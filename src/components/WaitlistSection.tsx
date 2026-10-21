"use client";

import Link from "next/link";
import { useId, useState, type SyntheticEvent } from "react";
import { supabase } from "@/lib/supabase";

export function WaitlistSection() {
  const fieldId = useId();
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setErrorMessage("");
    const address = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      setErrorMessage("That email doesn’t look quite right. Check it and try again.");
      return;
    }
    setPending(true);
    try {
      const { error } = await supabase.from("waitlist").insert({ email: address, source: "website" });
      if (error && error.code !== "23505") throw error;
      setJoined(true);
      setEmail("");
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "join_waitlist");
      }
    } catch {
      setErrorMessage("We couldn’t add you just now. Please try again in a moment.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section id="early-access" className="site-container py-20 sm:py-24">
      <div className="grid gap-8 rounded-3xl border border-line bg-surface/60 p-6 sm:p-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
        <div>
          <p className="ui-kicker">Grow with us</p>
          <h2 className="type-h2 max-w-md">Be here for what comes next.</h2>
          <p className="mt-4 max-w-lg leading-relaxed text-fg-2">Hear when your guides are ready to meet you. Join the waitlist for new app access and updates from Arbor.</p>
        </div>
        <div>
          {!joined ? (
            <form onSubmit={handleSubmit} aria-busy={pending}>
              <label htmlFor={fieldId} className="ui-label">Your email address</label>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <input id={fieldId} name="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" type="email" autoComplete="email" required disabled={pending} aria-invalid={!!errorMessage} aria-describedby={errorMessage ? `${fieldId}-error` : `${fieldId}-privacy`} className="ui-field min-w-0" />
                <button type="submit" disabled={pending} className="ui-primary shrink-0">{pending ? "Joining…" : "Join the waitlist"}</button>
              </div>
              {errorMessage && <p id={`${fieldId}-error`} role="alert" className="mt-3 text-sm text-danger">{errorMessage}</p>}
              <p id={`${fieldId}-privacy`} className="mt-4 text-xs leading-relaxed text-fg-2">App access opens in stages. By joining, you&apos;ll receive Arbor updates. See our <Link href="/privacy" className="underline underline-offset-4">privacy policy</Link>.</p>
            </form>
          ) : (
            <div role="status" className="border-l-2 border-fg pl-6">
              <p className="text-2xl font-medium">You&apos;re on the list.</p>
              <p className="mt-3 text-fg-2">We&apos;ll email you when new app access opens. Thanks for being part of the beginning.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
