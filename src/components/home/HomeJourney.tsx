import Image from "next/image";
import Link from "next/link";
import { homeCopy } from "@/content/home";
import styles from "./HomeNarrative.module.css";

// One landscape, one path, eight permanent branches. The picture stays intact
// through every chapter; only the visitor's position on the path changes.
const route = "M370 876 C125 810 150 729 400 739 C665 749 635 654 460 654 C290 654 340 604 432 582";
const branches = [
  { x: 225, y: 175, path: "M432 359 C345 340 317 237 225 175" },
  { x: 150, y: 320, path: "M427 431 C322 432 253 361 150 320" },
  { x: 205, y: 465, path: "M424 493 C350 487 279 482 205 465" },
  { x: 365, y: 100, path: "M441 284 C400 243 393 151 365 100" },
  { x: 565, y: 115, path: "M442 287 C519 252 550 203 565 115" },
  { x: 710, y: 245, path: "M446 370 C546 351 622 290 710 245" },
  { x: 740, y: 395, path: "M447 443 C561 464 653 427 740 395" },
  { x: 620, y: 500, path: "M447 516 C518 520 578 506 620 500" },
];
const leaves = [
  [201, 247, -48, 1], [279, 173, 14, .85], [307, 278, -63, 1.2],
  [193, 390, -22, .8], [291, 413, 25, 1.15], [363, 336, -34, .9],
  [359, 190, -31, .8], [408, 137, 36, .9], [484, 171, -15, 1.2],
  [554, 213, 57, .9], [603, 283, 43, 1.2], [646, 190, 28, .9],
  [709, 323, 69, .9], [571, 407, 47, 1.1], [669, 455, 77, .8],
  [497, 470, 16, .9], [350, 493, -74, .7], [479, 349, 55, .9],
];

