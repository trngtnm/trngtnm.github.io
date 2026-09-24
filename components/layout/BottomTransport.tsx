"use client";

import { profile } from "@/data/social";
import { cn } from "@/lib/utils";

type BottomTransportProps = {
  playingLabel: string;
};

const knobs = [
  { id: "gain", angle: -50 },
  { id: "pan", angle: 0 },
  { id: "fx", angle: 45 },
  { id: "mix", angle: 110 },
] as const;

export function BottomTransport({ playingLabel }: BottomTransportProps) {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-40 hidden h-[var(--bottombar-h)] items-center justify-between border-t border-border bg-bg-secondary px-6 lg:flex">
      <div className="flex items-center gap-2" aria-hidden>
        {knobs.map((knob) => (
          <Knob key={knob.id} angle={knob.angle} />
        ))}
      </div>
      <div className="flex items-center gap-8 font-mono text-[11px] tracking-wider uppercase">
        <span className="text-text-muted">SESSION_01</span>
        <span className="text-text-muted">BUILD {profile.buildYear}</span>
        <span className="inline-flex items-center gap-2 text-playback">
          <span className="size-1.5 rounded-full bg-playback shadow-[0_0_8px_var(--playback-glow)]" />
          FOCUS / {playingLabel}
        </span>
      </div>
    </footer>
  );
}

function Knob({ angle }: { angle: number }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={cn("size-5 text-text-muted")}
      aria-hidden
    >
      <circle
        cx="10"
        cy="10"
        r="8.5"
        fill="#1b1b1b"
        stroke="#383838"
        strokeWidth="1.2"
      />
      <circle
        cx="10"
        cy="10"
        r="5.5"
        fill="#202020"
        stroke="#2b2b2b"
        strokeWidth="0.8"
      />
      <line
        x1="10"
        y1="10"
        x2="10"
        y2="3.5"
        stroke="#a0a0a0"
        strokeWidth="1.2"
        strokeLinecap="round"
        transform={`rotate(${angle} 10 10)`}
      />
      <circle cx="10" cy="10" r="1.5" fill="#2b2b2b" />
    </svg>
  );
}
