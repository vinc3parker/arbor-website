import type { ConsentStatus } from "@/lib/arbor-core";
import { consentCopy, type ConsentLink } from "@/content/consent";

// Turns Core's per-app consent status into what the sign-in gate needs to
// decide and render. Two buckets:
//   • blocking — required consents the user must accept before continuing.
//   • optional — opt-in consents worth offering here (unchecked by default).
// Everything is derived from the status Core returns for ?app=<id>, so the gate
// is automatically correct for whichever app opened the flow.

export interface ConsentItem {
  key: string;
  required: boolean;
  title: string;
  body: string;
  links?: ConsentLink[];
  /** Version in force, passed through when recording so the audit stamps it. */
  version: string | null;
}

function toItem(s: ConsentStatus): ConsentItem {
  const copy = consentCopy(s.key, descriptionFallback(s.key));
  return {
    key: s.key,
    required: s.required,
    title: copy.title,
    body: copy.body,
    links: copy.links,
    version: s.currentVersion,
  };
}

// Core's status doesn't echo the catalogue description, so the fallback copy is
// just the key prettified — the CONSENT_COPY map is expected to cover real keys.
function descriptionFallback(key: string): string {
  return `Consent required: ${key}.`;
}

/**
 * Required consents that still need collecting (never accepted, declined, or an
 * out-of-date version). The user cannot continue until every one is accepted.
 */
export function blockingConsents(status: ConsentStatus[]): ConsentItem[] {
  return status.filter((s) => s.required && s.needsConsent).map(toItem);
}

/**
 * Optional consents worth offering on the sign-in gate: not required, not yet
 * decided, and versioned (Core rejects recording an unversioned consent, so we
 * never surface one we couldn't save — e.g. salus_neurodivergence_data, which is
 * intentionally left as a contextual in-app opt-in).
 */
export function optionalOffers(status: ConsentStatus[]): ConsentItem[] {
  return status
    .filter((s) => !s.required && s.accepted === null && s.currentVersion !== null)
    .map(toItem);
}
