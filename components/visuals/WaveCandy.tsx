"use client";

import { useTransport } from "@/components/session/TransportContext";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

type WaveCandyProps = {
  className?: string;
};

const SCOPE_POINTS = 720;

const TRACES = [
  { color: "#8bcf3f", glow: 0.18, width: 1.25, voice: 0 as const },
  { color: "#6aa82e", glow: 0.14, width: 1.1, voice: 1 as const },
];

/** Decorative FL Studio Wave Candy–style oscilloscope (no real audio). */
export function WaveCandy({ className }: WaveCandyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isPlaying } = useTransport();
  const playingRef = useRef(isPlaying);
  playingRef.current = isPlaying;

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

      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.stroke();

      ctx.lineJoin = "miter";
      ctx.miterLimit = 3;
      ctx.lineCap = "butt";

      for (const trace of TRACES) {
        ctx.beginPath();
        for (let i = 0; i < SCOPE_POINTS; i++) {
          const xNorm = i / (SCOPE_POINTS - 1);
          const x = xNorm * width;
          const y = midY - sample(t, xNorm, trace.voice) * ampPx;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = trace.color;
        ctx.globalAlpha = trace.glow;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.globalAlpha = 0.9;
        ctx.lineWidth = trace.width;
        ctx.stroke();
        ctx.globalAlpha = 1;
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
