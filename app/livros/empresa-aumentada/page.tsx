import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/atlas/site-header";
import { SiteFooter } from "@/components/atlas/site-footer";
import { BookCover } from "@/components/atlas/book-cover";
import { SectionHeader } from "@/components/atlas/section-header";
import { Reveal } from "@/components/atlas/reveal";
import { FLAGSHIP_BOOK } from "@/lib/atlas-content";
import type { Chapter } from "@/lib/atlas-content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Empresa Aumentada",
  description: FLAGSHIP_BOOK.summary,
  alternates: {
    canonical: "/livros/empresa-aumentada",
  },
  openGraph: {
    title: "Empresa Aumentada · AtlasHub Editions",
    description: FLAGSHIP_BOOK.summary,
    url: "https://editions.atlashub.si/livros/empresa-aumentada",
    type: "book",
    locale: "pt_PT",
    authors: [FLAGSHIP_BOOK.author],
  },
  twitter: {
    card: "summary_large_image",
    title: "Empresa Aumentada · AtlasHub Editions",
    description: FLAGSHIP_BOOK.summary,
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

function MetaRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-steel-dim">
        {label}
      </dt>
      <dd className="text-sm font-medium text-cloud">{value}</dd>
    </div>
  );
}

export default function BookDetailPage() {
  const toolkitIncludes = FLAGSHIP_BOOK.frameworks.map(f => ({ title: f.title, description: f.description }));

  const parts = groupChaptersByPart(FLAGSHIP_BOOK.chapters);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        {/* ----------------------------------------------------------------
            1. Book masthead
           ---------------------------------------------------------------- */}
        <section
          className="relative overflow-hidden bg-ink"
          aria-labelledby="book-masthead-title"
        >
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(circle at 75% 35%, rgba(20,125,255,0.18), transparent 65%)",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px hairline"
            aria-hidden
          />

          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
              {/* Left — book cover */}
              <div className="flex justify-center lg:col-span-5 lg:justify-start">
                <div className="relative">
                  <div
                    className="pointer-events-none absolute -inset-8 -z-10 animate-glow-pulse rounded-full blur-3xl"
                    style={{
                      background:
                        "radial-gradient(circle at 60% 40%, rgba(85,199,255,0.28), rgba(4,9,20,0) 65%)",
                    }}
                    aria-hidden
                  />
                  <BookCover book={FLAGSHIP_BOOK} size="lg" />
                </div>
              </div>

              {/* Right — title, meta, description, CTAs */}
              <div className="lg:col-span-7">
                <span className="eyebrow inline-flex items-center gap-2">
                  <span className="h-px w-8 bg-cyan-signal/70" aria-hidden />
                  AtlasHub Editions · EA–001
                </span>

                <h1
                  id="book-masthead-title"
                  className="mt-5 text-balance text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-cloud sm:text-5xl lg:text-6xl"
                >
                  {FLAGSHIP_BOOK.title}
                  <span className="mt-1 block text-gradient-atlas">
                    {FLAGSHIP_BOOK.titleAccent}
                  </span>
                </h1>

                <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-steel">
                  {FLAGSHIP_BOOK.subtitle}
                </p>

                <dl className="mt-7 grid grid-cols-2 gap-4 border-y border-cloud/10 py-5 sm:grid-cols-3 lg:grid-cols-5">
                  <MetaRow label="Autor" value={FLAGSHIP_BOOK.author} />
                  <MetaRow label="Edição" value={FLAGSHIP_BOOK.edition} />
                  <MetaRow label="Capítulos" value={String(FLAGSHIP_BOOK.chapterCount)} />
                  <MetaRow label="Idioma" value={FLAGSHIP_BOOK.language} />
                  <MetaRow label="Partes" value={String(FLAGSHIP_BOOK.partCount)} />
                </dl>

                <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-steel">
                  {FLAGSHIP_BOOK.description}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
                  <Link
                    href="/livros/empresa-aumentada/ler"
                    className="group inline-flex items-center justify-center gap-2 rounded-md bg-electric px-6 py-3.5 text-sm font-semibold text-cloud transition-colors hover:bg-electric-bright"
                  >
                    {FLAGSHIP_BOOK.readCta}
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      strokeWidth={1.75}
                    />
                  </Link>
                  <span className="text-sm text-steel">eBook em preparação</span>
                  <Link
                    href="#toolkit"
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-cloud/20 px-6 py-3.5 text-sm font-semibold text-cloud transition-colors hover:border-cyan-signal/50"
                  >
                    Explorar Toolkit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------
            2. Toolkit executivo
           ---------------------------------------------------------------- */}
        <section
          id="toolkit"
          className="scroll-mt-20 border-t border-cloud/10"
          aria-labelledby="toolkit-title"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <SectionHeader
              eyebrow="Toolkit executivo"
              title={
                <span id="toolkit-title">
                  Toolkit <span className="text-gradient-atlas">executivo</span>
                </span>
              }
              description="Modelos, frameworks e casos empresariais para converter o livro em operação."
              className="mb-12"
            />

            <div className="grid gap-6 lg:grid-cols-2">
              <Reveal className="panel-atlas flex flex-col rounded-lg p-6">
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-cyan-signal">
                  O que inclui
                </span>
                <h3 className="mt-3 text-lg font-semibold text-cloud">
                  Do conceito à execução
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-steel">
                  Os modelos apresentados no manuscrito apoiam o desenho organizacional. Os casos são cenários compostos e ilustrativos. Os materiais para download estão em preparação.
                </p>
                <ul className="mt-6 flex flex-col gap-3">
                  {toolkitIncludes.map((item) => (
                    <li
                      key={item.title}
                      className="flex items-start gap-3 text-sm text-cloud"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-signal"
                        aria-hidden
                      />
                      <span className="leading-relaxed">
                        <strong className="font-semibold">{item.title}</strong>
                        <span className="text-steel"> — {item.description}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal
                delay={80}
                className="panel-atlas glow-atlas flex flex-col rounded-lg p-6"
              >
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-cyan-signal">
                  EA–001 · Toolkit
                </span>
                <h3 className="mt-3 text-lg font-semibold text-cloud">
                  Da leitura à aplicação
                </h3>
                <p className="mt-6 text-sm leading-relaxed text-steel">Pessoas, agentes, tecnologia e processos. Receita ↑ · Custos ↓ · Velocidade ↑ · Controlo ↑.</p>
                <div className="mt-auto pt-6">
                  <Link
                    href="#frameworks"
                    className="group inline-flex items-center gap-2 text-sm font-medium text-cyan-signal transition-colors hover:text-cyan-bright"
                  >
                    Ver frameworks
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                      strokeWidth={1.75}
                    />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------
            3. Frameworks
           ---------------------------------------------------------------- */}
        <section
          id="frameworks"
          className="scroll-mt-20 border-t border-cloud/10 bg-ink-soft"
          aria-labelledby="frameworks-title"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <SectionHeader
              eyebrow="Frameworks"
              title={
                <span id="frameworks-title">
                  Frameworks{" "}
                  <span className="text-gradient-atlas">aplicáveis</span>
                </span>
              }
              description="Modelos aplicáveis do diagnóstico ao resultado."
              className="mb-12"
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FLAGSHIP_BOOK.frameworks.map((fw, i) => (
                <Reveal
                  key={fw.code}
                  delay={i * 60}
                  className={cn(
                    "panel-atlas glow-atlas relative flex flex-col gap-3 overflow-hidden rounded-lg p-6",
                    i === 0 && "ring-1 ring-cyan-signal/30"
                  )}
                >
                  {i === 0 && (
                    <div
                      className="absolute inset-x-0 top-0 h-px hairline"
                      aria-hidden
                    />
                  )}
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-cyan-signal">
                    {fw.code}
                  </span>
                  <h3 className="text-lg font-semibold leading-snug text-cloud">
                    {fw.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-steel">
                    {fw.description}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------
            4. Índice — chapters grouped by part
           ---------------------------------------------------------------- */}
        <section
          id="indice"
          className="scroll-mt-20"
          aria-labelledby="indice-title"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <SectionHeader
              eyebrow="Índice"
              title={
                <span id="indice-title">
                  {FLAGSHIP_BOOK.chapterCount} capítulos em{" "}
                  <span className="text-gradient-atlas">cinco Partes</span>
                </span>
              }
              description="Da Inteligência Artificial à Organização Inteligente, em cinco Partes."
              className="mb-12"
            />

            <Reveal className="panel-atlas scrollbar-atlas rounded-xl p-6 md:p-10">
              <div className="grid gap-x-12 gap-y-10 lg:grid-cols-2">
                {parts.map((group) => (
                  <div key={group.part} className="flex flex-col gap-4">
                    <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-signal">
                      {group.part}
                    </h3>
                    <ul className="flex flex-col divide-y divide-cloud/5">
                      {group.items.map((chapter) => (
                        <li
                          key={chapter.number}
                          className="flex items-baseline gap-4 py-3"
                        >
                          <span className="font-mono text-[0.8rem] text-steel-dim">
                            {chapter.number}
                          </span>
                          <span className="text-sm text-cloud sm:text-base">
                            {chapter.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ----------------------------------------------------------------
            5. Closing CTA band
           ---------------------------------------------------------------- */}
        <section
          className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
          aria-labelledby="closing-title"
        >
          <Reveal className="panel-atlas relative overflow-hidden rounded-2xl p-8 text-center md:p-14">
            <div
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  "radial-gradient(circle at 50% 0%, rgba(20,125,255,0.18), transparent 60%)",
              }}
              aria-hidden
            />
            <span className="eyebrow inline-flex items-center gap-2">
              <span className="h-px w-6 bg-cyan-signal/60" aria-hidden />
              Leitura
            </span>
            <h2
              id="closing-title"
              className="mt-4 text-3xl font-bold tracking-tight text-cloud sm:text-4xl"
            >
              Pronto para começar?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-pretty text-sm leading-relaxed text-steel sm:text-base">
              Leia uma amostra do capítulo 7 e conheça a proposta da Empresa Aumentada.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <Link
                href="/livros/empresa-aumentada/ler"
                className="group inline-flex items-center justify-center gap-2 rounded-md bg-electric px-6 py-3.5 text-sm font-semibold text-cloud transition-colors hover:bg-electric-bright"
              >
                {FLAGSHIP_BOOK.readCta}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={1.75}
                />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-cloud/20 px-6 py-3.5 text-sm font-semibold text-cloud transition-colors hover:border-cyan-signal/50"
              >
                Voltar à homepage
              </Link>
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}