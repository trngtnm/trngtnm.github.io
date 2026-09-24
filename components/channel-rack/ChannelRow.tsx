import { cn } from "@/lib/utils";
import type { Skill } from "@/types";

type ChannelRowProps = {
  skill: Skill;
  active: boolean;
  onToggle: () => void;
  onHover: () => void;
};

const STEP_COUNT = 12;
const CHANNEL_COLORS = [
  "#8bcf3f",
  "#ff8a00",
  "#5aa9e6",
  "#c47cff",
  "#e6c15a",
  "#e25b5b",
];

export function ChannelRow({
  skill,
  active,
  onToggle,
  onHover,
}: ChannelRowProps) {
  const color =
    CHANNEL_COLORS[Number.parseInt(skill.id, 10) % CHANNEL_COLORS.length] ??
    CHANNEL_COLORS[0];
  const litSteps = Math.round((skill.level / 5) * STEP_COUNT);
  const knobDeg = -135 + (skill.level / 5) * 270;

  return (
    <button
      type="button"
      onClick={onToggle}
      onMouseEnter={onHover}
      aria-pressed={active}
      aria-label={skill.name}
      className={cn(
        "flex min-w-0 flex-row items-center gap-2 border px-2 py-2.5 text-left transition-colors duration-150 md:flex-col md:items-center md:gap-1.5 md:px-1 md:py-3 md:text-center",
        active
          ? "border-accent bg-accent-muted"
          : "border-border bg-bg-panel hover:border-border-strong",
      )}
    >
      <span
        className="h-8 w-1.5 shrink-0 self-stretch md:h-1 md:w-full md:self-auto"
        style={{ backgroundColor: color }}
        aria-hidden
      />

      <span
        className={cn(
          "min-w-0 flex-1 truncate font-mono text-xs font-semibold tracking-[0.14em] uppercase md:flex md:min-h-[9rem] md:flex-none md:items-end md:justify-center md:rounded-sm md:px-1 md:py-2 md:tracking-[0.18em] md:[writing-mode:vertical-rl] md:[text-orientation:mixed] md:rotate-180 md:text-sm",
          active
            ? "text-accent md:bg-accent md:text-bg-primary"
            : "text-text-primary md:bg-bg-elevated",
        )}
      >
        {skill.name}
      </span>

      <span
        className="relative hidden size-6 shrink-0 rounded-full border border-border-strong bg-bg-elevated md:block"
        aria-hidden
      >
        <span
          className="absolute top-1/2 left-1/2 h-2 w-px origin-bottom bg-text-secondary"
          style={{ transform: `translate(-50%, -100%) rotate(${knobDeg}deg)` }}
        />
      </span>

      <span className="hidden flex-col gap-0.5 md:flex" aria-hidden>
        <span className="flex size-4 items-center justify-center border border-border font-mono text-[8px] text-text-muted [writing-mode:vertical-rl]">
          S
        </span>
        <span className="flex size-4 items-center justify-center border border-border font-mono text-[8px] text-text-muted [writing-mode:vertical-rl]">
          M
        </span>
      </span>

      <div className="hidden w-full min-w-0 flex-1 flex-col gap-1 md:flex" aria-hidden>
        {Array.from({ length: 3 }).map((_, group) => (
          <div key={group} className="flex w-full flex-col gap-px">
            {Array.from({ length: 4 }).map((__, step) => {
              const index = group * 4 + step;
              const lit = index < litSteps;
              return (
                <span
                  key={index}
                  className={cn(
                    "h-3 w-full min-w-0 border sm:h-3.5",
                    lit
                      ? active
                        ? "border-accent bg-accent"
                        : "border-playback/40 bg-playback"
                      : group % 2 === 0
                        ? "border-border bg-bg-elevated"
                        : "border-border bg-bg-secondary",
                  )}
                />
              );
            })}
          </div>
        ))}
      </div>
    </button>
  );
}
