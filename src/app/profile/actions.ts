"use server";

import { revalidatePath } from "next/cache";
import { parseArborProfileForm } from "@/lib/arbor-profile-fields";
import { upsertProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase-server";

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
    return { error: "You need to be signed in to update your profile." };
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
        "Couldn't save your profile. If this persists, make sure the 0003_arbor_users_profile.sql migration has been run.",
    };
  }

  revalidatePath("/profile");
  return { message: "Profile saved." };
}
