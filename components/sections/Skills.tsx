"use client";

import { ChannelRow } from "@/components/channel-rack/ChannelRow";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { skills } from "@/data/skills";
import { useState } from "react";

export function Skills() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="section-pad content-pad scroll-mt-[calc(var(--topbar-h)+1rem)] overflow-x-hidden border-b border-border"
    >
      <SectionLabel label="CHANNEL_RACK / SKILLS" />
      <h2 id="skills-heading" className="sr-only">
        Skills
      </h2>

      <div className="grid w-full grid-cols-[repeat(14,minmax(0,1fr))]">
        {skills.map((skill) => (
          <ChannelRow
            key={skill.id}
            skill={skill}
            active={activeId === skill.id}
            onToggle={() =>
              setActiveId((current) =>
                current === skill.id ? null : skill.id,
              )
            }
            onHover={() => setActiveId(skill.id)}
          />
        ))}
      </div>
    </section>
  );
}
