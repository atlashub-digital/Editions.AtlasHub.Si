import { cn } from "@/lib/utils";
import { ECOSYSTEM_STEPS } from "@/lib/atlas-content";
import { Reveal } from "./reveal";
import { ArrowRight } from "lucide-react";

/**
 * EcosystemFlow — the AtlasHub ecosystem progression:
 * EDITIONS → ACADEMY → APP → ATLASHUB.
 * Horizontal on desktop with flow connectors; vertical on mobile.
 */
export function EcosystemFlow({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-stretch",
        className
      )}
    >
      {ECOSYSTEM_STEPS.map((step, i) => {
        const active = i === 0;
        return (
          <div key={step.label} className="contents">
            <Reveal
              delay={i * 90}
              className={cn(
                "panel-atlas relative flex h-full flex-col gap-2 rounded-lg p-5",
                active && "border-cyan-signal/40 bg-ink-raised"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-cyan-signal">
                  {step.index}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[0.58rem] uppercase tracking-[0.18em]",
                    active
                      ? "bg-cyan-signal/15 text-cyan-signal"
                      : "border border-cloud/10 text-steel-dim"
                  )}
                >
                  {step.status}
                </span>
              </div>
              <h3 className="text-base font-bold uppercase tracking-tight text-cloud">
                {step.label}
              </h3>
              <p className="text-sm leading-relaxed text-steel">
                {step.description}
              </p>
              {step.status === "Em preparação" ? <span className="mt-auto pt-2 text-xs text-steel">{step.domain}</span> : <a
                href={step.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-1 pt-2 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-steel-dim transition-colors hover:text-cyan-signal"
              >
                {step.domain}
              </a>}
              {active && (
                <span
                  className="absolute inset-x-0 top-0 h-px hairline"
                  aria-hidden
                />
              )}
            </Reveal>

            {i < ECOSYSTEM_STEPS.length - 1 && (
              <div
                className="flex items-center justify-center text-cyan-signal/40 lg:px-1"
                aria-hidden
              >
                <ArrowRight
                  className="hidden h-5 w-5 lg:block"
                  strokeWidth={1.5}
                />
                <span className="lg:hidden">↓</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
