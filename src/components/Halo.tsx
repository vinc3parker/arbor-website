/**
 * The breathing halos (brand guide 6.1, 6.7): two soft rings around a centre —
 * one person, held by connected guidance. One per view, behind a key moment.
 * Breathes on a 3.8s sinusoidal cycle and holds still under reduced motion.
 */
export function Halo({
  colour,
  size = 560,
  className = "",
}: {
  colour: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className="halo-outer"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle, color-mix(in srgb, ${colour} 18%, transparent) 0%, color-mix(in srgb, ${colour} 9%, transparent) 50%, transparent 71%)`,
        }}
      />
      <div
        className="halo-inner"
        style={{
          width: size * 0.62,
          height: size * 0.62,
          background: `radial-gradient(circle, color-mix(in srgb, ${colour} 26%, transparent) 0%, color-mix(in srgb, ${colour} 13%, transparent) 55%, transparent 71%)`,
        }}
      />
    </div>
  );
}
