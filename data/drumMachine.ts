export const BARS = 4;
export const STEPS_PER_BAR = 16;
export const TOTAL_STEPS = BARS * STEPS_PER_BAR;
export const DEFAULT_BPM = 120;
export const MIN_BPM = 60;
export const MAX_BPM = 180;
export const BPM_STEP = 5;

export type DrumVoiceId =
  | "kick"
  | "tomHi"
  | "tomMid"
  | "tomLow"
  | "closedHat"
  | "openHat"
  | "snare"
  | "ride"
  | "crash1"
  | "crash2"
  | "clap"
  | "rimshot";

export type DrumVoice = {
  id: DrumVoiceId;
  name: string;
  color: string;
};

export const drumVoices: DrumVoice[] = [
  { id: "kick", name: "Kick", color: "#8bcf3f" },
  { id: "tomHi", name: "Tom Hi", color: "#ff8a00" },
  { id: "tomMid", name: "Tom Mid", color: "#5aa9e6" },
  { id: "tomLow", name: "Tom Low", color: "#c47cff" },
  { id: "closedHat", name: "CHH", color: "#e6c15a" },
  { id: "openHat", name: "OHH", color: "#e25b5b" },
  { id: "snare", name: "Snare", color: "#8bcf3f" },
  { id: "ride", name: "Ride", color: "#ff8a00" },
  { id: "crash1", name: "Crash 1", color: "#5aa9e6" },
  { id: "crash2", name: "Crash 2", color: "#c47cff" },
  { id: "clap", name: "Clap", color: "#e6c15a" },
  { id: "rimshot", name: "Rimshot", color: "#e25b5b" },
];

export type DrumPattern = Record<DrumVoiceId, boolean[]>;

export function emptyPattern(): DrumPattern {
  return Object.fromEntries(
    drumVoices.map((voice) => [
      voice.id,
      Array.from({ length: TOTAL_STEPS }, () => false),
    ]),
  ) as DrumPattern;
}

function rowFromSteps(indices: number[]): boolean[] {
  const row = Array.from({ length: TOTAL_STEPS }, () => false);
  for (const index of indices) {
    if (index >= 0 && index < TOTAL_STEPS) row[index] = true;
  }
  return row;
}

function acrossBars(offsets: number[], bars?: number[]): number[] {
  const use = bars ?? Array.from({ length: BARS }, (_, i) => i);
  return use.flatMap((bar) =>
    offsets.map((offset) => bar * STEPS_PER_BAR + offset),
  );
}

function barSteps(bar: number, offsets: number[]): number[] {
  return offsets.map((offset) => bar * STEPS_PER_BAR + offset);
}

function fromRows(rows: Partial<Record<DrumVoiceId, number[]>>): DrumPattern {
  const next = emptyPattern();
  for (const voice of drumVoices) {
    const steps = rows[voice.id];
    if (steps) next[voice.id] = rowFromSteps(steps);
  }
  return next;
}

export type DrumPresetId = "trap" | "bossa" | "rnb" | "drill" | "funk";

export type DrumPreset = {
  id: DrumPresetId;
  name: string;
  bpm: number;
  pattern: DrumPattern;
};

const trapHats = [
  ...barSteps(0, [0, 2, 3, 4, 6, 8, 10, 11, 12]),
  ...barSteps(1, [0, 2, 4, 7, 8, 10, 12, 13, 14, 15]),
  ...barSteps(2, [0, 2, 3, 4, 6, 8, 10, 11, 12]),
  ...barSteps(3, [0, 1, 2, 3, 4, 5, 6, 7, 8, 10]),
];
const trapOpens = [...barSteps(0, [14]), ...barSteps(1, [6]), ...barSteps(2, [14])];
const trapOpenSet = new Set(trapOpens);

const funkOpens = acrossBars([6]);
const funkOpenSet = new Set(funkOpens);

