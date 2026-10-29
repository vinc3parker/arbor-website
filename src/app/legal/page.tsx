import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AppNoticeGrid } from "@/components/legal/AppNoticeGrid";
import { getPageSocialMetadata } from "@/lib/seo";

const title = "Legal and privacy centre — Arbor";
const description =
  "Find Arbor-wide account terms and privacy information, plus data and use notices for each Arbor guide app.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://arborapps.co/legal" },
  ...getPageSocialMetadata(title, description, "/legal"),
};

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-bg text-fg">
      <Navbar />
      <section className="site-container pt-40 pb-24 sm:pt-44">
        <p className="ui-kicker">Legal and privacy</p>
        <h1 className="type-h1 max-w-3xl">One Arbor account. Clear notices for every guide.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-fg-2">
          The Arbor-wide documents cover your account, membership and the services
          shared by every app. Each guide then has a supplementary notice for its
          particular data, permissions and limits.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Link href="/privacy" className="group rounded-3xl border border-fg bg-surface p-7 transition hover:bg-raised">
            <p className="ui-kicker">Arbor-wide</p>
            <h2 className="mt-2 text-2xl font-semibold">Privacy Policy</h2>
            <p className="mt-3 leading-7 text-fg-2">
              How the Arbor account, shared services, membership, AI providers and
              your rights work across the family of apps.
            </p>
            <span className="mt-6 inline-block text-sm font-medium transition group-hover:translate-x-0.5">
              Read the Privacy Policy →
            </span>
          </Link>
          <Link href="/terms" className="group rounded-3xl border border-fg bg-surface p-7 transition hover:bg-raised">
            <p className="ui-kicker">Arbor-wide</p>
            <h2 className="mt-2 text-2xl font-semibold">Terms of Service</h2>
            <p className="mt-3 leading-7 text-fg-2">
              The agreement for your Arbor account, membership, acceptable use and
              the common limits that apply across Arbor.
            </p>
            <span className="mt-6 inline-block text-sm font-medium transition group-hover:translate-x-0.5">
              Read the Terms →
            </span>
          </Link>
        </div>

        <section className="mt-20 border-t border-line pt-14" aria-labelledby="guide-notices-title">
          <p className="ui-kicker">Guide-specific</p>
          <h2 id="guide-notices-title" className="type-h2 mt-2">App data and use notices</h2>
          <p className="mt-4 mb-8 max-w-2xl leading-7 text-fg-2">
            Choose a guide to see the types of information it uses or plans to use,
            why it needs them, optional connections, your controls and the limits of
            its guidance.
          </p>
          <AppNoticeGrid />
        </section>
      </section>
      <Footer />
    </main>
  );
}
