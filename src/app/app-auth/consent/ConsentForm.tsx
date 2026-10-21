"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  submitConsent,
  declineConsent,
  type ConsentActionState,
} from "./actions";
import type { ConsentItem } from "@/lib/app-consent";
import {
  CONNECT_CONSENT_KEY,
  CONNECT_SCREEN,
  consentCopy,
} from "@/content/consent";

// Renders the outstanding consents for an app as a short sequence of steps.
// Most consents are checkboxes on an "items" step: required ones (must be
// checked to continue) and optional opt-ins (unchecked by default).
// arbor_connected gets its own "connect" step (brand guide 8.3) with the 8.2
// explanation and a single "Connect my life to Arbor" button.
//
// Step order follows legal/account/consent-copy.md: for a new account it's
// account terms → connect → optional updates. Someone who joined before
// arbor_connected existed sees the connect step first, opened with the re-ask
// heading, then anything else outstanding.
//
// All steps live in one form, so checked state carries across. Continue stays
// disabled until every required box on the step is checked; the server action
// re-enforces everything regardless, so the client gate is just UX.

type Step = { kind: "connect" } | { kind: "items"; items: ConsentItem[] };

export function ConsentForm({
  appName,
  blocking,
  optional,
  existingAccount,
}: {
  appName: string;
  blocking: ConsentItem[];
  optional: ConsentItem[];
  existingAccount: boolean;
}) {
  const needsConnect = blocking.some((c) => c.key === CONNECT_CONSENT_KEY);
  const otherBlocking = blocking.filter((c) => c.key !== CONNECT_CONSENT_KEY);

  const candidates: Step[] = !needsConnect
    ? [{ kind: "items", items: [...blocking, ...optional] }]
    : existingAccount
      ? [
          { kind: "connect" },
          { kind: "items", items: [...otherBlocking, ...optional] },
        ]
      : [
          { kind: "items", items: otherBlocking },
          { kind: "connect" },
          { kind: "items", items: optional },
        ];
  const nonEmpty = candidates.filter(
    (s) => s.kind === "connect" || s.items.length > 0
  );
  // Never render zero steps (the page is only reached with something to ask,
  // but keep the Continue button available if Core says otherwise).
  const steps: Step[] = nonEmpty.length > 0 ? nonEmpty : [{ kind: "items", items: [] }];

  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;
  const isFirst = stepIndex === 0;

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

  const toggle = (key: string) =>
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  const next = () => setStepIndex((i) => i + 1);

  // Start each new step at the top. Done after render: scrolling in the click
  // handler gets undone by the browser's scroll anchoring once the step swaps.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [stepIndex]);

  return (
    <form action={formAction} className="flex flex-col">
      {step.kind === "connect" ? (
        <ConnectStep reask={existingAccount && isFirst} />
      ) : (
        <ItemsStep
          appName={appName}
          items={step.items}
          checked={checked}
          onToggle={toggle}
          // A step of only optional items (after connect) reads as "Optional".
          optionalOnly={step.items.every((c) => !c.required)}
          showIntro={isFirst}
        />
      )}

      {/* Only checked keys are submitted; the server re-derives what's required. */}
      {Object.entries(checked)
        .filter(([, v]) => v)
        .map(([key]) => (
          <input key={key} type="hidden" name="accepted" value={key} />
        ))}

      {state.error && (
        <p className="mt-5 px-1 text-sm text-danger">{state.error}</p>
      )}

      {/* Distinct keys on the primary buttons: if React reused one DOM node and
          flipped it from type="button" to "submit" mid-click, the click that
          advances a step would also submit the form. */}
      <div className="mt-7 flex flex-col gap-5">
        {step.kind === "connect" ? (
          isLast ? (
            // Submitting via this button adds accepted=arbor_connected itself,
            // since the checked state wouldn't render before the submit.
            <button
              key="connect-submit"
              type="submit"
              name="accepted"
              value={CONNECT_CONSENT_KEY}
              disabled={pending}
              className="ui-primary"
            >
              {pending ? "Please wait…" : CONNECT_SCREEN.button}
            </button>
          ) : (
            <button
              key="connect-next"
              type="button"
              onClick={() => {
                setChecked((prev) => ({ ...prev, [CONNECT_CONSENT_KEY]: true }));
                next();
              }}
              className="ui-primary"
            >
              {CONNECT_SCREEN.button}
            </button>
          )
        ) : isLast ? (
          <button
            key="items-submit"
            type="submit"
            disabled={
              pending || !step.items.every((c) => !c.required || checked[c.key])
            }
            className="ui-primary"
          >
            {pending ? "Please wait…" : `Continue to ${appName}`}
          </button>
        ) : (
          <button
            key="items-next"
            type="button"
            onClick={next}
            disabled={!step.items.every((c) => !c.required || checked[c.key])}
            className="ui-primary"
          >
            Continue
          </button>
        )}

        <button
          type="submit"
          formAction={declineConsent}
          formNoValidate
          disabled={pending}
          className="text-sm text-fg-3 underline underline-offset-4 transition hover:text-fg disabled:opacity-60"
        >
          Not now
        </button>
      </div>
    </form>
  );
}

