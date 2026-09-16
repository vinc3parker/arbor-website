"use server";

import { redirect } from "next/navigation";
import { deleteAccount } from "@/lib/arbor-core";
import { isRegisteredApp } from "@/lib/app-auth";
import { createClient } from "@/lib/supabase-server";

function cleanApp(raw: FormDataEntryValue | null): string | null {
  const value = typeof raw === "string" ? raw : null;
  return value && isRegisteredApp(value) ? value : null;
}

function withApp(path: string, app: string | null): string {
  return app ? `${path}?app=${encodeURIComponent(app)}` : path;
}

function withError(path: string, app: string | null, code: string): string {
  const params = new URLSearchParams();
  if (app) params.set("app", app);
  params.set("error", code);
  return `${path}?${params.toString()}`;
}

export async function deleteAccountAction(formData: FormData) {
  const app = cleanApp(formData.get("app"));
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    redirect(`/login?redirect=${encodeURIComponent(withApp("/account/delete", app))}`);
  }

  try {
    await deleteAccount(session.access_token);
    await supabase.auth.signOut();
  } catch (error) {
    const code =
      error instanceof Error && "code" in error
        ? String((error as { code?: unknown }).code ?? "error")
        : "error";
    redirect(withError("/account/delete", app, code));
  }

  redirect(withApp("/account/delete/done", app));
}
