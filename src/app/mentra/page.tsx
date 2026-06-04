import { AppLanding } from "@/components/AppLanding";
import { apps } from "@/content/apps";

export default function Page() {
  return <AppLanding app={apps.mentra} />;
}