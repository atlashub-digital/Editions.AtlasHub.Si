import { cn } from "@/lib/utils";
import type { Category } from "@/lib/atlas-content";
import { Reveal } from "./reveal";

export function CategoryCard({
  category,
  className,
  delay = 0,
}: {
  category: Category;
  className?: string;
  delay?: number;
}) {
  return (
    <Reveal
      delay={delay}
      className={cn(
        "glow-atlas panel-atlas group relative flex h-full flex-col gap-4 rounded-lg p-6",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-cyan-signal">
          {String(category.key).padStart(2, "0")}
        </span>
        {category.count && (
          <span className="rounded-full border border-cloud/10 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.2em] text-steel">
            {category.count}
          </span>
        )}
      </div>
      <h3 className="text-lg font-bold uppercase tracking-tight text-cloud">
        {category.title}
      </h3>
      <p className="text-sm leading-relaxed text-steel">
        {category.description}
      </p>
      <div className="mt-auto flex items-center gap-2 pt-2 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-cyan-signal/80 transition-colors group-hover:text-cyan-signal">
        {category.count === "Em preparação" ? "Em preparação" : "AtlasHub Editions"}
        <span aria-hidden>→</span>
      </div>
    </Reveal>
  );
}
