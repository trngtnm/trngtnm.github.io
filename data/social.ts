import type { SocialLink } from "@/types";

export const social: SocialLink[] = [
  {
    id: "email",
    label: "EMAIL",
    href: "mailto:trongtintmai@gmail.com",
    icon: "mail",
  },
  {
    id: "github",
    label: "GITHUB",
    href: "https://github.com/trongtinmai",
    icon: "github",
  },
  {
    id: "linkedin",
    label: "LINKEDIN",
    href: "https://www.linkedin.com/in/trongtin-mai",
    icon: "linkedin",
  },
];

export const profile = {
  name: "Tin Mai",
  displayName: "TIN.MAI",
  fullName: "TrongTin Tran Mai",
  title: "Software Engineer",
  education: "B.S. Computer Science",
  school: "George Mason University",
  gpa: "3.87",
  graduation: "Expected May 2028",
  location: "Virginia, USA",
  email: "trongtintmai@gmail.com",
  focus: "Software Engineering",
  specialty: "AI / ML · Mobile · Systems",
  status: "BUILDING",
  session: "PORTFOLIO_SESSION.flp",
  buildYear: "2026",
} as const;
