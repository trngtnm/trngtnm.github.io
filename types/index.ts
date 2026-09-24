export type ProjectStatus = "ACTIVE" | "COMPLETE" | "IN_PROGRESS";

export type LaneType = "KICK" | "CHORDS" | "HIHAT" | "ATMOS";

export type Project = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: string;
  status: ProjectStatus;
  laneType: LaneType;
  color: string;
  colorBright: string;
  technologies: string[];
  features: string[];
  architecture: string[];
  image: string;
  github: string | null;
  demo: string | null;
  year: string;
};

export type Skill = {
  id: string;
  name: string;
  categories: string[];
  level: number;
};

export type NavigationChild = {
  id: string;
  label: string;
  href: string;
};

export type NavigationItem = {
  id: string;
  number: string;
  label: string;
  href: string;
  children?: NavigationChild[];
};

export type SocialLink = {
  id: string;
  label: string;
  href: string;
  icon: "github" | "linkedin" | "mail";
};
