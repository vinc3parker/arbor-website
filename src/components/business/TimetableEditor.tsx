"use client";

import { useMemo, useState, useTransition } from "react";
import { findVenues, saveTimetable, type FormState } from "@/app/business/actions";
import type { MapPlace, PlaceRow, SessionRow, TimetableSessionInput } from "@/lib/arbor-business";
import { DAYS, OFFERINGS, SESSION_KINDS } from "./options";

type Row = TimetableSessionInput & { key: string };

const ACTIVITY_OPTIONS = OFFERINGS.filter(([value]) => value !== "classes");
let rowCounter = 0;
const nextKey = () => `row-${(rowCounter += 1)}`;

function fromSession(session: SessionRow): Row {
  return {
    key: session.id,
    title: session.title,
    kind: session.kind,
    activityType: session.activity_type,
    dayOfWeek: session.day_of_week,
    startTime: session.start_time.slice(0, 5),
    durationMinutes: session.duration_minutes,
    placeId: session.place_id,
    instructor: session.instructor,
    level: session.level,
    priceText: session.price_text,
    bookingUrl: session.booking_url,
  };
}

/** Monday first, then by start time. */
function sortRows(rows: Row[]): Row[] {
  return [...rows].sort((a, b) => ((a.dayOfWeek + 6) % 7) - ((b.dayOfWeek + 6) % 7) || a.startTime.localeCompare(b.startTime));
}

