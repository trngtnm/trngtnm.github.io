"use client";

import { useIntroReveal } from "@/components/intro/IntroRevealContext";
import { useTransport } from "@/components/session/TransportContext";
import { animate } from "motion/react";
import { useEffect, useState } from "react";

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
  const { phase } = useIntroReveal();
  const sweeping = phase !== "columns";
  const [beamProgress, setBeamProgress] = useState(0);

  useEffect(() => {
    if (!sweeping) {
      setBeamProgress(0);
      return;
    }
    const controls = animate(0, 1, {
      duration: 3.2,
      ease: "easeOut",
      onUpdate: setBeamProgress,
      onComplete: () => setBeamProgress(1),
    });
    return () => controls.stop();
  }, [sweeping]);

  const tipOn = beamProgress > 0.02 && beamProgress < 0.98;
  const trailBehind = 0.16;

  return (
    <div className="pointer-events-none absolute inset-0 z-[45]" aria-hidden>
      <div
        className="absolute inset-y-0"
        style={{
          left: `calc(${railWidth}px + (100% - ${railWidth}px) * ${progress})`,
        }}
      >
        <div
          className="absolute inset-y-0 left-0 w-0.5 origin-top bg-playback"
          style={{ transform: `scaleY(${beamProgress})` }}
        />

        <div
          className="absolute left-1/2 w-4 -translate-x-1/2"
          style={{
            top: `${Math.max(0, beamProgress - trailBehind) * 100}%`,
            height: `${Math.min(beamProgress, trailBehind) * 100}%`,
            opacity: tipOn ? 1 : 0,
            background:
              "linear-gradient(to bottom, rgba(139, 207, 63, 0) 0%, rgba(184, 240, 106, 0.25) 45%, rgba(198, 255, 120, 0.85) 100%)",
            filter: "blur(5px)",
          }}
        />

        {Array.from({ length: 7 }, (_, index) => {
          const t = beamProgress - (index + 1) * 0.016;
          if (t <= 0 || !tipOn) return null;
          const fade = 1 - index / 7;
          return (
            <div
              key={index}
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                top: `${t * 100}%`,
                width: `${10 - index}px`,
                height: `${10 - index}px`,
                opacity: fade * 0.75,
                background: `radial-gradient(circle, rgba(198, 255, 120, ${fade}) 0%, rgba(139, 207, 63, 0) 70%)`,
                boxShadow: `0 0 ${6 + fade * 8}px ${2 + fade * 3}px rgba(139, 207, 63, ${fade * 0.7})`,
              }}
            />
          );
        })}

        <div
          className="absolute left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            top: `${beamProgress * 100}%`,
            opacity: tipOn ? 1 : 0,
            background:
              "radial-gradient(circle, rgba(198, 255, 120, 1) 0%, rgba(139, 207, 63, 0.85) 35%, rgba(139, 207, 63, 0) 70%)",
            boxShadow:
              "0 0 10px 4px rgba(139, 207, 63, 0.95), 0 0 22px 8px rgba(184, 240, 106, 0.7)",
          }}
        />

        <div
          className="sticky top-[var(--topbar-h)] h-5"
          style={{ opacity: sweeping ? 1 : 0 }}
        >
          <svg
            className="absolute top-0 left-0 -translate-x-[6px]"
            width="14"
            height="10"
            viewBox="0 0 14 10"
            fill="var(--playback)"
          >
            <polygon points="0,0 14,0 7,10" />
          </svg>
        </div>

        <svg
          className="absolute bottom-0 left-0 -translate-x-[6px]"
          width="14"
          height="10"
          viewBox="0 0 14 10"
          fill="var(--playback)"
          style={{ opacity: beamProgress >= 0.92 ? 1 : 0 }}
        >
          <polygon points="7,0 14,10 0,10" />
        </svg>
      </div>
    </div>
  );
}
