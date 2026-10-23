"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { JOURNEY_STOPS } from "./journeyConfig";
import styles from "./HomeNarrative.module.css";

const JourneyScene = dynamic(() => import("./JourneyScene"), { ssr: false });

const chapters = [
  { label: "Meet Arbor", eyebrow: "", title: <>Eight personal<br /> guide apps.<br /><span>One connected life.</span></>, body: "" },
  { label: "For the long run", eyebrow: "Support that stays", title: <>A companion<br /><span>for the long run.</span></>, body: "A new training goal. A bigger role. A move to a new city. Arbor is being built to grow with you through what you’re working towards now—and whatever you decide to take on next." },
  { label: "Made for you", eyebrow: "Understanding you", title: <>No generic advice.<br /><span>Guidance built<br />around you.</span></>, body: "Your ambitions, habits and the way you approach life aren’t interchangeable with anyone else’s. Your guides are designed to learn what drives you, recognise your patterns and give you guidance shaped around the person behind the goals." },
  { label: "All connected", eyebrow: "Joined-up support", title: <>Eight parts of life.<br /><span>Connected<br />around you.</span></>, body: "Training, work, nights out and your next trip all draw on the same time, energy and money. Arbor’s guides are being built to understand those connections, so pursuing one goal doesn’t mean losing sight of everything else you want from life." },
  { label: "Your direction", eyebrow: "Your priorities", title: <>Your goals.<br />Your dreams.<br /><span>Not someone else’s.</span></>, body: "Get stronger. Build a career you care about. See more of the world. Make time for your people. You decide what matters and how far you want to take it. Your guides help you build your version of a good life." },
  { label: "Find your guide", eyebrow: "", title: <>Building a better life?<br /><span>You don’t have<br />to wing it.</span></>, body: "Your health. Your money. Your next move. Find personal guidance that helps you make sense of your options and take your next step." },
];


class SceneBoundary extends Component<{ children: ReactNode; onFail: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFail(); }
  render() { return this.state.failed ? null : this.props.children; }
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
    const sync = () => {
      setEnhanced(!motion.matches && !short.matches && available);
    };
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
    <>
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

        <div className={styles.worldCaptions}>
          {chapters.map((chapter, index) => (
            <section key={chapter.label} id={`arbor-chapter-${index}`} ref={element => { captionRefs.current[index] = element; }} className={styles.caption} aria-labelledby={`arbor-heading-${index}`}>
              {chapter.eyebrow && <p className={styles.eyebrow}>{chapter.eyebrow}</p>}
              {index === 0 ? <h1 id={`arbor-heading-${index}`}>{chapter.title}</h1> : <h2 id={`arbor-heading-${index}`}>{chapter.title}</h2>}
              {chapter.body && <p className={styles.copy}>{chapter.body}</p>}
              {index === 5 && <>
                <div className={styles.actions}><Link href="/guides" className={styles.primary}>Find your guide <span aria-hidden>→</span></Link></div>
                <p className={styles.availability}>Arbor is growing in stages. <Link href="/progress">See which apps are ready.</Link></p>
              </>}
            </section>
          ))}
        </div>

        <nav className={styles.chapterNav} aria-label="Arbor story chapters">{chapters.map((chapter, i) => <button key={chapter.label} type="button" onClick={() => goTo(i)} aria-controls={`arbor-chapter-${i}`} aria-label={`Chapter ${i + 1}: ${chapter.label}`} aria-current={active === i ? "step" : undefined}><span aria-hidden>0{i + 1}</span><i aria-hidden /></button>)}</nav>

        <div className={styles.journeyControls}>
          <button className={styles.scrollCue} aria-label={active === 5 ? "End of the journey" : "Continue to the next chapter"} onClick={() => goTo(Math.min(5, active + 1))} disabled={active === 5}><span className={styles.scrollTrack} aria-hidden><span /></span>{active > 0 && <span>{active === 5 ? "Your next chapter" : "Scroll to follow the path"}</span>}</button>
          <span className={styles.count}>0{active + 1}<small>/ 06</small></span>
        </div>
      </div>
    </main>
    <Footer />
    </>
  );
}
