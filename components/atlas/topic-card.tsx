import { cn } from "@/lib/utils";
import type { KnowledgeArea } from "@/lib/atlas-content";
import { Reveal } from "./reveal";

export function TopicCard({
  area,
  className,
  delay = 0,
}: {
  area: KnowledgeArea;
  className?: string;
  delay?: number;
}) {
  return (
    <Reveal
      delay={delay}
      className={cn(
        "group relative flex flex-col gap-1.5 rounded-lg border border-cloud/8 bg-ink-card/60 p-4 transition-colors hover:border-cyan-signal/40 hover:bg-ink-raised",
        className
      )}
    >
      <span
        className="absolute left-0 top-4 h-6 w-px bg-cyan-signal/50 transition-all duration-300 group-hover:h-8"
        aria-hidden
      />
      <h3 className="pl-3 text-[0.95rem] font-semibold tracking-tight text-cloud">
        {area.title}
      </h3>
      <p className="pl-3 text-[0.78rem] leading-relaxed text-steel">
        {area.blurb}
      </p>
    </Reveal>
  );
}
