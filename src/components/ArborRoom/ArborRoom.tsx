"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { ObservatoryScene } from "./scene/ObservatoryScene";
import { heroState } from "./scroll/heroState";
import { arborApps, type ArborApp } from "./data/apps";
import { APP_BRANDS } from "@/lib/brand";
import { APP_ROADMAP } from "@/content/roadmap";
import { CAMERA_POS, CAMERA_FOV } from "./room/constants";

const ENTER_DURATION_MS = 4600;
const NAVIGATE_AFTER_MS = 1150;
const BUILT_SESSION_KEY = "arbor-guides-built";

function StaticArchways({ loading = false }: { loading?: boolean }) {
  return (
    <section className="theme-dark relative isolate overflow-hidden bg-bg pt-32 pb-14 text-fg sm:pt-40">
      <Image src="/images/arbor-woodland.webp" alt="" fill sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-ink/80" />
      <div className="site-container">
        <p className="ui-kicker">The Arbor guides</p>
        <h1 className="type-h1 max-w-2xl">Meet the Arbor guides.</h1>
        <p className="mt-5 max-w-xl text-fg-2">Choose the part of life you want to explore. Each doorway introduces a specialist app and its personal AI guide.</p>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 lg:grid-cols-8">
          {arborApps.map(app => <Link key={app.id} href={app.route} className="group relative flex min-h-56 flex-col items-center justify-end overflow-hidden rounded-t-[6rem] rounded-b-2xl border border-paper/25 bg-ink/55 px-3 pt-10 pb-6 text-center transition hover:border-paper hover:bg-ink/80"><Image src={APP_BRANDS[app.id].icon} alt="" width={48} height={48} className="mb-7 h-12 w-12 rounded-xl transition group-hover:-translate-y-1" /><span className="font-medium">{app.name}</span><span className="mt-1 text-xs text-fg-2">Your {APP_BRANDS[app.id].title}</span><span className="mt-4 text-[0.65rem] text-fg-2">{APP_ROADMAP[app.id].label}</span></Link>)}
        </div>
        {loading && <p className="mt-10 text-sm text-fg-2" role="status">Opening the archways. You can also choose a guide above.</p>}
      </div>
    </section>
  );
}

class RoomBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <StaticArchways /> : this.props.children; }
}

export function ArborRoom() {
  const [mode, setMode] = useState<"loading" | "interactive" | "static">("loading");
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      if (motion.matches) { setMode("static"); return; }
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("webgl2");
      context?.getExtension("WEBGL_lose_context")?.loseContext();
      setMode(context ? "interactive" : "static");
    };
    update();
    motion.addEventListener("change", update);
    return () => motion.removeEventListener("change", update);
  }, []);

  if (mode !== "interactive") return <StaticArchways loading={mode === "loading"} />;
  return <RoomBoundary><InteractiveRoom /></RoomBoundary>;
}

