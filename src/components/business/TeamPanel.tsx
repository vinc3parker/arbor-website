"use client";

import { useActionState, useState, useTransition } from "react";
import { addTeamMember, removeTeamMember, type FormState } from "@/app/business/actions";
import type { Membership } from "@/lib/arbor-business";

const initialState: FormState = {};

const ROLE_HELP: Record<string, string> = {
  owner: "Everything, including adding other owners",
  admin: "Everything except managing owners",
  editor: "Details of locations and the timetable",
};

export function TeamPanel({
  organisationId,
  members,
  currentUserId,
  isOwner,
}: {
  organisationId: string;
  members: Membership[] | null;
  currentUserId: string;
  isOwner: boolean;
}) {
  const [state, formAction, pending] = useActionState(addTeamMember, initialState);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [removing, startTransition] = useTransition();

  return (
    <div className="space-y-6">
      {members === null ? (
        <p className="text-danger">We couldn&apos;t load your team just now.</p>
      ) : (
        <ul className="ui-surface divide-y divide-line">
          {members.map((member) => (
            <li key={member.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="font-medium">
                  {member.userId === currentUserId ? "You" : member.invitedEmail ?? "Team member"}
                </p>
                <p className="type-caption text-fg-2">
                  {member.role[0].toUpperCase() + member.role.slice(1)}
                  {member.status === "invited" ? " · Invited, not signed in yet" : ""}
                </p>
              </div>
              {member.userId !== currentUserId && (member.role !== "owner" || isOwner) && (
                <button type="button" className="ui-secondary" disabled={removing}
                  onClick={() => startTransition(async () => {
                    const result = await removeTeamMember(organisationId, member.id);
                    setRemoveError(result.error ?? null);
                  })}>
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {removeError && <p className="text-danger">{removeError}</p>}

      <form action={formAction} className="ui-surface grid gap-5 p-6 sm:grid-cols-[1fr_12rem_auto] sm:items-end sm:p-8">
        <input type="hidden" name="organisationId" value={organisationId} />
        <label className="grid gap-2">
          <span className="ui-label">Add someone by email</span>
          <input name="email" type="email" className="ui-field" required />
        </label>
        <label className="grid gap-2">
          <span className="ui-label">Role</span>
          <select name="role" className="ui-field" defaultValue="editor">
            {(isOwner ? ["editor", "admin", "owner"] : ["editor", "admin"]).map((role) => (
              <option key={role} value={role}>{role[0].toUpperCase() + role.slice(1)}</option>
            ))}
          </select>
        </label>
        <button type="submit" className="ui-primary" disabled={pending}>{pending ? "Adding" : "Add"}</button>
        <p className="type-caption text-fg-2 sm:col-span-3">
          {Object.entries(ROLE_HELP).map(([role, help]) => `${role[0].toUpperCase() + role.slice(1)}: ${help}.`).join(" ")}
          {" "}They get access when they sign in to Arbor with that email; they don&apos;t need a subscription.
        </p>
        {state.message && <p className="type-caption text-success sm:col-span-3" role="status">{state.message}</p>}
        {state.error && <p className="text-danger sm:col-span-3">{state.error}</p>}
      </form>
    </div>
  );
}
