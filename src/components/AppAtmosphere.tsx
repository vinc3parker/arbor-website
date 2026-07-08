'use client';

import { useEffect, useRef } from 'react';

/**
 * The living atmosphere behind an app "world": slow-drifting auroras of the
 * app's accent colour, a scatter of faint rising motes (echoing the
 * observatory's starfield), and a soft vignette — so the whole page feels like
 * a single, alive, coloured space rather than a flat page. Fixed behind the
 * content; purely decorative and non-interactive.
 */
export function AppAtmosphere({ rgb }: { rgb: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const motes = Array.from({ length: 48 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.9,
      s: 0.05 + Math.random() * 0.16,
      o: 0.15 + Math.random() * 0.5,
      d: Math.random() * Math.PI * 2,
    }));

    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, w, h);
      ctx.shadowBlur = 8;
      for (const m of motes) {
        if (!reduce) {
          m.y -= (m.s / 100) * 1;
          m.d += 0.01;
          if (m.y < -0.02) {
            m.y = 1.02;
            m.x = Math.random();
          }
        }
        const px = (m.x + Math.sin(m.d) * 0.01) * w;
        const py = m.y * h;
        const col = `rgba(${rgb}, ${m.o})`;
        ctx.beginPath();
        ctx.arc(px, py, m.r, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.shadowColor = col;
        ctx.fill();
      }
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [rgb]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: '#05060a' }} />

      <div
        className="app-aurora absolute left-[-20%] top-[-12%] h-[75vh] w-[70vw] rounded-full blur-[130px]"
        style={{
          background: `radial-gradient(circle, rgba(${rgb},0.30), transparent 68%)`,
        }}
      />
      <div
        className="app-aurora-2 absolute right-[-18%] top-[18%] h-[65vh] w-[58vw] rounded-full blur-[130px]"
        style={{
          background: `radial-gradient(circle, rgba(${rgb},0.20), transparent 70%)`,
        }}
      />
      <div
        className="app-aurora-3 absolute bottom-[-18%] left-[8%] h-[65vh] w-[64vw] rounded-full blur-[140px]"
        style={{
          background: `radial-gradient(circle, rgba(${rgb},0.15), transparent 72%)`,
        }}
      />

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 28%, transparent 42%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </div>
  );
}
