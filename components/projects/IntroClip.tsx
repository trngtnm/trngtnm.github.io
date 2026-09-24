"use client";

import { useIntroReveal } from "@/components/intro/IntroRevealContext";
import { Tag } from "@/components/ui/Tag";
import { WaveCandy } from "@/components/visuals/WaveCandy";
import { GRID_COL, MARKER_STEP_COLS } from "@/data/clipRanges";
import { profile, social } from "@/data/social";
import { Circle } from "lucide-react";
import { animate, motion } from "motion/react";
import { forwardRef, useEffect, useState, type CSSProperties } from "react";

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

const NAME_GLOW_WINDOW = 0.28;

function GlowName({ text, active }: { text: string; active: boolean }) {
  const [sweep, setSweep] = useState(0);
  const chars = Array.from(text);

  useEffect(() => {
    if (!active) {
      setSweep(0);
      return;
    }
    const controls = animate(0, 1 + NAME_GLOW_WINDOW, {
      duration: 1.4,
      ease: "linear",
      onUpdate: setSweep,
      onComplete: () => setSweep(1 + NAME_GLOW_WINDOW),
    });
    return () => controls.stop();
  }, [active]);

  return (
    <p className="mt-2 text-7xl font-medium tracking-tight text-text-primary sm:text-8xl md:text-9xl">
      {chars.map((char, index) => {
        const appearAt =
          chars.length <= 1 ? 0 : index / (chars.length - 1);
        const age = sweep - appearAt;
        const finished = sweep >= 1 + NAME_GLOW_WINDOW - 0.001;
        const flash =
          !finished && age > 0 && age < NAME_GLOW_WINDOW
            ? Math.sin((age / NAME_GLOW_WINDOW) * Math.PI)
            : 0;
        return (
          <span
            key={`${char}-${index}`}
            className={char === " " ? "inline" : "inline-block"}
            style={{
              color:
                flash > 0.05
                  ? `rgba(255, 255, 255, ${0.9 + flash * 0.1})`
                  : undefined,
              textShadow:
                flash > 0.05
                  ? `0 0 8px rgba(255, 255, 255, ${flash}), 0 0 18px rgba(255, 255, 255, ${flash * 0.85}), 0 0 32px rgba(255, 255, 255, ${flash * 0.55})`
                  : undefined,
            }}
          >
            {char === " " ? "\u00a0" : char}
          </span>
        );
      })}
    </p>
  );
}
