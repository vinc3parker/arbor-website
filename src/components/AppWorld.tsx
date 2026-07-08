'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Wraps an app page so arriving feels like stepping THROUGH the portal into a
 * new, differently-coloured world:
 *
 *  - On mount, a full-screen wash in the app's accent colour fills the view and
 *    then recedes, continuing the portal transition from the observatory.
 *  - Esc, or a two-finger pinch-in, leaves — back to the observatory (which is
 *    already built and waiting). The visible back control lives at the top of
 *    the hero (see AppLanding), so it's part of the page, not a floating chip.
 */
export function AppWorld({
  accent,
  children,
}: {
  accent: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [arrived, setArrived] = useState(false);

  // Let the accent wash sit for a frame, then recede to reveal the world.
  useEffect(() => {
    const id = requestAnimationFrame(() => setArrived(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const exit = () => router.push('/?entered=1');

  // Esc → back to the observatory.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') exit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Pinch-in (two fingers drawing together) → also leaves, like zooming back
  // out of the world.
  useEffect(() => {
    let startDist = 0;
    const dist = (t: TouchList) =>
      Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

    const onStart = (e: TouchEvent) => {
      if (e.touches.length === 2) startDist = dist(e.touches);
    };
    const onMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && startDist > 0) {
        const d = dist(e.touches);
        if (d < startDist * 0.55) {
          startDist = 0;
          exit();
        }
      }
    };
    const onEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) startDist = 0;
    };

    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <>
      {children}

      {/* Arrival wash: the portal's colour, receding into the new world. */}
      <div
        aria-hidden
        style={{
          background: `radial-gradient(ellipse at center, #ffffff 0%, ${accent} 26%, ${accent} 100%)`,
          opacity: arrived ? 0 : 1,
          transform: arrived ? 'scale(1.18)' : 'scale(1)',
          transition:
            'opacity 900ms cubic-bezier(0.4, 0, 0.2, 1), transform 1100ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        className="pointer-events-none fixed inset-0 z-[70]"
      />
    </>
  );
}
