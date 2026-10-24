import Image from "next/image";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { apps } from "@/content/apps";
import { APP_ROADMAP } from "@/content/roadmap";
import { getAppStates } from "@/lib/app-states";
import { APP_BRANDS } from "@/lib/brand";

import styles from "./SalusLanding.module.css";

const brand = APP_BRANDS.salus;
const roadmap = APP_ROADMAP.salus;

const screens = {
  home: "/images/apps/salus/home-overview.png",
  checkIn: "/images/apps/salus/check-in.png",
  reflect: "/images/apps/salus/reflect-options.png",
  guided: "/images/apps/salus/guided-journals.png",
  journal: "/images/apps/salus/journal-reflection.png",
  insight: "/images/apps/salus/insight-detail.png",
  insights: "/images/apps/salus/insights-overview.png",
  model: "/images/apps/salus/personal-model.png",
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

export async function SalusLanding() {
  const state = (await getAppStates()).salus;
  const betaUrl =
    state?.status === "beta" || state?.status === "live"
      ? state.downloadUrl
      : state === undefined
        ? apps.salus.download?.url
        : undefined;

  return (
    <main className="theme-light min-h-screen bg-bg text-fg">
      <Navbar tone="light" />

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
                  <p>Salus · your companion</p>
                  <span>Mind, reflection and resilience · by Arbor</span>
                </div>
              </div>

              <p className={styles.eyebrow}>{roadmap.label}</p>
              <h1>A quieter place to understand what is going on.</h1>
              <p className={styles.heroLead}>
                Check in, write freely, follow a prompt or talk something
                through. Salus helps you notice what keeps returning—without
                judging it or rushing you towards an answer.
              </p>

              <div className={styles.heroActions}>
                <a
                  href={betaUrl || "#access"}
                  target={betaUrl ? "_blank" : undefined}
                  rel={betaUrl ? "noopener noreferrer" : undefined}
                  className={styles.primaryCta}
                >
                  {betaUrl ? "Join the Salus beta" : "Follow Salus's progress"}
                  <span aria-hidden="true">{betaUrl ? "↗" : "→"}</span>
                </a>
                <a href="#how-it-works" className={styles.secondaryCta}>
                  See how Salus works <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>

            <div className={styles.heroVisual}>
              <div className={styles.rings} aria-hidden="true"><i /><i /></div>
              <ProductScreen
                src={screens.home}
                alt="Salus home screen offering a check-in, journal or conversation and highlighting a new reflection insight"
                className={styles.heroPhone}
                priority
              />
              <div className={styles.heroNote}>
                <span>A little space</span>
                <strong>Notice first. Decide later.</strong>
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
              <h2>It is hard to understand a pattern while you are still inside it.</h2>
            </div>
            <div className={styles.problemCopy}>
              <p>
                A thought can feel too small for a conversation and too tangled
                for a blank page. By the time it returns, the detail that made
                it useful may already be gone.
              </p>
              <p>
                Salus gives the moment somewhere to land, then helps you return
                to your own words with more distance and context.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className={styles.workflowSection}>
        <div className="site-container">
          <div className={styles.sectionIntro}>
            <p className={styles.kicker}>How Salus works</p>
            <h2>From a moment to something you can see more clearly.</h2>
          </div>

          <ol className={styles.steps}>
            <li><span>01</span><h3>Name what is here</h3><p>A quick mood and energy check-in can be enough to begin.</p></li>
            <li><span>02</span><h3>Choose your way in</h3><p>Write freely, start from a prompt, use a guided journal or talk.</p></li>
            <li><span>03</span><h3>Look at the thread</h3><p>Salus can surface a possible pattern and keep its source visible.</p></li>
            <li><span>04</span><h3>Return over time</h3><p>Review themes, emotions and what the evidence is beginning to suggest.</p></li>
          </ol>
        </div>
      </section>

      <section className={styles.beginSection}>
        <div className="site-container">
          <div className={styles.beginGrid}>
            <div className={styles.beginCopy}>
              <p className={styles.kicker}>Begin where you are</p>
              <h2>No perfect journal entry required.</h2>
              <p>
                Some days call for two sliders. Others need a blank page, a
                question, a short daily practice or a deeper guided thread.
                Salus keeps those entry points together so reflection can fit
                the moment rather than become another obligation.
              </p>
              <ul className={styles.modeList}>
                <li><strong>Check in</strong><span>Name mood and energy quickly.</span></li>
                <li><strong>Journal</strong><span>Choose free, prompted or guided writing.</span></li>
                <li><strong>Talk</strong><span>Use an open conversation when words need room.</span></li>
              </ul>
            </div>
            <div className={styles.beginScreens}>
              <ProductScreen
                src={screens.checkIn}
                alt="Salus check-in asking the user to place their mood and energy on simple scales"
                className={styles.checkInPhone}
              />
              <ProductScreen
                src={screens.reflect}
                alt="Salus Reflect screen offering free, prompted and guided journals, a check-in and a conversation"
                className={styles.reflectPhone}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.guidedSection}>
        <div className="site-container">
          <div className={styles.guidedGrid}>
            <ProductScreen
              src={screens.guided}
              alt="Salus guided journal library with daily practices, deeper adaptive reflection and themes including pressure, uncertainty and growth"
              className={styles.guidedPhone}
            />
            <div className={styles.guidedCopy}>
              <p className={styles.kicker}>Guidance without a script</p>
              <h2>A prompt for today—or a thread worth following.</h2>
              <p>
                Daily practices offer a steady starting point: an intention, a
                wind-down, highs and lows, or three good things. Adaptive
                journals can follow what you write, while themed reflections
                let you explore pressure, uncertainty, fatigue, growth or
                connection at your own pace.
              </p>
              <div className={styles.boundaryNote}>
                <strong>You choose the depth.</strong>
                <span>A short check-in and a deep reflection are both valid ways to use Salus.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.insightSection}>
        <div className="site-container">
          <div className={styles.insightHeader}>
            <p className={styles.kicker}>From entry to insight</p>
            <h2>Your words stay connected to what Salus notices.</h2>
            <p>
              A reflection can suggest a thread, but it does not replace the
              original moment. Salus keeps the source, meaning, possible next
              step and companion note close together so you can decide what is
              useful.
            </p>
          </div>
          <div className={styles.insightScreens}>
            <figure>
              <ProductScreen
                src={screens.journal}
                alt="A Salus journal entry with emotion labels, themes and a linked observation from Salus"
                className={styles.journalPhone}
              />
              <figcaption>Your entry remains the starting point.</figcaption>
            </figure>
            <figure>
              <ProductScreen
                src={screens.insight}
                alt="A Salus insight about feeling steadier at the end of the day, with meaning, source, next step and guide note available"
                className={styles.insightPhone}
              />
              <figcaption>The insight stays open to inspection.</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className={styles.patternSection}>
        <div className="site-container">
          <div className={styles.patternGrid}>
            <div className={styles.patternScreens}>
              <ProductScreen
                src={screens.insights}
                alt="Salus Insights screen summarising recent themes and emotions from the last month"
                className={styles.insightsPhone}
              />
              <ProductScreen
                src={screens.model}
                alt="Salus personal model showing a reflection-based openness signal, its current score and plain-language description"
                className={styles.modelPhone}
              />
            </div>
            <div className={styles.patternCopy}>
              <p className={styles.kicker}>Patterns, not labels</p>
              <h2>See what has been around—and how certain that picture is.</h2>
              <p>
                Monthly themes and recent emotions make change easier to
                notice. A wider personal model can bring together signals from
                check-ins, journals and optional questionnaires, with evidence
                and freshness kept visible.
              </p>
              <p className={styles.limitCopy}>
                These are mirrors for reflection, not clinical labels or a diagnosis.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.peopleSection}>
        <div className="site-container">
          <p className={styles.kicker}>Made for real moments</p>
          <h2>There is more than one useful way to reflect.</h2>
          <div className={styles.peopleGrid}>
            <div><strong>When the day feels full</strong><span>Capture a mood or a few words before the detail disappears.</span></div>
            <div><strong>When a thought keeps returning</strong><span>Follow it through a prompt, guided thread or conversation.</span></div>
            <div><strong>When you want perspective</strong><span>Look back across themes without forcing every day into a score.</span></div>
            <div><strong>When you know your mind works differently</strong><span>Use optional reflections about focus, energy, sensory load and support needs.</span></div>
          </div>
        </div>
      </section>

      <section className={styles.ecosystemSection}>
        <div className="site-container">
          <div className={styles.ecosystemGrid}>
            <div>
              <p className={styles.kicker}>Salus + Arbor</p>
              <h2>Your inner world helps Arbor understand the whole picture.</h2>
            </div>
            <div>
              <p className={styles.ecosystemLead}>
                Salus turns patterns in mood, energy and mental load into useful
                context for the rest of Arbor. Thrive can shape a gentler day,
                while Aevo can adjust training to the capacity you actually have.
              </p>
              <div className={styles.connectionNote}>
                <strong>Depth without duplication</strong>
                <span>Your private writing stays in Salus while the useful understanding it creates can strengthen every guide.</span>
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
            <div><dt>Access</dt><dd>{roadmap.note} {betaUrl ? "The current beta is available through TestFlight." : "Public beta access will be shared when it is ready."}</dd></div>
            <div><dt>Platform</dt><dd>Salus is currently being tested on iPhone. Wider platform availability has not been announced.</dd></div>
            <div><dt>Account</dt><dd>You need an Arbor account and must be 18 or older.</dd></div>
            <div><dt>Private writing</dt><dd>Your journals and reflections stay securely on your phone and can be managed in Salus.</dd></div>
            <div><dt>AI and personalisation</dt><dd>AI reflections help Salus surface themes and useful questions. Optional questionnaires can deepen the personal model behind that guidance.</dd></div>
            <div><dt>Important limit</dt><dd>Salus uses therapy-informed principles, but it is not a therapist, treatment, diagnosis or crisis service.</dd></div>
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
              <p>Salus · your companion</p>
              <h2>Give the moment somewhere to land.</h2>
            </div>
            <a
              href={betaUrl || "/progress"}
              target={betaUrl ? "_blank" : undefined}
              rel={betaUrl ? "noopener noreferrer" : undefined}
              className={styles.finalButton}
            >
              {betaUrl ? "Join the beta" : "Follow Salus's progress"}
              <span aria-hidden="true">{betaUrl ? "↗" : "→"}</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
