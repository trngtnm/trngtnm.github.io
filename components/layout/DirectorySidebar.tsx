"use client";

import { useIntroReveal } from "@/components/intro/IntroRevealContext";
import { useSelectedProject } from "@/components/session/SelectedProjectContext";
import { navigation } from "@/data/navigation";
import { profile } from "@/data/social";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import { motion } from "motion/react";

type DirectorySidebarProps = {
  activeId: string;
  playingLabel: string;
  onNavigate: (id: string) => void;
};

export function DirectorySidebar({
  activeId,
  playingLabel,
  onNavigate,
}: DirectorySidebarProps) {
  const { selectedSlug } = useSelectedProject();
  const { phase } = useIntroReveal();
  const chromeReady = phase !== "columns";

  const isProjectsActive =
    activeId === "projects" || Boolean(selectedSlug);

  return (
    <motion.aside
      className="fixed top-[var(--topbar-h)] bottom-0 left-0 z-40 hidden w-[var(--sidebar-w)] border-r border-border bg-bg-secondary lg:flex lg:flex-col"
      initial={{ opacity: 0, x: -16 }}
      animate={chromeReady ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="border-b border-border px-4 py-4">
        <p className="font-mono text-[10px] tracking-[0.25em] text-text-muted uppercase">
          Project_Root /
        </p>
        <a
          href="#intro"
          onClick={(event) => {
            event.preventDefault();
            onNavigate("intro");
          }}
          className="mt-1 inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.16em] text-text-primary uppercase"
        >
          {profile.displayName}
          <span
            className="record-blink size-1.5 shrink-0 rounded-full bg-record shadow-[0_0_8px_rgba(196,60,60,0.7)]"
            aria-label="Recording"
            role="status"
          />
        </a>
      </div>

      <nav
        aria-label="Session directory"
        className="flex-1 overflow-y-auto px-2 py-4"
      >
        <ul className="space-y-0.5">
          {navigation.map((item) => {
            const sectionActive =
              activeId === item.id ||
              (item.id === "projects" && isProjectsActive);

            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigate(item.id);
                  }}
                  className={cn(
                    "flex min-h-10 items-center gap-2 px-3 font-mono text-xs tracking-wider uppercase transition-colors duration-150",
                    sectionActive
                      ? "bg-accent-muted text-accent"
                      : "text-text-secondary hover:bg-white/[0.03] hover:text-text-primary",
                  )}
                  aria-current={sectionActive ? "true" : undefined}
                >
                  <span className="text-text-muted">▾</span>
                  <span className="text-text-muted">{item.number}_</span>
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border px-4 py-3">
        <a
          href={profile.resumeHref}
          download={profile.session}
          aria-label="Download resume"
          className="inline-flex w-full min-h-10 items-center justify-center gap-1.5 border border-border bg-bg-panel px-2 font-mono text-[10px] tracking-[0.1em] text-text-primary uppercase transition-colors duration-150 hover:border-accent hover:text-accent"
        >
          <Download className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">{profile.session}</span>
        </a>
      </div>

      <div className="border-t border-border px-4 py-4 font-mono text-[10px] tracking-wider text-text-muted uppercase">
        <p className="inline-flex items-center gap-2 text-playback">
          <span className="size-1.5 rounded-full bg-playback shadow-[0_0_8px_var(--playback-glow)]" />
          Focus / {playingLabel}
        </p>
        <div className="mt-3 flex items-center gap-2" aria-hidden>
          {KNOBS.map((knob) => (
            <Knob key={knob.id} angle={knob.angle} />
          ))}
        </div>
      </div>
    </motion.aside>
  );
}

const KNOBS = [
  { id: "gain", angle: -55 },
  { id: "pan", angle: 12 },
  { id: "fx", angle: 78 },
  { id: "mix", angle: -128 },
] as const;

function Knob({ angle }: { angle: number }) {
  return (
    <svg viewBox="0 0 20 20" className="size-5 text-text-muted">
      <circle
        cx="10"
        cy="10"
        r="7.5"
        fill="transparent"
        stroke="#383838"
        strokeWidth="1"
      />
      <circle cx="10" cy="10" r="1.25" fill="#666666" />
      <line
        x1="10"
        y1="10"
        x2="10"
        y2="3.75"
        stroke="#a0a0a0"
        strokeWidth="1.2"
        strokeLinecap="round"
        transform={`rotate(${angle} 10 10)`}
      />
    </svg>
  );
}
