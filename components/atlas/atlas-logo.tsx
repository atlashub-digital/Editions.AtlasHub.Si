import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * AtlasLogo — the AtlasHub brand lockup.
 *
 * Per brief §20: the provided AtlasHub mark is used as-is (never redrawn,
 * never re-proportioned). The wordmark "AtlasHub | EDITIONS" is rendered as
 * real text (brief §27: never rasterise important text).
 *
 * Variants:
 *   - "full"      : mark + AtlasHub wordmark + EDITIONS tail  (header default)
 *   - "compact"   : mark + AtlasHub wordmark only
 *   - "mark"      : the symbol only
 */
export function AtlasLogo({
  variant = "full",
  className,
  markSize = 36,
}: {
  variant?: "full" | "compact" | "mark";
  className?: string;
  markSize?: number;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 select-none",
        className
      )}
    >
      <Image
        src="/assets/atlas/atlashub-logo.png"
        alt="AtlasHub"
        width={markSize}
        height={markSize}
        priority
        sizes={`${markSize}px`}
        className="shrink-0 object-contain"
      />
      {variant !== "mark" && (
        <span className="inline-flex items-baseline gap-2 leading-none">
          <span className="text-[1.05rem] font-bold tracking-tight text-cloud">
            Atlas<span className="text-electric">Hub</span>
          </span>
          {variant === "full" && (
            <>
              <span className="h-3.5 w-px bg-cloud/20" aria-hidden />
              <span className="text-[0.7rem] font-medium uppercase tracking-[0.32em] text-steel">
                Editions
              </span>
            </>
          )}
        </span>
      )}
    </span>
  );
}
