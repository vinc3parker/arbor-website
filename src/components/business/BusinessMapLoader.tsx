"use client";

import dynamic from "next/dynamic";

/** Leaflet needs the browser, so the map only loads on the client. */
export const BusinessMap = dynamic(() => import("./BusinessMap").then((module) => module.BusinessMap), {
  ssr: false,
  loading: () => <div className="h-80 animate-pulse rounded-2xl border border-line bg-surface sm:h-96" aria-hidden />,
});

export type { MapPoint } from "./BusinessMap";
