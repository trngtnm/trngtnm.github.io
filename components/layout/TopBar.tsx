"use client";

import { useTransport } from "@/components/session/TransportContext";
import { profile } from "@/data/social";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

export function TopBar() {
  const { isPlaying, isRecording, play, stop, reverse, toggleRecord } =
    useTransport();

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[var(--topbar-h)] border-b border-border bg-bg-secondary">
      <div className="relative flex h-full items-center justify-between px-3 md:px-5">
        <div className="z-10 flex min-w-0 items-center gap-2 md:gap-3">
          <Link
            href="/#intro"
            className="shrink-0 font-mono text-xs tracking-[0.16em] text-text-primary uppercase md:text-sm"
          >
            {profile.displayName}
          </Link>
        </div>

        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden={false}
        >
          <div
            className="pointer-events-auto hidden items-center gap-2 md:flex md:gap-4"
            role="group"
            aria-label="Transport controls"
          >
            <TransportButton
              label="Reverse"
              onClick={reverse}
              className="text-text-secondary hover:text-text-primary"
            >
              ◀
            </TransportButton>
            <TransportButton
              label="Play"
              onClick={play}
              className={cn(
                isPlaying
                  ? "text-playback shadow-[0_0_8px_var(--playback-glow)]"
                  : "text-text-secondary hover:text-playback",
              )}
            >
              ▶
            </TransportButton>
            <TransportButton
              label="Stop"
              onClick={stop}
              className="text-text-secondary hover:text-text-primary"
            >
              ■
            </TransportButton>
            <TransportButton
              label="Record"
              onClick={toggleRecord}
              className={cn(
                isRecording
                  ? "text-record shadow-[0_0_8px_rgba(196,60,60,0.45)]"
                  : "text-text-secondary hover:text-record",
              )}
            >
              ●
            </TransportButton>
          </div>
        </div>

        <div className="z-10 max-w-[40%] shrink-0 truncate font-mono text-[10px] tracking-[0.12em] text-text-muted uppercase md:text-[11px]">
          {profile.session}
        </div>
      </div>
    </header>
  );
}

function TransportButton({
  children,
  label,
  onClick,
  className,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex size-9 items-center justify-center font-mono text-sm transition-colors duration-150",
        className,
      )}
    >
      {children}
    </button>
  );
}
