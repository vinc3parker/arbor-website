"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { homeCopy } from "@/content/home";
import { JOURNEY_STOPS } from "./journeyConfig";
import styles from "./HomeNarrative.module.css";

const JourneyScene = dynamic(() => import("./JourneyScene"), { ssr: false });

const chapters = [
  { label: "Meet Arbor", eyebrow: "Self-help, made personal", title: <>Eight personal<br /> guide apps.<br /><span>One connected life.</span></>, body: "For your health, mind, money, time and more. Personal AI guides being built to understand you, and how your life fits together." },
  { label: "Start here", eyebrow: "01 — A new kind of starting point", title: <>What if this was<br />the last time<br /><span>you started over?</span></>, body: "Another plan. Another app. Your whole story, all over again. Arbor is being built to carry your understanding forward, even when life changes direction." },
  { label: "Made for you", eyebrow: "02 — A person, not a template", title: <>Advice is everywhere.<br /><span>Understanding<br />is different.</span></>, body: "Your goals, your energy, your circumstances. Each guide is being shaped to help you in the life you actually live, at a pace that works for you." },
  { label: "All connected", eyebrow: "03 — The bigger picture", title: <>Nothing in your<br />life happens<br /><span>in isolation.</span></>, body: "Money can affect your sleep. Sleep can affect your mood. Mood can change your whole day. Arbor’s guides are being built to make sense of those connections together." },
  { label: "Your direction", eyebrow: "04 — Your life, on your terms", title: <>A better life.<br /><span>By your<br />definition.</span></>, body: "More support should mean more freedom to be yourself. You choose your direction, what you share, and the parts of life you want help with." },
  { label: "Find your guide", eyebrow: "One life. A little more support.", title: <>You should not<br />have to work out<br /><span>your life alone.</span></>, body: "Start with the part of life that needs you most. Meet your guide, and discover what we’re building around you." },
];


class SceneBoundary extends Component<{ children: ReactNode; onFail: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFail(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function Arrow() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function HomeNarrative() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const captionRefs = useRef<Array<HTMLElement | null>>([]);
  const progress = useRef(0);
  const invalidateRef = useRef<(() => void) | null>(null);
  const [active, setActive] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const [available, setAvailable] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const short = window.matchMedia("(max-height: 560px)");
    const sync = () => setEnhanced(!motion.matches && !short.matches && available);
    sync();
    motion.addEventListener("change", sync);
    short.addEventListener("change", sync);
    return () => { motion.removeEventListener("change", sync); short.removeEventListener("change", sync); };
  }, [available]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enhanced) return;
    let top = 0, travel = 1;
    const update = () => {
      progress.current = Math.max(0, Math.min(1, (window.scrollY - top) / travel));
      invalidateRef.current?.();
    };
    const measure = () => {
      top = root.getBoundingClientRect().top + window.scrollY;
      travel = Math.max(1, root.offsetHeight - window.innerHeight);
      update();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", measure);
      captionRefs.current.forEach(caption => {
        if (!caption) return;
        caption.inert = false;
        caption.removeAttribute("aria-hidden");
        caption.style.removeProperty("transform");
        caption.style.removeProperty("opacity");
      });
    };
  }, [enhanced]);

  const onChapter = useCallback((index: number) => setActive(index), []);
  const onReady = useCallback((invalidate: () => void) => {
    invalidateRef.current = invalidate;
    setReady(true);
    invalidate();
  }, []);
  const onUnavailable = useCallback(() => { setAvailable(false); setEnhanced(false); }, []);

  function goTo(index: number) {
    const root = rootRef.current;
    if (!root) return;
    if (!enhanced) { document.getElementById(`arbor-chapter-${index}`)?.scrollIntoView(); return; }
    const top = window.scrollY + root.getBoundingClientRect().top;
    window.scrollTo({ top: top + (root.offsetHeight - window.innerHeight) * JOURNEY_STOPS[index], behavior: "smooth" });
  }

  return (
    <main id="main-content" ref={rootRef} className={styles.experience} data-enhanced={enhanced}>
      <Navbar tone="dark" />
      <div ref={stageRef} className={styles.stage}>
        <div className={styles.forestBackdrop} aria-hidden />
        <div className={styles.world} aria-hidden="true" data-ready={ready}>
          {available && <SceneBoundary onFail={onUnavailable}>
            <JourneyScene progress={progress} captions={captionRefs} stage={stageRef} animated={enhanced} onChapter={onChapter} onReady={onReady} onUnavailable={onUnavailable} />
          </SceneBoundary>}
        </div>
        <div className={styles.sceneShade} aria-hidden />
        <div className={styles.openingFade} aria-hidden />
        <div className={styles.clearingFade} aria-hidden />
        <div className={styles.location} aria-hidden><span>A path of your own.</span><span>Arbor / A connected life</span></div>

        <div className={styles.worldCaptions}>
          {chapters.map((chapter, index) => (
            <section key={chapter.label} id={`arbor-chapter-${index}`} ref={element => { captionRefs.current[index] = element; }} className={styles.caption} aria-labelledby={`arbor-heading-${index}`}>
              <p className={styles.eyebrow}>{chapter.eyebrow}</p>
              {index === 0 ? <h1 id={`arbor-heading-${index}`}>{chapter.title}</h1> : <h2 id={`arbor-heading-${index}`}>{chapter.title}</h2>}
              <p className={styles.copy}>{chapter.body}</p>
              {index === 0 && <button className={styles.begin} onClick={() => goTo(1)}>Follow your path <Arrow /></button>}
              {index === 5 && <>
                <div className={styles.actions}><Link href="/guides" className={styles.primary}>Meet the eight guides <Arrow /></Link><Link href="/login" className={styles.secondary}>Your Arbor account <Arrow /></Link></div>
                <p className={styles.availability}>Growing in stages. <Link href="/progress">See which apps are ready.</Link></p>
              </>}
            </section>
          ))}
        </div>

        <nav className={styles.guideRail} aria-label="Explore all eight Arbor guides">
          {homeCopy.apps.map(app => <Link key={app.id} href={app.href} aria-label={`${app.name}, ${app.domain}. ${app.badge}.`}><Image src={app.icon} alt="" width={64} height={64} loading="eager" unoptimized={app.id === "nura" || app.id === "wend"} /><span>{app.name}</span></Link>)}
        </nav>

        <div className={styles.journeyControls}>
          <button className={styles.scrollCue} onClick={() => goTo(Math.min(5, active + 1))} disabled={active === 5}><span className={styles.scrollTrack}><span /></span><span>{active === 5 ? "Your next chapter" : "Scroll to follow the path"}</span></button>
          <nav className={styles.chapterNav} aria-label="Arbor story chapters">{chapters.map((chapter, i) => <button key={chapter.label} onClick={() => goTo(i)} aria-label={`Chapter ${i + 1}: ${chapter.label}`} aria-current={active === i ? "step" : undefined}><span>0{i + 1}</span><i /></button>)}</nav>
          <span className={styles.count}>0{active + 1}<small>/ 06</small></span>
        </div>
        <div className={styles.legal}><span>© 2026 Arbor</span><Link href="/early-access">Join the waitlist</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
      </div>
    </main>
  );
}
