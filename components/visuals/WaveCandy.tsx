"use client";

import { useTransport } from "@/components/session/TransportContext";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

type WaveCandyProps = {
  className?: string;
  /** 0–1 clip from the left. Defaults to fully drawn. */
  revealProgress?: number;
  /** Brighter traces during the intro draw-in. */
  vivid?: boolean;
};

const SCOPE_POINTS = 720;

const TRACES = [
  { color: "#8bcf3f", glow: 0.18, width: 1.25, voice: 0 as const },
  { color: "#6aa82e", glow: 0.14, width: 1.1, voice: 1 as const },
];

/** Decorative FL Studio Wave Candy–style oscilloscope (no real audio). */
export function WaveCandy({
  className,
  revealProgress = 1,
  vivid = false,
}: WaveCandyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isPlaying } = useTransport();
  const playingRef = useRef(isPlaying);
  playingRef.current = isPlaying;
  const revealRef = useRef(revealProgress);
  revealRef.current = revealProgress;
  const vividRef = useRef(vivid);
  vividRef.current = vivid;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    let disposed = false;
    let width = 0;
    let height = 0;
    let dpr = 1;
    const t0 = performance.now();

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const hash = (n: number) => {
      const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
      return s - Math.floor(s);
    };

    const sample = (t: number, x: number, voice: 0 | 1) => {
      const amp = playingRef.current ? 1.25 : 1;
      const beatRate = voice === 0 ? 1.45 : 1.85;
      const beat =
        0.5 + 0.5 * Math.abs(Math.sin(t * Math.PI * beatRate + voice * 1.1));

      const rate = voice === 0 ? 6 : 7.5;
      const seed = Math.floor(t * rate);
      const next = seed + 1;
      const blend = (t * rate) % 1;
      const cell = Math.floor(x * 48 + voice * 7);
      const noise =
        hash(cell * 19.13 + seed * 3.7 + voice) * (1 - blend) +
        hash(cell * 19.13 + next * 3.7 + voice) * blend;
      const spike = hash(cell * 8.2 + seed * 5.1 + voice * 2) > 0.82 ? 0.7 : 0;

      const p1 = x * (voice === 0 ? 38 : 52);
      const sine = Math.sin(p1);
      const saw = ((p1 / Math.PI) % 2) - 1;
      const square = sine >= 0 ? 1 : -1;
      const folded = Math.abs(((p1 / Math.PI) % 4) - 2) - 1;
      const mix =
        voice === 0
          ? { sine: 0.12, saw: 0.38, square: 0.42, folded: 0.18 }
          : { sine: 0.08, saw: 0.28, square: 0.5, folded: 0.26 };

      const raw =
        sine * mix.sine +
        saw * mix.saw +
        square * mix.square +
        folded * mix.folded +
        (noise * 2 - 1) * 0.55 +
        spike * (hash(cell + seed) > 0.5 ? 1 : -1);

      const rigid = Math.max(-1, Math.min(1, raw * 1.35));
      const stepped = Math.round(rigid * 7) / 7;

      return stepped * amp * beat * (0.75 + noise * 0.45);
    };

    const draw = (now: number) => {
      if (disposed) return;
      const t = (now - t0) / 1000;

      if (width < 2 || height < 2) {
        if (!reduceMotion) raf = requestAnimationFrame(draw);
        return;
      }

      const midY = height * 0.5;
      const ampPx = height * 0.42;

      ctx.clearRect(0, 0, width, height);

      const reveal = Math.min(1, Math.max(0, revealRef.current));
      const revealX = reveal * width;

      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(revealX, midY);
      ctx.stroke();

      ctx.lineJoin = "miter";
      ctx.miterLimit = 3;
      ctx.lineCap = "butt";

      for (const trace of TRACES) {
        ctx.beginPath();
        let started = false;
        for (let i = 0; i < SCOPE_POINTS; i++) {
          const xNorm = i / (SCOPE_POINTS - 1);
          if (xNorm > reveal) break;
          const x = xNorm * width;
          const y = midY - sample(t, xNorm, trace.voice) * ampPx;
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else ctx.lineTo(x, y);
        }
        if (!started) continue;
        const glow = vividRef.current ? 0.55 : trace.glow;
        const core = vividRef.current ? 1 : 0.9;
        ctx.strokeStyle = vividRef.current ? "#b8f06a" : trace.color;
        ctx.globalAlpha = glow;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.globalAlpha = core;
        ctx.lineWidth = trace.width;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      const drawing = reveal > 0.02 && reveal < 0.995;
      if (drawing) {
        const trailBehind = 0.16;
        for (const trace of TRACES) {
          const tipX = reveal * width;
          const tipY = midY - sample(t, reveal, trace.voice) * ampPx;

          ctx.save();
          ctx.beginPath();
          let started = false;
          const trailStart = Math.max(0, reveal - trailBehind);
          const startIndex = Math.floor(trailStart * (SCOPE_POINTS - 1));
          const endIndex = Math.floor(reveal * (SCOPE_POINTS - 1));
          for (let i = startIndex; i <= endIndex; i++) {
            const xNorm = i / (SCOPE_POINTS - 1);
            const x = xNorm * width;
            const y = midY - sample(t, xNorm, trace.voice) * ampPx;
            if (!started) {
              ctx.moveTo(x, y);
              started = true;
            } else ctx.lineTo(x, y);
          }
          if (started) {
            const trail = ctx.createLinearGradient(
              trailStart * width,
              tipY,
              tipX,
              tipY,
            );
            trail.addColorStop(0, "rgba(139, 207, 63, 0)");
            trail.addColorStop(0.45, "rgba(184, 240, 106, 0.25)");
            trail.addColorStop(1, "rgba(198, 255, 120, 0.85)");
            ctx.strokeStyle = trail;
            ctx.lineWidth = 4;
            ctx.shadowColor = "rgba(139, 207, 63, 0.75)";
            ctx.shadowBlur = 10;
            ctx.stroke();
          }
          ctx.restore();

          for (let index = 0; index < 7; index++) {
            const tn = reveal - (index + 1) * 0.016;
            if (tn <= 0) continue;
            const fade = 1 - index / 7;
            const ox = tn * width;
            const oy = midY - sample(t, tn, trace.voice) * ampPx;
            const radius = (10 - index) / 2;
            const orb = ctx.createRadialGradient(ox, oy, 0, ox, oy, radius * 2);
            orb.addColorStop(0, `rgba(198, 255, 120, ${fade})`);
            orb.addColorStop(0.7, "rgba(139, 207, 63, 0)");
            ctx.fillStyle = orb;
            ctx.beginPath();
            ctx.arc(ox, oy, radius * 2, 0, Math.PI * 2);
            ctx.fill();
          }

          const tip = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 14);
          tip.addColorStop(0, "rgba(198, 255, 120, 1)");
          tip.addColorStop(0.35, "rgba(139, 207, 63, 0.85)");
          tip.addColorStop(0.7, "rgba(139, 207, 63, 0)");
          ctx.fillStyle = tip;
          ctx.beginPath();
          ctx.arc(tipX, tipY, 14, 0, Math.PI * 2);
          ctx.fill();

          ctx.save();
          ctx.shadowColor = "rgba(139, 207, 63, 0.95)";
          ctx.shadowBlur = 18;
          ctx.fillStyle = "rgba(198, 255, 120, 0.95)";
          ctx.beginPath();
          ctx.arc(tipX, tipY, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };

    resize();
    draw(performance.now());

    const ro = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw(performance.now());
    });
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("block h-full w-full", className)}
      aria-hidden
    />
  );
}
