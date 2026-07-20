import { notFound } from "next/navigation";
import { appDisplayName, isRegisteredApp } from "@/lib/app-auth";
import {
  AppCallbackFallback,
  type CallbackSearchParams,
} from "../../callback-fallback";

export const metadata = {
  title: "Return to your app — Arbor",
  robots: { index: false, follow: false },
};

// Universal Link target: https://arborapps.co/app/[app]/callback?code=…&state=…
//
// On a device with the app installed, iOS/Android intercept this URL and hand
// it straight to the app *before* this page ever renders — the app reads the
// code and finishes signing in. This page is the fallback shown only when the
// app isn't installed or the link is opened somewhere it can't be handled
// (e.g. a desktop browser). It intentionally does nothing with the code.
export default async function AppCallbackPage({
  params,
  searchParams,
}: {
  params: Promise<{ app: string }>;
  searchParams: Promise<CallbackSearchParams>;
}) {
  const { app } = await params;
  if (!isRegisteredApp(app)) notFound();
  return (
    <AppCallbackFallback
      app={app}
      name={appDisplayName(app)}
      searchParams={await searchParams}
    />
  );
}
