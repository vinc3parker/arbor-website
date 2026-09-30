"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Marks its children as visible once they scroll into view, so CSS can play a
 * one-off entrance (see `.reveal` in globals.css). Content is fully visible
 * without JavaScript or with reduced motion.
 */
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} data-visible={visible || undefined}>
      {children}
    </div>
  );
}
