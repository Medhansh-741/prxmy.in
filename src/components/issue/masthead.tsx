import Link from "next/link";
import { portfolio } from "@/content";
import { QuickNavigation } from "@/components/quick-navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Wordmark } from "@/components/wordmark";

// The issue's masthead on the black page: wordmark, section links, index and theme.
export function IssueMasthead() {
  return (
    <header className="issue-mast">
      <Link className="issue-wordmark" href="/" aria-label="prxmy — Prakhar Gupta, home"><Wordmark /></Link>
      <nav aria-label="Main navigation">
        <Link href="/#cases">Cases</Link>
        <Link href="/#night-shift">Night shift</Link>
        <Link href="/#field-reports">Field reports</Link>
        <Link href="/#letters">Letters</Link>
      </nav>
      <div className="issue-tools"><QuickNavigation items={portfolio.index} /><ThemeToggle /></div>
    </header>
  );
}
