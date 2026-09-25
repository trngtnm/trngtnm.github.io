"use client";

import { IntroColumnSweep } from "@/components/intro/IntroColumnSweep";
import { useIntroReveal } from "@/components/intro/IntroRevealContext";
import { AboutClip } from "@/components/projects/AboutClip";
import { ArrangementHeader } from "@/components/projects/ArrangementHeader";
import { IntroClip } from "@/components/projects/IntroClip";
import { Playhead } from "@/components/projects/Playhead";
import { ProjectClip } from "@/components/projects/ProjectClip";
import { TrackIdentifier } from "@/components/projects/TrackIdentifier";
import { useSelectedProject } from "@/components/session/SelectedProjectContext";
import { useTransport } from "@/components/session/TransportContext";
import { clipRangeForSlug, clipEndToProgress, arrangementLaneWidthPx, GRID_COL } from "@/data/clipRanges";
import { projects } from "@/data/projects";
import { motion } from "motion/react";
import { Fragment, useCallback, useEffect, useState } from "react";

const INTRO_COLOR = "#c8c8c8";
const ABOUT_COLOR = "#9bb8d4";
const RAIL_WIDTH_MD = 160;
const GAP_COUNT = 5;

const trackPadClass = "py-1.5";

function SectionGap({ withGrid = false }: { withGrid?: boolean }) {
  return (
    <div
      className="relative h-16 w-full min-h-16 border-b border-border bg-bg-primary sm:h-20 sm:min-h-20 md:bg-bg-panel"
      aria-hidden
    >
      {withGrid ? (
        <div
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--border) 1px, transparent 1px)",
            backgroundSize: `${GRID_COL}px 100%`,
          }}
        />
      ) : null}
    </div>
  );
}

function IntroRow() {
  const { phase } = useIntroReveal();
  const contentReady = phase !== "columns";

  return (
    <>
      <div
        className={`relative hidden bg-bg-primary md:block ${
          contentReady
            ? "z-20 border-r border-b border-border"
            : "z-0 border-transparent"
        }`}
      >
        <motion.div
          className="h-full"
          initial={{ opacity: 0, x: -16 }}
          animate={contentReady ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <TrackIdentifier
            name="INTRO"
            color={INTRO_COLOR}
            expanded={false}
            onSelect={() => {
              document
                .getElementById("intro")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          />
        </motion.div>
      </div>
      <div
        id="intro-lane"
        className={`relative ${contentReady ? "border-b border-border" : ""}`}
      >
        <div
          className={`pointer-events-none absolute inset-0 hidden opacity-35 ${
            phase !== "columns" ? "md:block" : ""
          }`}
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--border) 1px, transparent 1px)",
            backgroundSize: `${GRID_COL}px 100%`,
          }}
        />
        <IntroColumnSweep />
        <IntroClip />
      </div>
    </>
  );
}

function ArrangementGaps({ id }: { id: string }) {
  return (
    <>
      <div
        className="h-80 w-full border-b border-border bg-bg-primary sm:h-[25rem] md:hidden"
        aria-hidden
      />
      {Array.from({ length: GAP_COUNT }, (_, index) => (
        <Fragment key={`${id}-${index}`}>
          <div className="hidden border-r border-border md:block">
            <SectionGap />
          </div>
          <div className="hidden md:contents">
            <SectionGap withGrid />
          </div>
        </Fragment>
      ))}
    </>
  );
}

