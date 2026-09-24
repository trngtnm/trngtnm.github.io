"use client";

import { useSelectedProject } from "@/components/session/SelectedProjectContext";
import { navigation } from "@/data/navigation";
import { profile } from "@/data/social";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

type DirectorySidebarProps = {
  activeId: string;
  onNavigate: (id: string) => void;
};

export function DirectorySidebar({
  activeId,
  onNavigate,
}: DirectorySidebarProps) {
  const [projectsOpen, setProjectsOpen] = useState(true);
  const { selectedSlug } = useSelectedProject();

  const isProjectsActive =
    activeId === "projects" || Boolean(selectedSlug);

  return (
    <aside className="fixed top-[var(--topbar-h)] bottom-[var(--bottombar-h)] left-0 z-40 hidden w-[var(--sidebar-w)] border-r border-border bg-bg-secondary lg:flex lg:flex-col">
      <div className="border-b border-border px-4 py-4">
        <p className="font-mono text-[10px] tracking-[0.25em] text-text-muted uppercase">
          Project_Root /
        </p>
        <p className="mt-1 font-mono text-xs tracking-wider text-text-secondary uppercase">
          Portfolio
        </p>
      </div>

      <nav
        aria-label="Session directory"
        className="flex-1 overflow-y-auto px-2 py-4"
      >
        <ul className="space-y-0.5">
          {navigation.map((item) => {
            const hasChildren = Boolean(item.children?.length);
            const sectionActive =
              activeId === item.id ||
              (item.id === "projects" && isProjectsActive);

            if (hasChildren) {
              return (
                <li key={item.id}>
                  <div className="flex items-stretch">
                    <button
                      type="button"
                      onClick={() => setProjectsOpen((open) => !open)}
                      className="flex min-h-10 w-8 items-center justify-center text-text-muted hover:text-text-secondary"
                      aria-expanded={projectsOpen}
                      aria-label={
                        projectsOpen
                          ? "Collapse projects"
                          : "Expand projects"
                      }
                    >
                      {projectsOpen ? (
                        <ChevronDown className="size-3.5" />
                      ) : (
                        <ChevronRight className="size-3.5" />
                      )}
                    </button>
                    <a
                      href={item.href}
                      onClick={(event) => {
                        event.preventDefault();
                        onNavigate(item.id);
                      }}
                      className={cn(
                        "flex min-h-10 flex-1 items-center gap-2 px-1 font-mono text-xs tracking-wider uppercase transition-colors duration-150",
                        sectionActive
                          ? "text-accent"
                          : "text-text-secondary hover:text-text-primary",
                      )}
                      aria-current={activeId === item.id ? "true" : undefined}
                    >
                      <span className="text-text-muted">{item.number}_</span>
                      {item.label}
                    </a>
                  </div>
                  {projectsOpen && (
                    <ul className="mb-1 ml-4 border-l border-border pl-2">
                      {item.children?.map((child, index) => {
                        const childSlug = child.id.replace(/^project-/, "");
                        const childSelected = selectedSlug === childSlug;
                        const isLast =
                          index === (item.children?.length ?? 0) - 1;
                        return (
                          <li key={child.id}>
                            <a
                              href={child.href}
                              onClick={(event) => {
                                event.preventDefault();
                                onNavigate(child.id);
                              }}
                              className={cn(
                                "flex min-h-10 items-center gap-2 px-2 font-mono text-[11px] tracking-wider uppercase transition-colors duration-150",
                                childSelected
                                  ? "bg-accent-muted text-accent"
                                  : "text-text-muted hover:text-text-primary",
                              )}
                              aria-current={childSelected ? "true" : undefined}
                            >
                              <span className="text-text-disabled">
                                {isLast ? "└─" : "├─"}
                              </span>
                              {child.label}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            }

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

      <div className="border-t border-border px-4 py-4 font-mono text-[10px] tracking-wider text-text-muted uppercase">
        <p>Session_01</p>
        <p className="mt-2 inline-flex items-center gap-2 text-playback">
          <span className="size-1.5 rounded-full bg-playback" />
          Online
        </p>
        <p className="mt-2 text-text-disabled">{profile.displayName}</p>
      </div>
    </aside>
  );
}
