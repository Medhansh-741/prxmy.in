import type { ReactNode } from "react";
import { WorkbenchHeader, WorkbenchFooter } from "@/components/workbench/frame";

export function EditorialPage({
  current,
  children,
}: {
  current: "book" | "aws";
  children: ReactNode;
}) {
  return (
    <div className="workbench wb-editorial-page" id="top" data-page={current}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <WorkbenchHeader />
      <main id="main" className="wb-width editorial-main">
        {children}
      </main>
      <WorkbenchFooter />
    </div>
  );
}
