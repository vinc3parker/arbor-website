"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { parseArborProfileForm } from "@/lib/arbor-profile-fields";
import {
  clearPendingSignupProfile,
  savePendingSignupProfile,
} from "@/lib/pending-signup-profile";
import { upsertProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase-server";

export type AuthState = {
  error?: string;
  message?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function login(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirect") ?? "/profile");

  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (!password) {
    return { error: "Please enter your password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect(redirectTo || "/profile");
}

export async function signup(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");
  const parsed = parseArborProfileForm(formData);

  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (parsed.error !== null) {
    return { error: parsed.error };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords don't match." };
  }

  const origin = (await headers()).get("origin") ?? "";
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // If email confirmation is enabled, no session is returned yet.
  if (!data.session) {
    await savePendingSignupProfile({ email, profile: parsed.profile });
    return {
      message:
        "Check your inbox to confirm your email address, then sign in.",
    };
  }

  if (!data.user) {
    return { error: "Account created, but we couldn't load your user profile." };
  }

  const { error: profileError } = await upsertProfile(
    supabase,
    data.user.id,
    data.user.email,
    parsed.profile
  );
  if (profileError) {
    return {
      error:
        "Your account was created, but we couldn't save your profile. Please try again from your profile page.",
    };
  }

  await clearPendingSignupProfile();

  redirect("/profile");
}
