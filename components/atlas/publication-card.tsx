import Link from "next/link";
import { cn } from "@/lib/utils";
import { FLAGSHIP_BOOK } from "@/lib/atlas-content";
import { BookCover } from "./book-cover";
import { Reveal } from "./reveal";
import { ArrowRight, BookOpen, LayoutGrid, Boxes } from "lucide-react";

/**
 * PublicationCard — the featured publication block (brief §12).
 * Horizontal split: book object on the left, editorial meta + CTAs on the right.
 */
export function PublicationCard({ className }: { className?: string }) {
  const b = FLAGSHIP_BOOK;

  const ctas = [
    {
      label: b.readCta,
      href: `/livros/${b.slug}/ler`,
      icon: BookOpen,
      primary: true,
    },
    {
      label: "Explorar Toolkit",
      href: `/livros/${b.slug}/toolkit`,
      icon: Boxes,
      primary: false,
    },
    {
      label: "Frameworks",
      href: `/livros/${b.slug}#frameworks`,
      icon: LayoutGrid,
      primary: false,
    },
  ];

  return (
    <Reveal
      className={cn(
        "panel-atlas grid gap-8 rounded-xl p-6 md:grid-cols-2 md:p-10 lg:gap-12",
        className
      )}
    >
      {/* Book */}
      <div className="flex items-center justify-center md:justify-start">
        <BookCover book={b} size="md" />
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-signal">
            {b.code}
          </span>
          <span className="h-px flex-1 bg-cloud/10" aria-hidden />
          <span className="text-[0.7rem] uppercase tracking-[0.2em] text-steel-dim">
            Publicação em destaque
          </span>
        </div>

        <div>
          <h3 className="text-balance text-3xl font-extrabold uppercase leading-[0.95] tracking-tight text-cloud sm:text-4xl">
            {b.title}
            <span className="block text-gradient-atlas">{b.titleAccent}</span>
          </h3>
          <p className="mt-3 text-base text-steel">{b.subtitle}</p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-1 text-[0.78rem] text-steel">
          <span>
            <span className="text-steel-dim">Autor: </span>
            <span className="text-cloud">{b.author}</span>
          </span>
          <span>
            <span className="text-steel-dim">Edição: </span>
            <span className="text-cloud">{b.edition}</span>
          </span>
        </div>

        <p className="max-w-prose text-sm leading-relaxed text-steel">
          {b.summary}
        </p>

        <div className="mt-1 flex flex-wrap gap-3 pt-1">
          {ctas.map((c) => {
            const Icon = c.icon;
            const isLink = c.href.startsWith("/") || c.href.startsWith("#");
            const content = (
              <>
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                {c.label}
                {c.primary && (
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                )}
              </>
            );
            const cls = cn(
              "inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-[0.82rem] font-semibold transition-colors",
              c.primary
                ? "bg-electric text-cloud hover:bg-electric-bright"
                : "border border-cloud/15 text-cloud/90 hover:border-cyan-signal/40 hover:text-cloud"
            );
            return isLink ? (
              <Link key={c.label} href={c.href} className={cls}>
                {content}
              </Link>
            ) : (
              <a key={c.label} href={c.href} className={cls}>
                {content}
              </a>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}
