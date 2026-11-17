import { projects } from "@/content";
import { CaseSplash } from "@/components/issue/case-splash";

// The Cases: each project's splash panel, linking to its full case file.
export function Cases() {
  return (
    <section id="cases" className="issue-section" aria-labelledby="cases-heading">
      <header className="chapter">
        <h2 id="cases-heading">The Cases<i>.</i></h2>
        <p>Things I built, each told as a case. Open one for the whole file: what I did, the hard part, and how it’s built.</p>
      </header>
      {projects.map((project, index) => <CaseSplash key={project.slug} project={project} number={index + 1} />)}
    </section>
  );
}
