/** Vertical column width for rectangular arrangement cells. */
export const GRID_COL = 48;

/** Grid columns between numbered markers (01 → 02). */
export const MARKER_STEP_COLS = 4;

/** Half-marker stagger in grid columns. */
export const HALF_STEP_COLS = MARKER_STEP_COLS / 2;

/** Project clip length in grid columns (3½ markers). */
export const CLIP_SPAN_COLS = MARKER_STEP_COLS * 3.5;

/**
 * Clip placement on the 48px grid (canvas is fit-to-width, no H-scroll).
 * Column 0 = first cell (flush with ID rail). Marker 01 sits at column 1
 * (one empty column between the ID rail and 01).
 * Project tracks stagger starting at 01; each spans 3½ markers.
 * `width` is span in grid columns (intro uses full lane; width unused).
 */
export const clipRanges = [
  { slug: "intro", startCol: 0, width: CLIP_SPAN_COLS },
  { slug: "kiteview", startCol: 1, width: CLIP_SPAN_COLS },
  { slug: "holoura", startCol: 1 + HALF_STEP_COLS, width: CLIP_SPAN_COLS },
  {
    slug: "ai-music-transcription",
    startCol: 1 + MARKER_STEP_COLS,
    width: CLIP_SPAN_COLS,
  },
  {
    slug: "parkeye",
    startCol: 1 + MARKER_STEP_COLS + HALF_STEP_COLS,
    width: CLIP_SPAN_COLS,
  },
] as const;

export function clipRangeForSlug(slug: string) {
  return (
    clipRanges.find((range) => range.slug === slug) ?? {
      slug,
      startCol: 1,
      width: CLIP_SPAN_COLS,
    }
  );
}

/** Playhead progress (0–1) at the end of a clip within the track lane. */
export function clipEndToProgress(
  startCol: number,
  widthCols: number,
  laneWidthPx: number,
) {
  if (laneWidthPx <= 0) return 1;
  return Math.min(
    1,
    Math.max(0, ((startCol + widthCols) * GRID_COL) / laneWidthPx),
  );
}

/** Track-lane width for playhead math (excludes the ID rail). */
export function arrangementLaneWidthPx(): number {
  if (typeof document === "undefined") return 0;
  const timeline = document.getElementById("arrangement-timeline");
  if (timeline) return timeline.clientWidth;
  const canvas = document.getElementById("arrangement-canvas");
  if (!canvas) return 0;
  const rail =
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 768px)").matches
      ? 160
      : 0;
  return Math.max(0, canvas.clientWidth - rail);
}
