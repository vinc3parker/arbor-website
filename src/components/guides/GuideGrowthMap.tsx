import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { APP_ROADMAP, type DevelopmentStage } from "@/content/roadmap";
import { APP_BRANDS, APP_ORDER } from "@/lib/brand";
import styles from "./GuideGrowthMap.module.css";

const stages = ["Pre-development", "Development", "Approaching testing", "Testing", "Wider release"];
const position: Record<DevelopmentStage, number> = {
  "pre-development": 0,
  development: 1,
  "approaching-testing": 2,
  testing: 3,
};
const heights = [34, 50, 32, 49, 37];
const trail = "M0 42 C30 42 35 34 60 34 S140 50 180 50 S245 32 300 32 S370 49 420 49 S510 37 540 37 L600 37";

export function GuideGrowthMap() {
  return (
    <section id="guide-directory" className={styles.section} aria-labelledby="growth-map-heading">
      <div className={`site-container ${styles.inner}`}>
        <header className={styles.heading}>
          <div>
            <p className={styles.kicker}>The Arbor growth map / October 2026</p>
            <h2 id="growth-map-heading">Eight apps.<br /><span>One bigger picture.</span></h2>
          </div>
          <p>Your training, your headspace, your money, your next adventure. Each guide has its own path to becoming part of your life. Here&apos;s where they are now.</p>
        </header>

        <div className={styles.mapIntro}>
          <p><span className={styles.seed} aria-hidden /> A marker shows where each guide is now.</p>
          <span className={styles.swipe}>Scroll across to explore the map <span aria-hidden>→</span></span>
        </div>
        <div className={styles.scroll} role="region" aria-label="Arbor app development map, scroll horizontally on smaller screens" tabIndex={0}>
          <table className={styles.map}>
            <caption className="sr-only">Current development stages of all eight Arbor apps. Stages, not dates or percentage completion.</caption>
            <colgroup><col className={styles.appColumn} />{stages.map(stage => <col key={stage} />)}</colgroup>
            <thead><tr><th scope="col" className={styles.appHeader}>Your guide</th>{stages.map((stage, index) => <th scope="col" key={stage}><span className={styles.stageNumber}>0{index + 1}</span>{stage}</th>)}</tr></thead>
            <tbody>
              {APP_ORDER.map(id => {
                const app = APP_BRANDS[id];
                const roadmap = APP_ROADMAP[id];
                const step = position[roadmap.stage];
                const x = step * 120 + 60;
                const y = heights[step];
                return (
                  <tr key={id} style={{ "--trail": app.onInk, "--trail-label": app.textOnInk } as CSSProperties}>
                    <th scope="row" className={styles.appCell}>
                      <Link href={`/${id}`} className={styles.appLink}>
                        <Image src={app.icon} alt="" width={44} height={44} unoptimized={id === "nura" || id === "wend"} />
                        <span><strong>{app.name}</strong><small>{app.domain}</small></span>
                        <span className={styles.arrow} aria-hidden>↗</span>
                      </Link>
                    </th>
                    <td colSpan={5} className={styles.trailCell}>
                      <div className={styles.trail}>
                        <svg viewBox="0 0 600 84" preserveAspectRatio="none" aria-hidden="true">
                          <defs><clipPath id={`growth-${id}`}><rect width={x + 1} height="84" /></clipPath></defs>
                          <path d={trail} className={styles.futurePath} />
                          <path d={trail} className={styles.currentPath} clipPath={`url(#growth-${id})`} />
                          {heights.map((height, index) => <circle key={index} cx={index * 120 + 60} cy={height} r="2" className={styles.waypoint} />)}
                          <circle cx={x} cy={y} r="15" className={styles.halo} />
                          <path d={`M${x - 6} ${y + 6} Q${x - 10} ${y - 8} ${x + 8} ${y - 9} Q${x + 10} ${y + 7} ${x - 6} ${y + 6}Z`} className={styles.leaf} />
                          <path d={`M${x - 7} ${y + 8} L${x + 3} ${y - 3}`} className={styles.leafVein} />
                        </svg>
                        <Link className={styles.currentStage} href={`/${id}`} style={{ left: `${10 + step * 20}%` }} aria-label={`${app.name}: ${roadmap.label}. Explore ${app.name}.`} title={roadmap.note}>{roadmap.label}<span aria-hidden> ↗</span></Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <footer className={styles.footnote}>
          <p>This is a map of stages, not a release calendar. Testing doesn&apos;t always mean access is open. Each guide&apos;s page shows any available beta links.</p>
          <Link href="/early-access">Hear when a guide opens <span aria-hidden>↗</span></Link>
        </footer>
      </div>
    </section>
  );
}
