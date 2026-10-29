import Image from "next/image";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { APP_ROADMAP } from "@/content/roadmap";
import { getAppStates } from "@/lib/app-states";
import { APP_BRANDS } from "@/lib/brand";

import styles from "./ThriveLanding.module.css";

const brand = APP_BRANDS.thrive;
const roadmap = APP_ROADMAP.thrive;

const screens = {
  home: "/images/apps/thrive/home-today.png",
  assistant: "/images/apps/thrive/assistant-capture.png",
  area: "/images/apps/thrive/area-work-purpose.png",
  project: "/images/apps/thrive/project-milestones.png",
  task: "/images/apps/thrive/task-detail.png",
  routines: "/images/apps/thrive/routines-overview.png",
  calendar: "/images/apps/thrive/calendar-day-plan.png",
  wrapUp: "/images/apps/thrive/evening-wrap-up.png",
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

export async function ThriveLanding() {
  const state = (await getAppStates()).thrive;
  const betaUrl =
    state?.status === "beta" || state?.status === "live"
      ? state.downloadUrl
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
                  <p>Thrive · your assistant</p>
                  <span>Time, plans and routines · by Arbor</span>
                </div>
              </div>

              <p className={styles.eyebrow}>{roadmap.label}</p>
              <h1>A plan that can survive the day.</h1>
              <p className={styles.heroLead}>
                Bring tasks, projects, routines and scheduled commitments into
                one realistic picture. Thrive helps you choose what matters
                now—and reorganise without turning a changed plan into failure.
              </p>

              <div className={styles.heroActions}>
                <a
                  href={betaUrl || "#access"}
                  target={betaUrl ? "_blank" : undefined}
                  rel={betaUrl ? "noopener noreferrer" : undefined}
                  className={styles.primaryCta}
                >
                  {betaUrl ? "Join the Thrive beta" : "Follow Thrive's progress"}
                  <span aria-hidden="true">{betaUrl ? "↗" : "→"}</span>
                </a>
                <a href="#how-it-works" className={styles.secondaryCta}>
                  See how Thrive works <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>

            <div className={styles.heroVisual}>
              <div className={styles.dayTrack} aria-hidden="true">
                <span>morning</span><i /><span>now</span><i /><span>evening</span>
              </div>
              <ProductScreen
                src={screens.home}
                alt="Thrive home screen showing today's one focus, a realistic assistant note, projects to keep in sight and the next tasks"
                className={styles.heroPhone}
                priority
              />
              <div className={styles.focusNote}>
                <span>Today&apos;s one thing</span>
                <strong>Clarity before quantity.</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.problemSection}>
        <div className="site-container">
          <div className={styles.problemGrid}>
            <div>
              <p className={styles.kicker}>The problem</p>
              <h2>Your tasks are not the same thing as your capacity.</h2>
            </div>
            <div className={styles.problemCopy}>
              <p>
                A long list cannot see the appointment already taking half the
                afternoon, the routine that keeps the evening steady or the
                project that deserves uninterrupted attention.
              </p>
              <p>
                Thrive turns those separate demands into a plan for the day you
                actually have, then helps you revise it when reality changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className={styles.workflowSection}>
        <div className="site-container">
          <div className={styles.sectionIntro}>
            <p className={styles.kicker}>How Thrive works</p>
            <h2>Capture the noise. Find the next action. Keep the day movable.</h2>
          </div>

          <ol className={styles.steps}>
            <li><span>01</span><h3>Put it down</h3><p>Add one task, paste a longer plan or empty a whole brain-dump.</p></li>
            <li><span>02</span><h3>Give it shape</h3><p>Connect tasks to an area, project, milestone, place, estimate and energy level.</p></li>
            <li><span>03</span><h3>Commit the day</h3><p>See routines and commitments together, then choose a realistic focus.</p></li>
            <li><span>04</span><h3>Close the loop</h3><p>Finish, move or release open work and set tomorrow up deliberately.</p></li>
          </ol>
        </div>
      </section>

      <section className={styles.captureSection}>
        <div className="site-container">
          <div className={styles.captureGrid}>
            <div className={styles.captureCopy}>
              <p className={styles.kicker}>Start untidy</p>
              <h2>Tell Thrive what is on your mind. Structure can come second.</h2>
              <p>
                The assistant accepts a task, several things at once or a
                longer plan. It can help turn that raw material into a project
                with milestones and dated tasks, or simply help you work out
                what today needs.
              </p>
              <div className={styles.promptExamples}>
                <span>“Help me figure out my day.”</span>
                <span>“Build a morning routine.”</span>
                <span>“Add: gym Friday at 7am.”</span>
              </div>
            </div>
            <ProductScreen
              src={screens.assistant}
              alt="Thrive assistant screen inviting a task, brain-dump or request for help, with examples for day planning, routines and scheduling"
              className={styles.assistantPhone}
            />
          </div>
        </div>
      </section>

      <section className={styles.structureSection}>
        <div className="site-container">
          <div className={styles.structureHeader}>
            <p className={styles.kicker}>More than a list</p>
            <h2>Keep work connected to the part of life it belongs to.</h2>
            <p>
              Areas hold the bigger picture. Projects show progress and the
              next milestone. Tasks carry the practical context needed to fit
              them into a real day.
            </p>
          </div>

          <div className={styles.structureScreens}>
            <figure>
              <ProductScreen
                src={screens.area}
                alt="Thrive Work and purpose area showing a focus task, project progress, related tasks and routine"
                className={styles.areaPhone}
              />
              <figcaption><strong>Area</strong><span>One view of the projects, tasks and routines pulling in the same direction.</span></figcaption>
            </figure>
            <figure>
              <ProductScreen
                src={screens.project}
                alt="Thrive project screen showing 30 percent progress, four milestones and a linked task"
                className={styles.projectPhone}
              />
              <figcaption><strong>Project</strong><span>Progress, milestones and the next piece of work stay together.</span></figcaption>
            </figure>
            <figure>
              <ProductScreen
                src={screens.task}
                alt="Thrive task detail with subtasks, location, labels, priority, energy, estimate, schedule, area, project and focus controls"
                className={styles.taskPhone}
              />
              <figcaption><strong>Task</strong><span>Enough context to decide when and how it fits—not just what it is called.</span></figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className={styles.rhythmSection}>
        <div className="site-container">
          <div className={styles.rhythmGrid}>
            <div className={styles.rhythmScreens}>
              <ProductScreen
                src={screens.routines}
                alt="Thrive routines screen showing morning, evening, fitness, cleaning and planning routines with progress and streak context"
                className={styles.routinesPhone}
              />
              <ProductScreen
                src={screens.calendar}
                alt="Thrive calendar showing a month, selected day, day-plan controls and scheduled blocks including the gym and a lecture"
                className={styles.calendarPhone}
              />
            </div>
            <div className={styles.rhythmCopy}>
              <p className={styles.kicker}>A day has a shape</p>
              <h2>Plan around rhythms, not just deadlines.</h2>
              <p>
                Morning and evening routines, weekly habits, calendar events,
                wake and sleep anchors and focused work all share the same day.
                Thrive makes that shape visible before more work is added.
              </p>
              <ul className={styles.rhythmList}>
                <li><strong>Flexible routines</strong><span>Daily, weekly or several times a week, with room to recover after a miss.</span></li>
                <li><strong>Day and week views</strong><span>See the calendar before committing the plan.</span></li>
                <li><strong>Focus when useful</strong><span>Start with five minutes or use a focused session for the task in front of you.</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.wrapSection}>
        <div className="site-container">
          <div className={styles.wrapGrid}>
            <div className={styles.wrapCopy}>
              <p className={styles.kicker}>The plan can change</p>
              <h2>End the day without carrying every loose end into tomorrow.</h2>
              <p>
                The evening wrap-up puts each open item back in your hands:
                move it to tomorrow, remove the date or mark it done. Add how
                the day felt, leave an optional line and decide whether to plan
                tomorrow now.
              </p>
              <div className={styles.wrapChoices}>
                <span>Tomorrow</span><span>No date</span><span>Done</span>
              </div>
            </div>
            <ProductScreen
              src={screens.wrapUp}
              alt="Thrive evening wrap-up showing open work with choices to move it to tomorrow, remove its date or mark it done, plus a day reflection"
              className={styles.wrapPhone}
            />
          </div>
        </div>
      </section>

      <section className={styles.peopleSection}>
        <div className="site-container">
          <p className={styles.kicker}>Useful in a life with moving parts</p>
          <h2>Structure without pretending every day is predictable.</h2>
          <div className={styles.peopleGrid}>
            <div><strong>Work and home together</strong><span>See personal admin, relationships, wellbeing and work without forcing them into separate systems.</span></div>
            <div><strong>Study with everything else</strong><span>Connect lectures and assignments to routines, estimates and realistic focus time.</span></div>
            <div><strong>Projects that need momentum</strong><span>Keep the outcome, milestones and next useful task in one place.</span></div>
            <div><strong>Days that change</strong><span>Re-plan deliberately instead of treating an unfinished list as failure.</span></div>
          </div>
        </div>
      </section>

      <section className={styles.ecosystemSection}>
        <div className="site-container">
          <div className={styles.ecosystemGrid}>
            <div>
              <p className={styles.kicker}>Thrive + Arbor</p>
              <h2>Your commitments can help every guide stay realistic.</h2>
            </div>
            <div>
              <p className={styles.ecosystemLead}>
                The time and capacity visible in Thrive make every Arbor guide
                more realistic. A packed week here can mean a lighter session
                in Aevo, a shorter lesson in Sage or a simpler plan from Wend.
              </p>
              <div className={styles.connectionNote}>
                <strong>One life, one sense of capacity</strong>
                <span>Thrive gives the wider Arbor system a grounded view of what your days can actually hold.</span>
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
            <p className={styles.kicker}>Before you join</p>
            <h2>The practical details.</h2>
          </div>
          <dl className={styles.practicalList}>
            <div><dt>Access</dt><dd>{roadmap.note} {betaUrl ? "The current beta is available through the supplied access link." : "Public beta access has not been announced."}</dd></div>
            <div><dt>Platform</dt><dd>Thrive is currently being tested on iPhone. Wider platform availability has not been announced.</dd></div>
            <div><dt>Account</dt><dd>You need an Arbor account and must be 18 or older.</dd></div>
            <div><dt>Private planning</dt><dd>Your tasks, routines and notes stay securely on your phone and can be managed in Thrive.</dd></div>
            <div><dt>AI assistant</dt><dd>Thrive uses AI to turn what you share into tasks, plans and suggested routines.</dd></div>
            <div><dt>Connected planning</dt><dd>Calendar, reminders and context from across Arbor help Thrive build plans around the reality of your life.</dd></div>
          </dl>
          <div className={styles.policyLinks}>
            <Link href="/legal/thrive">Thrive data &amp; use</Link>
            <Link href="/privacy">Arbor privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/account">Your Arbor account</Link>
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className="site-container">
          <div className={styles.finalCtaInner}>
            <div>
              <p>Thrive · your assistant</p>
              <h2>Make room for what matters today.</h2>
            </div>
            <a
              href={betaUrl || "/progress"}
              target={betaUrl ? "_blank" : undefined}
              rel={betaUrl ? "noopener noreferrer" : undefined}
              className={styles.finalButton}
            >
              {betaUrl ? "Join the beta" : "Follow Thrive's progress"}
              <span aria-hidden="true">{betaUrl ? "↗" : "→"}</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
