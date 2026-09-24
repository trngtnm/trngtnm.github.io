"use client";

import { navigation } from "@/data/navigation";
import { cn } from "@/lib/utils";

type MobileNavProps = {
  activeId: string;
  onNavigate: (id: string) => void;
};

const shortLabels: Record<string, string> = {
  intro: "INTRO",
  projects: "PROJECT",
  skills: "SKILLS",
  about: "ABOUT",
  contact: "CONTACT",
};

export function MobileNav({ activeId, onNavigate }: MobileNavProps) {
  const sectionId = activeId.startsWith("project-") ? "projects" : activeId;

  return (
    <nav
      aria-label="Mobile sections"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-bg-secondary pb-[env(safe-area-inset-bottom,0px)] lg:hidden"
    >
      <ul className="grid grid-cols-5">
        {navigation.map((item) => {
          const active = sectionId === item.id;
          return (
            <li key={item.id}>
              <a
                href={item.href}
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate(item.id);
                }}
                className={cn(
                  "flex h-[var(--mobilenav-h)] flex-col items-center justify-center gap-1 font-mono text-[10px] tracking-wider uppercase transition-colors duration-150",
                  active ? "text-accent" : "text-text-muted",
                )}
                aria-current={active ? "true" : undefined}
              >
                <span
                  className={cn(
                    "size-1 rounded-full",
                    active ? "bg-accent" : "bg-text-disabled",
                  )}
                  aria-hidden
                />
                {shortLabels[item.id] ?? item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
