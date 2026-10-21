"use client";

import { useActionState } from "react";
import { saveBusinessDetails, type FormState } from "@/app/business/actions";
import type { OrganisationRow } from "@/lib/arbor-business";
import { BUSINESS_KINDS, kindLabel } from "./options";

const initialState: FormState = {};

export function BusinessDetailsForm({ organisation, canEdit }: { organisation: OrganisationRow; canEdit: boolean }) {
  const [state, formAction, pending] = useActionState(saveBusinessDetails, initialState);

  if (!canEdit) {
    const rows: Array<[string, string | null]> = [
      ["Name", organisation.name],
      ["Type", kindLabel(organisation.kind)],
      ["Website", organisation.website],
      ["Phone", organisation.phone],
      ["About", organisation.description],
    ];
    return (
      <dl className="ui-surface grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="type-caption text-fg-2">{label}</dt>
            <dd className="mt-1">{value || <span className="text-fg-3">Not added</span>}</dd>
          </div>
        ))}
        <p className="type-caption text-fg-2 sm:col-span-2">Only owners and admins can change these.</p>
      </dl>
    );
  }

  return (
    <form action={formAction} className="ui-surface grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
      <input type="hidden" name="organisationId" value={organisation.id} />
      <label className="grid gap-2">
        <span className="ui-label">Business name</span>
        <input name="name" className="ui-field" defaultValue={organisation.name} required maxLength={160} />
      </label>
      <label className="grid gap-2">
        <span className="ui-label">Type</span>
        <select name="kind" className="ui-field" defaultValue={organisation.kind}>
          {BUSINESS_KINDS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          {!BUSINESS_KINDS.some(([value]) => value === organisation.kind) && (
            <option value={organisation.kind}>{kindLabel(organisation.kind)}</option>
          )}
        </select>
      </label>
      <label className="grid gap-2">
        <span className="ui-label">Website</span>
        <input name="website" className="ui-field" defaultValue={organisation.website ?? ""} inputMode="url" />
      </label>
      <label className="grid gap-2">
        <span className="ui-label">Phone</span>
        <input name="phone" type="tel" className="ui-field" defaultValue={organisation.phone ?? ""} />
      </label>
      <label className="grid gap-2 sm:col-span-2">
        <span className="ui-label">About</span>
        <textarea name="description" rows={3} className="ui-field" defaultValue={organisation.description ?? ""} maxLength={2000} />
      </label>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" className="ui-primary" disabled={pending}>{pending ? "Saving" : "Save details"}</button>
        {state.message && <span className="type-caption text-success" role="status">{state.message}</span>}
        {state.error && <span className="text-danger">{state.error}</span>}
      </div>
    </form>
  );
}
