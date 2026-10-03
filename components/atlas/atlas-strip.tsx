import { FAIXA_WORDS } from "@/lib/atlas-content";

function WordSet() {
  return (
    <span className="inline-flex items-center" aria-hidden>
      {FAIXA_WORDS.map((word) => (
        <span key={word} className="inline-flex items-center">
          <span className="mx-6 text-[0.7rem] font-medium uppercase tracking-[0.34em] text-steel sm:text-xs">
            {word}
          </span>
          <span className="text-cyan-signal/70">•</span>
        </span>
      ))}
    </span>
  );
}

/**
 * AtlasHubStrip — marquee bridging the hero and the editorial content.
 * Six AtlasHub concepts: IDEIAS • OPERAÇÕES • TECNOLOGIA • AUTOMAÇÃO •
 * CRESCIMENTO • RESULTADOS. Pauses on hover; reduced-motion safe.
 */
export function AtlasHubStrip() {
  return (
    <div
      className="marquee-atlas-paused relative overflow-hidden border-y border-cloud/10 bg-ink-soft"
      role="marquee"
      aria-label="AtlasHub — Ideias, Operações, Tecnologia, Automação, Crescimento, Resultados"
    >
      {/* top hairline glow */}
      <div className="absolute inset-x-0 top-0 h-px hairline" aria-hidden />
      <div className="marquee-track py-3.5">
        <WordSet />
        <WordSet />
      </div>
    </div>
  );
}
