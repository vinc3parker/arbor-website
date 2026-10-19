import type { ArborProfileFields } from "@/lib/arbor-profile-fields";

export type ConfirmationResult = "confirmed" | "invalid" | "profile_error";

export interface HostedSignupContext {
  app: string;
  state: string | null;
}

export interface ConfirmationUser {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
}

export interface PendingConfirmationProfile {
  email: string;
  profile: ArborProfileFields;
}

export interface ConfirmationDependencies {
  verifyOtp(): Promise<boolean>;
  currentUser(): Promise<ConfirmationUser | null>;
  saveProfile(user: ConfirmationUser, profile: ArborProfileFields): Promise<boolean>;
  markPendingSignupConfirmed(user: ConfirmationUser): Promise<boolean>;
  clearPendingProfile(): Promise<void>;
  signOut(): Promise<void>;
}

export function hostedContextFromMetadata(
  raw: unknown,
  isRegisteredApp: (app: string) => boolean
): HostedSignupContext | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const metadata = raw as Record<string, unknown>;
  const app = metadata.hosted_app;
  if (typeof app !== "string" || !isRegisteredApp(app)) return null;
  const rawState = metadata.hosted_state;
  const state = typeof rawState === "string" &&
      rawState.length <= 512 && /^[A-Za-z0-9._~-]+$/.test(rawState)
    ? rawState
    : null;
  return { app, state };
}

export function profileFromSignupMetadata(raw: unknown): ArborProfileFields | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const profile = raw as Record<string, unknown>;
  const required = [
    "first_name", "last_name", "date_of_birth", "gender", "address_line1",
    "city", "region", "postal_code", "country",
  ];
  if (!required.every((key) => typeof profile[key] === "string")) return null;
  if (profile.address_line2 !== null && typeof profile.address_line2 !== "string") return null;
  return profile as unknown as ArborProfileFields;
}

export function confirmationReturnPath(
  context: HostedSignupContext | null,
  result: ConfirmationResult
): string {
  if (!context) return "/login?error=confirmation_failed";
  const query = new URLSearchParams({ app: context.app, confirmation: result });
  if (context.state) query.set("state", context.state);
  return `/app-auth?${query.toString()}`;
}

export async function completeSignupConfirmation(
  dependencies: ConfirmationDependencies,
  input: {
    queryContext: HostedSignupContext | null;
    pendingProfile: PendingConfirmationProfile | null;
    fallbackPath: string;
    isRegisteredApp: (app: string) => boolean;
  }
): Promise<string> {
  if (!(await dependencies.verifyOtp())) {
    return confirmationReturnPath(input.queryContext, "invalid");
  }

  const user = await dependencies.currentUser();
  if (!user) {
    await dependencies.signOut();
    return confirmationReturnPath(input.queryContext, "invalid");
  }

  const metadata = user.user_metadata ?? {};
  const metadataContext = hostedContextFromMetadata(metadata, input.isRegisteredApp);
  const context = metadataContext ?? input.queryContext;
  const pending = input.pendingProfile;
  const profile = profileFromSignupMetadata(metadata.arbor_profile) ??
    (pending && pending.email.toLowerCase() === user.email?.toLowerCase()
      ? pending.profile
      : null);

  if (context && (!profile || (metadataContext && input.queryContext && metadataContext.app !== input.queryContext.app))) {
    await dependencies.signOut();
    return confirmationReturnPath(context, "profile_error");
  }

  if (profile && !(await dependencies.saveProfile(user, profile))) {
    if (context) {
      await dependencies.signOut();
      return confirmationReturnPath(context, "profile_error");
    }
    return input.fallbackPath;
  }

  if (!(await dependencies.markPendingSignupConfirmed(user))) {
    await dependencies.signOut();
    return confirmationReturnPath(context ?? input.queryContext, "profile_error");
  }

  await dependencies.clearPendingProfile();
  if (context) {
    await dependencies.signOut();
    return confirmationReturnPath(context, "confirmed");
  }
  return input.fallbackPath;
}
