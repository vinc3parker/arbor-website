"use client";

import { useState } from "react";
import type { MapPlace } from "@/lib/arbor-business";
import { BusinessMap, type MapPoint } from "./BusinessMapLoader";
import { ClaimForm } from "./ClaimForm";
import { offeringLabel } from "./options";

/** Search results beside a map: name matches highlighted, other listings in the area muted. */
export function FindResults({
  nameMatches,
  inArea,
  centre,
}: {
  nameMatches: MapPlace[];
  inArea: MapPlace[];
  centre: { latitude: number; longitude: number } | null;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(nameMatches[0]?.id ?? null);
  const matchIds = new Set(nameMatches.map((place) => place.id));
  const listed = [...nameMatches, ...inArea.filter((place) => !matchIds.has(place.id))];
  const points: MapPoint[] = listed
    .filter((place) => place.latitude != null && place.longitude != null)
    .map((place) => ({
      id: place.id,
      name: place.name,
      latitude: place.latitude!,
      longitude: place.longitude!,
      tone: matchIds.has(place.id) ? "match" : "nearby",
    }));

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div>
        <BusinessMap
          pin={centre}
          points={points}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            document.getElementById(`result-${id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }}
          className="h-80 sm:h-[30rem]"
        />
        <p className="mt-2 type-caption text-fg-2">
          {nameMatches.length ? "Amber dots match the name you searched for. " : ""}
          {inArea.length ? "Grey dots are other listings in the area." : ""}
        </p>
      </div>
      <ul className="max-h-[30rem] space-y-3 overflow-y-auto pr-1">
        {listed.map((place) => (
          <li key={place.id} id={`result-${place.id}`} className={`ui-surface p-4 ${place.id === selectedId ? "border-fg" : ""}`}>
            <button type="button" className="w-full text-left" onClick={() => setSelectedId(place.id)}>
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{place.name}</span>
                {place.managedAt && <span className="ui-status">Run by its owner</span>}
              </span>
              <span className="type-caption block text-fg-2">{place.location ?? "No address on the map yet"}</span>
              {place.activities.length > 0 && (
                <span className="mt-2 flex flex-wrap gap-1.5">
                  {place.activities.slice(0, 5).map((slug) => <span key={slug} className="ui-status text-xs">{offeringLabel(slug)}</span>)}
                </span>
              )}
            </button>
            <ClaimForm placeId={place.id} placeName={place.name} managed={Boolean(place.managedAt)} />
          </li>
        ))}
      </ul>
    </div>
  );
}
