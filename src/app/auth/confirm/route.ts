import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { isRegisteredApp, sanitizeState } from "@/lib/app-auth";
import {
  completeSignupConfirmation,
  confirmationReturnPath,
} from "./confirmation";
import {
  clearPendingSignupProfile,
  readPendingSignupProfile,
} from "@/lib/pending-signup-profile";
import { upsertProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase-server";

// Handles the signup OTP sent by Supabase Auth. Hosted signups return to their
// originating app after the profile has been saved and the temporary session
// has been cleared; ordinary website signups keep their existing destination.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const queryAppRaw = searchParams.get("app");
  const queryApp = isRegisteredApp(queryAppRaw) ? queryAppRaw : null;
  const queryState = sanitizeState(searchParams.get("state"));
  const queryContext = queryApp ? { app: queryApp, state: queryState } : null;
  const requestedNext = searchParams.get("next") ?? "/profile";
  const requestUrl = new URL(request.url);
  let safeNext = "/profile";
  try {
    const nextUrl = new URL(requestedNext, requestUrl);
    if (nextUrl.origin === requestUrl.origin) {
      safeNext = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
    }
  } catch {
    // Malformed or external destinations fall back to the profile page.
  }

  if (!token_hash) {
    return NextResponse.redirect(
      new URL(confirmationReturnPath(queryContext, "invalid"), request.url)
    );
  }

  const supabase = await createClient();

  if (type === "recovery") {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      const recoveryUrl = new URL(safeNext, request.url);
      if (recoveryUrl.pathname === "/reset-password") {
        return NextResponse.redirect(recoveryUrl);
      }
    }

    const resetUrl = new URL(safeNext, request.url);
    if (resetUrl.pathname !== "/reset-password") {
      resetUrl.pathname = "/reset-password";
      resetUrl.search = "";
    }
    resetUrl.searchParams.delete("mode");
    resetUrl.searchParams.set("error", "invalid");
    return NextResponse.redirect(resetUrl);
  }

  if (type !== "signup") {
    return NextResponse.redirect(
      new URL(confirmationReturnPath(queryContext, "invalid"), request.url)
    );
  }

  const pendingProfile = await readPendingSignupProfile();
  const path = await completeSignupConfirmation(
    {
      verifyOtp: async () => {
        const { error } = await supabase.auth.verifyOtp({ type, token_hash });
        return !error;
      },
      currentUser: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
      },
      saveProfile: async (user, profile) => {
        const { error } = await upsertProfile(supabase, user.id, user.email, profile);
        return !error;
      },
      markPendingSignupConfirmed: async (user) => {
        if (user.user_metadata?.email_confirmation_pending !== true) return true;
        const { error } = await supabase.auth.updateUser({
          data: { email_confirmation_pending: false },
        });
        return !error;
      },
      clearPendingProfile: clearPendingSignupProfile,
      signOut: async () => {
        await supabase.auth.signOut({ scope: "local" });
      },
    },
    {
      queryContext,
      pendingProfile,
      fallbackPath: safeNext,
      isRegisteredApp,
    }
  );
  return NextResponse.redirect(new URL(path, request.url));
}
