import { llmsIndex, textHeaders } from "@/lib/llm-content";

export function GET() {
  return new Response(llmsIndex(), { headers: textHeaders });
}
