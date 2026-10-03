import Link from "next/link";
import { AtlasLogo } from "./atlas-logo";
import {
  SITE_NAV,
  KNOWLEDGE_AREAS,
  FLAGSHIP_BOOK,
} from "@/lib/atlas-content";

const PUBLICATIONS = [
  { code: "EA–001", title: "Empresa Aumentada", href: "/livros/empresa-aumentada", status: "Disponível" },
  { code: "EA–002", title: "Em preparação", href: "/livros#em-preparacao", status: "Em preparação" },
  { code: "EA–003", title: "Em preparação", href: "/livros#em-preparacao", status: "Em preparação" },
];

const ECOSYSTEM_DOMAINS = [
  { label: "Editions", href: "/" },
  { label: "AtlasHub.SI", href: "https://atlashub.si" },
];

function Column({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[0.7rem] font-medium uppercase tracking-[0.3em] text-steel-dim">
        {title}
      </h3>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full border-t border-cloud/10 bg-ink-soft">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 flex flex-col gap-5 lg:col-span-2">
            <AtlasLogo variant="full" />
            <p className="max-w-sm text-sm leading-relaxed text-steel">
              Conhecimento para empresas reais. Livros, research, frameworks e
              inteligência aplicada para transformar tecnologia em resultados.
            </p>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.32em] text-cyan-signal/80">
              People · Technology · Results
            </p>
          </div>

          {/* Navegação */}
          <Column title="Navegação">
            {SITE_NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-steel transition-colors hover:text-cloud"
              >
                {item.label}
              </Link>
            ))}
          </Column>

          {/* Publicações */}
          <Column title="Publicações">
            {PUBLICATIONS.map((p) => (
              <Link
                key={p.code}
                href={p.href}
                className="group inline-flex items-center gap-2 text-sm text-steel transition-colors hover:text-cloud"
              >
                <span className="font-mono text-[0.7rem] text-cyan-signal/70">
                  {p.code}
                </span>
                <span className="truncate">{p.title}</span>
              </Link>
            ))}
          </Column>

          {/* Áreas */}
          <Column title="Áreas">
            {KNOWLEDGE_AREAS.slice(0, 6).map((area) => (
              <span
                key={area.title}
                className="text-sm text-steel transition-colors hover:text-cloud"
              >
                {area.title}
              </span>
            ))}
          </Column>
        </div>

        {/* Ecosystem line */}
        <div className="mt-12 flex flex-col gap-4 border-t border-cloud/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {ECOSYSTEM_DOMAINS.map((d) => (
              <a
                key={d.label}
                href={d.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.72rem] font-medium uppercase tracking-[0.2em] text-steel transition-colors hover:text-cyan-signal"
              >
                {d.label}
              </a>
            ))}
          </div>
          <a
            href={`/livros/${FLAGSHIP_BOOK.slug}`}
            className="text-[0.72rem] font-medium uppercase tracking-[0.2em] text-steel transition-colors hover:text-cyan-signal"
          >
            Ler EA–001 →
          </a>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col gap-3 border-t border-cloud/10 pt-6 text-[0.72rem] text-steel-dim sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} AtlasHub. Edição proprietária — AtlasHub Editions. Todos os
            direitos reservados.
          </p>
          <p className="tracking-[0.18em]">
            editions.atlashub.si
          </p>
        </div>
      </div>
    </footer>
  );
}