export const drumPresets: DrumPreset[] = [
  {
    id: "trap",
    name: "Trap",
    bpm: 120,
    pattern: fromRows({
      kick: [
        ...barSteps(0, [0, 10]),
        ...barSteps(1, [0, 6, 10]),
        ...barSteps(2, [0, 10]),
        ...barSteps(3, [0, 6, 8, 10]),
      ],
      tomHi: barSteps(3, [12, 13]),
      tomMid: barSteps(3, [14]),
      tomLow: barSteps(3, [15]),
      closedHat: trapHats.filter((step) => !trapOpenSet.has(step)),
      openHat: trapOpens,
      snare: acrossBars([4, 12]),
      ride: barSteps(2, [0, 4, 8, 12]),
      crash1: [0],
      crash2: [32],
      clap: acrossBars([4, 12]),
      rimshot: [
        ...barSteps(0, [6]),
        ...barSteps(1, [2, 14]),
        ...barSteps(2, [6]),
        ...barSteps(3, [2]),
      ],
    }),
  },
  {
    id: "bossa",
    name: "Bossa Nova",
    bpm: 128,
    pattern: fromRows({
      kick: [
        ...acrossBars([0, 7, 8]),
        ...barSteps(3, [10]),
      ],
      rimshot: acrossBars([3, 6, 10, 14]),
      ride: acrossBars([0, 2, 4, 6, 8, 10, 12, 14]),
      closedHat: acrossBars([4, 12]),
      openHat: acrossBars([14], [1, 3]),
      crash1: [0],
      tomLow: barSteps(3, [15]),
    }),
  },
  {
    id: "rnb",
    name: "RnB",
    bpm: 88,
    pattern: fromRows({
      kick: [
        ...barSteps(0, [0, 10]),
        ...barSteps(1, [0, 6, 10]),
        ...barSteps(2, [0, 8, 11]),
        ...barSteps(3, [0, 6, 10]),
      ],
      snare: acrossBars([4, 12]),
      clap: acrossBars([12]),
      rimshot: [
        ...barSteps(0, [2, 6, 14]),
        ...barSteps(1, [6, 11]),
        ...barSteps(2, [2, 14]),
        ...barSteps(3, [6, 11, 14]),
      ],
      closedHat: [
        ...acrossBars([0, 2, 4, 8, 10, 12]),
        ...barSteps(1, [3, 7, 11]),
        ...barSteps(3, [3, 7, 11, 13]),
      ],
      openHat: [...acrossBars([6]), ...barSteps(2, [14])],
      crash1: [0],
      tomMid: barSteps(3, [14]),
      tomLow: barSteps(3, [15]),
    }),
  },
  {
    id: "drill",
    name: "Drill",
    bpm: 142,
    pattern: fromRows({
      kick: [
        ...barSteps(0, [0, 6, 10]),
        ...barSteps(1, [0, 3, 10, 14]),
        ...barSteps(2, [0, 6, 11]),
        ...barSteps(3, [0, 6, 10, 13]),
      ],
      snare: acrossBars([8]),
      clap: acrossBars([8]),
      rimshot: [
        ...barSteps(0, [14]),
        ...barSteps(1, [6]),
        ...barSteps(2, [14]),
        ...barSteps(3, [4, 12]),
      ],
      closedHat: [
        ...barSteps(0, [0, 2, 4, 6, 7, 8, 10, 12, 14]),
        ...barSteps(1, [0, 2, 3, 4, 6, 8, 10, 11, 12, 13, 14, 15]),
        ...barSteps(2, [0, 2, 4, 6, 8, 10, 12, 14, 15]),
        ...barSteps(3, [0, 1, 2, 3, 4, 6, 8, 9, 10, 11]),
      ],
      openHat: [...barSteps(0, [14]), ...barSteps(2, [6]), ...barSteps(3, [12])],
      crash1: [0],
      crash2: [32],
      tomHi: barSteps(3, [12, 13]),
      tomMid: barSteps(3, [14]),
      tomLow: barSteps(3, [15]),
    }),
  },
  {
    id: "funk",
    name: "Funk",
    bpm: 110,
    pattern: fromRows({
      kick: [
        ...barSteps(0, [0, 6, 10]),
        ...barSteps(1, [0, 3, 7, 10]),
        ...barSteps(2, [0, 6, 8, 10]),
        ...barSteps(3, [0, 6, 10, 11]),
      ],
      snare: acrossBars([4, 12]),
      rimshot: [
        ...barSteps(0, [2, 7, 11, 14]),
        ...barSteps(1, [2, 11, 14]),
        ...barSteps(2, [2, 7, 14]),
        ...barSteps(3, [2, 7, 11]),
      ],
      closedHat: acrossBars([
        0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15,
      ]).filter((step) => !funkOpenSet.has(step)),
      openHat: funkOpens,
      clap: barSteps(3, [12]),
      crash1: [0],
      tomHi: barSteps(3, [13]),
      tomMid: barSteps(3, [14]),
      tomLow: barSteps(3, [15]),
    }),
  },
];

const LAST_PRESET_KEY = "drum-preset-id";

export function pickDrumPreset(): DrumPreset {
  const last =
    typeof window !== "undefined"
      ? window.sessionStorage.getItem(LAST_PRESET_KEY)
      : null;
  const pool = last
    ? drumPresets.filter((preset) => preset.id !== last)
    : drumPresets;
  const chosen = pool[Math.floor(Math.random() * pool.length)] ?? drumPresets[0];
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(LAST_PRESET_KEY, chosen.id);
  }
  return chosen;
}

export const defaultPattern = drumPresets[0]!.pattern;
