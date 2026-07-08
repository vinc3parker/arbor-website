'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas } from '@react-three/fiber';
import { ObservatoryScene } from './scene/ObservatoryScene';
import { heroState, titleOpacity } from './scroll/heroState';
import type { ArborApp } from './data/apps';
import { CAMERA_POS, CAMERA_FOV } from './room/constants';

const SECTION_HEIGHT_VH = 520;
const NAVIGATE_AFTER_MS = 1150;
/** Once the scroll gets this far, the intro hard-snaps to the finished state
 *  and commits — everything is built well before this (portals finish ~0.74). */
const SNAP_TO_END_AT = 0.9;

/**
 * The observatory hero. A tall scroll section pins the 3D room: the page
 * opens on "Arbor" in the dark, scrolling wakes the architecture, then the
 * portals light one at a time, centre-out. Hovering a lit portal raises its
 * app card; clicking dollies the camera through the veil into the app page.
 */
export function ArborRoom() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  // Latches once the intro reaches the end; from then on the room stays fully
  // built and the tall scroll region collapses to the top of the page.
  const lockedRef = useRef(false);
  // True only when the lock fired live mid-scroll (vs. arriving pre-completed),
  // so we know whether we need to absorb scroll momentum.
  const wasLiveLockRef = useRef(false);

  const [hovered, setHovered] = useState<ArborApp | null>(null);
  const [transitionApp, setTransitionApp] = useState<ArborApp | null>(null);
  const [locked, setLocked] = useState(false);
  // Brief phase right after a live lock: the observatory is pinned as a fixed
  // full-viewport layer while the tall section collapses and scroll resets
  // underneath, so the content below is never flashed on screen.
  const [settling, setSettling] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse), (max-width: 768px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Arrive already-completed when returning from an app page (Esc → ?entered=1,
  // or the session flag): the observatory shows fully built and locked, with no
  // replay of the intro and nothing to scroll back into.
  useLayoutEffect(() => {
    // Only the explicit ?entered=1 signal (set when returning from an app via
    // Esc) starts pre-completed. A plain refresh of "/" always replays the
    // intro from the top.
    let entered = false;
    try {
      entered =
        new URLSearchParams(window.location.search).get('entered') === '1';
    } catch {
      entered = false;
    }
    if (entered) {
      lockedRef.current = true;
      setLocked(true);
    }
  }, []);

  // Scroll → progress, polled on rAF (scroll events are unreliable on some
  // browsers). Written straight to the mutable store (read by the scene
  // per-frame) and to overlay styles — no React re-renders while scrolling.
  useEffect(() => {
    // Debug/testing hook: ?arbor-progress=0.7 pins the intro at that point.
    const pinned = parseFloat(
      new URLSearchParams(window.location.search).get('arbor-progress') ?? ''
    );
    if (!Number.isNaN(pinned)) heroState.progress = pinned;

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const section = sectionRef.current;
      if (!section) return;

      let p: number;
      if (lockedRef.current) {
        // Intro committed: hold the fully-built end state.
        p = 1;
      } else if (!Number.isNaN(pinned)) {
        p = pinned;
      } else {
        const rect = section.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        p = Math.min(Math.max(-rect.top / scrollable, 0), 1);

        // Near the end, hard-snap to the finished state and LOCK. The intro
        // then collapses to the top of the page — fully built, portals live —
        // and there's no scrolling back into the half-built animation, so
        // nobody gets stranded mid-build wondering what to do.
        if (p >= SNAP_TO_END_AT) {
          lockedRef.current = true;
          wasLiveLockRef.current = true;
          setLocked(true);
          setSettling(true);
          navigator.vibrate?.([14, 40, 22]);
          p = 1;
        }
      }

      heroState.progress = p;

      // Dismiss any open info card if the room isn't fully awake.
      if (p < 0.98 && heroState.hovered) heroState.setHovered?.(null);

      if (titleRef.current) {
        const o = titleOpacity(p);
        titleRef.current.style.opacity = String(o);
        titleRef.current.style.transform = `translateY(${-24 * (1 - o)}px)`;
        titleRef.current.style.visibility = o === 0 ? 'hidden' : 'visible';
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = String(titleOpacity(p) * 0.6);
      }
      // Navbar arrives only once every portal has woken.
      document.documentElement.classList.toggle('arbor-intro', p < 0.9);
    };
    document.documentElement.classList.add('arbor-intro');
    tick();
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('arbor-intro');
    };
  }, []);

  // Arriving already-completed (Esc): nothing to hide, just make sure we're at
  // the top.
  useLayoutEffect(() => {
    if (locked && !wasLiveLockRef.current) window.scrollTo(0, 0);
  }, [locked]);

  // The settling phase after a LIVE lock. The observatory is a fixed
  // full-viewport layer (see the container below), so while it covers the
  // screen we freeze scrolling, reset to the top, and hold there long enough
  // for any momentum to die — the page underneath collapses unseen. Then we
  // drop back to the normal top-of-page layout with no visible movement.
  useLayoutEffect(() => {
    if (!settling) return;

    const prevRestore = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    let n = 0;
    let raf = requestAnimationFrame(function pin() {
      window.scrollTo(0, 0);
      if (n++ < 40) raf = requestAnimationFrame(pin);
    });
    const done = window.setTimeout(() => {
      document.body.style.overflow = '';
      history.scrollRestoration = prevRestore;
      setSettling(false);
    }, 650);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(done);
      document.body.style.overflow = '';
      history.scrollRestoration = prevRestore;
    };
  }, [settling]);

  // Wire the three.js side of hover / select to React.
  useEffect(() => {
    heroState.setHovered = setHovered;
    heroState.select = (app) => {
      if (heroState.transition) return;
      heroState.transition = { app, startedAt: performance.now() };
      setTransitionApp(app);
      setHovered(null);
      window.setTimeout(() => router.push(app.route), NAVIGATE_AFTER_MS);
    };
    return () => {
      heroState.setHovered = undefined;
      heroState.select = undefined;
      heroState.transition = null;
      heroState.hovered = null;
    };
  }, [router]);

  useEffect(() => {
    heroState.hovered = hovered;
  }, [hovered]);

  return (
    <section
      ref={sectionRef}
      style={{
        // Collapses to a single viewport once the intro commits, so the built
        // scene becomes the top of the page with no scroll-back into the intro.
        height: locked ? '100vh' : `${SECTION_HEIGHT_VH}vh`,
        position: 'relative',
      }}
    >
      <div
        style={{
          // During the settling phase the observatory is pinned as a fixed
          // full-viewport cover, so the collapsing section and scroll reset
          // underneath are never seen; otherwise it's the normal sticky pin.
          position: settling ? 'fixed' : 'sticky',
          top: 0,
          left: 0,
          right: 0,
          height: '100vh',
          overflow: 'hidden',
          background: '#050608',
          zIndex: settling ? 50 : undefined,
        }}
      >
        <Canvas
          shadows="percentage"
          // Let vertical gestures scroll the page/drive the build; horizontal
          // gestures are captured by the CameraRig to orbit on mobile.
          style={{ touchAction: 'pan-y' }}
          camera={{
            position: CAMERA_POS,
            fov: CAMERA_FOV,
            near: 0.1,
            far: 200,
          }}
        >
          <ObservatoryScene />
        </Canvas>

        {/* ---- Title ---- */}
        <div
          ref={titleRef}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(3.5rem, 9vw, 7rem)',
              fontWeight: 250,
              letterSpacing: '0.35em',
              marginLeft: '0.35em', // optically recentre the tracking
              color: '#e8e6e1',
            }}
          >
            ARBOR
          </h1>
          <p
            style={{
              marginTop: '1.25rem',
              fontSize: '0.95rem',
              fontWeight: 300,
              letterSpacing: '0.3em',
              marginLeft: '0.3em',
              color: 'rgba(232,230,225,0.55)',
              textTransform: 'uppercase',
            }}
          >
            One life · Eight dimensions
          </p>
        </div>

        {/* ---- Scroll hint ---- */}
        <div
          ref={hintRef}
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: 0,
            right: 0,
            textAlign: 'center',
            pointerEvents: 'none',
            fontSize: '0.75rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(232,230,225,0.6)',
          }}
        >
          Scroll to enter
        </div>

        {/* ---- Hover label: centred, boxless, in the app's accent colour.
                 The hovered arch also lifts its own glow (see PortalSurface). */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${hovered ? 1 : 0.98})`,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 240ms ease, transform 240ms ease',
            pointerEvents: 'none',
            textAlign: 'center',
            width: 'min(40rem, calc(100vw - 3rem))',
            padding: '3rem 3.5rem',
            // A soft, edgeless bubble that fades to nothing — just enough to
            // lift the text off the scene without reading as a boxed card.
            background:
              'radial-gradient(ellipse at center, rgba(6,8,11,0.62) 0%, rgba(6,8,11,0.34) 48%, rgba(6,8,11,0) 78%)',
          }}
        >
          {hovered && (
            <>
              <div
                style={{
                  fontSize: 'clamp(2.6rem, 6.5vw, 4.5rem)',
                  fontWeight: 250,
                  letterSpacing: '0.14em',
                  marginLeft: '0.14em',
                  color: '#f2f0eb',
                  textShadow: '0 2px 40px rgba(0,0,0,0.6)',
                }}
              >
                {hovered.name}
              </div>
              <div
                style={{
                  height: 2,
                  width: '4rem',
                  margin: '1rem auto 0',
                  background: hovered.colour,
                  boxShadow: `0 0 16px ${hovered.colour}`,
                }}
              />
              <div
                style={{
                  marginTop: '1rem',
                  fontSize: 'clamp(0.8rem, 1.4vw, 1rem)',
                  letterSpacing: '0.3em',
                  marginLeft: '0.3em',
                  textTransform: 'uppercase',
                  color: hovered.colour,
                }}
              >
                {hovered.dimension}
              </div>
              {isMobile && (
                <div
                  style={{
                    marginTop: '1.4rem',
                    fontSize: '0.72rem',
                    letterSpacing: '0.24em',
                    marginLeft: '0.24em',
                    textTransform: 'uppercase',
                    color: 'rgba(232,230,225,0.6)',
                  }}
                >
                  Tap to enter
                </div>
              )}
            </>
          )}
        </div>

        {/* ---- Portal transition fade ---- */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: transitionApp ? 'auto' : 'none',
            opacity: transitionApp ? 1 : 0,
            transition: `opacity ${NAVIGATE_AFTER_MS - 100}ms ease-in`,
            background: transitionApp
              ? `radial-gradient(ellipse at center, #fdfdfb 0%, ${transitionApp.colour} 140%)`
              : '#fff',
          }}
        />
      </div>
    </section>
  );
}
