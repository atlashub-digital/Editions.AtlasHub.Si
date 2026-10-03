import { Users, Cpu, TrendingUp, type LucideIcon } from "lucide-react";
import { Reveal } from "./reveal";

type Pillar = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const PILLARS: Pillar[] = [
  {
    icon: Users,
    title: "People",
    description: "Equipas e agentes inteligentes a operar no mesmo sistema.",
  },
  {
    icon: Cpu,
    title: "Technology",
    description: "Inteligência aplicada, integrada de forma discreta.",
  },
  {
    icon: TrendingUp,
    title: "Results",
    description: "Crescimento e resultados mensuráveis.",
  },
];

/**
 * PeopleTechnologyResults — closing brand band (brief §32).
 *
 * Reinforces the AtlasHub slogan "People • Technology • Results" right above the
 * footer so the homepage reads as the editorial division of an international
 * technology, intelligence and transformation company.
 */
export function PeopleTechnologyResults() {
  return (
    <section
      id="manifesto"
      className="relative overflow-hidden border-t border-cloud/10 bg-ink-soft"
      aria-labelledby="ptr-title"
    >
      {/* cyan top hairline + ambient glow */}
      <div className="absolute inset-x-0 top-0 h-px hairline" aria-hidden />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-40 w-[36rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(20,125,255,0.18), rgba(4,9,20,0) 70%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal className="flex flex-col items-center gap-3 text-center">
          <span className="eyebrow inline-flex items-center gap-2">
            <span className="h-px w-6 bg-cyan-signal/60" aria-hidden />
            AtlasHub
            <span className="h-px w-6 bg-cyan-signal/60" aria-hidden />
          </span>
          <h2
            id="ptr-title"
            className="text-balance text-3xl font-bold tracking-tight text-cloud sm:text-4xl md:text-5xl"
          >
            People <span className="text-cyan-signal">•</span> Technology{" "}
            <span className="text-cyan-signal">•</span>{" "}
            <span className="text-gradient-atlas">Results</span>
          </h2>
          <p className="max-w-2xl text-pretty text-sm leading-relaxed text-steel sm:text-base">
            A ligação entre conhecimento, capacidade e implementação. Da ideia ao
            resultado operacional — sem fronteiras.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal
                key={p.title}
                delay={i * 90}
                className="panel-atlas group flex flex-col items-center gap-3 rounded-lg p-6 text-center"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-md border border-cyan-signal/25 bg-cyan-signal/5 text-cyan-signal transition-transform duration-300 group-hover:scale-105">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <h3 className="text-base font-bold uppercase tracking-[0.18em] text-cloud">
                  {p.title}
                </h3>
                <p className="max-w-[28ch] text-sm leading-relaxed text-steel">
                  {p.description}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
