import Image from "next/image";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { apps } from "@/content/apps";
import { APP_ROADMAP } from "@/content/roadmap";
import { getAppStates } from "@/lib/app-states";
import { APP_BRANDS } from "@/lib/brand";

import styles from "./AevoLanding.module.css";

const brand = APP_BRANDS.aevo;
const roadmap = APP_ROADMAP.aevo;

const screenshots = {
  today: "/images/apps/aevo/today-adaptive-plan.png",
  session: "/images/apps/aevo/session-coach-check.png",
  program: "/images/apps/aevo/program-overview.png",
  progress: "/images/apps/aevo/progress-coaching-read.png",
  profile: "/images/apps/aevo/athlete-profile.png",
};

function ProductScreen({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`${styles.phone} ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={1206}
        height={2622}
        sizes="(max-width: 767px) 72vw, 420px"
        priority={priority}
        className={styles.phoneImage}
      />
    </div>
  );
}

export async function AevoLanding() {
  const state = (await getAppStates()).aevo;
  const betaUrl =
    state?.status === "beta" || state?.status === "live"
      ? state.downloadUrl
      : state === undefined
        ? apps.aevo.download?.url
        : undefined;

  return (
    <main className="theme-dark min-h-screen bg-bg text-fg">
      <Navbar tone="dark" />

      <section className={styles.hero}>
        <div className="site-container">
          <Link href="/guides" className={styles.backLink}>
            <span aria-hidden="true">←</span> All Arbor guides
          </Link>

          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <div className={styles.identity}>
                <Image
                  src={brand.icon}
                  alt=""
                  width={64}
                  height={64}
                  priority
                  className={styles.appIcon}
                />
                <div>
                  <p>Aevo · your coach</p>
                  <span>Health, training and recovery · by Arbor</span>
                </div>
              </div>

              <p className={styles.eyebrow}>{roadmap.label}</p>
              <h1>Training that adjusts when life does.</h1>
              <p className={styles.heroLead}>
                Aevo brings strength, running, conditioning and sport into one
                plan—then helps you decide what to move, protect or change as
                the week unfolds.
              </p>

              <div className={styles.heroActions}>
                <a
                  href={betaUrl || "#access"}
                  target={betaUrl ? "_blank" : undefined}
                  rel={betaUrl ? "noopener noreferrer" : undefined}
                  className={styles.primaryCta}
                >
                  {betaUrl ? "Join the Aevo beta" : "Follow Aevo's progress"}
                  <span aria-hidden="true">{betaUrl ? "↗" : "→"}</span>
                </a>
                <a href="#how-it-works" className={styles.secondaryCta}>
                  See how Aevo works <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>

            <div className={styles.heroVisual}>
              <div className={styles.orbitLabel} aria-hidden="true">
                <span>plan</span><span>train</span><span>review</span>
              </div>
              <ProductScreen
                src={screenshots.today}
                alt="Aevo Today screen showing a missed run that needs a decision, today's strength session, and the rest of the training week"
                className={styles.heroPhone}
                priority
              />
              <div className={styles.decisionNote}>
                <span>Plan changed?</span>
                <strong>Move it. Do it. Let it go.</strong>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.disciplineRail}>
          <div className="site-container">
            <span>Strength</span><i aria-hidden="true" />
            <span>Running</span><i aria-hidden="true" />
            <span>Conditioning</span><i aria-hidden="true" />
            <span>Classes</span><i aria-hidden="true" />
            <span>Sport</span>
          </div>
        </div>
      </section>

      <section className={styles.tensionSection}>
        <div className="site-container">
          <div className={styles.tensionGrid}>
            <div>
              <p className={styles.sectionKicker}>The problem</p>
              <h2>Your training does not happen in separate apps—or in a perfect week.</h2>
            </div>
            <div className={styles.tensionCopy}>
              <p>
                A running plan can ignore the gym. A strength programme can
                miss the class you love. And neither knows that yesterday went
                sideways.
              </p>
              <p>
                Aevo keeps the work connected, so the next useful decision is
                based on your goal, your current programme and what you have
                actually managed to do.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className={styles.workflowSection}>
        <div className="site-container">
          <div className={styles.sectionIntro}>
            <p className={styles.sectionKicker}>How Aevo works</p>
            <h2>One training cycle, kept in context.</h2>
          </div>

          <ol className={styles.steps}>
            <li>
              <span>01</span>
              <h3>Set the direction</h3>
              <p>Choose the goal, event, focus areas and time you can realistically give it.</p>
            </li>
            <li>
              <span>02</span>
              <h3>Build the week</h3>
              <p>Bring running, strength, conditioning and classes into one progressive programme.</p>
            </li>
            <li>
              <span>03</span>
              <h3>Check before you start</h3>
              <p>Tell your coach what changed. Ease, move or protect a session before forcing it.</p>
            </li>
            <li>
              <span>04</span>
              <h3>Review the evidence</h3>
              <p>See what the plan, recovery and your own feedback suggest—and correct the record.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className={styles.programStory}>
        <div className="site-container">
          <div className={styles.programGrid}>
            <div className={styles.screenPair}>
              <ProductScreen
                src={screenshots.program}
                alt="Aevo six-week All-round Base Block programme combining threshold running, upper-body strength, endurance riding and full-body training"
                className={styles.programPhone}
              />
              <ProductScreen
                src={screenshots.session}
                alt="Aevo planned upper-body session with a coach check, build phase context, exercise loads and repetition targets"
                className={styles.sessionPhone}
              />
            </div>

            <div className={styles.programCopy}>
              <p className={styles.sectionKicker}>From block to set</p>
              <h2>See the whole programme. Know exactly what to do next.</h2>
              <p>
                Aevo connects the long view to the session in front of you. A
                six-week block shows how different disciplines fit together;
                each session carries the phase, purpose, exercises, loads,
                paces and recovery details that make it usable.
              </p>
              <ul className={styles.signalList}>
                <li><span>Programme</span> A progressive block around the outcome you chose</li>
                <li><span>Session</span> Precise work with coach context, not a generic workout</li>
                <li><span>Adjustment</span> A decision point before the session begins</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.evidenceSection}>
        <div className="site-container">
          <div className={styles.evidenceGrid}>
            <div className={styles.evidenceCopy}>
              <p className={styles.sectionKicker}>Progress without pretending</p>
              <h2>A coaching read, with the evidence left visible.</h2>
              <p>
                Aevo brings together your completed work, the plan, recovery
                signals, goal evidence and how training felt. It explains what
                is developing and what still needs time—without treating
                attendance as proof of fitness gains.
              </p>
              <div className={styles.evidenceQuote}>
                <span>Built for scrutiny</span>
                <p>You can inspect the signals, correct them and confirm changes before the plan moves.</p>
              </div>
            </div>
            <ProductScreen
              src={screenshots.progress}
              alt="Aevo Progress screen showing a weekly coaching read, the evidence behind it, recent training totals and capability status"
              className={styles.progressPhone}
            />
          </div>
        </div>
      </section>

      <section className={styles.profileSection}>
        <div className="site-container">
          <div className={styles.profileGrid}>
            <ProductScreen
              src={screenshots.profile}
              alt="Aevo athlete profile showing current coaching focus, goals, programme and capability confidence across strength, endurance and mobility"
              className={styles.profilePhone}
            />
            <div className={styles.profileCopy}>
              <p className={styles.sectionKicker}>Personal by design</p>
              <h2>Your plan starts with the athlete—not a template.</h2>
              <p>
                Goals, seasons, events, availability, routines and current
                capabilities give Aevo a working picture of what you are
                training for. Confidence labels make it clear where that
                picture is strong and where more evidence is needed.
              </p>
              <div className={styles.useCases}>
                <div><strong>Hybrid training</strong><span>Balance the run, the lift and the class.</span></div>
                <div><strong>Event build</strong><span>Work backwards from a race or competition.</span></div>
                <div><strong>Everyday structure</strong><span>Train consistently without assuming every week is ideal.</span></div>
                <div><strong>Return with context</strong><span>Keep rehab work visible while qualified care stays in charge.</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ecosystemSection}>
        <div className="site-container">
          <div className={styles.ecosystemGrid}>
            <div>
              <p className={styles.sectionKicker}>Aevo + Arbor</p>
              <h2>Your training is one part of your life.</h2>
            </div>
            <div>
              <p className={styles.ecosystemLead}>
                Your Arbor account gives Aevo the wider picture it needs to
                make training fit your life. A packed week in Thrive can mean
                a lighter session here, while Aevo&apos;s training load can help
                the rest of Arbor protect your recovery.
              </p>
              <div className={styles.connectionLine}>
                <span>One connected picture</span>
                <p>Time, energy, recovery and training no longer have to live in separate apps making separate plans.</p>
              </div>
              <Link href="/how-it-works" className={styles.textLink}>
                See how the Arbor guides work together <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="access" className={styles.practicalSection}>
        <div className="site-container">
          <div className={styles.practicalHeader}>
            <p className={styles.sectionKicker}>Before you join</p>
            <h2>The practical details.</h2>
          </div>
          <dl className={styles.practicalList}>
            <div><dt>Access</dt><dd>{roadmap.note} {betaUrl ? "The current beta is available through TestFlight." : "Public beta access will be shared when it is ready."}</dd></div>
            <div><dt>Platform</dt><dd>Aevo is currently being tested on iPhone. Wider platform availability has not been announced.</dd></div>
            <div><dt>Account</dt><dd>You need an Arbor account and must be 18 or older. Account creation, terms and billing are handled on arborapps.co.</dd></div>
            <div><dt>AI and training context</dt><dd>AI coaching is part of Aevo. Connected health and training sources can add useful recovery, readiness and workload context.</dd></div>
            <div><dt>The Arbor advantage</dt><dd>Your Arbor account lets Aevo learn from the rest of your life and contribute training context to the other guides.</dd></div>
            <div><dt>Important limit</dt><dd>Aevo supports training decisions. It does not diagnose or treat injuries or replace care from a qualified health professional.</dd></div>
          </dl>
          <div className={styles.policyLinks}>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/account">Your Arbor account</Link>
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className="site-container">
          <div className={styles.finalCtaInner}>
            <div>
              <p>Aevo · your coach</p>
              <h2>Build a plan for the week you will actually live.</h2>
            </div>
            <a
              href={betaUrl || "/progress"}
              target={betaUrl ? "_blank" : undefined}
              rel={betaUrl ? "noopener noreferrer" : undefined}
              className={styles.finalButton}
            >
              {betaUrl ? "Join the beta" : "Follow Aevo's progress"}
              <span aria-hidden="true">{betaUrl ? "↗" : "→"}</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
