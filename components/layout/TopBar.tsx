"use client";

import { profile } from "@/data/social";
import { Download } from "lucide-react";
import Link from "next/link";

export function TopBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[var(--topbar-h)] border-b border-border bg-bg-secondary lg:hidden">
      <div className="flex h-full items-center justify-between px-3">
        <Link
          href="/#intro"
          className="shrink-0 font-mono text-xs tracking-[0.16em] text-text-primary uppercase"
        >
          {profile.displayName}
        </Link>
        <a
          href={profile.resumeHref}
          download={profile.session}
          aria-label="Download resume"
          className="inline-flex shrink-0 items-center gap-1.5 border border-border bg-bg-panel px-2 py-1 font-mono text-xs tracking-[0.1em] text-text-primary uppercase transition-colors duration-150 hover:border-accent hover:text-accent"
        >
          <Download className="size-3.5 shrink-0" aria-hidden />
          <span>{profile.session}</span>
        </a>
      </div>
    </header>
  );
}
