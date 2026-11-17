import { feedback, openSource } from "@/content";
import type { GitHubSnapshot } from "@/lib/github-client";
import { FieldFolders, type Folder } from "@/components/issue/field-folders";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });

// Open source as field reports: one folder per project, verified against the GitHub snapshot.
export function FieldReports({ snapshot }: { snapshot: GitHubSnapshot | null }) {
  const folders: Folder[] = openSource.map((repo) => {
    const fullName = new URL(repo.href).pathname.slice(1);
    const verified = snapshot?.repositories.find((item) => item.nameWithOwner.toLowerCase() === fullName.toLowerCase());
    const mergedAt = (n: number) => verified?.highlights.find((pr) => pr.number === n)?.mergedAt;
    const quote = [feedback.upstream, feedback.client].find((item) => item.href.includes(`/${fullName}/`));
    return {
      name: repo.org,
      fullName,
      about: repo.about.split(" · ")[0],
      stars: verified?.stars ?? null,
      merged: verified?.mergedCount ?? repo.prs.length,
      mergedHref: repo.mergedHref,
      quote: quote ? { text: quote.excerpt, author: quote.author, href: quote.href, pr: quote.href.match(/pull\/(\d+)/)?.[1] ?? "" } : null,
      prs: repo.prs.map((pr) => {
        const at = mergedAt(pr.number);
        return { number: pr.number, title: pr.title, why: pr.why, added: pr.added, removed: pr.removed, highlight: Boolean(pr.highlight), href: pr.href, merged: at ? dateFormat.format(new Date(at)) : null };
      }),
    };
  });
  const asOf = snapshot && dateFormat.format(new Date(snapshot.fetchedAt));

  return (
    <section id="field-reports" className="panel fr" aria-labelledby="field-reports-heading">
      <div className="fr-top">
        <div>
          <h2 id="field-reports-heading">Field Reports<i>.</i></h2>
          <p className="fr-lede">Bugs I found and fixed in other people’s code. Every report is a merged pull request, and every one links to it.</p>
        </div>
        {snapshot && (
          <div className="fr-stats">
            <svg className="seal" viewBox="0 0 120 120" role="img" aria-label="Verified on GitHub, refreshed hourly">
              <defs><path id="seal-path" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" /></defs>
              <circle cx="60" cy="60" r="56" /><circle cx="60" cy="60" r="34" />
              <text><textPath href="#seal-path">VERIFIED ON GITHUB · REFRESHED HOURLY ·</textPath></text>
              <path d="M45 61l10 10 21-24" className="check" />
            </svg>
            <p className="tot"><b>{snapshot.publicMergedCount}</b><span>public PRs merged on GitHub · as of {asOf}</span></p>
          </div>
        )}
      </div>
      <FieldFolders folders={folders} />
    </section>
  );
}
