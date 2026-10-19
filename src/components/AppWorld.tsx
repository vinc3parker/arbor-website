import type { ReactNode } from "react";

/** App pages use ordinary navigation and preserve the browser's zoom controls. */
export function AppWorld({ children }: { children: ReactNode; accent?: string }) {
  return <>{children}</>;
}
