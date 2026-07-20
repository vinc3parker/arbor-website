import { NextResponse } from "next/server";
import { APP_IDS, appCallbackPath } from "@/lib/app-auth";

// Android App Links — the Play equivalent of the Apple AASA file. Lets Android
// open the right app for the /app/<id>/callback Universal Link.
//
// TODO(app team): replace the placeholders before launch, then verify at
// https://<domain>/.well-known/assetlinks.json
//   • package_name          — each app's real applicationId
//   • sha256_cert_fingerprints — the signing cert fingerprint(s); get them with
//        keytool -list -v -keystore <keystore> -alias <alias>
export const dynamic = "force-static";

const packageName = (app: string) => `co.arborapps.${app}`; // <-- confirm per app
const SHA256_FINGERPRINTS: string[] = [
  // "AA:BB:CC:...:FF",  // <-- add real signing cert fingerprint(s)
];

export function GET() {
  const body = APP_IDS.map((app) => ({
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: packageName(app),
      sha256_cert_fingerprints: SHA256_FINGERPRINTS,
    },
    relation_extensions: {
      "delegate_permission/common.handle_all_urls": {
        dynamic_app_link_components: [{ "/": appCallbackPath(app) }],
      },
    },
  }));

  return NextResponse.json(body, {
    headers: { "content-type": "application/json" },
  });
}
