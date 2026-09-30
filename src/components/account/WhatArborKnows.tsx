import type { DataOverview, OverviewCategory } from "@/lib/arbor-core";
import { CONSENT_COPY } from "@/content/consent";
import { DataCategoryCard } from "./DataCategoryCard";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import { appIcon, appName, formatDay } from "./labels";

/**
 * "What Arbor knows" (brand guide 8.4): everything Arbor has learned, grouped
 * by where it lives, each part removable. The opening three lines are the one
 * explanation used word for word everywhere (8.2).
 */
export function WhatArborKnows({ overview }: { overview: DataOverview | null }) {
  return (
    <div>
      <div className="max-w-2xl space-y-2 type-body text-fg-2">
        <p>Each Arbor app learns from what you share with it.</p>
        <p>Arbor brings that together, so every guide understands the whole of you.</p>
        <p className="text-fg">You can see and remove anything Arbor has learned, any time.</p>
      </div>

      {!overview ? (
        <p role="status" className="mt-8 rounded-2xl border border-line bg-surface p-5 text-fg-2">
          We couldn&apos;t load this just now. Nothing is lost. Try again in a moment.
        </p>
      ) : (
        <Overview overview={overview} />
      )}
    </div>
  );
}

function Overview({ overview }: { overview: DataOverview }) {
  const held = overview.categories.filter((c) => c.count > 0);
  const empty = overview.categories.filter((c) => c.count === 0);

  // Group by owner: shared understanding first, then each app in guide order.
  const groups = new Map<string, OverviewCategory[]>();
  for (const c of held) groups.set(c.app, [...(groups.get(c.app) ?? []), c]);
  const order = ["arbor", "aevo", "salus", "thrive", "nura", "wend", "kith", "telos", "sage"];
  const owners = [...groups.keys()].sort((a, b) => order.indexOf(a) - order.indexOf(b));

  return (
    <div className="mt-10 space-y-10">
      {held.length === 0 && (
        <p className="rounded-2xl border border-line bg-surface p-5 text-fg-2">
          Arbor hasn&apos;t learned anything about you yet. As you use the apps,
          what they learn will appear here.
        </p>
      )}

      {owners.map((owner) => (
        <section key={owner} aria-labelledby={`owner-${owner}`}>
          <h3 id={`owner-${owner}`} className="mb-4 type-label text-fg-2">
            {owner === "arbor" ? "Across your apps" : `In ${appName(owner)}`}
          </h3>
          <div className="space-y-3">
            {groups.get(owner)!.map((category) => (
              <DataCategoryCard
                key={category.id}
                category={withAppItems(category, overview)}
                itemsRemovable={category.id === "memories" || category.id === "feelings"}
              />
            ))}
          </div>
        </section>
      ))}

      {empty.length > 0 && held.length > 0 && (
        <p className="type-caption text-fg-2">
          Nothing held for: {empty.map((c) => c.title.toLowerCase()).join(", ")}.
        </p>
      )}

      {overview.apps.length > 0 && <KeptInApps apps={overview.apps.map((a) => a.app)} />}

      {overview.consents.length > 0 && (
        <details className="group rounded-2xl border border-line bg-bg">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 type-label text-fg transition hover:bg-surface">
            What you&apos;ve agreed to
            <span className="type-caption text-fg-2 group-open:hidden">
              {overview.consents.length}
            </span>
          </summary>
          <ul className="divide-y divide-line border-t border-line px-5">
            {overview.consents.map((c) => (
              <li key={c.key} className="flex items-start justify-between gap-4 py-4">
                <span>
                  <span className="block text-base text-fg">
                    {CONSENT_COPY[c.key]?.title ?? c.label}
                  </span>
                  {c.at && (
                    <span className="block type-caption text-fg-2">{formatDay(c.at)}</span>
                  )}
                </span>
                <span className="ui-status shrink-0">{c.detail}</span>
              </li>
            ))}
          </ul>
          <p className="border-t border-line px-5 py-4 type-caption text-fg-2">
            These are kept as a record of what you chose. You can change an app&apos;s
            choices in that app, and they&apos;re removed if you delete your account.
          </p>
        </details>
      )}
    </div>
  );
}

/** "Apps you use" lists the apps themselves, with when each was last used. */
function withAppItems(category: OverviewCategory, overview: DataOverview): OverviewCategory {
  if (category.id !== "apps") return category;
  return {
    ...category,
    items: overview.apps.map((a) => ({
      id: a.app,
      text: appName(a.app),
      source: null,
      domains: [],
      locked: false,
      updatedAt: a.lastSeenAt,
    })),
    facts: [],
  };
}

// What each app keeps on the phone rather than with Arbor. Only claims we know
// hold: Salus journals and Thrive tasks are stored on device.
const KEPT_IN_APP: Record<string, string> = {
  salus: "Your journals and reflections stay on your phone.",
  thrive: "Your tasks, routines and notes stay on your phone.",
};

/**
 * Apps can hold more than Arbor does. For each app this person uses, say so,
 * so the overview never implies it's the whole picture.
 */
function KeptInApps({ apps }: { apps: string[] }) {
  return (
    <section aria-labelledby="kept-in-apps" className="rounded-2xl bg-surface p-5">
      <h3 id="kept-in-apps" className="flex items-center gap-2 type-label text-fg">
        <Icon name="lock" size={18} />
        Kept securely in your apps
      </h3>
      <p className="mt-1 type-caption text-fg-2">
        Your apps can also keep things on your phone that aren&apos;t shared with
        Arbor. You can see and remove those in each app.
      </p>
      <ul className="mt-4 space-y-3">
        {apps.map((app) => (
          <li key={app} className="flex items-start gap-3">
            <Image
              src={appIcon(app)}
              alt=""
              width={512}
              height={512}
              className="h-8 w-8 shrink-0 rounded-lg"
            />
            <span>
              <span className="block type-label text-fg">{appName(app)}</span>
              <span className="block type-caption text-fg-2">
                {KEPT_IN_APP[app] ?? "May keep more in the app itself, stored securely on your phone."}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
