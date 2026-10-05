import { SiteHeader } from "@/components/atlas/site-header";
import { SiteFooter } from "@/components/atlas/site-footer";
import { PublicationCard } from "@/components/atlas/publication-card";
import { publications } from "@/lib/catalog";
export const metadata = {
  title: "Livros e publicações",
  description: "O catálogo da AtlasHub Editions: Empresa Aumentada e publicações em preparação.",
  alternates: { canonical: "/livros" },
};
export default function BooksPage() {
  return <div className="flex min-h-screen flex-col">
    <SiteHeader />
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
      <p className="eyebrow">AtlasHub Editions</p>
      <h1 className="mt-4 text-4xl font-bold text-cloud sm:text-5xl">Livros e publicações</h1>
      <p className="mt-5 mb-12 max-w-2xl text-steel">Edições abertas à comunidade. Leia online e descarregue gratuitamente, sem registo. Explore a publicação em destaque e acompanhe os próximos títulos.</p>
      <PublicationCard />
      <section id="em-preparacao" className="mt-16 scroll-mt-24" aria-labelledby="coming-title">
        <h2 id="coming-title" className="text-2xl font-bold text-cloud">Em preparação</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {publications.filter(p => p.status === "coming-soon").map(p =>
            <article key={p.code} className="panel-atlas rounded-lg p-6">
              <p className="eyebrow">{p.code} · {p.kind}</p>
              <h3 className="mt-4 text-xl font-semibold text-cloud">{p.title}</h3>
              <p className="mt-3 text-steel">{p.subtitle}</p>
              <p className="mt-5 text-sm text-steel">Em preparação</p>
            </article>
          )}
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>;
}
