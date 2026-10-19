import Image from "next/image";
import Link from "next/link";
import type { DevelopmentStage } from "@/content/roadmap";

type App = {
  id: string;
  name: string;
  role: string;
  domain: string;
  description: string;
  href: string;
  icon: string;
  colour: string;
  stage: DevelopmentStage;
  badge: string;
};

const milestones = [
  { label: "In testing", apps: "Aevo, Salus & Thrive", detail: "Refining the first experiences before a wider release." },
  { label: "Approaching testing", apps: "Nura", detail: "Development is progressing towards the testing phase." },
  { label: "In development", apps: "Wend", detail: "Building the experience and its personal guide." },
  { label: "Pre-development", apps: "Sage, Telos & Kith", detail: "Shaping the direction. Product development has not started." },
];

export function AppsSection({ apps }: { apps: App[] }) {
  return (
    <section id="guide-directory" className="theme-dark bg-bg text-fg">
      <div className="site-container py-20 sm:py-24">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div><p className="ui-kicker">Meet your guides</p><h2 className="type-h1 max-w-2xl">Different parts of life.<br /><span className="text-fg-2">The same you.</span></h2></div>
          <p className="max-w-md leading-relaxed text-fg-2">These are the eight specialist apps in Arbor&apos;s connected system. Each has its own AI guide. Step through an archway above, or browse here to see its focus and current stage.</p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {apps.map((app) => (
            <Link key={app.id} href={app.href} className="group flex flex-col rounded-2xl border border-line/75 bg-surface p-5 transition duration-200 hover:-translate-y-1 hover:border-fg-3 focus-visible:border-fg sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <Image src={app.icon} alt="" width={64} height={64} sizes="48px" className="h-12 w-12 rounded-xl" />
                <span aria-hidden className="text-xl text-fg-2 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg">↗</span>
              </div>
              <p className="mt-6 text-xs text-fg-2">{app.domain}</p>
              <h3 className="mt-1 text-2xl font-semibold">{app.name}</h3>
              <p className="mt-1 text-sm font-medium">{app.role}</p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-fg-2">{app.description}</p>
              <div className="mt-7 flex items-center gap-2 border-t border-line/70 pt-4 text-xs text-fg-2">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${app.stage === "testing" ? "bg-success" : app.stage === "approaching-testing" ? "bg-warning" : "bg-fg-3"}`} aria-hidden />
                {app.badge}
              </div>
            </Link>
          ))}
        </div>

        <div id="progress" className="mt-20 border-t border-line pt-10">
          <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-xl font-medium">Growing with care.</h3><p className="type-caption text-fg-2">Where we are / October 2026</p></div>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((milestone, index) => (
              <div key={milestone.label}>
                <p className="type-caption text-fg-2">0{index + 1} <span className="ml-3 text-fg">{milestone.label}</span></p>
                <p className="mt-4 text-sm font-medium">{milestone.apps}</p>
                <p className="mt-2 text-sm leading-relaxed text-fg-2">{milestone.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-3xl type-caption text-fg-2">Testing does not always mean access is open. Individual app pages show any available beta links; the waitlist is the best way to hear about new access. Release dates will follow when we&apos;re ready.</p>
        </div>
      </div>
    </section>
  );
}
