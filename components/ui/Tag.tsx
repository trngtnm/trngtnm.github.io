import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type TagProps = {
  children: ReactNode;
  className?: string;
};

export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex border border-border bg-bg-panel px-2 py-0.5 font-mono text-[10px] tracking-wider text-text-secondary uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}
