"use client";

import { useState } from "react";
import {
  DAY_KEYS,
  DAY_NAMES,
  emptyWeek,
  formatOpeningHours,
  parseOpeningHours,
  type DayKey,
  type WeekHours,
} from "@/lib/openingHours";

/**
 * A week of opening hours, submitted as `openingHours` in OpenStreetMap's
 * format. Hours the week view can't show (split times, holidays) are edited as
 * text, so nothing an owner or OpenStreetMap recorded is lost.
 */
export function OpeningHoursField({ value }: { value: string | null }) {
  const parsed = parseOpeningHours(value);
  const [week, setWeek] = useState<WeekHours>(parsed ?? emptyWeek());
  const [asText, setAsText] = useState(parsed === null);
  const [text, setText] = useState(value ?? "");

  const setDay = (day: DayKey, patch: Partial<WeekHours["days"][DayKey]>) =>
    setWeek((current) => ({ ...current, days: { ...current.days, [day]: { ...current.days[day], ...patch } } }));

  const copyMondayToWeekdays = () =>
    setWeek((current) => ({
      ...current,
      days: { ...current.days, Tu: current.days.Mo, We: current.days.Mo, Th: current.days.Mo, Fr: current.days.Mo },
    }));

  return (
    <div className="mt-3 grid gap-3">
      <input type="hidden" name="openingHours" value={asText ? text.trim() : formatOpeningHours(week)} />
      {asText ? (
        <label className="grid gap-2">
          <span className="type-caption text-fg-2">
            In OpenStreetMap&apos;s format, e.g. <code>Mo-Fr 06:00-22:00; Sa,Su 08:00-20:00</code>
          </span>
          <input className="ui-field" value={text} onChange={(event) => setText(event.target.value)} maxLength={255} />
        </label>
      ) : (
        <>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={week.alwaysOpen}
              onChange={(event) => setWeek((current) => ({ ...current, alwaysOpen: event.target.checked }))}
            />
            Open 24 hours, every day
          </label>
          {!week.alwaysOpen && (
            <div className="grid gap-2">
              {DAY_KEYS.map((day) => {
                const hours = week.days[day];
                return (
                  <div key={day} className="grid grid-cols-[6.5rem_auto_1fr] items-center gap-3 text-sm">
                    <span>{DAY_NAMES[day]}</span>
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" checked={hours.open} onChange={(event) => setDay(day, { open: event.target.checked })} />
                      Open
                    </label>
                    {hours.open ? (
                      <span className="grid grid-cols-[8rem_auto_8rem] items-center justify-start gap-2">
                        <input type="time" className="ui-field" value={hours.from} onChange={(event) => setDay(day, { from: event.target.value })} aria-label={`${DAY_NAMES[day]} opens`} />
                        <span className="text-fg-2">to</span>
                        {/* OpenStreetMap writes midnight as 24:00, which a time box can't show. */}
                        <input type="time" className="ui-field" value={hours.to === "24:00" ? "00:00" : hours.to} onChange={(event) => setDay(day, { to: event.target.value })} aria-label={`${DAY_NAMES[day]} closes`} />
                      </span>
                    ) : (
                      <span className="text-fg-2">Closed</span>
                    )}
                  </div>
                );
              })}
              <button type="button" className="ui-secondary w-fit text-sm" onClick={copyMondayToWeekdays}>
                Copy Monday to Tuesday–Friday
              </button>
            </div>
          )}
        </>
      )}
      <button
        type="button"
        className="w-fit text-sm text-fg-2 underline underline-offset-4"
        onClick={() => {
          if (asText) {
            // Hours the week can't show stay as text rather than being lost.
            const next = parseOpeningHours(text);
            if (!next) return;
            setWeek(next);
          } else {
            setText(formatOpeningHours(week));
          }
          setAsText(!asText);
        }}
      >
        {asText
          ? parseOpeningHours(text) ? "Use the weekly view" : "These hours can only be edited as text"
          : "Split hours or holidays? Edit as text"}
      </button>
    </div>
  );
}
