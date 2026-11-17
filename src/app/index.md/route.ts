import { portfolioMarkdown, textHeaders } from "@/lib/llm-content";

export function GET() {
  return new Response(portfolioMarkdown(), { headers: { ...textHeaders, "Content-Type": "text/markdown; charset=utf-8" } });
}
