export interface NavRoute {
  href: string;
  label: string;
}

export const ROUTES: NavRoute[] = [
  { href: "/", label: "Home" },
  { href: "/research", label: "Research" },
  { href: "/dataset", label: "Dataset" },
  { href: "/method", label: "Method" },
  { href: "/results", label: "Results" },
  { href: "/results#live-demo", label: "Live Demo" },
  { href: "/analysis", label: "Analysis" },
  { href: "/deployment", label: "Deployment" },
  { href: "/about", label: "About" },
];
