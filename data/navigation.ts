import { projects } from "@/data/projects";
import type { NavigationItem } from "@/types";

export const navigation: NavigationItem[] = [
  { id: "intro", number: "01", label: "INTRO", href: "#intro" },
  { id: "about", number: "02", label: "ABOUT", href: "#about" },
  {
    id: "projects",
    number: "03",
    label: "PROJECTS",
    href: "#projects",
    children: projects.map((project) => ({
      id: `project-${project.slug}`,
      label: project.name.replace(/\s+/g, "_"),
      href: `#project-${project.slug}`,
    })),
  },
  { id: "skills", number: "04", label: "SKILLS", href: "#skills" },
  { id: "contact", number: "05", label: "CONTACT", href: "#contact" },
];
