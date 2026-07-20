import { appDisplayName } from "@/lib/app-auth";
import {
  AppCallbackFallback,
  type CallbackSearchParams,
} from "../../callback-fallback";

export const metadata = {
  title: "Returning to Aevo — Arbor",
  robots: { index: false, follow: false },
};

export default async function AevoCallbackPage({
  searchParams,
}: {
  searchParams: Promise<CallbackSearchParams>;
}) {
  return (
    <AppCallbackFallback
      app="aevo"
      name={appDisplayName("aevo")}
      searchParams={await searchParams}
    />
  );
}
