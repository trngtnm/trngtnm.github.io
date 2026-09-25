"use client";

import { useDrumMachine } from "@/components/drum-machine/DrumMachineContext";
import {
  BARS,
  BPM_STEP,
  STEPS_PER_BAR,
  TOTAL_STEPS,
  drumVoices,
} from "@/data/drumMachine";
import { cn } from "@/lib/utils";

export function DrumMachine() {
  const {
    isPlaying,
    step,
    bpm,
    pattern,
    play,
    stop,
    toggleStep,
    setBpm,
  } = useDrumMachine();

  return (
    <div className="relative min-w-0">
      <p className="absolute right-0 -top-5 font-mono text-[10px] tracking-[0.2em] text-text-muted uppercase">
        drum_machine
      </p>
      <div
        className="flex flex-col border border-border bg-bg-panel"
        aria-label="Drum machine"
      >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-3 py-2.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] tracking-[0.18em] text-text-secondary uppercase">
          <span className="text-text-primary">Drum</span>
          <span>{BARS} Bars</span>
          <span>4-4</span>
          <span className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Decrease tempo"
              onClick={() => setBpm(bpm - BPM_STEP)}
              className="flex size-7 items-center justify-center border border-border text-text-primary transition-colors hover:border-border-strong hover:bg-white/[0.03]"
            >
              −
            </button>
            <span className="min-w-10 text-center text-text-primary">
              {bpm}
            </span>
            <button
              type="button"
              aria-label="Increase tempo"
              onClick={() => setBpm(bpm + BPM_STEP)}
              className="flex size-7 items-center justify-center border border-border text-text-primary transition-colors hover:border-border-strong hover:bg-white/[0.03]"
            >
              +
            </button>
          </span>
        </div>
        <div className="flex items-center gap-1" role="group" aria-label="Transport">
          <button
            type="button"
            aria-label="Play"
            aria-pressed={isPlaying}
            onClick={play}
            className={cn(
              "flex size-8 items-center justify-center font-mono text-sm transition-colors",
              isPlaying
                ? "text-playback shadow-[0_0_8px_var(--playback-glow)]"
                : "text-text-secondary hover:text-text-primary",
            )}
          >
            ▶
          </button>
          <button
            type="button"
            aria-label="Stop"
            onClick={stop}
            className="flex size-8 items-center justify-center font-mono text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            ■
          </button>
        </div>
      </div>

      <div className="daw-scroll overflow-x-auto">
        <div
          className="min-w-max"
          style={{
            display: "grid",
            gridTemplateColumns: `4.5rem repeat(${TOTAL_STEPS}, minmax(0.7rem, 1fr))`,
          }}
        >
          <div className="sticky left-0 z-10 border-b border-r border-border bg-bg-panel" />
          {Array.from({ length: TOTAL_STEPS }, (_, index) => {
            const inBar = index % STEPS_PER_BAR;
            return (
              <div
                key={`tick-${index}`}
                className={cn(
                  "border-b border-border py-1 text-center font-mono text-[8px] leading-none text-text-muted",
                  inBar === 0 && "border-l border-l-border-strong text-text-secondary",
                  inBar !== 0 && inBar % 4 === 0 && "border-l border-l-border",
                  inBar % 4 !== 0 && "border-l border-l-white/[0.06]",
                  isPlaying && index === step && "text-playback",
                )}
              >
                {inBar === 0 ? String(Math.floor(index / STEPS_PER_BAR) + 1) : ""}
              </div>
            );
          })}

          {drumVoices.map((voice) => (
            <DrumRow
              key={voice.id}
              name={voice.name}
              color={voice.color}
              cells={pattern[voice.id]}
              playhead={isPlaying ? step : -1}
              onToggle={(index) => toggleStep(voice.id, index)}
            />
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}

function DrumRow({
  name,
  color,
  cells,
  playhead,
  onToggle,
}: {
  name: string;
  color: string;
  cells: boolean[];
  playhead: number;
  onToggle: (index: number) => void;
}) {
  return (
    <>
      <div className="sticky left-0 z-10 flex h-full min-h-11 items-center gap-2 border-r border-b border-border bg-bg-panel px-1.5">
        <span
          className="h-4 w-0.5 shrink-0 self-stretch"
          style={{ backgroundColor: color }}
          aria-hidden
        />
        <span className="truncate font-mono text-[10px] tracking-[0.14em] text-text-primary uppercase">
          {name}
        </span>
      </div>
      {cells.map((on, index) => {
        const inBar = index % STEPS_PER_BAR;
        const offBeat = Math.floor(inBar / 4) % 2 === 1;
        const current = index === playhead;
        return (
          <button
            key={index}
            type="button"
            aria-label={`${name} step ${index + 1}`}
            aria-pressed={on}
            onClick={() => onToggle(index)}
            className={cn(
              "min-h-11 min-w-[0.7rem] border-b border-border transition-colors",
              inBar === 0 && "border-l border-l-border-strong",
              inBar !== 0 && inBar % 4 === 0 && "border-l border-l-border",
              inBar % 4 !== 0 && "border-l border-l-white/[0.06]",
              on
                ? "border-black/20"
                : offBeat
                  ? "bg-bg-secondary hover:bg-bg-elevated"
                  : "bg-bg-elevated hover:bg-white/[0.04]",
              current && !on && "bg-playback/25",
            )}
            style={
              on
                ? {
                    backgroundColor: color,
                    boxShadow: current
                      ? "0 0 8px var(--playback-glow)"
                      : undefined,
                  }
                : current
                  ? { boxShadow: "inset 0 0 0 1px var(--playback)" }
                  : undefined
            }
          />
        );
      })}
    </>
  );
}
