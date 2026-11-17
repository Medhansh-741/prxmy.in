import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { projects } from "@/content";
import { ProjectVisual } from "@/components/project-visual";
import { WorkbenchHeader, WorkbenchFooter } from "@/components/workbench/frame";
import { Arrow } from "@/components/workbench/interactions";
import { pageMetadata } from "@/lib/metadata";

// These small, prerendered pages validate their slug before showing the page,
// including returning a real 404 for an unknown project.
export const instant = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  return pageMetadata({
    title: project.name,
    description: project.summary,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = projects.findIndex((item) => item.slug === slug);
  if (index < 0) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  return (
    <div className="workbench" id="top">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <WorkbenchHeader />
      <main id="main" className="wb-project-page wb-width">
        <nav
          className="wb-project-breadcrumb wb-mono"
          aria-label="Project navigation"
        >
          <Link href="/#projects">← Back to the work</Link>
          <span>
            Project {index + 1} of {projects.length}
          </span>
        </nav>
        <header className="wb-project-heading">
          <h1>{project.name}</h1>
          <p className="wb-project-caption">{project.caption}</p>
          {project.badge && <p className="wb-project-badge">{project.badge}</p>}
          <div className="wb-detail-actions">
            {project.links.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                className={
                  i === 0 ? "wb-button wb-button-primary" : "wb-plain-link"
                }
                {...(link.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {link.label === "Live" ? "Open live project" : link.label}
                <Arrow />
              </a>
            ))}
          </div>
        </header>
        <figure className="wb-project-preview">
          {project.preview && project.slug !== "jansamadhan" ? (
            <div className="wb-project-image">
              <Image
                src={project.preview}
                alt={`${project.name} project cover`}
                loading="eager"
                fill
                sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1232px) calc(100vw - 112px), 1120px"
                style={{ objectFit: "contain" }}
              />
            </div>
          ) : (
            <ProjectVisual slug={project.slug} />
          )}
          <figcaption className="wb-mono">
            {project.preview && project.slug !== "jansamadhan"
              ? "Project cover"
              : "System illustration"}{" "}
            / {project.name}
          </figcaption>
        </figure>
        <div className="wb-project-story">
          <div>
            <h2>Overview</h2>
          </div>
          <div>
            <p>{project.summary}</p>
            {project.myPart && (
              <p>
                <strong>My part.</strong> {project.myPart}
              </p>
            )}
          </div>
        </div>
        <div className="wb-project-story">
          <div>
            <h2>Engineering</h2>
          </div>
          <div>
            <p>{project.hardPart}</p>
            <div className="wb-detail-stack">
              {project.stack.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
          </div>
        </div>
        <Link className="wb-next-project" href={`/projects/${next.slug}`}>
          <span>
            <span className="wb-mono">Next project</span>
            <strong>{next.name}</strong>
          </span>
          <Arrow />
        </Link>
      </main>
      <WorkbenchFooter />
    </div>
  );
}
