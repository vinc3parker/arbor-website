"use client";

import { useState } from "react";
import { ProfileForm } from "@/app/profile/ProfileForm";
import { formatDay } from "./labels";

type Details = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
};

/** Your details, read at a glance; the form only appears when you edit. */
export function DetailsCard({ details, email }: { details: Details; email: string }) {
  const [editing, setEditing] = useState(false);

  const name = [details.firstName, details.lastName].filter(Boolean).join(" ");
  const address = [
    details.addressLine1,
    details.addressLine2,
    details.city,
    details.region,
    details.postalCode,
    details.country,
  ]
    .filter(Boolean)
    .join(", ");

  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Date of birth", formatDay(details.dateOfBirth) ?? ""],
    ["Gender", details.gender],
    ["Address", address],
  ];

  return (
    <div className="ui-surface p-6 sm:p-8">
      {editing ? (
        <ProfileForm {...details} onCancel={() => setEditing(false)} />
      ) : (
        <>
          <dl className="grid gap-5 sm:grid-cols-2">
            {rows.map(([label, value]) => (
              <div key={label} className={label === "Address" ? "sm:col-span-2" : ""}>
                <dt className="type-caption text-fg-2">{label}</dt>
                <dd className="mt-1 text-base text-fg">
                  {value || <span className="text-fg-3">Not added</span>}
                </dd>
              </div>
            ))}
          </dl>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="ui-secondary mt-8"
          >
            Edit details
          </button>
        </>
      )}
    </div>
  );
}
