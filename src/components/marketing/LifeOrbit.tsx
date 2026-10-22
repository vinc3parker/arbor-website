import Image from "next/image";
import Link from "next/link";
import { APP_BRANDS, APP_ORDER } from "@/lib/brand";
import styles from "./StoryPages.module.css";

const points = APP_ORDER.map((id, index) => {
  const angle = (index * 45 - 90) * Math.PI / 180;
  return { id, x: 50 + Math.cos(angle) * 37, y: 48 + Math.sin(angle) * 37 };
});

export function LifeOrbit() {
  return (
    <div className={styles.orbit} role="group" aria-label="Eight personal guide apps, connected around you">
      <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <circle cx="50" cy="48" r="37" stroke="#889777" strokeOpacity=".3" strokeWidth=".2" strokeDasharray=".5 1.2" />
        <circle cx="50" cy="48" r="25" stroke="#889777" strokeOpacity=".12" strokeWidth=".2" />
        {points.map(({ id, x, y }) => <path key={id} d={`M50 48 Q${50 + (x - 50) * .25} ${y} ${x} ${y}`} stroke="#889777" strokeOpacity=".4" strokeWidth=".25" />)}
      </svg>
      <div className={styles.orbitCentre}><strong>You.</strong><span>Not just your goals.</span></div>
      {points.map(({ id, x, y }) => {
        const app = APP_BRANDS[id];
        return <Link key={id} href={`/${id}`} className={styles.orbitApp} style={{ left: `${x}%`, top: `${y}%` }} aria-label={`Meet ${app.name}, your ${app.title}`}><Image src={app.icon} alt="" width={44} height={44} unoptimized={id === "nura" || id === "wend"} /><span>{app.name}</span></Link>;
      })}
      <p className={styles.orbitCaption}>The connected Arbor experience we&apos;re building.</p>
    </div>
  );
}
