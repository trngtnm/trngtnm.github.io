"use client";

import { Tag } from "@/components/ui/Tag";
import { WaveCandy } from "@/components/visuals/WaveCandy";
import { GRID_COL, HALF_STEP_COLS } from "@/data/clipRanges";
import { profile, social } from "@/data/social";
import { Circle } from "lucide-react";
import Link from "next/link";
import { forwardRef, type CSSProperties } from "react";

const INTRO_LABEL = "#d0d0d0";
/** Marker 01 is col 1; 1½ = one half-step past 01. */
const CONTENT_START_COL = 1 + HALF_STEP_COLS;

export const IntroClip = forwardRef<HTMLElement>(function IntroClip(_, ref) {
  return (
    <article
      ref={ref}
      id="intro"
      className="scroll-mt-[calc(var(--topbar-h)+1.25rem)] w-full"
    >
      <div
        className="relative z-10 w-full overflow-hidden border bg-bg-primary"
        style={{ borderColor: "var(--border)" } as CSSProperties}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-1/2 -translate-y-1/2 opacity-20"
          aria-hidden
        >
          <WaveCandy className="h-full w-full" />
        </div>

        <div
          className="relative z-10 flex min-h-[calc(100svh-var(--topbar-h)-var(--bottombar-h)-1.25rem)] w-full flex-col justify-center gap-3 py-10 pr-5 text-left sm:pr-8 lg:min-h-[calc(100svh-var(--topbar-h)-var(--bottombar-h)-1.25rem)]"
          style={{ paddingLeft: CONTENT_START_COL * GRID_COL }}
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

          <p className="mt-2 text-4xl font-medium tracking-tight text-text-primary sm:text-5xl md:text-6xl">
            {profile.name.toUpperCase()}
          </p>
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
            <Link
              href="#project-kiteview"
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-transparent bg-accent px-4 py-2 font-mono text-xs tracking-wider text-bg-primary uppercase transition-colors duration-150 hover:bg-accent-hover"
            >
              View Projects
            </Link>
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
        </div>
      </div>
    </article>
  );
});
