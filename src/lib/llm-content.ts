import { about, education, experience, openSource, profile, projects, toolkit, wins, type Project } from "../content.ts";

const link = (label: string, href: string, description: string) =>
  `- [${label}](${new URL(href, `${profile.site}/`).href}): ${description}`;

export const textHeaders = {
  "Content-Type": "text/plain; charset=utf-8",
  "X-Robots-Tag": "noindex, follow",
};

export function projectMarkdown(project: Project) {
  return [
    `# ${project.name}`, "", `> ${project.summary}`, "",
    `By ${profile.name} · ${project.year}`, "",
    ...(project.badge ? [project.badge, ""] : []),
    ...(project.myPart ? ["## My contribution", "", project.myPart, ""] : []),
    "## Engineering", "", project.hardPart, "",
    `Technologies: ${project.stack.join(", ")}.`, "",
    "## Links", "",
    link("Project page", `/projects/${project.slug}`, "Visual case study"),
    ...project.links.map((item) => link(item.label, item.href, item.label)), "",
  ].join("\n");
}

export function portfolioMarkdown() {
  return [
    `# ${profile.name}`, "", `> ${profile.summary}`, "",
    ...about.flatMap((paragraph) => [paragraph, ""]),
    `Role: ${profile.role}`, `Location: ${profile.location}`,
    `Availability: ${profile.availability}`, `Email: ${profile.email}`, "",
    "## Projects", "",
    ...projects.map((project) => link(project.name, `/projects/${project.slug}/index.md`, project.summary)), "",
    "## Experience", "",
    ...experience.flatMap((job) => [
      `### ${job.role}, ${job.org}`, "", `${job.period} · ${job.place}`, "",
      ...job.points.map((point) => `- ${point}`), "",
    ]),
    "## Open source", "",
    ...openSource.flatMap((repo) => [
      link(`${repo.org}/${repo.repo}`, repo.href, repo.about.split(" · ")[0]),
      link("Merged contributions", repo.mergedHref, `Public pull requests by ${profile.brand}`),
    ]), "",
    "## Technologies", "",
    ...toolkit.map((group) => `- ${group.label}: ${group.items.join(", ")}`), "",
    "## Education", "",
    ...education.map((school) => `- ${school.degree}, ${school.name} (${school.period})${school.note ? ` · ${school.note}` : ""}`), "",
    "## Awards", "",
    ...wins.map((win) => `- ${win.title} (${win.year}): ${win.context}`), "",
    "## Contact and profiles", "",
    link("Book a call", "/book", "Schedule a meeting or arrange one by email if scheduling is unavailable"),
    link("Résumé", "/resume", "PDF résumé viewer"),
    ...profile.links.map((item) => link(item.label, item.href, `${profile.name}'s public profile`)), "",
  ].join("\n");
}

export function llmsIndex() {
  return [
    `# ${profile.name}`, "", `> ${profile.summary}`, "",
    `Public portfolio of ${profile.name}, ${profile.role}, based in ${profile.location}.`,
    `Contact: ${profile.email}. ${profile.availability}.`,
    "Content is generated from the same curated source as the website. Project metrics describe documented results, not live telemetry.", "",
    "## Pages", "",
    link("Portfolio", "/index.md", "Biography, experience, technologies, education, awards and contact information in Markdown"),
    link("Résumé", "/resume", "PDF résumé viewer"),
    link("Book a call", "/book", "Meeting scheduler with an email fallback"), "",
    "## Projects", "",
    ...projects.map((project) => link(project.name, `/projects/${project.slug}/index.md`, project.summary)), "",
    "## Profiles", "",
    ...profile.links.map((item) => link(item.label, item.href, `${profile.name}'s public profile`)), "",
    "## Optional", "",
    link("Full portfolio text", "/llms-full.txt", "Biography and all project case studies in one file"),
    link("Résumé PDF", "/resume.pdf", "Downloadable résumé"),
    link("Sitemap", "/sitemap.xml", "Canonical indexable HTML pages"), "",
  ].join("\n");
}