export function TimetableEditor({
  organisationId,
  sessions,
  places,
}: {
  organisationId: string;
  sessions: SessionRow[];
  places: PlaceRow[];
}) {
  const [rows, setRows] = useState<Row[]>(() => sortRows(sessions.map(fromSession)));
  const [venues, setVenues] = useState<Array<{ id: string; name: string }>>(
    () => places.map((place) => ({ id: place.id, name: place.name })),
  );
  const [expanded, setExpanded] = useState<string | null>(null);
  const [result, setResult] = useState<FormState>({});
  const [pending, startTransition] = useTransition();
  const defaultPlaceId = places[0]?.id ?? null;
  const venueName = useMemo(() => new Map(venues.map((venue) => [venue.id, venue.name])), [venues]);

  function update(key: string, patch: Partial<Row>) {
    setRows((current) => current.map((row) => (row.key === key ? { ...row, ...patch } : row)));
    setResult({});
  }

  function addRow() {
    const key = nextKey();
    setRows((current) => [...current, {
      key, title: "", kind: "class", activityType: null, dayOfWeek: 1, startTime: "18:00",
      durationMinutes: 60, placeId: defaultPlaceId, instructor: null, level: null, priceText: null, bookingUrl: null,
    }]);
    setExpanded(key);
    setResult({});
  }

  function publish() {
    const invalid = rows.find((row) => !row.title.trim() || !/^\d{2}:\d{2}$/.test(row.startTime));
    if (invalid) {
      setResult({ error: "Every session needs a name and a start time." });
      return;
    }
    startTransition(async () => {
      const outcome = await saveTimetable(organisationId, rows.map((row) => ({
        title: row.title.trim(),
        kind: row.kind,
        activityType: row.activityType,
        dayOfWeek: row.dayOfWeek,
        startTime: row.startTime,
        durationMinutes: row.durationMinutes,
        placeId: row.placeId,
        instructor: row.instructor,
        level: row.level,
        priceText: row.priceText,
        bookingUrl: row.bookingUrl,
      })));
      setResult(outcome);
      if (!outcome.error) setRows((current) => sortRows(current));
    });
  }

  return (
    <div className="ui-surface p-4 sm:p-6">
      {rows.length === 0 && <p className="ui-copy p-2">No sessions yet. Add your first one below.</p>}
      <ul className="divide-y divide-line">
        {rows.map((row) => (
          <li key={row.key} className="py-4">
            <div className="grid gap-3 sm:grid-cols-[9rem_7rem_1fr_auto] sm:items-end">
              <label className="grid gap-1">
                <span className="type-caption text-fg-2">Day</span>
                <select className="ui-field" value={row.dayOfWeek} onChange={(event) => update(row.key, { dayOfWeek: Number(event.target.value) })}>
                  {DAYS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <label className="grid gap-1">
                <span className="type-caption text-fg-2">Starts</span>
                <input type="time" className="ui-field" value={row.startTime} onChange={(event) => update(row.key, { startTime: event.target.value })} required />
              </label>
              <label className="grid gap-1">
                <span className="type-caption text-fg-2">Session name</span>
                <input className="ui-field" value={row.title} placeholder="e.g. Vinyasa Flow" maxLength={160}
                  onChange={(event) => update(row.key, { title: event.target.value })} />
              </label>
              <div className="flex gap-2">
                <button type="button" className="ui-secondary" aria-expanded={expanded === row.key}
                  onClick={() => setExpanded(expanded === row.key ? null : row.key)}>
                  {expanded === row.key ? "Less" : "More"}
                </button>
                <button type="button" className="ui-secondary" aria-label={`Remove ${row.title || "session"}`}
                  onClick={() => { setRows((current) => current.filter((item) => item.key !== row.key)); setResult({}); }}>
                  Remove
                </button>
              </div>
            </div>
            {expanded !== row.key && (
              <p className="mt-2 type-caption text-fg-2">
                {row.durationMinutes} min · {SESSION_KINDS.find(([value]) => value === row.kind)?.[1]}
                {row.placeId ? ` · ${venueName.get(row.placeId) ?? "Another venue"}` : ""}
                {row.instructor ? ` · with ${row.instructor}` : ""}
              </p>
            )}
            {expanded === row.key && (
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <label className="grid gap-1">
                  <span className="type-caption text-fg-2">Type</span>
                  <select className="ui-field" value={row.kind} onChange={(event) => update(row.key, { kind: event.target.value as Row["kind"] })}>
                    {SESSION_KINDS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
                <label className="grid gap-1">
                  <span className="type-caption text-fg-2">Activity</span>
                  <select className="ui-field" value={row.activityType ?? ""} onChange={(event) => update(row.key, { activityType: event.target.value || null })}>
                    <option value="">Other</option>
                    {ACTIVITY_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
                <label className="grid gap-1">
                  <span className="type-caption text-fg-2">Length (minutes)</span>
                  <input type="number" min={5} max={600} className="ui-field" value={row.durationMinutes}
                    onChange={(event) => update(row.key, { durationMinutes: Number(event.target.value) || 60 })} />
                </label>
                <VenueField
                  value={row.placeId}
                  venues={venues}
                  onPick={(venue) => {
                    if (!venueName.has(venue.id)) setVenues((current) => [...current, venue]);
                    update(row.key, { placeId: venue.id });
                  }}
                  onChange={(placeId) => update(row.key, { placeId })}
                />
                <label className="grid gap-1">
                  <span className="type-caption text-fg-2">Instructor</span>
                  <input className="ui-field" value={row.instructor ?? ""} onChange={(event) => update(row.key, { instructor: event.target.value || null })} />
                </label>
                <label className="grid gap-1">
                  <span className="type-caption text-fg-2">Level</span>
                  <input className="ui-field" value={row.level ?? ""} placeholder="e.g. All levels" onChange={(event) => update(row.key, { level: event.target.value || null })} />
                </label>
                <label className="grid gap-1">
                  <span className="type-caption text-fg-2">Price</span>
                  <input className="ui-field" value={row.priceText ?? ""} placeholder="e.g. £8 drop-in" onChange={(event) => update(row.key, { priceText: event.target.value || null })} />
                </label>
                <label className="grid gap-1 sm:col-span-2">
                  <span className="type-caption text-fg-2">Booking link</span>
                  <input className="ui-field" inputMode="url" value={row.bookingUrl ?? ""} placeholder="https://"
                    onChange={(event) => update(row.key, { bookingUrl: event.target.value || null })} />
                </label>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-4">
        <button type="button" className="ui-secondary" onClick={addRow}>Add a session</button>
        <button type="button" className="ui-primary" onClick={publish} disabled={pending}>
          {pending ? "Publishing" : "Publish timetable"}
        </button>
        {result.message && <span className="type-caption text-success" role="status">{result.message}</span>}
        {result.error && <span className="text-danger">{result.error}</span>}
      </div>
    </div>
  );
}

/** Pick one of your own locations, or search the map for another venue. */
function VenueField({
  value,
  venues,
  onPick,
  onChange,
}: {
  value: string | null;
  venues: Array<{ id: string; name: string }>;
  onPick: (venue: { id: string; name: string }) => void;
  onChange: (placeId: string | null) => void;
}) {
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MapPlace[]>([]);
  const [pending, startTransition] = useTransition();

  if (searching) {
    return (
      <div className="grid gap-1 sm:col-span-3">
        <span className="type-caption text-fg-2">Find the venue on the Arbor map</span>
        <div className="flex gap-2">
          <input className="ui-field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Venue name" />
          <button type="button" className="ui-secondary" disabled={pending}
            onClick={() => startTransition(async () => setResults(await findVenues(query)))}>
            Search
          </button>
          <button type="button" className="ui-secondary" onClick={() => setSearching(false)}>Cancel</button>
        </div>
        {results.length > 0 && (
          <ul className="mt-2 space-y-1">
            {results.map((place) => (
              <li key={place.id}>
                <button type="button" className="w-full rounded-lg px-3 py-2 text-left hover:bg-raised"
                  onClick={() => { onPick({ id: place.id, name: place.name }); setSearching(false); }}>
                  <span className="font-medium">{place.name}</span>
                  <span className="type-caption text-fg-2"> · {place.location ?? "No address"}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {!pending && query && results.length === 0 && (
          <p className="type-caption text-fg-2">Search for the venue by name. If it isn&apos;t on the map, ask the venue to add it.</p>
        )}
      </div>
    );
  }

  const known = !value || venues.some((venue) => venue.id === value);
  return (
    <label className="grid gap-1">
      <span className="type-caption text-fg-2">Where</span>
      <select className="ui-field" value={value ?? ""}
        onChange={(event) => {
          if (event.target.value === "__search") setSearching(true);
          else onChange(event.target.value || null);
        }}>
        <option value="">Varies / not fixed</option>
        {venues.map((venue) => <option key={venue.id} value={venue.id}>{venue.name}</option>)}
        {!known && <option value={value!}>Another venue</option>}
        <option value="__search">Another venue…</option>
      </select>
    </label>
  );
}
