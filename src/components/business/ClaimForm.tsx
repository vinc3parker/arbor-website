"use client";

import { useActionState, useState } from "react";
import { claimListing, type FormState } from "@/app/business/actions";

const initialState: FormState = {};

const ROLES = ["Owner", "Manager", "Instructor or coach", "Club committee member", "Team captain or organiser", "Staff member"];

/** "This is mine": a short claim form under a search result (a place, or a club or team with no venue). */
export function ClaimForm({
  placeId,
  organisationId,
  placeName,
  managed,
}: {
  placeId?: string;
  organisationId?: string;
  placeName: string;
  managed: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(claimListing, initialState);

  if (state.message) {
    return <p className="ui-status mt-4" role="status">{state.message}</p>;
  }
  if (!open) {
    return (
      <button type="button" className="ui-secondary mt-4" onClick={() => setOpen(true)}>
        {managed ? "I also run this" : "This is mine"}
      </button>
    );
  }

  return (
    <form action={formAction} className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
      {placeId ? <input type="hidden" name="placeId" value={placeId} /> : <input type="hidden" name="organisationId" value={organisationId} />}
      <p className="ui-copy sm:col-span-2">
        Tell us how you&apos;re connected to {placeName}.
        {managed ? " Someone already manages this listing, so we'll check with you before adding you." : ""}
      </p>
      <label className="grid gap-2">
        <span className="ui-label">Your role</span>
        <select name="role" className="ui-field" defaultValue={ROLES[0]}>
          {ROLES.map((role) => <option key={role}>{role}</option>)}
        </select>
      </label>
      <label className="grid gap-2">
        <span className="ui-label">Phone (optional)</span>
        <input name="contactPhone" type="tel" className="ui-field" autoComplete="tel" />
      </label>
      <label className="grid gap-2 sm:col-span-2">
        <span className="ui-label">Anything that helps us confirm it (optional)</span>
        <textarea name="evidence" rows={3} className="ui-field" placeholder="e.g. a link to your staff page, or your business email" />
      </label>
      {state.error && <p className="text-danger sm:col-span-2">{state.error}</p>}
      <div className="flex flex-wrap gap-3 sm:col-span-2">
        <button type="submit" className="ui-primary" disabled={pending}>{pending ? "Sending" : "Send claim"}</button>
        <button type="button" className="ui-secondary" onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </form>
  );
}