// Screen 2 · Connect your life to Arbor. Wording is in src/content/consent.ts.
function ConnectStep({ reask }: { reask: boolean }) {
  const copy = consentCopy(CONNECT_CONSENT_KEY, "");
  return (
    <div>
      {reask && (
        <div className="mb-8 border-b border-line pb-8">
          <h1 className="ui-title">{CONNECT_SCREEN.reask.heading}</h1>
          <p className="mt-3 text-sm leading-7 text-fg-2">
            {CONNECT_SCREEN.reask.body}
          </p>
        </div>
      )}

      {reask ? (
        <h2 className="text-lg font-medium text-fg">{CONNECT_SCREEN.heading}</h2>
      ) : (
        <h1 className="ui-title">{CONNECT_SCREEN.heading}</h1>
      )}

      <div className="mt-4 flex flex-col gap-2 text-sm leading-6 text-fg">
        {CONNECT_SCREEN.explanation.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <p className="mt-6 text-sm font-medium text-fg">What this means</p>
      <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-6 text-fg-2">
        {CONNECT_SCREEN.whatThisMeans.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>

      <div className="mt-6 border-t border-line pt-5">
        <p className="text-sm font-medium text-fg">
          {copy.title}
          <span className="ml-2 text-sm font-normal text-fg-3">Required</span>
        </p>
        <p className="mt-1 text-sm leading-6 text-fg-2">{copy.body}</p>
      </div>
    </div>
  );
}

function ItemsStep({
  appName,
  items,
  checked,
  onToggle,
  optionalOnly,
  showIntro,
}: {
  appName: string;
  items: ConsentItem[];
  checked: Record<string, boolean>;
  onToggle: (key: string) => void;
  optionalOnly: boolean;
  showIntro: boolean;
}) {
  const required = items.filter((c) => c.required);
  const optional = items.filter((c) => !c.required);

  return (
    <div>
      <h1 className="ui-title">
        {optionalOnly && !showIntro ? "One last thing." : "Before you continue."}
      </h1>
      {showIntro && (
        <p className="mt-3 text-sm leading-7 text-fg-2">
          A few permissions so {appName} can work the way it should. You can
          change these later in your Arbor profile.
        </p>
      )}

      <div className="mt-8 flex flex-col gap-5">
        {required.map((c) => (
          <ConsentRow
            key={c.key}
            item={c}
            checked={!!checked[c.key]}
            onToggle={() => onToggle(c.key)}
          />
        ))}

        {optional.length > 0 && (
          <>
            {required.length > 0 && (
              <div className="mt-1 border-t border-line pt-5">
                <p className="text-sm text-fg-3">Optional</p>
              </div>
            )}
            {optional.map((c) => (
              <ConsentRow
                key={c.key}
                item={c}
                checked={!!checked[c.key]}
                onToggle={() => onToggle(c.key)}
              />
            ))}
          </>
        )}
      </div>
    </div>
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