function SmallTree({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M-37 0C-54-23-42-47-24-52C-40-77-16-99 0-91C18-113 48-88 34-68C64-47 47-12 30-9C20 9-12 14-37 0Z" fill="#dce3cf" />
    <path d="M0 32C5 8-5-29 0-69M0-18L-23-40M1-36L24-58" fill="none" stroke="#bac6aa" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M-36 34Q0 44 36 34" fill="none" stroke="#cbd4bc" strokeWidth="1" />
  </g>;
}

export function HomeJourney() {
  return (
    <figure className={styles.journey} aria-label="Your path through life, with all eight Arbor guide apps connected through one tree">
      <svg viewBox="0 0 860 920" className={styles.landscape} fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="arbor-canopy" x1="260" y1="90" x2="585" y2="540" gradientUnits="userSpaceOnUse"><stop stopColor="#e5e9d8" /><stop offset="1" stopColor="#cbd7b9" /></linearGradient>
          <linearGradient id="arbor-crown" x1="450" y1="65" x2="450" y2="515" gradientUnits="userSpaceOnUse"><stop stopColor="#d3dec1" /><stop offset="1" stopColor="#e5ead9" /></linearGradient>
          <linearGradient id="arbor-bark" x1="418" y1="365" x2="459" y2="365" gradientUnits="userSpaceOnUse"><stop stopColor="#9aa889" /><stop offset=".4" stopColor="#b7c3a1" /><stop offset=".7" stopColor="#d0d7bb" /><stop offset="1" stopColor="#9eac8d" /></linearGradient>
          <linearGradient id="arbor-land" x1="430" y1="535" x2="430" y2="920" gradientUnits="userSpaceOnUse"><stop stopColor="#e6ebd9" /><stop offset="1" stopColor="#f4f3ed" /></linearGradient>
          <linearGradient id="arbor-path" x1="430" y1="590" x2="320" y2="890" gradientUnits="userSpaceOnUse"><stop stopColor="#f1ecde" /><stop offset="1" stopColor="#eee5d1" /></linearGradient>
          <linearGradient id="arbor-leaf" x1="-25" y1="0" x2="35" y2="-48" gradientUnits="userSpaceOnUse"><stop stopColor="#a7b991" stopOpacity=".3" /><stop offset="1" stopColor="#f0f2e6" stopOpacity=".9" /></linearGradient>
        </defs>

        {/* A quiet landscape gives the winding path a physical place to go. */}
        <path d="M118 596C183 540 283 568 352 547C462 514 519 537 612 565C731 601 795 631 766 696C742 749 637 757 662 811C688 867 532 923 370 905C195 885 103 847 126 785C152 720 40 666 118 596Z" fill="url(#arbor-land)" />
        <g stroke="#c6d0b8" strokeOpacity=".48" strokeWidth="1">
          <path d="M141 630C227 574 302 613 383 581C472 547 568 588 684 623" />
          <path d="M89 668C192 623 270 660 327 643M546 625C612 622 710 654 748 681" />
          <path d="M147 801C220 865 358 876 475 861C571 849 613 827 641 805" />
          <path d="M184 847C281 906 465 902 562 863" />
        </g>
        <SmallTree x={119} y={620} scale={.9} />
        <SmallTree x={720} y={594} scale={1.1} />
        <SmallTree x={660} y={728} scale={.65} />
        <SmallTree x={177} y={706} scale={.45} />

        {/* The same route remains visible for the entire story. */}
        <path d={route} stroke="#c8c6ae" strokeOpacity=".35" strokeWidth="49" strokeLinecap="round" />
        <path data-journey-track d={route} stroke="url(#arbor-path)" strokeWidth="45" strokeLinecap="round" />
        <path d={route} stroke="#bdab83" strokeOpacity=".4" strokeWidth="1.5" strokeDasharray="2 9" strokeLinecap="round" />
        <path data-journey-trail d={route} pathLength="1" className={styles.journeyTrail} stroke="#aa8650" strokeWidth="3" strokeLinecap="round" />

        {/* Layered botanical forms, connected by a single sculpted trunk. */}
        <path d="M147 347C89 274 142 192 218 184C196 109 273 55 342 76C387 4 482 40 507 76C593 31 675 96 666 160C767 168 811 261 760 325C806 402 729 482 667 477C625 551 529 552 485 519C408 571 318 539 291 509C198 535 124 474 146 419C91 412 102 362 147 347Z" fill="url(#arbor-canopy)" opacity=".85" />
        <path d="M239 222C208 171 251 120 303 130C313 74 375 67 417 101C463 61 526 88 531 133C600 113 662 166 633 219C703 233 721 302 676 346C714 408 650 463 595 445C557 498 493 483 459 458C394 505 338 471 320 433C255 448 209 393 234 354C178 315 191 248 239 222Z" fill="url(#arbor-crown)" opacity=".64" />
        <g stroke="#a9b893" strokeWidth="1" strokeOpacity=".35">
          <path d="M165 272C195 213 245 214 270 177M569 105C626 108 641 147 653 173M714 276C745 304 747 351 725 377M250 482C291 504 329 499 344 483" />
          <path d="M220 146L235 138M690 427L702 415M338 62L349 54M181 428L193 432" />
        </g>

        <path d="M398 594C414 518 425 466 417 380C410 313 431 261 438 194C453 265 439 326 449 378C458 459 448 533 466 593C449 605 418 605 398 594Z" fill="url(#arbor-bark)" />
        {branches.map((branch, index) => <g key={index}>
          <path d={branch.path} stroke="#dfe5ce" strokeWidth={index % 3 === 0 ? 16 : 13} strokeLinecap="round" />
          <path d={branch.path} stroke="#a4b291" strokeWidth={index % 3 === 0 ? 7 : 5} strokeLinecap="round" />
          <path d={branch.path} stroke="#eff1e2" strokeOpacity=".65" strokeWidth="1.5" strokeLinecap="round" />
        </g>)}
        <g stroke="#b2c09e" strokeWidth="2" strokeLinecap="round">
          <path d="M300 259Q313 227 303 199M330 395Q308 356 277 354M544 330Q558 291 544 271M617 430Q637 403 670 401M416 519Q385 547 356 550" />
        </g>
        {leaves.map(([x, y, rotation, scale], i) => <g key={i} transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}>
          <path d="M0 0C-30-9-35-32-28-51C-5-45 6-27 0 0ZM0 0C10-31 33-42 49-38C45-14 25 3 0 0Z" fill="url(#arbor-leaf)" stroke="#afbd9c" strokeOpacity=".25" strokeWidth=".8" />
          <path d="M0 0L-24-43M0 0L41-33" stroke="#9faf8c" strokeOpacity=".4" strokeWidth=".8" />
        </g>)}
        <g stroke="#a9b795" strokeLinecap="round" strokeOpacity=".65"><path d="M429 585C420 608 387 615 363 617M435 588C445 610 488 611 514 615M431 585L432 622" strokeWidth="3" /><path d="M363 617L347 627M514 615L530 625" strokeWidth="1.5" /></g>
        <g fill="#b4bf9f"><ellipse cx="317" cy="614" rx="6" ry="2.3" /><ellipse cx="559" cy="600" rx="9" ry="3" /><ellipse cx="570" cy="785" rx="5" ry="2" /></g>

        <g data-journey-traveller transform="translate(370 876)" className={styles.traveller}>
          <circle r="18" fill="#b5955e" fillOpacity=".12" />
          <circle r="10" fill="#f7f5eb" />
          <circle r="6" fill="#9a713d" />
          <text x="23" y="7" fill="#7c684a">You</text>
        </g>
      </svg>

      <ul className={styles.treeApps} aria-label="The eight Arbor guides">
        {homeCopy.apps.map((app, index) => <li key={app.id} className={styles.treeApp} style={{ left: `${branches[index].x / 860 * 100}%`, top: `${branches[index].y / 920 * 100}%` }}>
          <Link href={app.href} aria-label={`${app.name}, ${app.domain}. ${app.badge}. Explore ${app.name}.`}>
            <Image src={app.icon} alt="" width={80} height={80} className={styles.treeIcon} />
            <span className={styles.treeName}>{app.name}</span>
            <span className={styles.treeDomain}>{app.domain}</span>
          </Link>
        </li>)}
      </ul>
      <figcaption className={styles.journeyCaption}>Your path. Eight guides beside you.</figcaption>
    </figure>
  );
}
