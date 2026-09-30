"use client";

import { useActionState, useState } from "react";
import {
  submitConsent,
  declineConsent,
  type ConsentActionState,
} from "./actions";
import type { ConsentItem } from "@/lib/app-consent";

// Renders the outstanding consents for an app: required ones (must be checked to
// continue) and optional opt-ins (unchecked by default). The Continue button
// stays disabled until every required box is checked; the server action
// re-enforces this regardless, so the client gate is just UX.
export function ConsentForm({
  appName,
  blocking,
  optional,
}: {
  appName: string;
  blocking: ConsentItem[];
  optional: ConsentItem[];
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    // Required start unchecked (explicit action); optional start unchecked too.
    const init: Record<string, boolean> = {};
    for (const c of [...blocking, ...optional]) init[c.key] = false;
    return init;
  });

  const [state, formAction, pending] = useActionState<
    ConsentActionState,
    FormData
  >(submitConsent, {});

  const allRequiredChecked = blocking.every((c) => checked[c.key]);

  const toggle = (key: string) =>
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-5">
      {blocking.map((c) => (
        <ConsentRow
          key={c.key}
          item={c}
          checked={!!checked[c.key]}
          onToggle={() => toggle(c.key)}
        />
      ))}

      {optional.length > 0 && (
        <>
          <div className="mt-1 border-t border-line pt-5">
            <p className="text-sm text-fg-3">
              Optional
            </p>
          </div>
          {optional.map((c) => (
            <ConsentRow
              key={c.key}
              item={c}
              checked={!!checked[c.key]}
              onToggle={() => toggle(c.key)}
            />
          ))}
        </>
      )}

      {/* Only checked keys are submitted; the server re-derives what's required. */}
      {Object.entries(checked)
        .filter(([, v]) => v)
        .map(([key]) => (
          <input key={key} type="hidden" name="accepted" value={key} />
        ))}

      {state.error && (
        <p className="px-1 text-sm text-danger">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending || !allRequiredChecked}
        className="mt-2 ui-primary"
      >
        {pending ? "Please wait…" : `Continue to ${appName}`}
      </button>

      <button
        type="submit"
        formAction={declineConsent}
        formNoValidate
        disabled={pending}
        className="text-sm text-fg-3 underline underline-offset-4 transition hover:text-fg disabled:opacity-60"
      >
        Not now
      </button>
    </form>
  );
}

function ConsentRow({
  item,
  checked,
  onToggle,
}: {
  item: ConsentItem;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="mt-1 h-5 w-5 shrink-0 rounded border-line bg-bg accent-white"
      />
      <span className="flex flex-col gap-1">
        <span className="text-sm font-medium text-fg">
          {item.title}
          {item.required && (
            <span className="ml-2 text-sm font-normal text-fg-3">
              Required
            </span>
          )}
        </span>
        <span className="text-sm leading-6 text-fg-2">{item.body}</span>
        {item.links && item.links.length > 0 && (
          <span className="mt-0.5 flex flex-wrap gap-x-4 gap-y-1">
            {item.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-fg-2 underline underline-offset-4 transition hover:text-fg"
              >
                {l.label}
              </a>
            ))}
          </span>
        )}
      </span>
    </label>
  );
}
