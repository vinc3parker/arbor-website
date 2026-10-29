import Link from "next/link";
import { APP_LEGAL_IDS, APP_LEGAL_NOTICES } from "@/content/app-legal";
import { APP_BRANDS } from "@/lib/brand";

export function AppNoticeGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {APP_LEGAL_IDS.map((id) => {
        const app = APP_BRANDS[id];
        const notice = APP_LEGAL_NOTICES[id];
        return (
          <Link
            key={id}
            href={`/legal/${id}`}
            className="group rounded-2xl border border-line bg-surface p-5 transition hover:border-fg-3 hover:bg-raised"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">{app.name}</h3>
              <span className="type-caption text-fg-3">{notice.status}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-fg-2">{notice.summary}</p>
            <span className="mt-4 inline-block text-sm font-medium text-fg transition group-hover:translate-x-0.5">
              Read app notice →
            </span>
          </Link>
        );
      })}
    </div>
  );
}
