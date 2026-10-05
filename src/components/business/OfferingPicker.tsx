import { OFFERINGS, offeringLabel } from "./options";

/** Checkbox chips for everything a place offers; submits as repeated `activities`. */
export function OfferingPicker({ selected }: { selected: string[] }) {
  // Keep anything already set that isn't in the standard list (e.g. from discovery).
  const extra = selected.filter((slug) => !OFFERINGS.some(([value]) => value === slug));
  const options: Array<[string, string]> = [...OFFERINGS, ...extra.map((slug): [string, string] => [slug, offeringLabel(slug)])];
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {options.map(([value, label]) => (
        <label
          key={value}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm has-[:checked]:border-fg has-[:checked]:bg-fg has-[:checked]:text-bg has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-fg has-[:focus-visible]:ring-offset-2"
        >
          <input type="checkbox" name="activities" value={value} defaultChecked={selected.includes(value)} className="sr-only" />
          {label}
        </label>
      ))}
    </div>
  );
}
