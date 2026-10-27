// Opening hours in OpenStreetMap's opening_hours format, which Arbor Core
// stores and the apps read ("Mo-Fr 06:00-22:00; Sa,Su 08:00-20:00"). The
// business portal edits them as a simple week: each day closed or open between
// two times, or open 24/7. Anything more complex is edited as text.

export const DAY_KEYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;
export type DayKey = (typeof DAY_KEYS)[number];

export const DAY_NAMES: Record<DayKey, string> = {
  Mo: "Monday", Tu: "Tuesday", We: "Wednesday", Th: "Thursday", Fr: "Friday", Sa: "Saturday", Su: "Sunday",
};

export type DayHours = { open: boolean; from: string; to: string };
export type WeekHours = { alwaysOpen: boolean; days: Record<DayKey, DayHours> };

const TIME = /^([01]\d|2[0-4]):[0-5]\d$/;

export function emptyWeek(): WeekHours {
  return {
    alwaysOpen: false,
    days: Object.fromEntries(DAY_KEYS.map((day) => [day, { open: false, from: "09:00", to: "17:00" }])) as Record<DayKey, DayHours>,
  };
}

/** Days named in "Mo-Fr", "Sa,Su" or "Mo-We,Fr"; null if not understood. */
function parseDays(text: string): DayKey[] | null {
  const days: DayKey[] = [];
  for (const part of text.split(",")) {
    const [start, end] = part.trim().split("-") as [string, string | undefined];
    const from = DAY_KEYS.indexOf(start as DayKey);
    const to = end === undefined ? from : DAY_KEYS.indexOf(end as DayKey);
    if (from < 0 || to < 0) return null;
    // A range can wrap past Sunday ("Sa-Mo").
    for (let index = from; ; index = (index + 1) % 7) {
      if (!days.includes(DAY_KEYS[index])) days.push(DAY_KEYS[index]);
      if (index === to) break;
    }
  }
  return days;
}

/**
 * The week a simple opening_hours text describes, or null when it uses
 * something the week view can't show (several time ranges, holidays, months).
 */
export function parseOpeningHours(text: string | null | undefined): WeekHours | null {
  const week = emptyWeek();
  const value = (text ?? "").trim();
  if (!value) return week;
  if (value === "24/7") return { ...week, alwaysOpen: true };
  for (const rule of value.split(";").map((part) => part.trim()).filter(Boolean)) {
    const match = rule.match(/^([A-Za-z,\- ]+?)\s+(off|closed|(\d{2}:\d{2})-(\d{2}:\d{2}))$/i);
    if (!match) return null;
    const days = parseDays(match[1].replace(/\s+/g, ""));
    if (!days) return null;
    const closed = /^(off|closed)$/i.test(match[2]);
    if (!closed && (!TIME.test(match[3]) || !TIME.test(match[4]))) return null;
    for (const day of days) {
      week.days[day] = closed ? { ...week.days[day], open: false } : { open: true, from: match[3], to: match[4] };
    }
  }
  return week;
}

/** The week as opening_hours text, grouping days with the same times. Empty when nothing is open. */
export function formatOpeningHours(week: WeekHours): string {
  if (week.alwaysOpen) return "24/7";
  const rules: Array<{ days: DayKey[]; times: string }> = [];
  for (const day of DAY_KEYS) {
    const hours = week.days[day];
    if (!hours.open || !TIME.test(hours.from) || !TIME.test(hours.to)) continue;
    // Closing at 00:00 means midnight, which OpenStreetMap writes as 24:00.
    const times = `${hours.from}-${hours.to === "00:00" ? "24:00" : hours.to}`;
    const previous = rules[rules.length - 1];
    const lastDay = previous?.days[previous.days.length - 1];
    if (previous && previous.times === times && lastDay && DAY_KEYS.indexOf(lastDay) === DAY_KEYS.indexOf(day) - 1) {
      previous.days.push(day);
    } else {
      rules.push({ days: [day], times });
    }
  }
  // Merge runs with the same times ("Mo-We 09:00-17:00" and "Fr 09:00-17:00").
  const byTimes = new Map<string, DayKey[][]>();
  for (const rule of rules) byTimes.set(rule.times, [...(byTimes.get(rule.times) ?? []), rule.days]);
  return [...byTimes].map(([times, runs]) => {
    const days = runs.map((run) => (run.length > 2 ? `${run[0]}-${run[run.length - 1]}` : run.join(","))).join(",");
    return `${days} ${times}`;
  }).join("; ");
}
