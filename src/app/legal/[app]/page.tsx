import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  APP_LEGAL_IDS,
  APP_LEGAL_EFFECTIVE_DATE,
  APP_LEGAL_NOTICES,
  isAppLegalId,
} from "@/content/app-legal";
import { APP_BRANDS } from "@/lib/brand";

export const dynamicParams = false;

export function generateStaticParams() {
  return APP_LEGAL_IDS.map((app) => ({ app }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ app: string }>;
}): Promise<Metadata> {
  const { app } = await params;
  if (!isAppLegalId(app)) return {};
  const brand = APP_BRANDS[app];
  const title = `${brand.name} data and use notice — Arbor`;
  const description = `The app-specific data, permissions, controls and guidance limits for ${brand.name}, supplementing Arbor's account-wide Privacy Policy and Terms.`;
  return {
    title,
    description,
    alternates: { canonical: `https://arborapps.co/legal/${app}` },
  };
}

function NoticeList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 flex list-disc flex-col gap-3 pl-6 leading-7 text-fg-2 marker:text-fg-3">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

export default async function AppLegalPage({
  params,
}: {
  params: Promise<{ app: string }>;
}) {
  const { app } = await params;
  if (!isAppLegalId(app)) notFound();

  const brand = APP_BRANDS[app];
  const notice = APP_LEGAL_NOTICES[app];
  const sections = [
    { title: "Information this guide uses", items: notice.dataCategories },
    { title: "Why it uses that information", items: notice.purposes },
    { title: "Connections and sharing", items: notice.connections },
    { title: "Your choices and controls", items: notice.controls },
    { title: "Important limits", items: notice.limits },
  ];

  return (
    <main className="min-h-screen bg-bg text-fg">
      <Navbar context={{ label: `${brand.name} notice`, href: `/legal/${app}` }} />
      <article className="site-container max-w-3xl pt-40 pb-24 sm:pt-44">
        <div className="flex flex-wrap items-center gap-3">
          <p className="ui-kicker">{brand.name} · {brand.domain}</p>
          <span className="ui-status">{notice.status}</span>
        </div>
        <h1 className="type-h1 mt-3">Data and use notice</h1>
        <p className="mt-4 text-sm text-fg-3">Updated {APP_LEGAL_EFFECTIVE_DATE}</p>
        <p className="mt-5 text-lg leading-8 text-fg-2">{notice.dataStatus}</p>

        <div className="mt-8 rounded-2xl border border-line bg-surface p-5 text-sm leading-7 text-fg-2">
          This notice supplements the Arbor-wide <Link href="/privacy" className="font-medium text-fg underline underline-offset-4">Privacy Policy</Link> and <Link href="/terms" className="font-medium text-fg underline underline-offset-4">Terms of Service</Link>. Those documents cover the account, membership, shared infrastructure, providers, retention and your legal rights. An in-product notice will also appear when a feature needs a new permission, connection or consent.
        </div>

        <div className="mt-14 flex flex-col gap-12">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-semibold">{section.title}</h2>
              <NoticeList items={section.items} />
            </section>
          ))}
        </div>

        <nav aria-label="Legal links" className="mt-16 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-8 text-sm text-fg-2">
          <Link href="/legal" className="transition hover:text-fg">← All legal notices</Link>
          <Link href={`/${app}`} className="transition hover:text-fg">Explore {brand.name}</Link>
          <Link href="/privacy" className="transition hover:text-fg">Privacy Policy</Link>
          <Link href="/terms" className="transition hover:text-fg">Terms of Service</Link>
        </nav>
      </article>
      <Footer />
    </main>
  );
}
