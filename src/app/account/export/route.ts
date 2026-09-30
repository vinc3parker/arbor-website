import { exportAllData } from "@/lib/arbor-core";
import { createClient } from "@/lib/supabase-server";

// "Take it with you" (brand guide 8.4): a downloadable copy of everything
// Arbor holds on its servers for the signed-in person, as JSON.
export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return Response.redirect(
      new URL("/login?redirect=/profile", request.url),
      303
    );
  }

  try {
    const data = await exportAllData(session.access_token);
    const date = new Date().toISOString().slice(0, 10);
    return new Response(JSON.stringify(data, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="arbor-data-${date}.json"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new Response(
      "We couldn’t prepare your copy just now. Nothing is lost. Try again in a moment.",
      { status: 502, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }
}
