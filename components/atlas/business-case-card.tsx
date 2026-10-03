import Image from "next/image";
import { cn } from "@/lib/utils";
import type { BusinessCase } from "@/lib/atlas-content";
import { Reveal } from "./reveal";
import { ArrowUpRight } from "lucide-react";

export function BusinessCaseCard({
  item,
  className,
  delay = 0,
}: {
  item: BusinessCase;
  className?: string;
  delay?: number;
}) {
  return (
    <Reveal
      delay={delay}
      className={cn(
        "glow-atlas group relative flex flex-col overflow-hidden rounded-lg border border-cloud/8 bg-ink-card",
        className
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(4,9,20,0.15) 0%, rgba(4,9,20,0.55) 60%, rgba(4,9,20,0.95) 100%)",
          }}
          aria-hidden
        />
        <div className="absolute left-4 top-4">
          <span className="rounded-full border border-cyan-signal/30 bg-ink/60 px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.22em] text-cyan-signal backdrop-blur-sm">
            Caso ilustrativo
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.24em] text-steel-dim">
              {item.subtitle}
            </p>
            <h3 className="mt-1 text-lg font-bold tracking-tight text-cloud">
              {item.title}
            </h3>
          </div>
          <ArrowUpRight
            className="h-4 w-4 text-cyan-signal/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.75}
          />
        </div>
        <p className="text-sm leading-relaxed text-steel">
          {item.description}
        </p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {item.topics.map((t) => (
            <span
              key={t}
              className="rounded border border-cloud/8 bg-ink-soft px-2 py-0.5 text-[0.66rem] text-steel"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
