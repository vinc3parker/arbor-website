import { createClient } from "@supabase/supabase-js";

// Service-role Supabase client — bypasses Row Level Security. SERVER ONLY:
// used by the Stripe webhook and billing routes to write the shared
// public.subscriptions row and mirror arbor_users.subscription_tier. Never
// import this into a client component or expose the key to the browser.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.warn(
    "[supabase-admin] NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set — the Stripe webhook cannot write until these are configured."
  );
}

export const supabaseAdmin = createClient(
  url ?? "http://placeholder",
  serviceKey ?? "placeholder",
  { auth: { autoRefreshToken: false, persistSession: false } }
);
