"use client";

import {
  IntroRevealProvider,
  useIntroReveal,
} from "@/components/intro/IntroRevealContext";
import { DrumMachineProvider } from "@/components/drum-machine/DrumMachineContext";
import { DirectorySidebar } from "@/components/layout/DirectorySidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { TopBar } from "@/components/layout/TopBar";
import { SelectedProjectProvider, useSelectedProject } from "@/components/session/SelectedProjectContext";
import { TransportProvider, useTransport } from "@/components/session/TransportContext";
import { clipRangeForSlug, clipEndToProgress, arrangementLaneWidthPx } from "@/data/clipRanges";
import { navigation } from "@/data/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

function resolvePlayingLabel(activeId: string, selectedSlug: string | null) {
  if (selectedSlug) return "PROJECTS";
  if (activeId === "intro") return "INTRO";
  if (activeId.startsWith("project-")) return "PROJECTS";
  const match = navigation.find((item) => item.id === activeId);
  return match?.label ?? "INTRO";
}

function AppShellInner({ children }: AppShellProps) {
  const [activeId, setActiveId] = useState("intro");
  const { setSelectedSlug, selectedSlug } = useSelectedProject();
  const { seekTo } = useTransport();
  const { phase } = useIntroReveal();

  const scrollToSection = useCallback(
    (id: string) => {
      if (id === "intro") {
        setSelectedSlug(null);
        seekTo(0, 300);
        setActiveId("intro");
        const el = document.getElementById("intro");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        return;
      }

      if (id.startsWith("project-")) {
        const slug = id.replace(/^project-/, "");
        const range = clipRangeForSlug(slug);
        setSelectedSlug(slug);
        seekTo(
          clipEndToProgress(
            range.startCol,
            range.width,
            arrangementLaneWidthPx(),
          ),
          400,
        );
        setActiveId("projects");
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      const el = document.getElementById(id);
      if (!el) return;
      setActiveId(id);
      if (id !== "projects") {
        setSelectedSlug(null);
      }
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [seekTo, setSelectedSlug],
  );

  useEffect(() => {
    // Position-based spy so nested arrangement clips (intro / about / projects)
    // update the sidebar and transport independently of the tall parent section.
    const sectionIds = ["intro", "about", "projects", "skills", "contact"];

    const update = () => {
      const offset = 96;
      let current = sectionIds[0] ?? "intro";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el || el.getClientRects().length === 0) continue;
        if (el.getBoundingClientRect().top <= offset) {
          current = id;
        }
      }
      setActiveId(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [phase]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-bg-primary text-text-primary">
      <TopBar />
      <DirectorySidebar
        activeId={activeId}
        playingLabel={resolvePlayingLabel(activeId, selectedSlug)}
        onNavigate={scrollToSection}
      />
      <div className="pt-[var(--topbar-h)] pb-[calc(var(--mobilenav-h)+env(safe-area-inset-bottom,0px))] lg:pb-0 lg:pl-[var(--sidebar-w)]">
        <main className="w-full">{children}</main>
      </div>
      <MobileNav activeId={activeId} onNavigate={scrollToSection} />
    </div>
  );
}

export function AppShell({ children }: AppShellProps) {
  return (
    <TransportProvider>
      <SelectedProjectProvider>
        <IntroRevealProvider>
          <DrumMachineProvider>
            <AppShellInner>{children}</AppShellInner>
          </DrumMachineProvider>
        </IntroRevealProvider>
      </SelectedProjectProvider>
    </TransportProvider>
  );
}