function InteractiveRoom() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hovered, setHovered] = useState<ArborApp | null>(null);
  const [transitionApp, setTransitionApp] = useState<ArborApp | null>(null);
  const [resumeBuilt] = useState(() => {
    const built = window.sessionStorage.getItem(BUILT_SESSION_KEY) === "true";
    heroState.progress = built ? 1 : 0;
    return built;
  });
  const [locked, setLocked] = useState(resumeBuilt);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mobile, setMobile] = useState(() => window.matchMedia("(pointer: coarse), (max-width: 768px)").matches);

  useEffect(() => {
    heroState.progress = resumeBuilt ? 1 : 0;
    heroState.hovered = null;
    heroState.transition = null;
    const query = window.matchMedia("(pointer: coarse), (max-width: 768px)");
    const sync = () => setMobile(query.matches);
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [resumeBuilt]);

  useEffect(() => {
    if (!ready || locked || resumeBuilt) return;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / ENTER_DURATION_MS, 1);
      const progress = t * t * (3 - 2 * t);
      heroState.progress = progress;
      if (t < 1) frame = requestAnimationFrame(tick);
      else setLocked(true);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [ready, locked, resumeBuilt]);

  useEffect(() => {
    heroState.setHovered = setHovered;
    heroState.select = app => {
      if (heroState.transition) return;
      window.sessionStorage.setItem(BUILT_SESSION_KEY, "true");
      heroState.transition = { app, startedAt: performance.now() };
      setTransitionApp(app);
      setHovered(null);
      navigationTimer.current = setTimeout(() => router.push(app.route), NAVIGATE_AFTER_MS);
    };
    return () => {
      if (navigationTimer.current) clearTimeout(navigationTimer.current);
      heroState.setHovered = undefined;
      heroState.select = undefined;
      heroState.transition = null;
      heroState.hovered = null;
      heroState.progress = 0;
    };
  }, [router]);

  const markBuilt = () => window.sessionStorage.setItem(BUILT_SESSION_KEY, "true");

  useEffect(() => {
    const guideRoutes = new Set(arborApps.map((app) => app.route));
    const rememberCompletedRoom = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const destination = new URL(link.href, window.location.href);
      if (destination.origin === window.location.origin && guideRoutes.has(destination.pathname)) {
        markBuilt();
      }
    };
    document.addEventListener("click", rememberCompletedRoom);
    return () => document.removeEventListener("click", rememberCompletedRoom);
  }, []);

  useEffect(() => { heroState.hovered = hovered; }, [hovered]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100px" });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="theme-dark relative min-h-[42rem] bg-bg text-fg" style={{ height: "100svh" }} aria-label="Explore Arbor through the archways">
      <h1 className="sr-only">Explore the Arbor guides</h1>
      <div className="absolute inset-x-0 top-20 bottom-36 overflow-hidden sm:bottom-24">
        <Canvas shadows="percentage" dpr={[1, 1.5]} frameloop={visible ? "always" : "never"} style={{ touchAction: "pan-y" }} camera={{ position: CAMERA_POS, fov: CAMERA_FOV, near: 0.1, far: 200 }} onCreated={() => setReady(true)}>
          <ObservatoryScene />
        </Canvas>
      </div>

      {locked && hovered && (
        <div
          className="pointer-events-none absolute inset-x-0 top-[44%] z-10 mx-auto w-[min(40rem,calc(100vw-3rem))] -translate-y-1/2 px-6 py-10 text-center"
          role="status"
          aria-live="polite"
          style={{
            background: "radial-gradient(ellipse at center, rgba(6,8,11,0.62) 0%, rgba(6,8,11,0.34) 48%, rgba(6,8,11,0) 78%)",
          }}
        >
          <p className="text-5xl font-light tracking-[0.14em] text-fg sm:text-7xl">
            {hovered.name}
          </p>
          <div
            className="mx-auto mt-5 h-0.5 w-16"
            style={{ backgroundColor: hovered.colour, boxShadow: `0 0 16px ${hovered.colour}` }}
          />
          <p
            className="mt-5 text-xs uppercase tracking-[0.3em] sm:text-sm"
            style={{ color: APP_BRANDS[hovered.id].textOnInk }}
          >
            {hovered.dimension}
          </p>
          {mobile && <p className="mt-5 text-xs uppercase tracking-[0.2em] text-fg-2">Tap to enter</p>}
        </div>
      )}

      <nav aria-label="Choose an Arbor guide" className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:inset-x-4 focus-within:bottom-28 focus-within:z-30 focus-within:rounded-2xl focus-within:bg-ink focus-within:p-4">
        <ul className="flex flex-wrap justify-center gap-2">
          {arborApps.map(app => <li key={app.id}><Link href={app.route} className="inline-flex min-h-11 items-center rounded-lg px-4 text-fg focus-visible:outline-2 focus-visible:outline-offset-2">Explore {app.name}</Link></li>)}
        </ul>
      </nav>

      <div className="absolute inset-x-0 bottom-0 z-20 px-4 pt-4 pb-5 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 text-center text-xs text-fg-2">
          <p>{locked ? mobile ? "Swipe to look around. Tap an archway to explore." : "Hover to discover. Click an archway to step inside." : "The room is coming together."}</p>
          {!locked && <button type="button" onClick={() => { heroState.progress = 1; setLocked(true); }} className="min-h-11 px-4 text-fg underline underline-offset-4">Skip animation</button>}
        </div>
      </div>

      {transitionApp && <div aria-hidden className="pointer-events-none absolute inset-0 z-30" style={{ background: `radial-gradient(ellipse at center, #fdfdfb 0%, ${transitionApp.colour} 140%)`, animation: "portal-arrive 1050ms ease-in both" }} />}
    </section>
  );
}
