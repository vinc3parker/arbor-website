import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NewBusinessForm } from "@/components/business/NewBusinessForm";
import { requireBusinessSession } from "@/lib/arbor-business";

export const metadata = {
  title: "Add your business — Arbor",
  robots: { index: false, follow: false },
};

export default async function NewBusinessPage() {
  await requireBusinessSession("/business/new");
  return (
    <main className="min-h-screen bg-bg text-fg">
      <Navbar />
      <div className="site-container pt-32 pb-24 sm:pt-36">
        <p className="ui-kicker"><Link href="/business" className="hover:text-fg">Arbor for businesses</Link></p>
        <h1 className="type-h1">Add your business</h1>
        <p className="ui-copy mt-3 max-w-2xl">
          For gyms, studios, clubs and instructors that aren&apos;t on the Arbor map yet. We&apos;ll check the details,
          then it goes live and you can manage it. Already listed? <Link href="/business/find" className="underline">Find and claim it</Link> instead.
        </p>
        <NewBusinessForm />
      </div>
      <Footer />
    </main>
  );
}
