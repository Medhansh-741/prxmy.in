import type { Metadata } from "next";
import Link from "next/link";
import { cacheLife } from "next/cache";
import {
  about,
  education,
  experience,
  feedback,
  openSource,
  profile,
  toolkit,
  wins,
} from "@/content";
import { getGitHubData } from "@/lib/github";
import { homeStructuredData, serializeJsonLd } from "@/lib/structured-data";
import {
  Arrow,
  CopyEmail,
  FanCalendar,
} from "@/components/workbench/interactions";
import {
  Motherboard,
  OpenSourceGpu,
  ProjectRack,
  Ram,
} from "@/components/workbench/hardware";
import { WorkbenchHeader, WorkbenchFooter } from "@/components/workbench/frame";
import upstream from "@/data/upstream.json";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  "use cache";
  cacheLife({ stale: 300, revalidate: 3600, expire: 86400 });
  const { snapshot } = await getGitHubData();
  const job = experience[0];
  const faceGate = openSource[2];
  return (
    <div className="workbench" id="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(homeStructuredData()),
        }}
      />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <WorkbenchHeader home />
      <main id="main">
        <section className="hw-hero wb-width" aria-labelledby="intro-heading">
          <div className="hw-introduction">
            <h1 id="intro-heading">
              Prakhar
              <br />
              Gupta
            </h1>
            <p className="hw-role">Backend & full-stack developer</p>
            <p className="hw-bio">
              I build web applications, developer tools, and civic platforms.
              Currently a web developer at{" "}
              <a
                href="https://schrader.co"
                target="_blank"
                rel="noopener noreferrer"
              >
                Schrader
              </a>{" "}
              and a CS student at Manipal University Jaipur.
            </p>
            <div className="hw-hero-actions">
              <a href="#projects" className="wb-button wb-button-primary">
                View projects <Arrow diagonal={false} />
              </a>
              <Link href="/resume" className="wb-button wb-button-outline">
                Résumé <Arrow />
              </Link>
            </div>
            <p className="hw-availability">
              <span aria-hidden="true" />
              Open to full-time & freelance work
            </p>
          </div>
          <Motherboard />
        </section>
        <section
          id="projects"
          className="hw-section wb-width"
          aria-labelledby="projects-heading"
        >
          <span id="cases" className="wb-anchor" />
          <div className="hw-section-heading">
            <div>
              <h2 id="projects-heading">Projects</h2>
              <p>
                Developer tools, civic systems, and the engineering behind them.
              </p>
            </div>
            <a
              href="https://github.com/prx-my?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
            >
              All repositories <Arrow />
            </a>
          </div>
          <ProjectRack />
        </section>
        <section
          id="open-source"
          className="hw-section wb-width"
          aria-labelledby="oss-heading"
        >
          <span id="field-reports" className="wb-anchor" />
          <div className="hw-section-heading">
            <div>
              <h2 id="oss-heading">Open source</h2>
              <p>Contributions to the tools and communities I work with.</p>
            </div>
          </div>
          <OpenSourceGpu snapshot={upstream} />
          <details className="hw-additional-oss">
            <summary>
              <span>
                Also contributed to <strong>FaceGate for macOS</strong>
              </span>
              <span aria-hidden="true">+</span>
            </summary>
            <ul className="hw-pr-list">
              {faceGate.prs.slice(0, 3).map((pr) => (
                <li key={pr.number}>
                  <a href={pr.href} target="_blank" rel="noopener noreferrer">
                    <span>#{pr.number}</span>
                    <span>{pr.title}</span>
                    <Arrow />
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </section>
        <section
          id="stack"
          className="hw-section wb-width"
          aria-labelledby="stack-heading"
        >
          <div className="hw-section-heading">
            <div>
              <h2 id="stack-heading">Tech stack</h2>
              <p>The tools I use across projects and client work.</p>
            </div>
          </div>
          <div className="hw-skills-grid">
            {toolkit.map((group) => (
              <article className="hw-skill-card" key={group.label}>
                <Ram />
                <h3>{group.label}</h3>
                <ul>
                  {group.items.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
        <section
          id="about"
          className="hw-section wb-width"
          aria-labelledby="about-heading"
        >
          <div className="hw-section-heading">
            <h2 id="about-heading">About</h2>
            <span className="hw-location">Jaipur, India</span>
          </div>
          <div className="hw-about-grid">
            <div className="hw-about-copy">
              {about.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p>
                I contribute to OWASP, Sugar Labs, and FaceGate. Outside of
                work, I’m usually listening to Spotify or getting away from the
                screen.
              </p>
              <figure className="hw-testimonial">
                <blockquote>“{feedback.client.excerpt}”</blockquote>
                <figcaption>
                  <a
                    href={feedback.client.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {feedback.client.author} <Arrow />
                  </a>
                  <span>Owner, Schrader Web Solutions</span>
                </figcaption>
              </figure>
            </div>
            <div className="hw-about-records">
              <article id="night-shift" className="hw-record">
                <h3>Experience</h3>
                <a
                  href={job.href}
                  className="hw-employer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {job.org} <Arrow />
                </a>
                <p>{job.role}</p>
                <p className="hw-record-date">{job.period} · Remote</p>
                <p>{job.points[0]}</p>
                <details className="hw-client-work">
                  <summary>
                    Client websites <span aria-hidden="true">+</span>
                  </summary>
                  <ul>
                    {job.links?.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.label}
                          <Arrow />
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              </article>
              <article id="by-day" className="hw-record">
                <h3>Education</h3>
                {education.map((school) => (
                  <div className="hw-school" key={school.name}>
                    <h4>{school.name}</h4>
                    <p>{school.degree}</p>
                    <p className="hw-record-date">
                      {school.period} · {school.note}
                    </p>
                  </div>
                ))}
              </article>
            </div>
          </div>
          <div className="hw-awards" id="recognition">
            <h3>Recognition</h3>
            {wins.map((win) => (
              <div key={win.title}>
                <span>
                  <strong>{win.title}</strong>
                  <span>{win.context}</span>
                </span>
                <span>{win.year}</span>
              </div>
            ))}
          </div>
          {snapshot && (
            <div id="city" className="hw-activity">
              <div className="hw-activity-heading">
                <h3>GitHub activity</h3>
                <span>
                  {snapshot.calendar.totalContributions.toLocaleString("en-US")}{" "}
                  contributions in one year
                </span>
              </div>
              <FanCalendar calendar={snapshot.calendar} />
              <p className="hw-data-note">
                Saved GitHub calendar, checked{" "}
                {new Date(snapshot.fetchedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "UTC",
                })}
                .
              </p>
            </div>
          )}
        </section>
        <section
          id="contact"
          className="hw-contact wb-width"
          aria-labelledby="contact-heading"
        >
          <span id="letters" className="wb-anchor" />
          <div>
            <h2 id="contact-heading">Contact</h2>
            <p>
              Open to full-time roles, freelance projects, and collaborations.
            </p>
            <a href={`mailto:${profile.email}`} className="hw-email">
              {profile.email}
              <Arrow />
            </a>
            <CopyEmail />
          </div>
          <div className="hw-contact-action">
            <Link href="/book" className="wb-button wb-button-primary">
              Book a call <Arrow />
            </Link>
            <p>30 minutes · Google Meet</p>
          </div>
        </section>
      </main>
      <WorkbenchFooter home />
    </div>
  );
}
