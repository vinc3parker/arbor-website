import type { PlaceTypeGroup } from "@/lib/arbor-business";

const CHIP = "inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm has-[:checked]:border-fg has-[:checked]:bg-fg has-[:checked]:text-bg has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-fg has-[:focus-visible]:ring-offset-2";

/**
 * What kind of place this is (pub, gym, pottery studio…), submitted as repeated
 * `tags`. Tags not offered here (descriptors, chain markers) are kept as they are.
 */
export function PlaceTypePicker({ groups, selected }: { groups: PlaceTypeGroup[]; selected: string[] }) {
  const offered = new Set(groups.flatMap((group) => group.types.map((type) => type.slug)));
  const kept = selected.filter((tag) => !offered.has(tag));
  return (
    <div className="mt-3 grid gap-3">
      {kept.map((tag) => <input key={tag} type="hidden" name="tags" value={tag} />)}
      {groups.map((group) => {
        const chosen = group.types.filter((type) => selected.includes(type.slug)).length;
        return (
          <details key={group.label} open={chosen > 0} className="group">
            <summary className="cursor-pointer type-label text-fg-2">
              {group.label}{chosen ? ` · ${chosen} chosen` : ""}
            </summary>
            <div className="mt-2 flex flex-wrap gap-2">
              {group.types.map((type) => (
                <label key={type.slug} className={CHIP}>
                  <input type="checkbox" name="tags" value={type.slug} defaultChecked={selected.includes(type.slug)} className="sr-only" />
                  {type.label}
                </label>
              ))}
            </div>
          </details>
        );
      })}
    </div>
  );
}
