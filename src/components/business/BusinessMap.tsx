"use client";

import "leaflet/dist/leaflet.css";
import { divIcon, latLngBounds, type LatLngExpression } from "leaflet";
import { useEffect, useMemo } from "react";
import { CircleMarker, MapContainer, Marker, TileLayer, Tooltip, useMap, useMapEvents } from "react-leaflet";
import { MAP_TILES } from "./mapTiles";

export type MapPoint = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  /** `match` = may be the same business; `nearby` = just close by. */
  tone: "match" | "nearby";
};

const UK_CENTRE: LatLngExpression = [54.5, -2.5];
// Arbor colours: Warning amber for possible matches, Moss for nearby. A selected
// listing keeps its colour and gains a thick Ink ring, so it never looks like the pin.
const TONE = {
  match: { color: "#a15c07", fill: "#a15c07" },
  nearby: { color: "#65655e", fill: "#8a8f7a" },
};
const SELECTED_RING = "#0a0a0a";

const pinIcon = divIcon({
  className: "",
  html: '<div style="width:22px;height:22px;border-radius:999px;background:#0a0a0a;border:4px solid #f6f5f2;box-shadow:0 1px 6px rgba(0,0,0,.35)"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

function FitToContent({ pin, points }: { pin: { latitude: number; longitude: number } | null; points: MapPoint[] }) {
  const map = useMap();
  const key = `${pin?.latitude},${pin?.longitude}|${points.map((point) => point.id).join(",")}`;
  useEffect(() => {
    const coords: Array<[number, number]> = points.map((point) => [point.latitude, point.longitude]);
    if (pin) coords.push([pin.latitude, pin.longitude]);
    if (coords.length === 0) {
      map.setView(UK_CENTRE, 5);
    } else if (coords.length === 1) {
      map.setView(coords[0], 16);
    } else {
      map.fitBounds(latLngBounds(coords), { padding: [40, 40], maxZoom: 17 });
    }
    // Refit only when the set of things shown changes, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, map]);
  return null;
}

function ClickToPlace({ onPlace }: { onPlace: (latitude: number, longitude: number) => void }) {
  useMapEvents({ click: (event) => onPlace(event.latlng.lat, event.latlng.lng) });
  return null;
}

export function BusinessMap({
  pin,
  points,
  selectedId,
  onSelect,
  onPinMove,
  className = "h-80 sm:h-96",
}: {
  pin: { latitude: number; longitude: number } | null;
  points: MapPoint[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  /** When set, the pin can be dragged, or placed by clicking the map. */
  onPinMove?: (latitude: number, longitude: number) => void;
  className?: string;
}) {
  const ordered = useMemo(
    // Draw matches and the selected listing on top.
    () => [...points].sort((a, b) => Number(a.tone === "match") - Number(b.tone === "match")
      || Number(a.id === selectedId) - Number(b.id === selectedId)),
    [points, selectedId],
  );

  return (
    <div className={`isolate overflow-hidden rounded-2xl border border-line ${className}`}>
      <MapContainer center={UK_CENTRE} zoom={5} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer {...MAP_TILES} />
        <FitToContent pin={pin} points={points} />
        {onPinMove && <ClickToPlace onPlace={onPinMove} />}
        {ordered.map((point) => {
          const tone = TONE[point.tone];
          const selected = point.id === selectedId;
          return (
            <CircleMarker
              key={point.id}
              center={[point.latitude, point.longitude]}
              radius={selected ? 12 : point.tone === "match" ? 10 : 7}
              pathOptions={{
                color: selected ? SELECTED_RING : tone.color,
                fillColor: tone.fill,
                fillOpacity: 0.85,
                weight: selected ? 4 : 2,
              }}
              eventHandlers={{ click: () => onSelect?.(point.id) }}
            >
              <Tooltip direction="top" offset={[0, -8]}>{point.name}</Tooltip>
            </CircleMarker>
          );
        })}
        {pin && (
          <Marker
            position={[pin.latitude, pin.longitude]}
            icon={pinIcon}
            draggable={Boolean(onPinMove)}
            keyboard={false}
            eventHandlers={{
              dragend: (event) => {
                const { lat, lng } = event.target.getLatLng();
                onPinMove?.(lat, lng);
              },
            }}
          >
            <Tooltip direction="top" offset={[0, -12]}>{onPinMove ? "Your business (drag to adjust)" : "Searched area"}</Tooltip>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
