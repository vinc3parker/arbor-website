import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase-server";
import { ArborCoreError, createCheckout, fetchEntitlement } from "@/lib/arbor-core";
import { isRegisteredApp, sanitizeState } from "@/lib/app-auth";
import { PLANS, hasAccess } from "@/lib/subscription";
import { EmbeddedCheckoutForm } from "./EmbeddedCheckoutForm";
import { redeemCodeAction } from "../actions";

export const metadata = {
  title: "Subscribe — Arbor",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

type SearchParams = { [k: string]: string | string[] | undefined };

function query(params: Record<string, string | undefined>): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) p.set(k, v);
  const q = p.toString();
  return q ? `?${q}` : "";
}

// Messages for Core's redeem error codes.
const CODE_ERRORS: Record<string, string> = {
  CODE_EXHAUSTED: "That code has already been used as many times as it allows.",
  CODE_EXPIRED: "That code has expired.",
  INVALID_CODE: "That code isn’t valid. Check it and try again.",
  empty: "Enter your code to continue.",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const sp = await searchParams;
  const appRaw = typeof sp.app === "string" ? sp.app : undefined;
  const app = appRaw && isRegisteredApp(appRaw) ? appRaw : undefined;
  const state = sanitizeState(typeof sp.state === "string" ? sp.state : undefined) ?? undefined;
  const method = sp.method === "code" ? "code" : "card";
  const codeError = typeof sp.code_error === "string" ? sp.code_error : undefined;

  const here = `/subscription/checkout${query({ app, state, method: method === "code" ? "code" : undefined })}`;
  const back = `/subscription${query({ app, state })}`;

  if (!user) redirect(`/login?redirect=${encodeURIComponent(here)}`);

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token ?? null;
  if (!token) redirect(`/login?redirect=${encodeURIComponent(here)}`);

  // Already have access? Nothing to buy or redeem. (redirect outside try/catch.)
  let alreadyEntitled = false;
  try {
    const view = await fetchEntitlement(token);
    alreadyEntitled = hasAccess(view.entitlement.status) && view.entitlement.status !== "past_due";
  } catch {
    // ignore — let them carry on
  }
  if (alreadyEntitled) {
    redirect(`/subscription${query({ billing: "active", app, state })}`);
  }

  // Card: create the Checkout Session server-side so failures are visible, not
  // blank. Skipped for codes — starting a session reserves a founding place.
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  let clientSecret: string | null = null;
  let plan: "founder" | "standard" | undefined;
  let errorMsg: string | null = null;
  if (method === "card") {
    if (!publishableKey) {
      errorMsg = "Payments aren’t set up on the website yet.";
    } else {
      try {
        const result = await createCheckout(token, { app, state });
        clientSecret = result.clientSecret;
        plan = result.plan;
      } catch (err) {
        errorMsg =
          err instanceof ArborCoreError
            ? err.message
            : "We couldn’t reach the payment service. Nothing has been charged.";
      }
    }
  }
  const price = plan ? PLANS[plan] : null;

  const tabClass = (active: boolean) =>
    `flex min-h-11 flex-1 items-center justify-center rounded-xl px-4 type-label transition ${
      active ? "bg-bg text-fg shadow-sm" : "text-fg-2 hover:text-fg"
    }`;

  return (
    <main className="min-h-screen bg-bg text-fg">
      <Navbar />
      <section className="page-shell page-shell-narrow">
        <p className="ui-kicker">Subscription</p>
        <h1 className="ui-title">Subscribe to Arbor</h1>
        <p className="mt-3 text-fg-2">
          One subscription for every Arbor app. Pay by card, or use a code if
          you have one.
        </p>

        {/* Pay or use a code */}
        <nav aria-label="How to subscribe" className="mt-8 flex gap-1 rounded-2xl bg-surface p-1">
          <Link
            href={`/subscription/checkout${query({ app, state })}`}
            aria-current={method === "card" ? "page" : undefined}
            className={tabClass(method === "card")}
          >
            Pay by card
          </Link>
          <Link
            href={`/subscription/checkout${query({ app, state, method: "code" })}`}
            aria-current={method === "code" ? "page" : undefined}
            className={tabClass(method === "code")}
          >
            Use a code
          </Link>
        </nav>

        {method === "card" ? (
          <>
            {price && (
              <div className="mt-6 flex items-baseline justify-between gap-4 rounded-2xl border border-line p-5">
                <div>
                  <p className="type-label text-fg">{price.name}</p>
                  <p className="mt-1 type-caption text-fg-2">{price.summary}</p>
                </div>
                <p className="shrink-0 text-fg-2">
                  <span className="text-2xl font-semibold text-fg">{price.price}</span>{" "}
                  {price.cadence}
                </p>
              </div>
            )}

            {clientSecret && publishableKey ? (
              <>
                <p className="mt-6 type-caption text-fg-2">Secure payment by Stripe.</p>
                <EmbeddedCheckoutForm publishableKey={publishableKey} clientSecret={clientSecret} />
              </>
            ) : (
              <div role="alert" className="mt-6 rounded-2xl border border-danger/40 bg-danger/10 p-5">
                <p className="type-label text-danger">We couldn’t open the payment form</p>
                <p className="mt-2 text-danger">{errorMsg}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={`/subscription/checkout${query({ app, state })}`} className="ui-primary">
                    Try again
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="ui-surface mt-6 p-6 sm:p-8">
            <h2 className="text-xl font-semibold">Use a code</h2>
            <p className="mt-2 text-fg-2">
              If you&apos;ve been given an Arbor code, enter it here instead of paying.
            </p>
            <form action={redeemCodeAction} className="mt-6 flex flex-col gap-3 sm:flex-row">
              {app && <input type="hidden" name="app" value={app} />}
              {state && <input type="hidden" name="state" value={state} />}
              <label htmlFor="code" className="sr-only">
                Code
              </label>
              <input
                id="code"
                name="code"
                required
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                placeholder="Enter your code"
                aria-invalid={codeError ? true : undefined}
                aria-describedby={codeError ? "code-error" : undefined}
                className="ui-field uppercase placeholder:normal-case"
              />
              <button type="submit" className="ui-primary shrink-0">
                Use code
              </button>
            </form>
            {codeError && (
              <p id="code-error" role="alert" className="mt-3 type-caption text-danger">
                {CODE_ERRORS[codeError] ??
                  "We couldn’t check that code just now. Try again in a moment."}
              </p>
            )}
          </div>
        )}

        <p className="mt-10 type-caption text-fg-2">
          <Link href={back} className="transition hover:text-fg">
            ← Back to your subscription
          </Link>
        </p>
      </section>
      <Footer />
    </main>
  );
}
