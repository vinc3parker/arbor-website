"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import type { OverviewCategory, OverviewItem } from "@/lib/arbor-core";
import {
  removeCategoryAction,
  removeItemAction,
  type RemoveState,
} from "@/app/profile/actions";
import { Icon } from "@/components/Icon";
import { appIcon, domainLabel, formatDay } from "./labels";

const initial: RemoveState = {};

/**
 * One kind of thing Arbor holds (brand guide 8.4): what it is, how much, when
 * it last changed, and — opened up — the items themselves, each removable.
 * Removal is immediate; removing a whole category asks once, plainly.
 */
export function DataCategoryCard({
  category,
  itemsRemovable = false,
}: {
  category: OverviewCategory;
  /** Whether each item can be removed on its own (memories, feelings). */
  itemsRemovable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [state, action, pending] = useActionState(removeCategoryAction, initial);
  const updated = formatDay(category.lastUpdated);
  const hasDetail = category.items.length > 0 || category.facts.length > 0;
  const panelId = `category-${category.id}`;

  return (
    <div className="rounded-2xl border border-line bg-bg">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-start gap-4 rounded-2xl p-5 text-left transition hover:bg-surface"
      >
        {category.app !== "arbor" && (
          <Image
            src={appIcon(category.app)}
            alt=""
            width={512}
            height={512}
            className="h-10 w-10 shrink-0 rounded-xl"
          />
        )}
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-4">
            <span className="type-label text-fg">{category.title}</span>
            <span className="shrink-0 type-caption text-fg-2">
              {category.count.toLocaleString("en-GB")}
            </span>
          </span>
          <span className="mt-1 block type-caption text-fg-2">{category.description}</span>
          {updated && (
            <span className="mt-2 block type-caption text-fg-3">Updated {updated}</span>
          )}
        </span>
        <Icon
          name="chevronDown"
          size={20}
          className={`mt-1 shrink-0 text-fg-2 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div id={panelId} className="border-t border-line px-5 pb-5">
          {category.facts.length > 0 && (
            <ul className="flex flex-wrap gap-2 pt-4">
              {category.facts.map((fact) => (
                <li key={fact} className="ui-status">
                  {fact}
                </li>
              ))}
            </ul>
          )}

          {category.items.length > 0 && (
            <ul className="divide-y divide-line">
              {category.items.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  kind={category.id}
                  removable={itemsRemovable}
                />
              ))}
            </ul>
          )}

          {!hasDetail && (
            <p className="pt-4 type-caption text-fg-2">
              The full detail is in your downloadable copy.
            </p>
          )}

          <div className="mt-5 border-t border-line pt-5">
            {state.error && (
              <p role="alert" className="mb-3 type-caption text-danger">
                {state.error}
              </p>
            )}
            {!confirming ? (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 type-label text-fg-2 transition hover:bg-surface hover:text-fg"
              >
                <Icon name="trash" size={18} />
                Remove all of this
              </button>
            ) : (
              <form action={action} className="rounded-xl bg-surface p-4">
                <input type="hidden" name="category" value={category.id} />
                <p className="type-label text-fg">
                  Remove {category.title.toLowerCase()} from every guide?
                </p>
                <p className="mt-1 type-caption text-fg-2">
                  It&apos;s gone straight away and can&apos;t be brought back.
                  {category.removeNote ? ` ${category.removeNote}` : ""}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button type="submit" disabled={pending} className="ui-primary">
                    {pending ? "Removing…" : "Remove"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    className="ui-secondary"
                  >
                    Keep it
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ItemRow({
  item,
  kind,
  removable,
}: {
  item: OverviewItem;
  kind: string;
  removable: boolean;
}) {
  const [state, action, pending] = useActionState(removeItemAction, initial);
  const meta = [
    item.domains.map(domainLabel).join(", "),
    kind === "apps" && item.updatedAt ? `Last used ${formatDay(item.updatedAt)}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <li className={`flex items-start gap-3 py-4 ${pending ? "opacity-50" : ""}`}>
      <div className="min-w-0 flex-1">
        <p className="text-base text-fg">{item.text}</p>
        {meta && <p className="mt-1 type-caption text-fg-2">{meta}</p>}
        {state.error && (
          <p role="alert" className="mt-1 type-caption text-danger">
            {state.error}
          </p>
        )}
      </div>
      {removable && (
        <form action={action}>
          <input type="hidden" name="kind" value={kind} />
          <input type="hidden" name="id" value={item.id} />
          <button
            type="submit"
            disabled={pending}
            aria-label={`Remove: ${item.text}`}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-fg-2 transition hover:bg-surface hover:text-fg"
          >
            <Icon name="close" size={20} />
          </button>
        </form>
      )}
    </li>
  );
}
