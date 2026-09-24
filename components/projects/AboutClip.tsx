import { Tag } from "@/components/ui/Tag";
import { GRID_COL } from "@/data/clipRanges";
import { profile } from "@/data/social";
import { Circle } from "lucide-react";
import type { CSSProperties } from "react";

const ABOUT_COLOR = "#9bb8d4";
const CONTENT_START_COL = 1;

export function AboutClip() {
  return (
    <article
      id="about"
      className="scroll-mt-[calc(var(--topbar-h)+1.25rem)] w-full"
    >
      <div
        className="relative z-10 w-full overflow-hidden border bg-bg-panel"
        style={{ borderColor: `${ABOUT_COLOR}88` } as CSSProperties}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundColor: `${ABOUT_COLOR}40` }}
          aria-hidden
        />

        <div
          className="relative z-10 flex min-h-[28rem] w-full flex-col justify-center gap-6 px-4 py-12 sm:min-h-[32rem] sm:py-16 lg:min-h-[36rem] md:pl-[var(--clip-start)] md:pr-8"
          style={
            {
              "--clip-start": `${CONTENT_START_COL * GRID_COL}px`,
            } as CSSProperties
          }
        >
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="flex size-4 items-center justify-center"
              style={{ color: ABOUT_COLOR }}
              aria-hidden
            >
              <Circle className="size-2.5" />
            </span>
            <h2
              id="about-heading"
              className="font-mono text-sm tracking-wider uppercase"
              style={{ color: ABOUT_COLOR }}
            >
              Session Info
            </h2>
            <Tag>ABOUT</Tag>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-2">
              {[
                { label: "NAME", value: profile.name.toUpperCase() },
                {
                  label: "EDUCATION",
                  value: `${profile.education.toUpperCase()}\n${profile.school.toUpperCase()}\nGPA ${profile.gpa} · ${profile.graduation.toUpperCase()}`,
                },
                {
                  label: "FOCUS",
                  value:
                    "SOFTWARE ENGINEERING\nAI / ML\nMOBILE DEVELOPMENT\nBACKEND SYSTEMS",
                },
                {
                  label: "CURRENTLY BUILDING",
                  value: "KITEVIEW\nHOLOURA\nPARKEYE\nAI-POWERED APPLICATIONS",
                },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="font-mono text-[10px] tracking-[0.2em] text-text-secondary uppercase">
                    {item.label}
                  </dt>
                  <dd className="mt-2 whitespace-pre-line font-mono text-xs leading-relaxed tracking-wide text-text-primary uppercase">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="max-w-xl text-base leading-relaxed text-text-primary/85">
              I&apos;m a computer science student at George Mason University who
              builds full-stack and mobile systems — from real-time parking
              tools to AI-assisted reading and purchasing agents. I care about
              clean APIs, solid data models, and product UX that stays out of
              the way. When I&apos;m not in class or shipping code, I&apos;m
              usually exploring new ML tooling or refining something I already
              built.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
