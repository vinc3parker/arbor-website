"use client";

import type { SyntheticEvent } from "react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(
    e: SyntheticEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setErrorMessage("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      setErrorMessage("That email doesn’t look quite right. Check it and try again.");
      return;
    }

    const { error } =
      await supabase
        .from("waitlist")
        .insert({
          email,
          source: "website",
        });

    if (error) {
      console.error(error);

      setErrorMessage(
        "Something went wrong on our side. Try again in a moment."
      );

      return;
    }

    setJoined(true);

    setEmail("");

    // Track conversion event in Google Analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "join_waitlist", {
        email_hash: email.split("")[0], // Only track first char for privacy
      });
    }
  }

  return (
    <section
      id="early-access"
      className="site-container py-24"
    >
      <div className="ui-surface p-6 sm:p-10">

        <p className="ui-kicker">
          Early access
        </p>

        <h2 className="type-h2">
          Join the waitlist
        </h2>

        <p className="mt-3 max-w-xl type-body text-fg-2">
          Hear when new Arbor apps and early access become available.
        </p>

        {!joined ? (
          <form
            onSubmit={handleSubmit}
            className="mt-7 flex max-w-xl flex-col gap-3 sm:flex-row"
          >
            <input
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Email"
              aria-label="Email"
              type="email"
              required
              className="ui-field"
            />
            {errorMessage && (
              <p className="px-2 text-sm text-danger">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="ui-primary shrink-0"
            >
              Join waitlist
            </button>
          </form>
        ) : (
          <div className="mt-10">
            <div className="text-2xl font-semibold">
              You&apos;re in.
            </div>

            <p className="mt-2 text-fg-2">We&apos;ll email you when access opens.</p>
          </div>
        )}

      </div>
    </section>
  );
}
