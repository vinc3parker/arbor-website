import { redirect } from "next/navigation";
import { AccountView } from "@/components/account/AccountView";
import { createClient } from "@/lib/supabase-server";
import { fetchDataOverview, fetchEntitlement, type DataOverview } from "@/lib/arbor-core";
import { hasAccess } from "@/lib/subscription";
import { getProfile } from "@/lib/profile";

export const metadata = {
  title: "Your account — Arbor",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/profile");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;
  const [profile, overview, entitlement] = await Promise.all([
    getProfile(supabase, user.id),
    token
      ? fetchDataOverview(token).catch((): DataOverview | null => null)
      : Promise.resolve(null),
    token ? fetchEntitlement(token).catch(() => null) : Promise.resolve(null),
  ]);

  return (
    <AccountView
      profile={profile}
      email={user.email ?? null}
      createdAt={user.created_at ?? null}
      overview={overview}
      subscription={
        entitlement
          ? {
              active: hasAccess(entitlement.entitlement.status),
              plan: entitlement.entitlement.plan,
              comp: entitlement.source === "comp",
            }
          : null
      }
    />
  );
}
