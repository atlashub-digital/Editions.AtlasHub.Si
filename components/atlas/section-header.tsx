import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

/**
 * SectionHeader — eyebrow + title + optional description, left aligned.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <span className="eyebrow inline-flex items-center gap-2">
          <span className="h-px w-6 bg-cyan-signal/60" aria-hidden />
          {eyebrow}
        </span>
      )}
      <h2 className="max-w-3xl text-balance text-3xl font-bold tracking-tight text-cloud sm:text-4xl md:text-[2.6rem] md:leading-[1.1]">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-pretty text-sm leading-relaxed text-steel sm:text-base">
          {description}
        </p>
      )}
    </Reveal>
  );
}
