import type { Metadata } from "next";
import Link from "next/link";
import { WorkbenchHeader, WorkbenchFooter } from "@/components/workbench/frame";
import { Arrow } from "@/components/workbench/interactions";

export const metadata: Metadata = {
  title: { absolute: "Page not found · Prakhar Gupta" },
  description:
    "This page could not be found. Return to Prakhar Gupta’s portfolio or explore his projects.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="workbench" id="top">
      <WorkbenchHeader />
      <main className="wb-width hw-not-found">
        <h1>Page not found</h1>
        <p>
          The link may have changed. You can return to the portfolio or explore
          the projects.
        </p>
        <Link href="/" className="wb-button wb-button-primary">
          Back to portfolio <Arrow />
        </Link>
      </main>
      <WorkbenchFooter />
    </div>
  );
}
