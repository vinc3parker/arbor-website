import Image from "next/image";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { APP_ROADMAP } from "@/content/roadmap";
import { APP_BRANDS } from "@/lib/brand";

import styles from "./NuraLanding.module.css";

const brand = APP_BRANDS.nura;
const roadmap = APP_ROADMAP.nura;

const screens = {
  home: "/images/apps/nura/home-overview.png",
  decision: "/images/apps/nura/budget-decision.png",
  income: "/images/apps/nura/income-payday-plan.png",
  guide: "/images/apps/nura/guide-connected-plan.png",
  goals: "/images/apps/nura/saving-goals-progress.png",
  insights: "/images/apps/nura/insights-wealth-spending.png",
  money: "/images/apps/nura/money-accounts-pots.png",
  wend: "/images/apps/nura/wend-cost-decision.png",
};

function ProductScreen({
  src,
  alt,
  className = "",
  priority = false,
  coral = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  coral?: boolean;
}) {
  return (
    <div className={`${styles.phone} ${coral ? styles.coralScreen : ""} ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={1206}
        height={2622}
        sizes="(max-width: 767px) 74vw, 420px"
        priority={priority}
        className={styles.phoneImage}
      />
    </div>
  );
}

export function NuraLanding() {
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
                  <p>Nura · your money manager</p>
                  <span>Spending, saving and planning ahead · by Arbor</span>
                </div>
              </div>

              <p className={styles.eyebrow}>{roadmap.label}</p>
              <h1>Give every pound a job.</h1>
              <p className={styles.heroLead}>
                Nura turns accounts, income, budgets and future plans into a
                clear picture of what your money needs to do next—without
                judging what matters to you.
              </p>

              <div className={styles.heroActions}>
                <a href="#access" className={styles.primaryCta}>
                  Follow Nura&apos;s progress <span aria-hidden="true">→</span>
                </a>
                <a href="#how-it-works" className={styles.secondaryCta}>
                  See how Nura works <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>

            <div className={styles.heroVisual}>
              <div className={styles.heroLedger} aria-hidden="true">
                <span>Now</span><strong>£756</strong><small>left to spend</small>
                <span>Next</span><strong>4 days</strong><small>until payday</small>
                <span>Goal</span><strong>34%</strong><small>Australia fund</small>
              </div>
              <ProductScreen
                src={screens.home}
                alt="Nura home screen showing an over-budget transport decision, monthly spending pace, money left, payday timing and savings progress"
                className={styles.heroPhone}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.problemSection}>
        <div className="site-container">
          <div className={styles.problemGrid}>
            <div>
              <p className={styles.kicker}>The problem</p>
              <h2>A balance tells you what is there. Not what to do with it.</h2>
            </div>
            <div className={styles.problemCopy}>
              <p>
                Transactions explain where money went. They do not tell you
                which move matters on payday, whether a future plan still fits
                or what an overspent category means for the rest of the month.
              </p>
              <p>
                Nura connects the numbers to decisions: protect the buffer,
                fund the next priority, adjust the plan or leave it alone.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className={styles.workflowSection}>
        <div className="site-container">
          <div className={styles.sectionIntro}>
            <p className={styles.kicker}>How Nura works</p>
            <h2>See today. Order the next moves. Make room for what is coming.</h2>
          </div>

          <ol className={styles.steps}>
            <li><span>01</span><h3>Build the picture</h3><p>Bring accounts in or add them manually, then organise balances, pots and income.</p></li>
            <li><span>02</span><h3>Set the jobs</h3><p>Give everyday categories limits and bigger plans a target, date and funding pace.</p></li>
            <li><span>03</span><h3>Work payday</h3><p>Keep a buffer, fill important pots and move down the list in a sensible order.</p></li>
            <li><span>04</span><h3>Handle the change</h3><p>Respond to overspending, price rises and new plans with one clear decision.</p></li>
          </ol>
        </div>
      </section>

      <section className={styles.paydaySection}>
        <div className="site-container">
          <div className={styles.paydayGrid}>
            <div className={styles.paydayCopy}>
              <p className={styles.kicker}>From income to intention</p>
              <h2>Payday becomes a plan, not a reset.</h2>
              <p>
                Nura brings expected income, unpaid work and recurring sources
                into one view. Then it turns the money arriving into a short,
                ordered set of moves: protect bills, build the safety net and
                fund the goal that is due next.
              </p>
              <div className={styles.moneyRule}>
                <span>£4,640 expected</span>
                <span>3 moves this payday</span>
                <span>9 paydays to Australia</span>
              </div>
            </div>
            <div className={styles.paydayScreens}>
              <ProductScreen
                src={screens.income}
                alt="Nura income screen showing expected pay, unpaid work and a payday checklist for an emergency fund, travel goal and bills"
                className={styles.incomePhone}
              />
              <ProductScreen
                src={screens.decision}
                alt="Nura decision screen offering practical responses to a transport budget that is forty-three pounds over"
                className={styles.decisionPhone}
                coral
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.goalsSection}>
        <div className="site-container">
          <div className={styles.goalsGrid}>
            <ProductScreen
              src={screens.goals}
              alt="Nura saving goals screen showing suggested pots and progress towards Australia and emergency-fund targets"
              className={styles.goalsPhone}
            />
            <div className={styles.goalsCopy}>
              <p className={styles.kicker}>Every pound gets a job</p>
              <h2>Separate everyday spending from the things you are building.</h2>
              <p>
                Budgets pace the month. Pots prepare for bills and one-off
                costs. Goals connect a target and date to the amount that needs
                to move each payday, so progress stays visible before the money
                is needed.
              </p>
              <ul className={styles.goalTypes}>
                <li><strong>Safety</strong><span>A buffer and emergency fund before surprises arrive.</span></li>
                <li><strong>Known costs</strong><span>Annual bills, tax reserves and planned purchases.</span></li>
                <li><strong>Life goals</strong><span>Travel, learning and the plans you actually care about.</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.planSection}>
        <div className="site-container">
          <div className={styles.planHeader}>
            <p className={styles.kicker}>A plan with an order</p>
            <h2>Clarity is knowing what comes first—and what can wait.</h2>
          </div>

          <div className={styles.planGrid}>
            <div className={styles.planOrder}>
              <ol>
                <li><span>1</span><div><strong>Keep a buffer</strong><small>Protect the current account from the unexpected.</small></div></li>
                <li><span>2</span><div><strong>Build the emergency fund</strong><small>Work towards a useful number of months.</small></div></li>
                <li><span>3</span><div><strong>Prepare for bills</strong><small>Turn annual shocks into manageable monthly moves.</small></div></li>
                <li><span>4</span><div><strong>Fund the goals</strong><small>Start with the one that is due soonest.</small></div></li>
                <li><span>5</span><div><strong>Think longer term</strong><small>Grow from a more stable foundation.</small></div></li>
              </ol>
            </div>
            <ProductScreen
              src={screens.guide}
              alt="Nura Guide screen showing a connected Wend cost, the current payday and an ordered money plan beginning with a buffer"
              className={styles.guidePhone}
              coral
            />
          </div>
        </div>
      </section>

      <section className={styles.proofSection}>
        <div className="site-container">
          <div className={styles.proofIntro}>
            <p className={styles.kicker}>Progress you can read</p>
            <h2>See the whole position—and the pressure points inside it.</h2>
            <p>
              Nura separates available cash, pots, business money and
              investments, follows wealth over time and shows which spending
              categories are on track or need attention.
            </p>
          </div>
          <div className={styles.proofScreens}>
            <figure>
              <ProductScreen
                src={screens.insights}
                alt="Nura Insights screen showing total wealth split across available cash, pots, business money and investments, plus change over time"
              />
              <figcaption><strong>Understand the position</strong><span>Different kinds of money stay distinct instead of collapsing into one reassuring total.</span></figcaption>
            </figure>
            <figure>
              <ProductScreen
                src={screens.money}
                alt="Nura Money screen showing accounts, pots, savings goals and financial context arriving from other Arbor apps"
              />
              <figcaption><strong>Connect the plan</strong><span>Accounts and pots become the working structure behind budgets, payday moves and future costs.</span></figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className={styles.peopleSection}>
        <div className="site-container">
          <p className={styles.kicker}>Built for real money lives</p>
          <h2>Useful whether income is predictable, irregular or still taking shape.</h2>
          <div className={styles.peopleGrid}>
            <div><strong>Variable income</strong><span>See expected pay, unpaid work and the moves that matter when money lands.</span></div>
            <div><strong>Everyday budgeting</strong><span>Know what is left without treating every purchase as a mistake.</span></div>
            <div><strong>Future goals</strong><span>Turn a date and target into progress that advances each payday.</span></div>
            <div><strong>Several priorities at once</strong><span>Balance buffers, bills and meaningful plans in one ordered system.</span></div>
          </div>
        </div>
      </section>

      <section className={styles.ecosystemSection}>
        <div className="site-container">
          <div className={styles.ecosystemGrid}>
            <div className={styles.ecosystemCopy}>
              <p className={styles.kicker}>Nura + Arbor</p>
              <h2>The rest of life stops arriving as a financial surprise.</h2>
              <p>
                Aevo can surface an upcoming race entry, Sage a course and Wend
                a weekend away. Nura shows what those plans mean alongside
                bills, goals and payday—then gives the relevant guide a price
                range it can use to suggest something that fits.
              </p>
              <div className={styles.connectionNote}>
                <strong>Connected planning in action</strong>
                <span>Wend proposes a £140 weekend against £120 already set aside. Nura makes the £20 trade-off visible before the plan is committed.</span>
              </div>
              <Link href="/how-it-works" className={styles.textLink}>
                See how the Arbor guides work together <span aria-hidden="true">→</span>
              </Link>
            </div>
            <ProductScreen
              src={screens.wend}
              alt="Nura conversation showing that a weekend suggested by Wend is twenty pounds above the amount set aside, with a choice to save for it"
              className={styles.wendPhone}
              coral
            />
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
            <div><dt>Access</dt><dd>{roadmap.note}</dd></div>
            <div><dt>Platform</dt><dd>Nura is currently being developed and reviewed on iPhone. Wider platform availability has not been announced.</dd></div>
            <div><dt>Account</dt><dd>You need an Arbor account and must be 18 or older.</dd></div>
            <div><dt>Money sources</dt><dd>The development build includes connected-account and manual-account flows. Supported banking providers and territories will be confirmed before release.</dd></div>
            <div><dt>Financial context</dt><dd>Nura brings balances, transactions, income, budgets, pots and goals together, then uses upcoming plans from across Arbor to make the picture more useful.</dd></div>
            <div><dt>Important limit</dt><dd>Nura is for explanation, organisation and planning. It does not provide regulated financial advice or personal investment recommendations.</dd></div>
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
              <p>Nura · your money manager</p>
              <h2>Make money work for the life you want.</h2>
            </div>
            <a href="#access" className={styles.finalButton}>
              Follow Nura&apos;s progress <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
