import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// Signs the user out of the website only and returns them to the home page.
// scope "local" ends just this browser session — the default ("global") would
// revoke every session, signing them out of their Arbor apps too.
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: "local" });
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
