"use client";

import { useState } from "react";

export function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setJoined(true);

    console.log({
      email,
    });
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
          Help shape Arbor.
        </h2>

        <p className="mt-6 max-w-2xl text-lg text-neutral-400">
          Join the first testers.
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
              className="
              rounded-2xl
              border
              border-neutral-800
              bg-black
              px-6
              py-4
            "
            />

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
          <div className="mt-10 text-xl">
            You're in.
          </div>
        )}

      </div>
    </section>
  );
}