export function Projects() {
  const { seekTo } = useTransport();
  const { selectedSlug, setSelectedSlug } = useSelectedProject();
  const { phase } = useIntroReveal();
  const [railWidth, setRailWidth] = useState(0);
  const [laneWidth, setLaneWidth] = useState(0);

  const handleSelect = useCallback(
    (slug: string) => {
      const range = clipRangeForSlug(slug, laneWidth);
      const collapsing = selectedSlug === slug;
      setSelectedSlug(collapsing ? null : slug);
      seekTo(
        collapsing
          ? 0
          : clipEndToProgress(
              range.startCol,
              range.width,
              arrangementLaneWidthPx(),
            ),
        collapsing ? 300 : 400,
      );

      if (!collapsing) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            document
              .getElementById(`project-${slug}`)
              ?.scrollIntoView({ behavior: "smooth", block: "center" });
          });
        });
      }
    },
    [seekTo, setSelectedSlug, selectedSlug, laneWidth],
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => {
      setRailWidth(mq.matches ? RAIL_WIDTH_MD : 0);
      setLaneWidth(arrangementLaneWidthPx());
    };
    sync();
    mq.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    const timeline = document.getElementById("arrangement-timeline");
    const canvas = document.getElementById("arrangement-canvas");
    const ro = new ResizeObserver(sync);
    if (timeline) ro.observe(timeline);
    if (canvas) ro.observe(canvas);
    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
      ro.disconnect();
    };
  }, []);

  return (
    <section
      id="arrangement"
      aria-labelledby="projects-heading"
      className={`scroll-mt-[var(--topbar-h)] ${
        phase === "columns" ? "" : "border-b border-border"
      }`}
    >
      <h2 id="projects-heading" className="sr-only">
        Arrangement
      </h2>

      <div
        className={`relative bg-bg-primary ${
          phase === "columns"
            ? ""
            : "border-t border-border md:bg-bg-panel"
        }`}
      >
        <motion.div
          className={`sticky top-[var(--topbar-h)] z-40 bg-bg-secondary ${
            phase === "columns" ? "h-0 overflow-hidden md:block" : "hidden md:block"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: phase !== "columns" ? 1 : 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="relative flex border-b border-border bg-bg-secondary">
            <div className="hidden h-5 w-[160px] shrink-0 border-r border-border bg-bg-secondary md:block" />
            <div
              id="arrangement-timeline"
              className="relative h-5 min-w-0 flex-1 bg-bg-secondary"
            >
              <ArrangementHeader />
            </div>
          </div>
        </motion.div>

        <div
          id="arrangement-canvas"
          className="relative grid w-full grid-cols-1 md:grid-cols-[160px_minmax(0,1fr)]"
        >
          <IntroRow />

          <div className={phase === "columns" ? "hidden" : "contents"}>
          <ArrangementGaps id="intro-gap" />

          {/* Session info / about — arrangement track */}
          <div className="col-span-full flex h-12 items-center border-b border-border bg-bg-secondary md:hidden">
            <span
              className="w-1.5 shrink-0 self-stretch"
              style={{ backgroundColor: ABOUT_COLOR }}
              aria-hidden
            />
            <span className="px-2.5 font-mono text-sm font-semibold tracking-[0.14em] text-text-primary uppercase">
              ABOUT
            </span>
          </div>
          <div className="hidden border-r border-b border-border md:block">
            <button
              type="button"
              onClick={() => {
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="flex h-full min-h-16 w-full items-center bg-bg-secondary text-left sm:min-h-20"
            >
              <span
                className="w-1.5 shrink-0 self-stretch"
                style={{ backgroundColor: ABOUT_COLOR }}
                aria-hidden
              />
              <span className="px-2.5 font-mono text-sm font-semibold tracking-[0.14em] text-text-primary uppercase">
                ABOUT
              </span>
            </button>
          </div>
          <div className="relative border-b border-border">
            <div
              className="pointer-events-none absolute inset-0 hidden opacity-35 md:block"
              aria-hidden
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--border) 1px, transparent 1px)",
                backgroundSize: `${GRID_COL}px 100%`,
              }}
            />
            <AboutClip />
          </div>

          <ArrangementGaps id="about-gap" />

          <div
            id="projects"
            className="col-span-full h-px w-full scroll-mt-[var(--topbar-h)] md:scroll-mt-[calc(var(--topbar-h)+1.25rem)]"
          />

          <div className="col-span-full flex h-12 items-center border-b border-border bg-bg-secondary md:hidden">
            <span
              className="w-1.5 shrink-0 self-stretch bg-text-secondary"
              aria-hidden
            />
            <span className="px-2.5 font-mono text-sm font-semibold tracking-[0.14em] text-text-primary uppercase">
              PROJECTS
            </span>
          </div>

          <div className="hidden border-r border-b border-border md:block">
            <div className="flex h-16 min-h-16 items-center bg-bg-secondary sm:h-20 sm:min-h-20">
              <span
                className="w-1.5 shrink-0 self-stretch bg-text-secondary"
                aria-hidden
              />
              <span className="px-2.5 font-mono text-sm font-semibold tracking-[0.14em] text-text-primary uppercase">
                PROJECTS
              </span>
            </div>
          </div>
          <div className="hidden md:contents">
            <SectionGap withGrid />
          </div>

          {/* Project rows — ID + clip share one CSS grid row */}
          {projects.map((project) => {
            const range = clipRangeForSlug(project.slug, laneWidth);
            const isOpen = selectedSlug === project.slug;
            const accent = project.colorBright;
            return (
              <Fragment key={project.slug}>
                <div className="hidden border-r border-b border-border md:block">
                  <TrackIdentifier
                    name={project.name}
                    color={accent}
                    expanded={isOpen}
                    onSelect={() => handleSelect(project.slug)}
                  />
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  aria-pressed={isOpen}
                  aria-label={`Toggle ${project.name}`}
                  className={`relative cursor-pointer border-b border-border ${trackPadClass}`}
                  onClick={() => handleSelect(project.slug)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleSelect(project.slug);
                    }
                  }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 hidden opacity-35 md:block"
                    aria-hidden
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, var(--border) 1px, transparent 1px)",
                      backgroundSize: `${GRID_COL}px 100%`,
                    }}
                  />
                  <ProjectClip
                    project={project}
                    expanded={isOpen}
                    startCol={range.startCol}
                    clipWidth={range.width}
                    onToggle={() => handleSelect(project.slug)}
                  />
                </div>
              </Fragment>
            );
          })}
          </div>
        </div>
        <div className="hidden md:contents">
          <Playhead railWidth={railWidth} />
        </div>
      </div>
    </section>
  );
}
