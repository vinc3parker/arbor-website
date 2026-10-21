"use client";

import { useState, useTransition } from "react";
import { cancelClaim } from "@/app/business/actions";
import type { Claim } from "@/lib/arbor-business";

/** Waiting and declined requests, with a way to withdraw a waiting one. */
export function ClaimList({ claims }: { claims: Claim[] }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <ul className="mt-4 space-y-3">
        {claims.map((claim) => (
          <li key={claim.id} className="ui-surface flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <p className="font-medium">
                {claim.kind === "create"
                  ? `Add ${claim.proposed.name ?? "a new business"}`
                  : `Claim ${claim.place?.name ?? "an existing listing"}`}
              </p>
              <p className="type-caption text-fg-2">
                {claim.status === "pending"
                  ? `Waiting for review since ${new Date(claim.createdAt).toLocaleDateString()}`
                  : `Not approved${claim.reviewNote ? `: ${claim.reviewNote}` : ""}`}
              </p>
            </div>
            {claim.status === "pending" && (
              <button
                type="button"
                className="ui-secondary"
                disabled={pending}
                onClick={() => startTransition(async () => {
                  const result = await cancelClaim(claim.id);
                  setError(result.error ?? null);
                })}
              >
                Withdraw
              </button>
            )}
          </li>
        ))}
      </ul>
      {error && <p className="mt-3 text-danger">{error}</p>}
    </>
  );
}
