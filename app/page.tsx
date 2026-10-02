import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BookCover } from "@/components/BookCover";
import { PublicationCard } from "@/components/PublicationCard";
import { publications } from "@/lib/catalog";

export default function EditionsHome() {
  return (
    <main>
      <SiteHeader />

      <section className="home-hero shell">
        <div className="hero-copy">
          <p className="eyebrow">ATLASHUB EDITIONS</p>
          <h1>Ideas for the<br /><em>Augmented Age.</em></h1>
          <p className="hero-lead">Books, research and executive intelligence for people building the next generation of organizations.</p>
          <div className="hero-actions">
            <Link className="button primary" href="/livros">Explore Editions</Link>
            <a className="button ghost" href="#research">Latest Research</a>
          </div>
        </div>
        <Link className="featured-cover-wrap" href="/livros/empresa-aumentada" aria-label="Open Empresa Aumentada">
          <div className="cover-glow" />
          <BookCover />
        </Link>
      </section>

      <section className="featured shell">
        <div className="feature-index">FEATURED EDITION · EA–001</div>
        <div className="feature-grid">
          <div>
            <h2>Empresa Aumentada</h2>
            <p className="feature-subtitle">Da Inteligência Artificial à Organização Inteligente</p>
          </div>
          <div className="feature-copy">
            <p>Uma proposta de desenho organizacional para empresas em que pessoas, agentes inteligentes, tecnologia e processos passam a operar como partes de um mesmo sistema.</p>
            <div className="text-actions">
              <Link href="/livros/empresa-aumentada">Explore the book →</Link>
              <Link href="/livros/empresa-aumentada/ler">Read online →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="catalogue shell">
        <div className="section-kicker">CATALOGUE</div>
        <div className="catalogue-title"><h2>Publishing intelligence,<br />not content volume.</h2><p>Long-form work, executive research and practical frameworks designed to remain useful beyond the news cycle.</p></div>
        <div className="publication-grid">
          {publications.map((item) => <PublicationCard item={item} key={item.code} />)}
        </div>
      </section>

      <section id="research" className="editorial-manifesto">
        <div className="shell manifesto-grid">
          <p className="eyebrow">THE EDITORIAL PRINCIPLE</p>
          <blockquote>Technology becomes valuable when it changes a variable that matters.</blockquote>
          <div className="manifesto-equation"><span>Revenue ↑</span><span>Costs ↓</span><span>Speed ↑</span><span>Control ↑</span></div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
