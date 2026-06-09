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
      setErrorMessage("Please enter a valid email address.");
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
        "Something went wrong. Please try again."
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
      className="mx-auto max-w-6xl px-8 py-32"
    >
      <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-10 md:p-14">

        <p className="mb-6 text-sm uppercase tracking-[0.3em] text-neutral-500">
          EARLY ACCESS
        </p>

        <h2 className="text-5xl font-semibold">
          Join the Arbor waitlist.
        </h2>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-400">
          Register your interest and join the email list to be the first to hear when new Arbor apps launch, early access opens, and major updates are released.
        </p>

        {!joined ? (
          <form
            onSubmit={handleSubmit}
            className="mt-10 flex flex-col gap-4"
          >
            <input
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Email"
              type="email"
              required
              className="
              rounded-2xl
              border
              border-neutral-800
              bg-black
              px-6
              py-4
            "
            />
            {errorMessage && (
              <p className="px-2 text-sm text-red-400">
                {errorMessage}
              </p>
            )}

            <button
              className="
              rounded-full
              bg-white
              px-8
              py-4
              text-black
            "
            >
              Join Waitlist
            </button>
          </form>
        ) : (
          <div className="mt-10">
            <div className="text-2xl font-medium">
              You're in.
            </div>

            <p className="mt-3 max-w-xl leading-7 text-neutral-400">
              You're on the list. We'll email you when early access opens, new apps launch, and there is something worth hearing about.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}