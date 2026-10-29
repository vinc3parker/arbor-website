import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export function GroveHeader() {
  return <Navbar context={{ label: "Grove", href: "/grove" }} />;
}

export function GroveFooter() {
  return (
    <>
      <section className="border-t border-line bg-surface">
        <div className="site-container grid gap-6 py-10 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="type-caption uppercase tracking-[0.16em] text-fg-3">Arbor / Grove</p>
            <p className="mt-2 max-w-xl text-lg font-medium">A future workspace for the same guides—and the same connected life.</p>
          </div>
          <Link href="/progress" className="ui-secondary w-fit">See Arbor&apos;s progress</Link>
        </div>
      </section>
      <div className="bg-bg">
        <Footer />
      </div>
    </>
  );
}
