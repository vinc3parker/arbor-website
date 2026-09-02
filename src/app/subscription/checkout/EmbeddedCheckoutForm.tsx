"use client";

import { useCallback, useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { createCheckoutClientSecret } from "../actions";

/**
 * Stripe's embedded Checkout, mounted inline (no redirect). The card fields are
 * Stripe-hosted iframes, so card data goes straight to Stripe, never our server.
 * The client secret is fetched via a server action that holds the user's token.
 */
export function EmbeddedCheckoutForm({
  publishableKey,
  app,
  state,
}: {
  publishableKey: string;
  app?: string;
  state?: string;
}) {
  const stripePromise = useMemo(() => loadStripe(publishableKey), [publishableKey]);
  const fetchClientSecret = useCallback(
    () => createCheckoutClientSecret(app, state),
    [app, state]
  );

  return (
    <div className="mt-8">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
