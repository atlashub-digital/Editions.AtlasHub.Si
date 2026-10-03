import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FLAGSHIP_BOOK, HERO_METRICS } from "@/lib/atlas-content";
import { BookCover } from "./book-cover";
import { MetricItem } from "./metric";

/**
 * Hero — the signature AtlasHub Editions hero (brief §6–§10).
 *
 * Layout: 12-col grid. Left holds the eyebrow, two-line headline with the
 * cyan→electric gradient on "EMPRESAS REAIS.", the subheadline, dual CTAs and
 * the metrics row. Right holds the 3D book object.
 *
 * Background is a cinematic office-at-dusk photograph (brief §9) darkened with
 * navy overlays so text stays fully legible (brief §9 — "garantir forte
 * legibilidade", "usar overlays navy").
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background image + navy overlays */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <Image
          src="/assets/atlas/hero-office.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* overall navy grade for legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(4,9,20,0.78) 0%, rgba(4,9,20,0.55) 35%, rgba(4,9,20,0.92) 100%)",
          }}
        />
        {/* left-weighted legibility wash */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(4,9,20,0.92) 0%, rgba(4,9,20,0.70) 38%, rgba(4,9,20,0.20) 70%, rgba(4,9,20,0.10) 100%)",
          }}
        />
        {/* subtle cyan glow accent */}
        <div
          className="absolute right-0 top-1/4 h-[28rem] w-[28rem] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(20,125,255,0.20), rgba(4,9,20,0) 70%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left — copy + CTAs + metrics */}
          <div className="lg:col-span-7 xl:col-span-6">
            <span className="eyebrow inline-flex items-center gap-2">
              <span className="h-px w-8 bg-cyan-signal/70" aria-hidden />
              AtlasHub Editions · EA–001
            </span>

            <h1 className="mt-6 text-balance text-[clamp(1.8rem,8vw,2.35rem)] font-extrabold uppercase leading-[0.95] tracking-tight text-cloud sm:text-5xl md:text-6xl lg:text-7xl">
              CONHECIMENTO PARA
              <span className="mt-1 block text-gradient-atlas">
                EMPRESAS REAIS.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-steel sm:text-lg">
              Livros, research, frameworks e inteligência aplicada para
              transformar tecnologia em resultados.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/livros"
                className="group inline-flex items-center justify-center gap-2 rounded-md bg-electric px-6 py-3.5 text-sm font-semibold text-cloud transition-colors hover:bg-electric-bright"
              >
                Explorar Publicações
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={1.75}
                />
              </Link>
              <Link
                href={`/livros/${FLAGSHIP_BOOK.slug}`}
                className="group inline-flex items-center justify-center gap-2 rounded-md border border-cloud/20 px-6 py-3.5 text-sm font-semibold text-cloud transition-colors hover:border-cyan-signal/50"
              >
                Empresa Aumentada
                <ArrowRight
                  className="h-4 w-4 text-cyan-signal transition-transform group-hover:translate-x-0.5"
                  strokeWidth={1.75}
                />
              </Link>
            </div>

            {/* Metrics */}
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-cloud/10 pt-8 sm:grid-cols-4 sm:gap-x-8">
              {HERO_METRICS.map((m) => (
                <MetricItem key={m.label} metric={m} />
              ))}
            </div>
          </div>

          {/* Right — book object */}
          <div className="flex justify-center lg:col-span-5 xl:col-span-6 lg:justify-end">
            <div className="relative">
              {/* blue light movement behind the book */}
              <div
                className="pointer-events-none absolute -inset-10 -z-10 animate-glow-pulse rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle at 60% 40%, rgba(85,199,255,0.30), rgba(4,9,20,0) 65%)",
                }}
                aria-hidden
              />
              <BookCover book={FLAGSHIP_BOOK} size="lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
