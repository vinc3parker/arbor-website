import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase-server";
import {
  getProfile,
  calculateAge,
  displayNameFor,
  fullNameFor,
} from "@/lib/profile";
import { TIERS } from "@/lib/subscription";
import { ProfileForm } from "./ProfileForm";

export const metadata = {
  title: "Your profile — Arbor",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/profile");
  }

  const profile = await getProfile(supabase, user.id);
  const plan = TIERS[profile.subscription_tier];
  const name = displayNameFor(profile, user.email);
  const fullName = fullNameFor(profile);
  const age = calculateAge(profile.date_of_birth);

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const initial = (
    profile.first_name?.charAt(0) ||
    profile.last_name?.charAt(0) ||
    user.email?.charAt(0) ||
    "?"
  ).toUpperCase();

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="mx-auto max-w-3xl px-8 pb-24 pt-40">
        <p className="mb-6 text-sm uppercase tracking-[0.3em] text-neutral-500">
          YOUR PROFILE
        </p>

        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-2xl font-semibold">
            {initial}
          </div>
          <div>
            <h1 className="text-3xl font-semibold">Hi, {name}</h1>
            <p className="mt-1 text-sm text-neutral-500">
              {fullName ? `${fullName} · ` : ""}
              {user.email}
              {age !== null ? ` · ${age} years old` : ""}
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-4">
          {/* Personal info — shared across all Arbor apps */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-8">
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
              Personal information
            </p>
            <p className="mt-2 mb-6 text-sm text-neutral-400">
              This information is shared across every Arbor app you use.
            </p>
            <ProfileForm
              firstName={profile.first_name ?? ""}
              lastName={profile.last_name ?? ""}
              dateOfBirth={profile.date_of_birth ?? ""}
            />
          </div>

          {/* Subscription */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
                  Current plan
                </p>
                <p className="mt-2 text-2xl font-semibold">{plan.name}</p>
                <p className="mt-1 text-sm text-neutral-400">{plan.tagline}</p>
              </div>
              <span className="shrink-0 rounded-full border border-emerald-800 bg-emerald-950/40 px-4 py-1.5 text-sm text-emerald-400">
                Active
              </span>
            </div>
            <Link
              href="/subscription"
              className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
            >
              Manage subscription
            </Link>
          </div>

          {/* Account */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-8">
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
              Account
            </p>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500">Email</dt>
                <dd className="text-neutral-200">{user.email}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500">Email confirmed</dt>
                <dd className="text-neutral-200">
                  {user.email_confirmed_at ? "Yes" : "Pending"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500">Member since</dt>
                <dd className="text-neutral-200">{memberSince}</dd>
              </div>
            </dl>

            <form action="/auth/signout" method="post" className="mt-6">
              <button
                type="submit"
                className="rounded-full border border-neutral-800 px-6 py-3 text-sm text-neutral-300 transition hover:border-neutral-600 hover:text-white"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
