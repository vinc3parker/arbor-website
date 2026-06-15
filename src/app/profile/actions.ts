"use server";

import { revalidatePath } from "next/cache";
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

  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();
  const dobRaw = String(formData.get("date_of_birth") ?? "").trim();

  // Validation
  if (firstName.length > 80 || lastName.length > 80) {
    return { error: "Name fields are too long." };
  }

  let dateOfBirth: string | null = null;
  if (dobRaw) {
    const dob = new Date(dobRaw);
    if (Number.isNaN(dob.getTime())) {
      return { error: "Please enter a valid date of birth." };
    }
    const now = new Date();
    if (dob > now) {
      return { error: "Date of birth can't be in the future." };
    }
    const age = now.getFullYear() - dob.getFullYear();
    if (age > 130) {
      return { error: "Please enter a valid date of birth." };
    }
    dateOfBirth = dobRaw;
  }

  const { error } = await supabase.from("arbor_users").upsert(
    {
      id: user.id,
      email: user.email,
      first_name: firstName || null,
      last_name: lastName || null,
      date_of_birth: dateOfBirth,
    },
    { onConflict: "id" }
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
