"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Navbar } from "@/components/Navbar";
import { homeCopy } from "@/content/home";
import styles from "./HomeNarrative.module.css";

const Sculpture = dynamic(() => import("./HomeSculpture"), { ssr: false });

const chapters = [
  { label: "Meet Arbor", eyebrow: "Self-help, made personal", title: <>Eight personal<br /> guide apps.<br /><span>One connected life.</span></>, body: "For your health, mind, money, time and more. Personal AI guides being built to understand you, and how your life fits together." },
  { label: "Start here", eyebrow: "01 — A new kind of starting point", title: <>What if this was<br />the last time<br /><span>you started over?</span></>, body: "Another plan. Another app. Your whole story, all over again. Arbor is being built to carry your understanding forward, even when life changes direction." },
  { label: "Made for you", eyebrow: "02 — A person, not a template", title: <>Advice is everywhere.<br /><span>Understanding<br />is different.</span></>, body: "Your goals, your energy, your circumstances. Each guide is being shaped to help you in the life you actually live, at a pace that works for you." },
  { label: "All connected", eyebrow: "03 — The bigger picture", title: <>Nothing in your<br />life happens<br /><span>in isolation.</span></>, body: "Money can affect your sleep. Sleep can affect your mood. Mood can change your whole day. Arbor’s guides are being built to make sense of those connections together." },
  { label: "Your direction", eyebrow: "04 — Your life, on your terms", title: <>A better life.<br /><span>By your<br />definition.</span></>, body: "More support should mean more freedom to be yourself. You choose your direction, what you share, and the parts of life you want help with." },
  { label: "Find your guide", eyebrow: "One life. A little more support.", title: <>You should not<br />have to work out<br /><span>your life alone.</span></>, body: "Start with the part of life that needs you most. Meet your guide, and discover what we’re building around you." },
];

const nodePositions = [
  [[24, 21], [72, 17], [88, 48], [74, 80], [32, 84], [12, 57], [37, 9], [58, 88]],
  [[17, 22], [78, 12], [91, 58], [72, 87], [30, 91], [8, 61], [39, 3], [55, 98]],
  [[19, 22], [50, 46], [85, 63], [73, 86], [30, 87], [10, 58], [39, 7], [59, 95]],
  [[25, 18], [79, 25], [79, 74], [24, 79], [50, 91], [8, 48], [45, 5], [91, 51]],
  [[20, 21], [79, 24], [82, 73], [22, 81], [51, 93], [8, 51], [48, 6], [93, 48]],
  [[24, 21], [72, 17], [88, 48], [74, 80], [32, 84], [12, 57], [37, 9], [58, 88]],
];
const nodeOpacities = [
  [1, 1, 1, 1, 0, 0, 0, 0],
  [.5, .7, .5, .35, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
];
const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };

