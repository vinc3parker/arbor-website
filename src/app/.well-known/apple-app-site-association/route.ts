import { NextResponse } from "next/server";
import { APP_IDS, appCallbackPath } from "@/lib/app-auth";

// Apple App Site Association — tells iOS which app to open for each
// /app/<id>/callback path, so the Universal Link redirect at the end of the
// hosted sign-in flow lands inside the right app instead of a web page.
//
// Served from a route handler (not /public) so the content-type is always
// application/json and the app list stays single-sourced.
//
// TODO(app team): replace the placeholders below with the real values before
// this goes live, then verify at
// https://<domain>/.well-known/apple-app-site-association
//   • APPLE_TEAM_ID   — your 10-char Apple Developer Team ID
//   • bundle ids      — confirm each app's real bundle identifier
export const dynamic = "force-static";

const APPLE_TEAM_ID = "TEAMID"; // <-- replace with real Team ID
const bundleId = (app: string) => `co.arborapps.${app}`; // <-- confirm per app

export function GET() {
  const body = {
    applinks: {
      details: APP_IDS.map((app) => ({
        appID: `${APPLE_TEAM_ID}.${bundleId(app)}`,
        paths: [appCallbackPath(app)],
      })),
    },
  };

  return NextResponse.json(body, {
    headers: { "content-type": "application/json" },
  });
}
