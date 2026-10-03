import sample from "@/content/empresa-aumentada-sample.json";
import type { Metadata } from "next";
import Link from "next/link";
import { AtlasLogo } from "@/components/atlas/atlas-logo";
import { FLAGSHIP_BOOK } from "@/lib/atlas-content";
import type { Chapter } from "@/lib/atlas-content";

export const metadata: Metadata = {
  title: "Amostra — Empresa Aumentada",
  alternates: { canonical: "/livros/empresa-aumentada/ler" },
  description:
    "Leitura de Empresa Aumentada, de Sérgio Monteiro. AtlasHub Editions.",
  robots: {
    index: false,
    follow: true,
  },
};

/** Group chapters by `part`, preserving the order defined in the content model. */
function groupChaptersByPart(chapters: Chapter[]): {
  part: string;
  items: Chapter[];
}[] {
  const groups: { part: string; items: Chapter[] }[] = [];
  for (const chapter of chapters) {
    const last = groups[groups.length - 1];
    if (last && last.part === chapter.part) {
      last.items.push(chapter);
    } else {
      groups.push({ part: chapter.part, items: [chapter] });
    }
  }
  return groups;
}

export default function ReaderPage() {
  const parts = groupChaptersByPart(FLAGSHIP_BOOK.chapters);

  const aberturaParagraphs = sample.paragraphs;

  return (
    <div className="reader-light min-h-screen bg-[#F7F8FA] font-serif text-[#14202E]">
      {/* Minimal masthead — light, sticky, discrete */}
      <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-[#F7F8FA]/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-4 px-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5"
            aria-label="AtlasHub Editions — início"
          >
            <AtlasLogo variant="mark" markSize={28} />
            <span className="inline-flex items-baseline gap-2 leading-none">
              <span className="text-[1.05rem] font-bold tracking-tight text-[#14202E]">
                Atlas<span className="text-electric">Hub</span>
              </span>
              <span className="hidden text-[0.7rem] font-medium uppercase tracking-[0.32em] text-steel-dim sm:inline">
                Editions
              </span>
            </span>
          </Link>

          <nav className="flex items-center gap-4" aria-label="Leitura">
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-steel-dim">
              EA–001
            </span>
            <span className="h-5 w-px bg-[#CBD5E1]" aria-hidden />
            <Link
              href="/livros/empresa-aumentada"
              className="text-sm font-medium text-[#14202E] transition-colors hover:text-electric"
            >
              Voltar ao livro
            </Link>
          </nav>
        </div>
      </header>

      {/* Reading content */}
      <main className="mx-auto max-w-[680px] px-5 py-16">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.32em] text-electric">
          Amostra · Capítulo 07 / 21 · Parte III
        </p>

        <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-[#14202E] md:text-5xl">
          O que é uma Empresa Aumentada?
        </h1>

        <p className="mt-4 text-lg italic leading-relaxed text-[#5A6B7E]">
          {FLAGSHIP_BOOK.subtitle}
        </p>

        <p className="mt-3 text-sm font-medium text-[#5A6B7E]">
          {FLAGSHIP_BOOK.author} · AtlasHub Editions
        </p>

        <hr className="my-8 h-px border-0 bg-[#CBD5E1]" />

        {/* Abertura — calm serif prose */}
        <div className="space-y-6 text-lg leading-[1.8] text-[#243244]">
          {aberturaParagraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {/* Índice — chapters grouped by part */}
        <section className="mt-16" aria-labelledby="indice-heading">
          <h2
            id="indice-heading"
            className="font-serif text-2xl font-bold text-[#14202E]"
          >
            Índice
          </h2>

          <div className="mt-6 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {parts.map((group) => (
              <div key={group.part} className="flex flex-col gap-3">
                <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#5A6B7E]">
                  {group.part}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {group.items.map((chapter) => (
                    <li
                      key={chapter.number}
                      className="flex items-baseline gap-3 text-[#243244]"
                    >
                      <span className="font-mono text-[0.8rem] text-[#5A6B7E]">
                        {chapter.number}.
                      </span>
                      <span className="leading-snug">{chapter.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Honest note about progressive publication */}
        <p className="mt-12 border-t border-[#E2E8F0] pt-6 text-sm italic leading-relaxed text-[#5A6B7E]">
          Esta é uma amostra do capítulo 7. A leitura integral e o eBook estão em preparação.
        </p>
      </main>

      {/* Reader footer — minimal */}
      <footer className="border-t border-[#E2E8F0]">
        <div className="mx-auto max-w-[680px] px-5 py-8 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-[#5A6B7E]">
            AtlasHub Editions · EA–001 · Edição proprietária
          </p>
          <Link
            href="/livros/empresa-aumentada"
            className="mt-4 inline-block text-sm font-medium text-[#14202E] transition-colors hover:text-electric"
          >
            ← Voltar ao livro
          </Link>
        </div>
      </footer>
    </div>
  );
}