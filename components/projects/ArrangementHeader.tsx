"use client";

import { GRID_COL, MARKER_STEP_COLS } from "@/data/clipRanges";
import { useEffect, useState } from "react";

type ArrangementHeaderProps = {
  markers?: string[];
};

/**
 * FL Studio–style playlist ruler: bar numbers + short ticks, no grid.
 * One empty column after the ID rail, then 01, then every MARKER_STEP_COLS.
 */
export function ArrangementHeader({ markers }: ArrangementHeaderProps) {
  const [colCount, setColCount] = useState(32);

  useEffect(() => {
    const el = document.getElementById("arrangement-timeline");
    if (!el) return;

    const update = () => {
      setColCount(Math.max(2, Math.floor(el.clientWidth / GRID_COL)));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const markerCount = Math.max(
    1,
    Math.floor((colCount - 1) / MARKER_STEP_COLS) + 1,
  );
  const labels =
    markers ??
    Array.from({ length: markerCount }, (_, i) =>
      String(i + 1).padStart(2, "0"),
    );

  return (
    <div
      className="relative hidden h-full w-full md:block"
      aria-hidden
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, ${GRID_COL}px)`,
      }}
    >
      {Array.from({ length: colCount }, (_, col) => {
        const isBar = col >= 1 && (col - 1) % MARKER_STEP_COLS === 0;
        const barIndex = (col - 1) / MARKER_STEP_COLS;
        const label = isBar ? labels[barIndex] : null;
        return (
          <div key={col} className="relative h-full">
            <span
              className={
                isBar
                  ? "absolute bottom-0 left-0 h-2 w-px bg-text-secondary"
                  : "absolute bottom-0 left-0 h-1 w-px bg-text-muted"
              }
            />
            {label ? (
              <span className="absolute bottom-0.5 left-1 font-mono text-[10px] leading-none tracking-wide text-text-secondary">
                {label}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
