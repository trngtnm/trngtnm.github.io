/** Vertical column width for rectangular arrangement cells. */
export const GRID_COL = 48;

/** Grid columns between numbered markers (01 → 02). */
export const MARKER_STEP_COLS = 4;

/** Half-marker stagger in grid columns. */
export const HALF_STEP_COLS = MARKER_STEP_COLS / 2;

/** Project clip length in grid columns (3½ markers + 1). */
export const CLIP_SPAN_COLS = MARKER_STEP_COLS * 3.5 + 1;

/** Empty columns between the ID rail / right edge and the first / last clip. */
export const PROJECT_EDGE_COLS = 2;

export const PROJECT_SLUGS = [
  "kiteview",
  "holoura",
  "ai-music-transcription",
  "parkeye",
] as const;

export function staggeredProjectRange(
  index: number,
  count: number,
  laneWidthPx: number,
) {
  const totalCols = Math.max(
    PROJECT_EDGE_COLS * 2 + 1,
    Math.floor(laneWidthPx / GRID_COL),
  );
  const width = Math.min(
    CLIP_SPAN_COLS,
    Math.max(1, totalCols - PROJECT_EDGE_COLS * 2),
  );
  const firstStart = PROJECT_EDGE_COLS;
  const lastStart = Math.max(firstStart, totalCols - PROJECT_EDGE_COLS - width);
  const step = count > 1 ? (lastStart - firstStart) / (count - 1) : 0;
  const startCol =
    count <= 1 || index >= count - 1
      ? lastStart
      : Math.round(firstStart + index * step);

  return { startCol, width };
}

export function clipRangeForSlug(slug: string, laneWidthPx?: number) {
  const index = PROJECT_SLUGS.indexOf(
    slug as (typeof PROJECT_SLUGS)[number],
  );
  if (index >= 0) {
    const lane = laneWidthPx ?? arrangementLaneWidthPx();
    return {
      slug,
      ...staggeredProjectRange(index, PROJECT_SLUGS.length, lane),
    };
  }
  return { slug, startCol: 0, width: CLIP_SPAN_COLS };
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
