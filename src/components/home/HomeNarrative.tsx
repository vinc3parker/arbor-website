"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HomeJourney } from "./HomeJourney";
import styles from "./HomeNarrative.module.css";

const chapters = [
  { label: "Meet Arbor", eyebrow: "Self-help, made personal", title: <>Eight personal<br /> guide apps.<br /><span>One connected life.</span></>, body: "For your health, mind, money, time and more. Personal AI guides being built to understand you, and how your life fits together." },
  { label: "Start here", eyebrow: "01 — A new kind of starting point", title: <>What if this was<br />the last time<br /><span>you started over?</span></>, body: "Another plan. Another app. Your whole story, all over again. Arbor is being built to carry your understanding forward, even when life changes direction." },
  { label: "Made for you", eyebrow: "02 — A person, not a template", title: <>Advice is everywhere.<br /><span>Understanding<br />is different.</span></>, body: "Your goals, your energy, your circumstances. Each guide is being shaped to help you in the life you actually live, at a pace that works for you." },
  { label: "All connected", eyebrow: "03 — The bigger picture", title: <>Nothing in your<br />life happens<br /><span>in isolation.</span></>, body: "Money can affect your sleep. Sleep can affect your mood. Mood can change your whole day. Arbor’s guides are being built to make sense of those connections together." },
  { label: "Your direction", eyebrow: "04 — Your life, on your terms", title: <>A better life.<br /><span>By your<br />definition.</span></>, body: "More support should mean more freedom to be yourself. You choose your direction, what you share, and the parts of life you want help with." },
  { label: "Find your guide", eyebrow: "One life. A little more support.", title: <>You should not<br />have to work out<br /><span>your life alone.</span></>, body: "Start with the part of life that needs you most. Meet your guide, and discover what we’re building around you." },
];

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function Arrow({ down = false }: { down?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden style={down ? { transform: "rotate(90deg)" } : undefined}><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function ClosingActions() {
  return <>
    <div className={styles.actions}><Link href="/guides" className={styles.primary}>Meet the eight guides <Arrow /></Link><Link href="/login" className={styles.secondary}>Your Arbor account <Arrow /></Link></div>
    <p className={styles.availability}>Growing in stages. <Link href="/progress">See which apps are ready to meet you.</Link></p>
  </>;
}

export function HomeNarrative() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const shortViewport = window.matchMedia("(max-height: 560px)");
    const sync = () => setEnhanced(!preference.matches && !shortViewport.matches);
    sync();
    preference.addEventListener("change", sync);
    shortViewport.addEventListener("change", sync);
    return () => { preference.removeEventListener("change", sync); shortViewport.removeEventListener("change", sync); };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage || !enhanced) return;
    const panels = [...stage.querySelectorAll<HTMLElement>("[data-story-panel]")];
    const path = stage.querySelector<SVGPathElement>("[data-journey-track]");
    const trail = stage.querySelector<SVGPathElement>("[data-journey-trail]");
    const traveller = stage.querySelector<SVGGElement>("[data-journey-traveller]");
    if (!path || !trail || !traveller) return;

    // Sample once. Scrolling only changes a transform and the path's reveal;
    // no WebGL loop, per-frame layout reads, or moving app-label layouts.
    const length = path.getTotalLength();
    const samples = Array.from({ length: 241 }, (_, i) => path.getPointAtLength(length * i / 240));
    let frame = 0;
    let lastActive = -1;
    let rootTop = 0;
    let travel = 1;
    let target = 0;
    let displayed = 0;
    let previousTime = 0;

    const paint = (time: number) => {
      frame = 0;
      const delta = previousTime ? Math.min(time - previousTime, 64) : 16.67;
      previousTime = time;
      displayed += (target - displayed) * (1 - Math.exp(-delta / 85));
      if (Math.abs(target - displayed) < .00004) displayed = target;
      const progress = displayed * (chapters.length - 1);
      const current = Math.round(progress);
      if (current !== lastActive) {
        lastActive = current;
        setActive(current);
        stage.dataset.chapter = String(current);
        panels.forEach((panel, i) => {
          panel.inert = current !== i;
          panel.setAttribute("aria-hidden", String(current !== i));
        });
      }
      panels.forEach((panel, i) => {
        const distance = progress - i;
        panel.style.opacity = clamp(1 - (Math.abs(distance) - .18) / .35).toFixed(4);
        panel.style.transform = `translate3d(0, ${clamp(distance, -1, 1) * -20}px, 0)`;
      });
      const sample = displayed * 240;
      const index = Math.min(239, Math.floor(sample));
      const blend = sample - index;
      const x = samples[index].x + (samples[index + 1].x - samples[index].x) * blend;
      const y = samples[index].y + (samples[index + 1].y - samples[index].y) * blend;
      traveller.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
      trail.style.strokeDashoffset = (1 - displayed).toFixed(5);
      if (displayed !== target) frame = requestAnimationFrame(paint);
      else previousTime = 0;
    };
    const schedule = () => {
      target = clamp((window.scrollY - rootTop) / travel);
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const measure = () => {
      rootTop = root.getBoundingClientRect().top + window.scrollY;
      travel = Math.max(1, root.offsetHeight - window.innerHeight);
      schedule();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(root);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    measure();
    displayed = target;
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      panels.forEach(panel => { panel.inert = false; panel.removeAttribute("aria-hidden"); panel.style.removeProperty("opacity"); panel.style.removeProperty("transform"); });
    };
  }, [enhanced]);

  function goTo(index: number) {
    const root = rootRef.current;
    if (!root) return;
    if (!enhanced) { document.getElementById(`arbor-chapter-${index}`)?.scrollIntoView(); return; }
    const top = window.scrollY + root.getBoundingClientRect().top;
    window.scrollTo({ top: top + (root.offsetHeight - window.innerHeight) * index / (chapters.length - 1), behavior: "smooth" });
  }

  return (
    <main id="main-content" ref={rootRef} className={styles.experience} data-enhanced={enhanced}>
      <Navbar />
      <div className={styles.stage} ref={stageRef} data-chapter="0">
        <div className={styles.paperLight} aria-hidden />
        <div className={styles.topline} aria-hidden><span>A little more understanding.</span><span>A little more possibility.</span></div>
        <div className={styles.story}>
          {chapters.map((chapter, index) => (
            <section id={`arbor-chapter-${index}`} key={chapter.label} data-story-panel className={styles.panel} aria-labelledby={`arbor-heading-${index}`}>
              <p className={styles.eyebrow}><span />{chapter.eyebrow}</p>
              {index === 0 ? <h1 id={`arbor-heading-${index}`}>{chapter.title}</h1> : <h2 id={`arbor-heading-${index}`}>{chapter.title}</h2>}
              <p className={styles.copy}>{chapter.body}</p>
              {index === 0 && <button className={styles.begin} onClick={() => goTo(1)}>Discover a different way <Arrow down /></button>}
              {index === 3 && <p className={styles.note}>Connected by design. Built with your permission.</p>}
              {index === 5 && <ClosingActions />}
            </section>
          ))}
        </div>

        <HomeJourney />

        <div className={styles.mobileActions} data-visible={enhanced && active === 5} aria-hidden={!enhanced || active !== 5} inert={!enhanced || active !== 5}><ClosingActions /></div>

        <div className={styles.bottomBar}>
          <button className={styles.scrollCue} onClick={() => goTo(Math.min(active + 1, chapters.length - 1))} aria-label="Continue the Arbor story" disabled={active === 5}><span className={styles.scrollTrack}><span /></span><span>{active === 5 ? "Your next chapter starts here" : "Scroll to explore"}</span></button>
          <nav className={styles.chapterNav} aria-label="Arbor story chapters">{chapters.map((chapter, i) => <button key={chapter.label} onClick={() => goTo(i)} aria-label={`Chapter ${i + 1}: ${chapter.label}`} aria-current={active === i ? "step" : undefined}><span className={styles.chapterIndex}>0{i + 1}</span><span className={styles.chapterLabel}>{chapter.label}</span><span className={styles.chapterLine} /></button>)}</nav>
          <span className={styles.pageCount}>0{active + 1}<span>/ 06</span></span>
        </div>
        <div className={styles.legal}><span>© 2026 Arbor</span><Link href="/early-access">Join the waitlist</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
      </div>
    </main>
  );
}
