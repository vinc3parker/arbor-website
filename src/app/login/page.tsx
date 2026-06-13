import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase-server";
import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Sign in — Arbor",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect: redirectParam } = await searchParams;

  // Only allow internal redirect targets.
  const redirectTo =
    redirectParam && redirectParam.startsWith("/") ? redirectParam : "/profile";

  // If already signed in, skip the login screen.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect(redirectTo);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-8 py-32">
        <LoginForm redirectTo={redirectTo} />

        <p className="mt-8 text-center text-sm text-neutral-600">
          <Link href="/" className="transition hover:text-neutral-400">
            ← Back to home
          </Link>
        </p>
      </section>

      <Footer />
    </main>
  );
}