function Arrow({ down = false }: { down?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden style={down ? { transform: "rotate(90deg)" } : undefined}><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function HomeNarrative() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [active, setActive] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const shortViewport = window.matchMedia("(max-height: 560px)");
    const sync = () => { setReducedMotion(preference.matches); setEnhanced(!preference.matches && !shortViewport.matches); };
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
    const nodes = [...stage.querySelectorAll<HTMLElement>("[data-app-node]")];
    let frame = 0;
    let lastActive = -1;
    const paint = () => {
      frame = 0;
      const travel = root.offsetHeight - window.innerHeight;
      const raw = clamp(-root.getBoundingClientRect().top / Math.max(1, travel)) * (chapters.length - 1);
      const index = Math.min(chapters.length - 2, Math.floor(raw));
      const blend = smooth((raw - index - .25) / .5);
      const progress = index + blend;
      progressRef.current = progress;
      const current = Math.round(progress);
      if (current !== lastActive) { lastActive = current; setActive(current); }
      stage.style.setProperty("--progress", String(raw / (chapters.length - 1)));
      stage.dataset.chapter = String(current);
      panels.forEach((panel, i) => {
        const distance = progress - i;
        panel.style.opacity = String(clamp(1 - Math.abs(distance) * 1.7));
        panel.style.transform = `translate3d(0, ${distance * -38}px, 0)`;
        panel.inert = current !== i;
        panel.setAttribute("aria-hidden", String(current !== i));
      });
      nodes.forEach((node, i) => {
        const [x, y] = nodePositions[index][i];
        const [nextX, nextY] = nodePositions[index + 1][i];
        node.style.left = `${mix(x, nextX, blend)}%`;
        node.style.top = `${mix(y, nextY, blend)}%`;
        node.style.opacity = String(mix(nodeOpacities[index][i], nodeOpacities[index + 1][i], blend));
      });
      for (let i = 0; i < chapters.length; i++) stage.style.setProperty(`--scene-${i}`, String(clamp(1 - Math.abs(progress - i))));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const resize = new ResizeObserver(schedule);
    resize.observe(root);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    paint();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      panels.forEach(panel => { panel.inert = false; panel.removeAttribute("aria-hidden"); panel.style.removeProperty("opacity"); panel.style.removeProperty("transform"); });
    };
  }, [enhanced]);

  function goTo(index: number) {
    const root = rootRef.current;
    if (!root) return;
    if (!enhanced) { document.getElementById(`arbor-chapter-${index}`)?.scrollIntoView(); return; }
    const top = window.scrollY + root.getBoundingClientRect().top;
    window.scrollTo({ top: top + (root.offsetHeight - window.innerHeight) * index / (chapters.length - 1), behavior: reducedMotion ? "instant" : "smooth" });
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
              {index === 5 && <>
                <div className={styles.actions}><Link href="/guides" className={styles.primary}>Meet the eight guides <Arrow /></Link><Link href="/login" className={styles.secondary}>Your Arbor account <Arrow /></Link></div>
                <p className={styles.availability}>Growing in stages. <Link href="/progress">See which apps are ready to meet you.</Link></p>
              </>}
            </section>
          ))}
        </div>

        <div className={styles.visual} aria-hidden="true">
          <div className={styles.visualGlow} />
          <div className={styles.sculpture}>
            <svg className={styles.sculptureFallback} viewBox="0 0 700 700" fill="none"><defs><linearGradient id="arbor-satin" x1="140" y1="100" x2="550" y2="600" gradientUnits="userSpaceOnUse"><stop stopColor="#e4e7db" /><stop offset=".35" stopColor="#a4b2a0" /><stop offset=".55" stopColor="#eef0e7" /><stop offset="1" stopColor="#879780" /></linearGradient></defs>{[0, 60, 120].map(angle => <ellipse key={angle} cx="350" cy="350" rx="205" ry="112" transform={`rotate(${angle} 350 350)`} stroke="url(#arbor-satin)" strokeWidth="38" />)}</svg>
            {!reducedMotion && <Sculpture progress={progressRef} />}
          </div>
          <svg className={styles.connectionLines} viewBox="0 0 700 700" fill="none">
            <defs><linearGradient id="arbor-link" x1="150" y1="150" x2="560" y2="550" gradientUnits="userSpaceOnUse"><stop stopColor="#889d8a" stopOpacity=".3" /><stop offset=".5" stopColor="#889d8a" /><stop offset="1" stopColor="#889d8a" stopOpacity=".3" /></linearGradient></defs>
            <circle cx="350" cy="350" r="225" stroke="#adb7a8" strokeOpacity=".2" />
            <circle cx="350" cy="350" r="160" stroke="#adb7a8" strokeOpacity=".12" />
            <path d="M175 126 C380 100 350 350 553 175 S650 430 553 518 S170 600 168 553 S50 160 175 126Z" stroke="url(#arbor-link)" strokeWidth="1.2" />
            <path d="M175 126 Q350 350 553 518 M553 175 Q350 350 168 553 M175 126 Q350 350 168 553 M553 175 Q350 350 553 518" stroke="#93a48d" strokeOpacity=".45" strokeWidth="1" />
            <circle className={styles.connectionPulse} r="3" fill="#7c9279"><animateMotion dur="9s" repeatCount="indefinite" path="M175 126 C380 100 350 350 553 175 S650 430 553 518 S170 600 168 553 S50 160 175 126Z" /></circle>
          </svg>
          {homeCopy.apps.map((app, index) => <div key={app.id} data-app-node className={styles.appNode} style={{ left: `${nodePositions[0][index][0]}%`, top: `${nodePositions[0][index][1]}%`, opacity: nodeOpacities[0][index], "--app-colour": app.colour } as CSSProperties}><span className={styles.iconWell}><Image src={app.icon} alt="" width={112} height={112} className={styles.appIcon} /></span><span className={styles.nodeName}>{app.name}</span><span className={styles.nodeDomain}>{app.domain}</span></div>)}
          <div className={`${styles.annotation} ${styles.heroAnnotation}`}><span className={styles.fineRule} /><span>Eight perspectives.<br />One fuller picture.</span></div>
          <div className={`${styles.annotation} ${styles.restartAnnotation}`}><span>New routines</span><span>New goals</span><span>Same you.</span></div>
          <div className={styles.personalOrbit}><div className={styles.personalCircle} /><span className={styles.signalOne}>Your priorities</span><span className={styles.signalTwo}>Your patterns</span><span className={styles.signalThree}>Your pace</span><span className={styles.personalCaption}>An understanding that grows with you.</span></div>
          <div className={styles.connectionCentre}><span className={styles.centreDot} /><span>You</span><small>At the centre.</small></div>
          <div className={styles.connectionCaptions}><span>How you feel</span><span>How you spend</span><span>How you move</span><span>How you plan</span></div>
          <div className={styles.direction}><svg viewBox="0 0 700 700" fill="none"><path d="M350 590C350 390 180 390 130 170M350 590C350 390 500 350 550 150M350 590C350 390 350 260 350 95" stroke="#8a9a84" strokeWidth="1" /><circle cx="350" cy="95" r="6" fill="#85967c" /><circle cx="130" cy="170" r="4" fill="#bdc6b7" /><circle cx="550" cy="150" r="4" fill="#bdc6b7" /></svg><span className={styles.directionOne}>What matters to you.</span><span className={styles.directionTwo}>What you choose to share.</span><span className={styles.directionThree}>Where you want to go.</span><span className={styles.directionYou}>Your direction.<br /><strong>Always.</strong></span></div>
          <div className={styles.finalMark}><Image src="/brand/arbor_mark_ink.png" alt="" width={100} height={74} /><span>By your side.</span></div>
          <div className={styles.visualFootnote}><span className={styles.smallCross}>+</span><span>Designed around a whole person.</span><span className={styles.smallCross}>+</span></div>
        </div>

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
