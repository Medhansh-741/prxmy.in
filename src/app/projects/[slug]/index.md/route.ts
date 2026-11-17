import { projects } from "@/content";
import { projectMarkdown, textHeaders } from "@/lib/llm-content";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return new Response("Project not found\n", { status: 404, headers: textHeaders });
  return new Response(projectMarkdown(project), { headers: { ...textHeaders, "Content-Type": "text/markdown; charset=utf-8" } });
}
