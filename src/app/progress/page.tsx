import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GuideGrowthMap } from "@/components/guides/GuideGrowthMap";
import { APP_ROADMAP, type DevelopmentStage } from "@/content/roadmap";
import { APP_BRANDS, APP_ORDER } from "@/lib/brand";
import styles from "@/components/marketing/StoryPages.module.css";
import { getPageSocialMetadata } from "@/lib/seo";

const title = "Arbor app development progress | Testing and roadmap";
const description = "See which Arbor guide apps are in testing, development or early planning, and what each stage means for access and release.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://arborapps.co/progress" },
  ...getPageSocialMetadata(title, description, "/progress"),
};

const stageNotes: { stage: DevelopmentStage; label: string; title: string; body: string }[] = [
  { stage: "testing", label: "In testing", title: "Testing it, not calling it finished.", body: "The first experiences are being tried and refined before a wider release. Testing status doesn’t mean anyone can download the app yet; each app’s page shows any available beta links." },
  { stage: "approaching-testing", label: "Approaching testing", title: "Getting ready for the first testers.", body: "The app is in development and progressing towards testing. Access is not open yet, and we’re not announcing a release date at this stage." },
  { stage: "development", label: "In development", title: "Turning the idea into something useful.", body: "The app and its personal guide are being built. This is active development, not an open beta or a promise of a launch date." },
  { stage: "pre-development", label: "Pre-development", title: "Shaping what comes next.", body: "We’re defining the direction of these guides. Product development has not started, so there is no release date or testing access yet." },
];
const count = (...stages: DevelopmentStage[]) => APP_ORDER.filter(id => stages.includes(APP_ROADMAP[id].stage)).length;

export default function ProgressPage() {
  return (
    <main className="min-h-screen bg-bg text-fg">
      <Navbar />
      <header className={styles.progressHero}><div className="site-container">
        <p className={styles.eyebrow}>Our progress / October 2026</p>
        <div className={styles.progressLead}>
          <h1 className={styles.title}>Big picture.<br /><span className={styles.muted}>Real steps.</span></h1>
          <p className={styles.intro}>You&apos;re building a life with more in it. We&apos;re building the guides to support it. Here&apos;s where each app stands—what&apos;s in testing, what&apos;s being built and what&apos;s still an idea.</p>
        </div>
        <dl className={styles.stats} aria-label="Current app development summary">
          <div className={styles.stat}><dt><span>Apps in testing</span></dt><dd><strong>{count("testing").toString().padStart(2, "0")}</strong><p>Trying, learning, refining.</p></dd></div>
          <div className={styles.stat}><dt><span>Apps in development</span></dt><dd><strong>{count("development", "approaching-testing").toString().padStart(2, "0")}</strong><p>Including those nearing testing.</p></dd></div>
          <div className={styles.stat}><dt><span>Apps in pre-development</span></dt><dd><strong>{count("pre-development").toString().padStart(2, "0")}</strong><p>Direction before development.</p></dd></div>
        </dl>
      </div></header>
      <GuideGrowthMap />
      <section className={`site-container ${styles.progressDetails}`} aria-labelledby="stages-heading">
        <div><p className={styles.eyebrow}>No guesswork</p><h2 id="stages-heading" className={styles.sectionTitle}>What does<br /><span className={styles.muted}>“in testing” mean?</span></h2><p className={styles.body}>A useful guide has to earn its place in your day. These stages show where the work is—not how long you&apos;ll have to wait.</p></div>
        <div className={styles.detailsList}>
          {stageNotes.map(({ stage, label, title, body }, index) => <details key={stage} open={index === 0}>
            <summary>{label}</summary>
            <p><strong className="font-medium text-fg">{title}</strong><br />{body}<br /><span className="mt-3 inline-block">{APP_ORDER.filter(id => APP_ROADMAP[id].stage === stage).map((id, appIndex) => <span key={id}>{appIndex > 0 && " · "}<Link href={`/${id}`} className="underline underline-offset-4">{APP_BRANDS[id].name}</Link></span>)}</span></p>
          </details>)}
        </div>
      </section>

      <section className={styles.closing} aria-labelledby="progress-closing-heading"><div className={`site-container ${styles.closingInner}`}>
        <div><p className={styles.eyebrow}>Be here early</p><h2 id="progress-closing-heading" className={styles.sectionTitle}>Help shape something<br />you&apos;ll actually use.</h2><p>Training before work. A week that keeps changing. Plans you want to make happen. That&apos;s the kind of real life Arbor is for. Join the waitlist to hear when new app access opens.</p></div>
        <Link href="/early-access" className="ui-primary gap-5">Keep me in the loop <span aria-hidden>↗</span></Link>
      </div></section>

      <section className={`site-container ${styles.future}`} aria-labelledby="grove-future-heading">
        <div><p className={styles.eyebrow}>Further down the path / An idea, not a release</p><h2 id="grove-future-heading">A place for the bigger picture.</h2></div>
        <div><p className={styles.body}>Arbor Grove is our idea for a future web workspace. Our focus now is the guide apps; Grove&apos;s development has not started and there&apos;s no release date.</p><Link href="/grove" className={styles.textLink}>Explore the Grove idea <span aria-hidden>↗</span></Link></div>
      </section>
      <Footer />
    </main>
  );
}
