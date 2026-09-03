import { createClient } from "@supabase/supabase-js";

// Each Arbor app's public state lives in the shared `app_states` table so it can
// be changed from the admin site without redeploying. Read with the anon key
// (the rows are public). Falls back to an empty map if the DB is unreachable, so
// the site always renders using the static content as a baseline.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

export type AppStatus = "development" | "beta" | "live";

export type AppState = {
  appId: string;
  name: string;
  status: AppStatus;
  downloadUrl: string | null;
  statusNote: string | null;
};

export type AppStateMap = Record<string, AppState>;

type Row = {
  app_id: string;
  name: string | null;
  status: string | null;
  download_url: string | null;
  status_note: string | null;
};

function normStatus(v: string | null): AppStatus {
  return v === "beta" || v === "live" ? v : "development";
}

export async function getAppStates(): Promise<AppStateMap> {
  const { data, error } = await supabase
    .from("app_states")
    .select("app_id, name, status, download_url, status_note");

  if (error || !data) {
    if (error) console.error("[app-states] fetch failed:", error.message);
    return {};
  }

  const map: AppStateMap = {};
  for (const row of data as Row[]) {
    map[row.app_id] = {
      appId: row.app_id,
      name: row.name ?? row.app_id,
      status: normStatus(row.status),
      downloadUrl: row.download_url,
      statusNote: row.status_note,
    };
  }
  return map;
}

// Homepage badge shown on each app card.
export function badgeForStatus(status: AppStatus): string | undefined {
  if (status === "beta") return "Beta";
  if (status === "live") return "Live";
  return undefined;
}
