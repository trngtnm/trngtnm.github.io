"use client";

import { useIntroReveal } from "@/components/intro/IntroRevealContext";
import { GRID_COL } from "@/data/clipRanges";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function IntroColumnSweep() {
  const { progress, phase, columnCount } = useIntroReveal();
  const [laneLeft, setLaneLeft] = useState(0);
  const [viewW, setViewW] = useState(1);

  useEffect(() => {
    const el = document.getElementById("intro-lane");
    const update = () => {
      setViewW(window.innerWidth || 1);
      if (el) setLaneLeft(el.getBoundingClientRect().left);
    };
    update();
    window.addEventListener("resize", update);
    const ro = el ? new ResizeObserver(update) : null;
    if (el && ro) ro.observe(el);
    return () => {
      window.removeEventListener("resize", update);
      ro?.disconnect();
    };
  }, []);

  const sweepX = progress * viewW;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-[1] flex transition-opacity duration-500",
        phase === "columns" ? "opacity-100" : "opacity-0",
      )}
      aria-hidden
    >
      {Array.from({ length: columnCount }, (_, index) => {
        const slatLeft = laneLeft + index * GRID_COL;
        const t = Math.min(1, Math.max(0, (sweepX - slatLeft) / GRID_COL));
        const flash = Math.sin(t * Math.PI);
        return (
          <div
            key={index}
            className="h-full shrink-0 border-l"
            style={{
              width: GRID_COL,
              opacity: t,
              borderLeftColor: `rgba(242, 242, 242, ${0.18 + flash * 0.45})`,
              backgroundColor: `rgba(242, 242, 242, ${flash * 0.1})`,
            }}
          />
        );
      })}
    </div>
  );
}
