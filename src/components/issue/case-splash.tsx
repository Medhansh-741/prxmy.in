import Link from "next/link";
import { wins, type Project } from "@/content";
import { Burst, Caption } from "@/components/comic";
import { ProjectVisual } from "@/components/project-visual";
import { ExtLink } from "@/components/ui";

// A case's splash panel: caption, name, summary, original diagram art, and a
// burst only when the project actually won something. Used on the homepage and
// as the top tier of the case file page.
export function CaseSplash({ project, number, onCaseFile = false }: { project: Project; number: number; onCaseFile?: boolean }) {
  const win = wins.find((item) => item.context === project.name);
  const [headline, ...detail] = (win?.title ?? "").split(", ");
  const live = project.links.find((link) => link.label === "Live");
  const Name = onCaseFile ? "h1" : "h3";
  const href = `/projects/${project.slug}`;

  return (
    <article className={`panel case-splash${number === 1 && !onCaseFile ? " lead" : ""}`} id={onCaseFile ? undefined : project.slug}>
      <div className="cs-txt">
        <Caption className="cs-caption">{project.caption}</Caption>
        <Name className="cs-name">{onCaseFile ? project.name : <Link href={href}>{project.name}</Link>}<i>.</i></Name>
        <p className="cs-sum">{project.summary}</p>
        {!onCaseFile && (
          <>
            <ul className="tags" aria-label="Built with">{project.stack.map((name) => <li key={name}>{name}</li>)}</ul>
            <div className="cs-acts">
              <Link href={href} className="comic-btn">Open the case file <span aria-hidden="true">→</span></Link>
              {live && <ExtLink href={live.href} className="comic-btn out">Live ↗</ExtLink>}
            </div>
          </>
        )}
      </div>
      <figure className="cs-art">
        <ProjectVisual slug={project.slug} />
        <figcaption>Fig. {number}.1 · {project.coverLabel ?? project.name} (illustration)</figcaption>
      </figure>
      {win && <Burst className="cs-award">{headline.replace(/ Winner$/, "")}!<small>{headline.endsWith(" Winner") && "Winner · "}{detail.join(", ")}</small></Burst>}
    </article>
  );
}
