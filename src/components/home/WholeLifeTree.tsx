import { APP_BRANDS, APP_ORDER } from "@/lib/brand";

// Canopy: eight nodes on an arc above the trunk (brand guide 6.9 — one trunk,
// eight branches; Arbor is the trunk, each part of life grows from it).
const W = 560;
const H = 520;
const TRUNK = { x: 280, base: 470, top: 330 };
const NODE = 52;

const nodes = APP_ORDER.map((id, i) => {
  const t = i / (APP_ORDER.length - 1); // 0..1 left → right
  const angle = Math.PI * (1.05 - 1.1 * t); // just past each side of a semicircle
  return {
    id,
    x: TRUNK.x + Math.cos(angle) * 225,
    y: 265 - Math.sin(angle) * 190,
    // Outer branches leave the trunk lower, inner ones higher, so they fan
    // out without crossing.
    from: TRUNK.top + Math.abs(t - 0.5) * 2 * 90,
  };
});

/**
 * "A guide for your whole life": the Arbor tree. Each app is a branch drawn
 * from the same trunk, over a single breathing Moss halo (6.1). Branches grow
 * in when the section is revealed (see `.tree-*` in globals.css).
 */
export function WholeLifeTree() {
  return (
    <div className="relative w-full">
      {/* The one halo in this view: Moss on Paper. Filled, soft-edged
          discs, so the breath reads as a swell of light, not two rings. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="halo-outer"
          style={{
            width: "82%",
            aspectRatio: "1",
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--color-moss) 38%, transparent) 0%, color-mix(in srgb, var(--color-moss) 26%, transparent) 55%, color-mix(in srgb, var(--color-moss) 10%, transparent) 66%, transparent 71%)",
          }}
        />
        <div
          className="halo-inner"
          style={{
            width: "52%",
            aspectRatio: "1",
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--color-moss) 48%, transparent) 0%, color-mix(in srgb, var(--color-moss) 34%, transparent) 58%, color-mix(in srgb, var(--color-moss) 14%, transparent) 67%, transparent 71%)",
          }}
        />
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="relative w-full"
        role="img"
        aria-label="The Arbor tree: one trunk with eight branches, one for each Arbor app — Aevo, Salus, Thrive, Nura, Wend, Kith, Telos and Sage"
      >
        <defs>
          {nodes.map((n) => (
            <clipPath key={n.id} id={`tree-icon-${n.id}`}>
              <rect x={n.x - NODE / 2} y={n.y - NODE / 2} width={NODE} height={NODE} rx={14} />
            </clipPath>
          ))}
        </defs>

        {/* Trunk */}
        <path
          className="tree-branch"
          d={`M${TRUNK.x} ${TRUNK.base} L${TRUNK.x} ${TRUNK.top - 10}`}
          pathLength={1}
          fill="none"
          stroke="var(--color-moss)"
          strokeWidth={10}
          strokeLinecap="round"
        />

        {/* Branches */}
        {nodes.map((n, i) => (
          <path
            key={n.id}
            className="tree-branch"
            style={{ transitionDelay: `${300 + i * 90}ms` }}
            d={`M${TRUNK.x} ${n.from} C${TRUNK.x} ${n.from - 60}, ${n.x} ${n.y + 90}, ${n.x} ${n.y}`}
            pathLength={1}
            fill="none"
            stroke="var(--color-moss)"
            strokeWidth={4}
            strokeLinecap="round"
          />
        ))}

        {/* Each branch ends in its app */}
        {nodes.map((n, i) => {
          const app = APP_BRANDS[n.id];
          return (
            <g
              key={n.id}
              className="tree-node"
              style={{ transitionDelay: `${900 + i * 90}ms` }}
            >
              <image
                href={app.icon}
                x={n.x - NODE / 2}
                y={n.y - NODE / 2}
                width={NODE}
                height={NODE}
                clipPath={`url(#tree-icon-${n.id})`}
              />
              <text
                x={n.x}
                y={n.y - NODE / 2 - 10}
                textAnchor="middle"
                fontSize={15}
                fontWeight={500}
                fill="var(--fg-2)"
              >
                {app.domain}
              </text>
            </g>
          );
        })}

        {/* Arbor at the root */}
        <image
          href="/brand/arbor_mark_full.png"
          x={TRUNK.x - 30}
          y={TRUNK.base + 6}
          width={60}
          height={44}
        />
      </svg>
    </div>
  );
}
