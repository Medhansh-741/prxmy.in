import { projects } from "@/content";
import { portfolioMarkdown, projectMarkdown, textHeaders } from "@/lib/llm-content";

export function GET() {
  return new Response([portfolioMarkdown(), ...projects.map(projectMarkdown)].join("\n---\n\n"), { headers: textHeaders });
}
