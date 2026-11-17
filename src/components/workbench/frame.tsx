import Link from "next/link";
import { profile } from "@/content";
import { Arrow } from "./interactions";
import "@/app/workbench.css";

export function WorkbenchHeader({ home = false }: { home?: boolean }) {
  return (
    <header className="wb-nav wb-width">
      <Link
        className="wb-brand"
        href={home ? "#top" : "/"}
        aria-label={home ? "prxmy — back to top" : "prxmy — back to portfolio"}
      >
        <span className="wb-brand-icon" aria-hidden="true">
          p<span>_</span>
        </span>
        prxmy<span className="wb-brand-dot">.</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href={`${home ? "" : "/"}#projects`}>Work</Link>
        <Link href={`${home ? "" : "/"}#open-source`}>Open source</Link>
        <Link href={`${home ? "" : "/"}#stack`}>Skills</Link>
        <Link href={`${home ? "" : "/"}#about`}>About</Link>
        <Link href={`${home ? "" : "/"}#contact`}>Contact</Link>
      </nav>
      <Link href="/resume" className="wb-nav-resume">
        Résumé <Arrow />
      </Link>
    </header>
  );
}

export function WorkbenchFooter({ home = false }: { home?: boolean }) {
  return (
    <footer className="wb-footer wb-width">
      <Link href={home ? "#top" : "/"} className="wb-footer-brand">
        prxmy<span>.</span>
      </Link>
      <p>
        © 2026 Prakhar Gupta
        <br />
        <span>Jaipur, India</span>
      </p>
      <div>
        {profile.links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label}
            <Arrow />
          </a>
        ))}
      </div>
      <a href="#top" className="wb-back-top" aria-label="Back to top">
        ↑
      </a>
    </footer>
  );
}
