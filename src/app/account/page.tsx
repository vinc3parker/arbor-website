import { redirect } from "next/navigation";
import { isRegisteredApp } from "@/lib/app-auth";

export const metadata = {
  title: "Account — Arbor",
  robots: { index: false, follow: false },
};

type SearchParams = { [k: string]: string | string[] | undefined };

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function appQuery(app: string | null): string {
  return app ? `?app=${encodeURIComponent(app)}` : "";
}

export default async function AccountRouterPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const rawApp = first(sp.app);
  const app = rawApp && isRegisteredApp(rawApp) ? rawApp : null;
  const action = first(sp.action) ?? "profile";

  if (action === "delete") {
    redirect(`/account/delete${appQuery(app)}`);
  }

  if (action === "subscription" || action === "billing") {
    redirect(`/subscription${appQuery(app)}`);
  }

  if (action === "consent" || action === "terms") {
    if (app) redirect(`/app-auth?app=${encodeURIComponent(app)}&intent=signin`);
    redirect("/profile");
  }

  redirect("/profile");
}
