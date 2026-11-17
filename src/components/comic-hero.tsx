import { hero, profile } from "@/content";
import { Caption, FocusLines, PencilNote } from "@/components/comic";
import { CoverComic } from "@/components/cover-comic";
import { Arrow, ExtLink } from "@/components/ui";

// The cover: the name and one button on a lamp-lit desk, beside issue #1 of
// The Prxmy Files as an object you can tilt and open. Black in both themes.
export function ComicHero({ weeks }: { weeks: number[] }) {
  const [first, ...rest] = profile.name.split(" ");
  const city = profile.location.split(",")[0];

  return (
    <section className="cover" id="cover" aria-labelledby="hero-heading">
      <div className="cover-in">
        <div className="cover-copy">
          <h1 id="hero-heading" className="cover-name">
            <span>{first}</span> <span>{rest.join(" ")}</span>
          </h1>
          <Caption className="cover-role">{profile.role} · {city}</Caption>
          <p className="cover-intro">{hero.intro}</p>
          <div className="cover-cta">
            <FocusLines />
            <a href="#letters" className="comic-btn">{hero.cta} <span aria-hidden="true">→</span></a>
            <PencilNote>{hero.ctaNote}</PencilNote>
          </div>
          <ul className="cover-links" aria-label="Résumé and profiles">
            <li><a href="/resume">Résumé</a></li>
            {profile.links.map((link) => (
              <li key={link.label}><ExtLink href={link.href}>{link.label}<Arrow /></ExtLink></li>
            ))}
          </ul>
        </div>
        <CoverComic weeks={weeks} copy={hero} availability={profile.availability} />
      </div>
    </section>
  );
}
