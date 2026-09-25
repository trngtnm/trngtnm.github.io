"use client";

import { useIntroReveal } from "@/components/intro/IntroRevealContext";
import { Tag } from "@/components/ui/Tag";
import { WaveCandy } from "@/components/visuals/WaveCandy";
import { GRID_COL, MARKER_STEP_COLS } from "@/data/clipRanges";
import { profile, social } from "@/data/social";
import { Circle } from "lucide-react";
import { animate, motion } from "motion/react";
import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from "react";

const INTRO_LABEL = "#d0d0d0";
/** Marker 01 is col 1; 1¼ = one quarter-step past 01. */
const CONTENT_START_COL = 1 + MARKER_STEP_COLS / 4;

export const IntroClip = forwardRef<HTMLElement>(function IntroClip(_, ref) {
  const { phase, progress } = useIntroReveal();
  const contentReady = phase !== "columns";

  return (
    <article
      ref={ref}
      id="intro"
      className="scroll-mt-[calc(var(--topbar-h)+1.25rem)] w-full"
    >
      <div
        className={`relative z-10 w-full bg-bg-primary ${
          contentReady ? "border" : "border-transparent"
        }`}
        style={
          {
            borderColor: contentReady ? "var(--border)" : "transparent",
          } as CSSProperties
        }
      >
        <div
          className={`pointer-events-none absolute top-1/2 left-0 z-[15] h-1/3 w-screen -translate-y-1/2 transition-opacity duration-500 md:-left-[160px] md:h-1/2 lg:left-[calc(-1*(var(--sidebar-w)+160px))] ${
            contentReady ? "opacity-10 md:opacity-20" : "opacity-80"
          }`}
          aria-hidden
        >
          <WaveCandy
            className="h-full w-full"
            revealProgress={progress}
            vivid={!contentReady}
          />
        </div>

        <motion.div
          className="relative z-10 flex min-h-[calc(100svh-var(--topbar-h)-var(--mobilenav-h)-env(safe-area-inset-bottom,0px))] w-full flex-col justify-center gap-3 py-10 pl-4 pr-5 text-left md:min-h-[calc(100svh-var(--topbar-h)-1.25rem)] md:pl-[var(--clip-start)] md:pr-8"
          style={
            {
              "--clip-start": `${CONTENT_START_COL * GRID_COL}px`,
            } as CSSProperties
          }
          initial={{ opacity: 0, x: -16 }}
          animate={
            contentReady ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }
          }
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="flex size-4 items-center justify-center"
              style={{ color: INTRO_LABEL }}
              aria-hidden
            >
              <Circle className="size-2.5" />
            </span>
            <h1
              className="font-mono text-sm tracking-wider uppercase"
              style={{ color: INTRO_LABEL }}
            >
              Intro
            </h1>
            <Tag>SESSION</Tag>
          </div>

          <GlowName text={profile.name.toUpperCase()} active={contentReady} />
          <p className="font-mono text-sm tracking-[0.18em] text-accent uppercase">
            {profile.title}
          </p>
          <p className="font-mono text-xs tracking-[0.16em] text-text-secondary uppercase">
            Computer Science
          </p>
          <p className="mt-2 max-w-xl text-base leading-relaxed text-text-primary/85 sm:text-lg">
            Building software across mobile, AI/ML, backend systems, and
            data-driven applications.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="#projects"
              onClick={(event) => {
                event.preventDefault();
                document
                  .getElementById("projects")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-transparent bg-accent px-4 py-2 font-mono text-xs tracking-wider text-bg-primary uppercase transition-colors duration-150 hover:bg-accent-hover"
            >
              View Projects
            </a>
            <a
              href={social.find((s) => s.id === "github")?.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-border bg-transparent px-4 py-2 font-mono text-xs tracking-wider text-text-primary uppercase transition-colors duration-150 hover:border-border-strong hover:bg-white/[0.03]"
            >
              GitHub
            </a>
          </div>

          <dl className="mt-8 grid max-w-3xl grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-4">
            {[
              { label: "LOCATION", value: profile.location },
              { label: "FOCUS", value: profile.focus },
              { label: "SPECIALTY", value: profile.specialty },
              { label: "STATUS", value: profile.status },
            ].map((item) => (
              <div key={item.label}>
                <dt className="font-mono text-[10px] tracking-[0.2em] text-text-secondary uppercase">
                  {item.label}
                </dt>
                <dd className="mt-1 font-mono text-xs tracking-wide text-text-primary uppercase">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </article>
  );
});

const DRAW_BASE = 0.5;
const DRAW_STEP = 0.12;
const GLOW_S = 0.25;
const TRAIL_BEHIND = 0.16;

const LETTERS: Record<
  string,
  { viewBox: string; d: string; widthEm: number }
> = {
  T: {
    viewBox: "0 0 56.8 100",
    widthEm: 0.568,
    d: "M33.8 79L23 79L23 17.9L1.2 17.9L1.2 8L55.6 8L55.6 17.9L33.8 17.9Z",
  },
  I: {
    viewBox: "0 0 28 100",
    widthEm: 0.28,
    d: "M19.4 79L8.6 79L8.6 8L19.4 8Z",
  },
  N: {
    viewBox: "0 0 74.5 100",
    widthEm: 0.745,
    d: "M19.4 79L8.6 79L8.6 8L22.3 8L55.1 65.9L55.1 8L65.9 8L65.9 79L51.7 79L19.4 22.4Z",
  },
  M: {
    viewBox: "0 0 89 100",
    widthEm: 0.89,
    d: "M19.4 79L8.6 79L8.6 8L23.4 8L44.5 66.3L65.6 8L80.4 8L80.4 79L69.6 79L69.6 27L50.5 78.9L38.5 78.9L19.4 27Z",
  },
  A: {
    viewBox: "0 0 68.9 100",
    widthEm: 0.689,
    d: "M13.5 79L2 79L27.6 8L41.3 8L66.9 79L55.4 79L48.9 60.5L19.9 60.5Z M34.4 18.3L23.3 50.7L45.6 50.7Z",
  },
};

function GlowName({ text, active }: { text: string; active: boolean }) {
  const chars = Array.from(text);
  const glowId = useId().replace(/:/g, "");
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  let letterIndex = 0;
  return (
    <p className="mt-2 flex flex-wrap items-end text-7xl font-medium tracking-tight text-text-primary sm:text-8xl md:text-9xl">
      <svg className="absolute h-0 w-0" aria-hidden>
        <defs>
          <filter
            id={`${glowId}-glow`}
            x="-80%"
            y="-80%"
            width="260%"
            height="260%"
          >
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      {chars.map((char, index) => {
        if (char === " ") {
          return (
            <span key={`space-${index}`} className="inline-block w-[0.243em]" />
          );
        }
        const i = letterIndex++;
        return (
          <GlowLetter
            key={`${char}-${index}`}
            char={char}
            letterIndex={i}
            active={active}
            reduce={reduce}
            glowId={`${glowId}-glow`}
          />
        );
      })}
    </p>
  );
}

function GlowLetter({
  char,
  letterIndex,
  active,
  reduce,
  glowId,
}: {
  char: string;
  letterIndex: number;
  active: boolean;
  reduce: boolean;
  glowId: string;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const [progress, setProgress] = useState(0);
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null);
  const [ghosts, setGhosts] = useState<
    { x: number; y: number; fade: number }[]
  >([]);
  const [drawn, setDrawn] = useState(false);
  const [flash, setFlash] = useState(0);
  const glyph = LETTERS[char];

  useEffect(() => {
    if (!active) {
      setProgress(0);
      setTip(null);
      setGhosts([]);
      setDrawn(false);
      setFlash(0);
    }
  }, [active]);

  useEffect(() => {
    if (!active || reduce) return;
    const controls = animate(0, 1, {
      duration: DRAW_BASE + letterIndex * DRAW_STEP,
      ease: "linear",
      onUpdate: (value) => {
        setProgress(value);
        const path = pathRef.current;
        if (!path) return;
        const len = path.getTotalLength();
        if (len <= 0) return;
        const pt = path.getPointAtLength(value * len);
        setTip({ x: pt.x, y: pt.y });
        const next: { x: number; y: number; fade: number }[] = [];
        for (let index = 0; index < 7; index++) {
          const t = value - (index + 1) * 0.016;
          if (t <= 0) continue;
          const ghost = path.getPointAtLength(t * len);
          next.push({ x: ghost.x, y: ghost.y, fade: 1 - index / 7 });
        }
        setGhosts(next);
      },
      onComplete: () => {
        setProgress(1);
        setTip(null);
        setGhosts([]);
        setDrawn(true);
      },
    });
    return () => controls.stop();
  }, [active, letterIndex, reduce]);

  useEffect(() => {
    if (!active || !drawn || reduce) return;
    const controls = animate(0, 1, {
      duration: GLOW_S,
      ease: "easeOut",
      onUpdate: (value) => setFlash(Math.sin(value * Math.PI)),
      onComplete: () => setFlash(0),
    });
    return () => controls.stop();
  }, [active, drawn, reduce]);

  if (!glyph) {
    return <span className="inline-block">{char}</span>;
  }

  const glowing = flash > 0.05;
  const tracing = active && !drawn && !reduce && progress > 0.01;
  const tipOn = tracing && progress < 0.98;
  const trailStart = Math.max(0, progress - TRAIL_BEHIND);
  const trailLen = Math.max(0, progress - trailStart);

  return (
    <svg
      viewBox={glyph.viewBox}
      className="inline-block h-[1em] overflow-visible"
      style={{
        width: `${glyph.widthEm}em`,
        color: glowing ? "#ffffff" : "var(--text-primary)",
        filter: glowing
          ? `drop-shadow(0 0 8px rgba(255,255,255,${flash})) drop-shadow(0 0 18px rgba(255,255,255,${flash * 0.85})) drop-shadow(0 0 32px rgba(255,255,255,${flash * 0.55}))`
          : undefined,
      }}
      aria-label={char}
    >
      <path
        ref={pathRef}
        d={glyph.d}
        fill="none"
        stroke="none"
        pathLength={1}
      />

      {reduce || drawn ? (
        <path d={glyph.d} fill="currentColor" fillRule="evenodd" />
      ) : (
        <>
          <path
            d={glyph.d}
            fill="none"
            fillRule="evenodd"
            stroke="#ffffff"
            strokeWidth={2.4}
            strokeLinejoin="miter"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={`${progress} 1`}
            filter={`url(#${glowId})`}
            style={{
              filter:
                "drop-shadow(0 0 3px rgba(255,255,255,0.95)) drop-shadow(0 0 8px rgba(255,255,255,0.55))",
            }}
          />
          {tipOn && trailLen > 0 && (
            <path
              d={glyph.d}
              fill="none"
              stroke="#ffffff"
              strokeWidth={5.5}
              strokeLinejoin="round"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={`${trailLen} 1`}
              strokeDashoffset={-trailStart}
              opacity={0.9}
              style={{
                filter:
                  "blur(2.6px) drop-shadow(0 0 6px rgba(255,255,255,0.95))",
              }}
            />
          )}
          {tipOn &&
            ghosts.map((ghost, index) => (
              <circle
                key={index}
                cx={ghost.x}
                cy={ghost.y}
                r={4.8 - index * 0.45}
                fill={`rgba(255,255,255,${ghost.fade * 0.7})`}
                style={{
                  filter: `blur(${1.2 + (1 - ghost.fade) * 1.4}px)`,
                }}
              />
            ))}
          {tipOn && tip && (
            <circle
              cx={tip.x}
              cy={tip.y}
              r={3.4}
              fill="#ffffff"
              style={{
                filter:
                  "drop-shadow(0 0 5px rgba(255,255,255,1)) drop-shadow(0 0 12px rgba(255,255,255,0.85)) drop-shadow(0 0 20px rgba(255,255,255,0.55))",
              }}
            />
          )}
        </>
      )}
    </svg>
  );
}
