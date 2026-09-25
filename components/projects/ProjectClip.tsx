"use client";

import { GithubIcon } from "@/components/ui/BrandIcons";
import { Tag } from "@/components/ui/Tag";
import { GRID_COL } from "@/data/clipRanges";
import type { Project } from "@/types";
import { ArrowUpRight, Circle, Play } from "lucide-react";
import Image from "next/image";
import { forwardRef, useId, type CSSProperties } from "react";

type ProjectClipProps = {
  project: Project;
  expanded: boolean;
  onToggle: () => void;
  startCol: number;
  clipWidth: number;
};

export const ProjectClip = forwardRef<HTMLElement, ProjectClipProps>(
  function ProjectClip(
    { project, expanded, onToggle, startCol, clipWidth },
    ref,
  ) {
    const panelId = useId();
    const accent = project.colorBright;

    return (
      <article
        ref={ref}
        id={`project-${project.slug}`}
        className="scroll-mt-[calc(var(--topbar-h)+1.25rem)] w-full"
      >
        <div
          className="relative z-10 overflow-hidden border bg-bg-panel transition-colors duration-200 md:ml-[var(--clip-start)] md:w-[var(--clip-width)]"
          style={
            {
              borderColor: expanded ? "var(--accent)" : `${accent}88`,
              "--clip-start": `${startCol * GRID_COL}px`,
              "--clip-width": `${clipWidth * GRID_COL}px`,
            } as CSSProperties
          }
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onToggle();
            }}
            aria-expanded={expanded}
            aria-controls={panelId}
            className="group relative z-10 grid min-h-40 w-full grid-rows-[auto_1fr] items-start gap-2 overflow-hidden px-3 py-3 text-left md:flex md:min-h-0 md:flex-col md:items-stretch md:gap-2 md:px-4 md:py-3"
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundColor: `${project.color}${expanded ? "66" : "4d"}`,
              }}
              aria-hidden
            />
            <div className="relative z-10 flex flex-wrap items-center gap-3">
              <span
                className="flex size-4 items-center justify-center"
                style={{ color: expanded ? "var(--accent)" : accent }}
                aria-hidden
              >
                {expanded ? (
                  <Circle className="size-2.5 fill-current" />
                ) : (
                  <>
                    <Play className="absolute size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                    <Circle className="size-2.5 group-hover:opacity-0" />
                  </>
                )}
              </span>
              <h3
                className="font-mono text-sm tracking-wider text-text-primary uppercase"
                style={expanded ? { color: "var(--accent)" } : undefined}
              >
                {project.name}
              </h3>
              <Tag className="text-text-primary">{project.status}</Tag>
              {expanded && (
                <span className="font-mono text-[10px] tracking-wider text-accent uppercase">
                  Selected
                </span>
              )}
            </div>
            <p className="relative z-10 line-clamp-5 text-xs leading-relaxed text-text-primary md:hidden">
              {project.shortDescription}
            </p>
            <p className="relative z-10 hidden text-sm leading-relaxed text-text-primary md:block">
              {project.description}
            </p>
            <p className="relative z-10 hidden font-mono text-xs tracking-wider text-text-primary uppercase md:block">
              {project.technologies.slice(0, 4).join(" · ")}
            </p>
          </button>

          <div
            id={panelId}
            hidden={!expanded}
            className="relative z-10 border-t bg-bg-primary/70 px-3 py-5 sm:px-4"
            style={{ borderColor: `${accent}55` }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
              <div className="space-y-6">
                <div>
                  <h4 className="font-mono text-xs tracking-[0.18em] text-text-primary uppercase">
                    Stack
                  </h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Tag
                        key={tech}
                        className="border-white/25 bg-black/30 text-text-primary"
                      >
                        {tech}
                      </Tag>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-mono text-xs tracking-[0.18em] text-text-primary uppercase">
                    Features
                  </h4>
                  <ol className="mt-3 space-y-2.5">
                    {project.features.map((feature, index) => (
                      <li
                        key={feature}
                        className="flex gap-3 text-sm leading-relaxed text-text-primary"
                      >
                        <span
                          className="font-mono text-xs font-semibold tabular-nums"
                          style={{ color: accent }}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="flex flex-wrap gap-3">
                  {project.github ? (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 border border-border px-4 font-mono text-xs tracking-wider uppercase transition-colors hover:border-border-strong hover:bg-white/[0.03]"
                    >
                      <GithubIcon className="size-3.5" />
                      GitHub
                    </a>
                  ) : (
                    <span
                      className="inline-flex min-h-11 cursor-not-allowed items-center gap-2 border border-border px-4 font-mono text-xs tracking-wider text-text-disabled uppercase"
                      aria-disabled="true"
                    >
                      <GithubIcon className="size-3.5" />
                      GitHub
                    </span>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 bg-accent px-4 font-mono text-xs tracking-wider text-bg-primary uppercase hover:bg-accent-hover"
                    >
                      Live Demo
                      <ArrowUpRight className="size-3.5" />
                    </a>
                  )}
                </div>
              </div>

              <figure className="hidden overflow-hidden rounded-lg border border-border bg-bg-panel md:block">
                <div className="border-b border-border px-3 py-2 font-mono text-[10px] tracking-[0.2em] text-text-secondary uppercase">
                  Preview
                </div>
                <div className="relative aspect-[16/10] bg-bg-elevated">
                  <Image
                    src={project.image}
                    alt={`${project.name} preview`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 560px"
                  />
                </div>
              </figure>
            </div>
          </div>
        </div>
      </article>
    );
  },
);
