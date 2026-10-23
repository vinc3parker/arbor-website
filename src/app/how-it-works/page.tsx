import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GuideStories } from "@/components/home/GuideStories";
import { LifeOrbit } from "@/components/marketing/LifeOrbit";
import styles from "@/components/marketing/StoryPages.module.css";
import { getPageSocialMetadata } from "@/lib/seo";

const title = "How Arbor works | Personal self-help guidance";
const description = "Learn how Arbor’s personal guide apps are designed to understand your goals, tailor guidance to you and connect the different parts of life.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://arborapps.co/how-it-works" },
  ...getPageSocialMetadata(title, description, "/how-it-works"),
};

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-bg text-fg">
      <Navbar />
      <header className={styles.hero}>
        <div className={`site-container ${styles.heroGrid}`}>
          <div>
            <p className={styles.eyebrow}>Why Arbor / A life that fits together</p>
            <h1 className={styles.title}>Big plans.<br /><span className={styles.muted}>A life that fits.</span></h1>
            <p className={styles.intro}>Get stronger. Do work you care about. Book the trip. Make time for your people. Wanting more from life shouldn&apos;t mean juggling all of it alone.</p>
            <div className={styles.actions}><Link href="/guides" className="ui-primary gap-5">Find your guide <span aria-hidden>↗</span></Link><a href="#life-in-context" className={styles.textLink}>See the bigger picture <span aria-hidden>↓</span></a></div>
          </div>
          <LifeOrbit />
        </div>
      </header>

      <section className={`site-container ${styles.statement}`} aria-labelledby="personal-heading">
        <div><p className={styles.eyebrow}>Personal, not prescriptive</p><h2 id="personal-heading" className={styles.sectionTitle}>You don&apos;t need<br />someone else&apos;s<br /><span className={styles.muted}>perfect routine.</span></h2></div>
        <div className={styles.body}>
          <p>You need support that understands your ambitions, your habits and the week you&apos;re actually having. Not another generic plan that only works if you rearrange your life around it.</p>
          <p>Arbor is a family of eight personal guide apps. Each has a specialist AI guide for one part of life. We&apos;re building the connections between them so a training goal, a busy week and a weekend away can be considered together—not treated as separate lives.</p>
          <p>You choose what a good life looks like. The guides are there to help you work towards it.</p>
        </div>
      </section>

      <GuideStories />

      <section className={`site-container ${styles.steps}`} aria-labelledby="long-run-heading">
        <p className={styles.eyebrow}>A companion for the long run</p>
        <h2 id="long-run-heading" className={styles.sectionTitle}>Start with what matters now.<br /><span className={styles.muted}>Keep room for what comes next.</span></h2>
        <div className={styles.stepsGrid}>
          <article className={styles.step}><span className={styles.number}>01 / Your starting point</span><h3>One goal is enough to begin.</h3><p>Your training. Your headspace. Getting on top of your week. Choose the guide for the part of life you want to work on first.</p></article>
          <article className={styles.step}><span className={styles.number}>02 / Your context</span><h3>More understanding. Less generic advice.</h3><p>Your guides are designed to learn from what you share: what drives you, what gets in the way and what has or hasn&apos;t worked for you.</p></article>
          <article className={styles.step}><span className={styles.number}>03 / Your next chapter</span><h3>Support beyond this one challenge.</h3><p>A new role. A different city. A bigger ambition. Arbor&apos;s aim is a connected understanding that grows with you, rather than another tool you outgrow.</p></article>
        </div>
        <div className={styles.actions}><Link href="/privacy" className={styles.textLink}>What you share matters. Read about your data <span aria-hidden>↗</span></Link></div>
      </section>

      <section className={styles.closing} aria-labelledby="why-closing-heading"><div className={`site-container ${styles.closingInner}`}>
        <div><h2 id="why-closing-heading" className={styles.sectionTitle}>Your next chapter<br />doesn&apos;t have to be a solo project.</h2><p>Arbor is taking shape, with the first apps in testing. Explore the guides, see where we are, and find your place in what comes next.</p></div>
        <Link href="/early-access" className="ui-primary gap-5">Be part of the beginning <span aria-hidden>↗</span></Link>
      </div></section>
      <Footer />
    </main>
  );
}
