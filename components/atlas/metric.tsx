import { BookOpen, Boxes, BarChart3, Briefcase, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Metric } from "@/lib/atlas-content";

const ICONS: Record<Metric["icon"], LucideIcon> = {
  chapters: BookOpen,
  frameworks: Boxes,
  cases: BarChart3,
  toolkit: Briefcase,
};

export function MetricItem({
  metric,
  className,
}: {
  metric: Metric;
  className?: string;
}) {
  const Icon = ICONS[metric.icon];
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-cyan-signal/25 bg-cyan-signal/5 text-cyan-signal"
        aria-hidden
      >
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-2xl font-bold tracking-tight text-cloud">
          {metric.value}
        </span>
        <span className="mt-1 text-xs uppercase tracking-[0.18em] text-steel">
          {metric.label}
        </span>
      </span>
    </div>
  );
}
