"use client";

import { useTransport } from "@/components/session/TransportContext";

type PlayheadProps = {
  /** Width of the track ID rail (0 when hidden). */
  railWidth: number;
};

/**
 * Line spans the full arrangement. The head sticks with the number line
 * so it does not unstick when scrolling into the project rows.
 */
export function Playhead({ railWidth }: PlayheadProps) {
  const { progress } = useTransport();

  return (
    <div className="pointer-events-none absolute inset-0 z-[45]" aria-hidden>
      <div
        className="absolute inset-y-0"
        style={{
          left: `calc(${railWidth}px + (100% - ${railWidth}px) * ${progress})`,
        }}
      >
        <div className="absolute inset-y-0 left-0 w-0.5 bg-playback shadow-[0_0_10px_var(--playback-glow)]" />

        <div className="sticky top-[var(--topbar-h)] h-5">
          <svg
            className="absolute top-0 left-0 -translate-x-[6px] drop-shadow-[0_0_6px_var(--playback-glow)]"
            width="14"
            height="10"
            viewBox="0 0 14 10"
            fill="var(--playback)"
          >
            <polygon points="0,0 14,0 7,10" />
          </svg>
        </div>

        <svg
          className="absolute bottom-0 left-0 -translate-x-[6px] drop-shadow-[0_0_6px_var(--playback-glow)]"
          width="14"
          height="10"
          viewBox="0 0 14 10"
          fill="var(--playback)"
        >
          <polygon points="7,0 14,10 0,10" />
        </svg>
      </div>
    </div>
  );
}
