import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageIntro } from "@/components/PageIntro";
import { APP_ROADMAP, type DevelopmentStage } from "@/content/roadmap";
import { APP_BRANDS, APP_ORDER } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Our progress — Arbor",
  description: "The current Arbor roadmap: Aevo, Salus and Thrive in testing, Nura approaching testing, Wend in development, and Sage, Telos and Kith in pre-development.",
  alternates: { canonical: "https://arborapps.co/progress" },
};

const stages: { stage: DevelopmentStage; title: string; body: string }[] = [
  { stage: "testing", title: "In testing", body: "Refining the first experiences before a wider release." },
  { stage: "approaching-testing", title: "Approaching testing", body: "The next guide is progressing towards its testing phase." },
  { stage: "development", title: "In development", body: "Building the app and its personal guide." },
  { stage: "pre-development", title: "Pre-development", body: "Shaping the direction. Product development has not started." },
];

export default function ProgressPage() {
  return (
    <main className="min-h-screen bg-bg text-fg"><Navbar /><PageIntro eyebrow="Our progress / October 2026" title="Growing with care."><p>Good guides take time. Here is where each app stands, with access opening as the experiences are ready.</p></PageIntro>
      <section className="site-container py-16 sm:py-24" aria-label="App development stages">
        {stages.map((group, index) => <div key={group.stage} className="grid gap-6 border-t border-line py-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16"><div><p className="ui-kicker">0{index + 1}</p><h2 className="type-h2">{group.title}</h2><p className="mt-3 max-w-sm text-fg-2">{group.body}</p></div><div className="divide-y divide-line">{APP_ORDER.filter(id => APP_ROADMAP[id].stage === group.stage).map(id => { const app = APP_BRANDS[id]; return <Link key={id} href={`/${id}`} className="group flex items-start gap-4 py-5 first:pt-0"><Image src={app.icon} alt="" width={48} height={48} className="h-12 w-12 rounded-xl" /><div className="flex-1"><h3 className="font-medium">{app.name} <span className="font-normal text-fg-2">/ Your {app.title}</span></h3><p className="mt-2 text-sm leading-relaxed text-fg-2">{APP_ROADMAP[id].note}</p></div><span aria-hidden className="text-fg-2 transition group-hover:translate-x-1">↗</span></Link>; })}</div></div>)}
        <div className="mt-6 rounded-3xl border border-line bg-surface p-6 sm:p-8"><span className="ui-status mb-4 bg-transparent">A future idea</span><h2 className="type-h2">Arbor Grove</h2><p className="mt-4 max-w-2xl text-fg-2">Grove is our vision for a future web workspace. Development has not started and there is no release date.</p><Link href="/grove" className="ui-secondary mt-6">Explore the idea <span aria-hidden className="ml-3">↗</span></Link></div>
        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-fg-2">Testing does not always mean a public beta is open. Individual app pages show available beta links. <Link href="/early-access" className="underline underline-offset-4">Join the waitlist</Link> to hear when new access opens.</p>
      </section><Footer />
    </main>
  );
}
