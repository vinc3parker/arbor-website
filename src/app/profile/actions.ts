"use server";

import { revalidatePath } from "next/cache";
import { parseArborProfileForm } from "@/lib/arbor-profile-fields";
import { upsertProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase-server";
import {
  removeDataCategory,
  removeFeeling,
  removeMemory,
  type DataCategoryId,
} from "@/lib/arbor-core";

const DATA_CATEGORIES: DataCategoryId[] = [
  "memories",
  "feelings",
  "plans",
  "guide_suggestions",
  "training",
  "money",
  "apps",
];

export type ProfileState = {
  error?: string;
  message?: string;
};

export async function updateProfile(
  _prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Your session has ended. Sign in again to save your details." };
  }

  const parsed = parseArborProfileForm(formData);
  if (parsed.error !== null) {
    return { error: parsed.error };
  }

  const { error } = await upsertProfile(
    supabase,
    user.id,
    user.email,
    parsed.profile
  );

  if (error) {
    return {
      error:
        "We couldn’t save your details just now. Nothing has changed. Try again in a moment.",
    };
  }

  revalidatePath("/profile");
  return { message: "Details saved." };
}

// ── What Arbor knows: removal ────────────────────────────────────────────────
// Removal is immediate and complete (brand guide 8.4). Each action reports
// back plainly so the page never claims something was removed when it wasn't.

export type RemoveState = { error?: string; removed?: boolean };

async function accessToken(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

async function runRemoval(
  fn: (token: string) => Promise<unknown>
): Promise<RemoveState> {
  const token = await accessToken();
  if (!token) return { error: "Your session has ended. Sign in again to continue." };
  try {
    await fn(token);
  } catch {
    return {
      error: "We couldn’t remove that just now. Nothing has changed. Try again in a moment.",
    };
  }
  revalidatePath("/profile");
  return { removed: true };
}

export async function removeCategoryAction(
  _prev: RemoveState,
  formData: FormData
): Promise<RemoveState> {
  const category = String(formData.get("category") ?? "");
  if (!DATA_CATEGORIES.includes(category as DataCategoryId)) {
    return { error: "Nothing to remove." };
  }
  return runRemoval((t) => removeDataCategory(t, category as DataCategoryId));
}

export async function removeItemAction(
  _prev: RemoveState,
  formData: FormData
): Promise<RemoveState> {
  const kind = String(formData.get("kind") ?? "");
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Nothing to remove." };
  if (kind === "memories") return runRemoval((t) => removeMemory(t, id));
  if (kind === "feelings") return runRemoval((t) => removeFeeling(t, id));
  return { error: "Nothing to remove." };
}
