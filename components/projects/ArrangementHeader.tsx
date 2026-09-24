"use client";

import { useIntroReveal } from "@/components/intro/IntroRevealContext";
import { GRID_COL, MARKER_STEP_COLS } from "@/data/clipRanges";
import { animate } from "motion/react";
import { useEffect, useState } from "react";

type ArrangementHeaderProps = {
  markers?: string[];
};

/**
 * FL Studio–style playlist ruler: bar numbers + short ticks, no grid.
 * One empty column after the ID rail, then 01, then every MARKER_STEP_COLS.
 */
export function ArrangementHeader({ markers }: ArrangementHeaderProps) {
  const { phase } = useIntroReveal();
  const [colCount, setColCount] = useState(32);
  const [tickProgress, setTickProgress] = useState(0);

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

  const sweeping = phase !== "columns";
  const glowWindow = 0.28;

  useEffect(() => {
    if (!sweeping) {
      setTickProgress(0);
      return;
    }
    const controls = animate(0, 1 + glowWindow, {
      duration: 1.4,
      ease: "linear",
      onUpdate: setTickProgress,
      onComplete: () => setTickProgress(1 + glowWindow),
    });
    return () => controls.stop();
  }, [sweeping]);

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
        const appearAt = colCount <= 1 ? 0 : col / (colCount - 1);
        const age = tickProgress - appearAt;
        const t = Math.min(1, Math.max(0, age / 0.04));
        const finished = tickProgress >= 1 + glowWindow - 0.001;
        const flash =
          !finished && age > 0 && age < glowWindow
            ? Math.sin((age / glowWindow) * Math.PI)
            : 0;
        return (
          <div key={col} className="relative h-full" style={{ opacity: t }}>
            <span
              className={
                isBar
                  ? "absolute bottom-0 left-0 h-2.5 w-0.5"
                  : "absolute bottom-0 left-0 h-1.5 w-px"
              }
              style={{
                backgroundColor:
                  flash > 0.05
                    ? `rgba(184, 240, 106, ${0.7 + flash * 0.3})`
                    : isBar
                      ? "rgba(160, 160, 160, 0.85)"
                      : "rgba(102, 102, 102, 0.8)",
                boxShadow:
                  flash > 0.05
                    ? `0 0 8px 3px rgba(139, 207, 63, ${flash}), 0 0 16px 6px rgba(184, 240, 106, ${flash * 0.7})`
                    : undefined,
              }}
            />
            {label ? (
              <span
                className="absolute bottom-0.5 left-1 font-mono text-[10px] leading-none tracking-wide"
                style={{
                  color:
                    flash > 0.05
                      ? `rgba(198, 255, 120, ${0.85 + flash * 0.15})`
                      : "rgba(160, 160, 160, 1)",
                  textShadow:
                    flash > 0.05
                      ? `0 0 8px rgba(139, 207, 63, 1), 0 0 16px rgba(184, 240, 106, ${flash}), 0 0 24px rgba(184, 240, 106, ${flash * 0.8})`
                      : undefined,
                }}
              >
                {label}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
