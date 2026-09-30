'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Canvas } from '@react-three/fiber';
import { ObservatoryScene } from './scene/ObservatoryScene';
import { heroState, titleOpacity } from './scroll/heroState';
import type { ArborApp } from './data/apps';
import { rememberEntered, shouldSkipIntro } from '@/lib/intro';
import { appBrand } from '@/lib/brand';
import { CAMERA_POS, CAMERA_FOV } from './room/constants';

const NAVIGATE_AFTER_MS = 1150;
/** How long the auto-build plays once the visitor clicks to enter. The whole
 *  sequence (light → wall → portals) finishes around progress 0.9, so we tween
 *  progress 0 → 1 across this window and then lock. */
const ENTER_DURATION_MS = 4600;

const smoothstep = (t: number) => {
  const c = Math.min(Math.max(t, 0), 1);
  return c * c * (3 - 2 * c);
};

/**
 * The observatory hero. The page opens on "Arbor" in the dark; clicking to
 * enter plays an auto-build — the architecture wakes, the wall assembles, then
 * the portals light one at a time, centre-out. Hovering a lit portal raises its
 * app card; clicking dollies the camera through the veil into the app page.
 */
export function ArborRoom({
  statuses,
}: {
  statuses?: Record<string, ArborApp['status']>;
}) {
  const router = useRouter();
  const titleRef = useRef<HTMLDivElement>(null);
  // Latches once the auto-build finishes; from then on the room stays fully
  // built and every portal is live.
  const lockedRef = useRef(false);
  // Set the moment the visitor clicks to enter; the rAF loop tweens progress
  // from here.
  const enteringRef = useRef(false);
  const enterStartRef = useRef(0);

  const [hovered, setHovered] = useState<ArborApp | null>(null);
  const [transitionApp, setTransitionApp] = useState<ArborApp | null>(null);
  const [locked, setLocked] = useState(false);
  const [entering, setEntering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse), (max-width: 768px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Kick off the auto-build. Ignored once it's already running or committed.
  const startEnter = () => {
    if (enteringRef.current || lockedRef.current) return;
    enteringRef.current = true;
    enterStartRef.current = 0;
    setEntering(true);
    navigator.vibrate?.([14, 40, 22]);
  };

  // Drive progress every frame. Before the click it holds at 0 (the dark title
  // screen); after the click it tweens 0 → 1 across ENTER_DURATION_MS, then
  // locks. Written straight to the mutable store (read by the scene per-frame)
  // and to overlay styles — no React re-renders while it plays.
  useEffect(() => {
    // Debug/testing hook: ?arbor-progress=0.7 pins the intro at that point.
    const pinned = parseFloat(
      new URLSearchParams(window.location.search).get('arbor-progress') ?? ''
    );
    if (!Number.isNaN(pinned)) heroState.progress = pinned;

    // Already inside the site (Esc → ?entered=1, the logo, or an earlier
    // visit this session): start fully built and locked, with no replay of the
    // intro. lockedRef is picked up on the first frame below, which also syncs
    // the React `locked` state.
    const skip = shouldSkipIntro();
    if (skip) lockedRef.current = true;

    let syncedLock = false;
    let raf = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);

      let p: number;
      if (lockedRef.current) {
        // Intro committed: hold the fully-built end state. Sync the React lock
        // once so the click surface goes inert and the intro class clears.
        p = 1;
        if (!syncedLock) {
          syncedLock = true;
          setLocked(true);
          setEntering(false);
        }
      } else if (!Number.isNaN(pinned)) {
        p = pinned;
      } else if (enteringRef.current) {
        if (!enterStartRef.current) enterStartRef.current = now;
        const raw = (now - enterStartRef.current) / ENTER_DURATION_MS;
        p = smoothstep(raw);
        if (raw >= 1) {
          lockedRef.current = true;
          rememberEntered();
          syncedLock = true;
          setLocked(true);
          setEntering(false);
          p = 1;
        }
      } else {
        // Waiting on the dark title screen.
        p = 0;
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
      // Navbar arrives only once every portal has woken.
      document.documentElement.classList.toggle('arbor-intro', p < 0.9);
    };
    if (!skip) document.documentElement.classList.add('arbor-intro');
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('arbor-intro');
    };
  }, []);

  // Freeze page scroll from the click until the build commits, so nobody
  // scrolls off the animation while it plays. The section is a plain single
  // viewport, so once locked normal scrolling resumes into the content below.
  useEffect(() => {
    if (!entering) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = prev;
    };
  }, [entering]);

  useLayoutEffect(() => {
    if (shouldSkipIntro() && titleRef.current) {
      titleRef.current.style.opacity = '0';
      titleRef.current.style.visibility = 'hidden';
    }
  }, []);

  // Arriving already-completed: start at the top, unless a link asked for a
  // section further down (e.g. /#early-access).
  useLayoutEffect(() => {
    if (locked && !window.location.hash) window.scrollTo(0, 0);
  }, [locked]);

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

  // The click-to-enter surface is live only on the dark title screen — before
  // the build starts and before it commits. Once the auto-build is running or
  // done, it's inert so portal hover/click (via the canvas) takes over.
  const catcherActive = !entering && !locked;

  return (
    <section style={{ height: '100vh', position: 'relative' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          height: '100vh',
          overflow: 'hidden',
          background: '#050608',
        }}
      >
        <Canvas
          shadows="percentage"
          // Horizontal gestures are captured by the CameraRig to orbit on mobile.
          style={{ touchAction: 'pan-y' }}
          camera={{
            position: CAMERA_POS,
            fov: CAMERA_FOV,
            near: 0.1,
            far: 200,
          }}
        >
          <ObservatoryScene statuses={statuses} />
        </Canvas>

        {/* ---- Click-to-enter surface ---- */}
        {catcherActive && (
          <button
            type="button"
            onClick={startEnter}
            aria-label="Enter Arbor"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 20,
              cursor: 'pointer',
              background: 'transparent',
              border: 'none',
              padding: 0,
              margin: 0,
            }}
          />
        )}

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
            // Solid Ink until the visitor enters: the room stays hidden
            // behind the title, then is revealed as the title fades.
            background: '#0A0A0A',
            padding: '0 1.5rem',
          }}
        >
          {/* The wordmark is artwork — never retyped (brand guide 5.7). */}
          <h1 style={{ margin: 0 }}>
            <span className="sr-only">Arbor</span>
            <Image
              src="/brand/arbor_logo_reverse.png"
              alt=""
              width={942}
              height={227}
              priority
              style={{ width: 'clamp(12rem, 32vw, 26rem)', height: 'auto' }}
            />
          </h1>
          <p
            style={{
              marginTop: '1.75rem',
              fontSize: 'clamp(1rem, 1.6vw, 1.25rem)',
              fontWeight: 400,
              color: 'rgba(246,245,242,0.75)',
            }}
          >
            Live more of the life you choose.
          </p>
          {/* Enter prompt. The whole screen is the click target (the button
              above); this just makes it obvious. */}
          <span
            aria-hidden
            style={{
              marginTop: '2.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.625rem',
              minHeight: 48,
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              background: '#F6F5F2',
              color: '#0A0A0A',
              fontSize: '1rem',
              fontWeight: 500,
            }}
          >
            {isMobile ? 'Tap to enter' : 'Click to enter'}
            <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>→</span>
          </span>
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
                  // Dark leads (Wend, Telos, Sage) swap to their readable colour on Ink.
                  color: appBrand(hovered.id)?.textOnInk ?? hovered.colour,
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
