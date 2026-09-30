"use client";

import { useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

/**
 * Stripe's embedded Checkout, mounted inline. The clientSecret is created on the
 * server (page) and passed in, so any Core/Stripe failure is handled there with a
 * visible message rather than a blank form.
 */
export function EmbeddedCheckoutForm({
  publishableKey,
  clientSecret,
}: {
  publishableKey: string;
  clientSecret: string;
}) {
  const stripePromise = useMemo(() => loadStripe(publishableKey), [publishableKey]);

  return (
    <div className="mt-10 ui-surface p-4 sm:p-8">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
