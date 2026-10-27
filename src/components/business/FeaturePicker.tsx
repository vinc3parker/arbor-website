import type { FeatureGroup } from "@/lib/arbor-business";

const CHIP = "inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm has-[:checked]:border-fg has-[:checked]:bg-fg has-[:checked]:text-bg has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-fg has-[:focus-visible]:ring-offset-2";

// The order owners see the groups in, and what each is called.
const KINDS: Array<[string, string]> = [
  ["price", "Price"],
  ["access", "Access and booking"],
  ["food", "Food"],
  ["drink", "Drink"],
  ["activity", "Things to do here"],
  ["amenity", "Amenities"],
  ["facility", "Facilities"],
  ["equipment", "Equipment"],
  ["space", "Spaces"],
  ["surface", "Surfaces"],
];

/**
 * Everything a place has, from a beer garden to a ski erg, submitted as repeated
 * `features`. Price is one choice (`price`). Features an owner adds that aren't
 * in the list (say, virtual clay shooting) go in `customFeatures`.
 */
export function FeaturePicker({ groups, selected }: { groups: FeatureGroup[]; selected: string[] }) {
  const known = new Set(groups.flatMap((group) => group.features.map((feature) => feature.slug)));
  const custom = selected.filter((slug) => !known.has(slug));
  const ordered = KINDS.map(([kind, label]) => ({ label, group: groups.find((group) => group.kind === kind) }))
    .filter((entry): entry is { label: string; group: FeatureGroup } => Boolean(entry.group));
  return (
    <div className="mt-3 grid gap-3">
      {ordered.map(({ label, group }) => {
        const chosen = group.features.filter((feature) => selected.includes(feature.slug)).length;
        const price = group.kind === "price";
        return (
          <details key={group.kind} open={chosen > 0 || price}>
            <summary className="cursor-pointer type-label text-fg-2">{label}{chosen && !price ? ` · ${chosen}` : ""}</summary>
            <div className="mt-2 flex flex-wrap gap-2">
              {price && (
                <label className={CHIP}>
                  <input type="radio" name="price" value="" defaultChecked={!chosen} className="sr-only" />
                  Not set
                </label>
              )}
              {group.features.map((feature) => (
                <label key={feature.slug} className={CHIP}>
                  <input
                    type={price ? "radio" : "checkbox"}
                    name={price ? "price" : "features"}
                    value={feature.slug}
                    defaultChecked={selected.includes(feature.slug)}
                    className="sr-only"
                  />
                  {feature.label}
                </label>
              ))}
            </div>
          </details>
        );
      })}
      <label className="grid gap-2">
        <span className="type-label text-fg-2">Anything else people can do or find here</span>
        <input
          name="customFeatures"
          className="ui-field"
          defaultValue={custom.map((slug) => slug.replaceAll("_", " ")).join(", ")}
          placeholder="e.g. virtual clay shooting, sled track, vinyl nights"
        />
        <span className="type-caption text-fg-2">Separate with commas.</span>
      </label>
    </div>
  );
}
