import Link from "next/link";
import { BookCover } from "@/components/BookCover";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Empresa Aumentada",
  description: "Da Inteligência Artificial à Organização Inteligente — Sérgio Monteiro.",
};

const toc = [
  "Da Inteligência Artificial à Inteligência Operacional",
  "Estamos a usar IA da forma errada?",
  "A Empresa Aumentada",
  "A Empresa em Funcionamento",
  "A Equação da Empresa Aumentada",
];

export default function EmpresaAumentadaPage() {
  return (
    <main>
      <SiteHeader />
      <section className="book-hero shell">
        <div className="book-hero-copy">
          <p className="eyebrow">EA–001 · BOOK · 1.ª EDIÇÃO · OUTUBRO 2026</p>
          <h1>Empresa<br /><em>Aumentada</em></h1>
          <p className="book-subtitle">Da Inteligência Artificial à Organização Inteligente</p>
          <p className="book-author">Sérgio Monteiro</p>
          <div className="hero-actions">
            <Link className="button primary" href="/livros/empresa-aumentada/ler">Começar a ler</Link>
            <a className="button ghost" href="#edition">Sobre a edição</a>
          </div>
        </div>
        <div className="book-cover-stage"><div className="cover-glow" /><BookCover /></div>
      </section>

      <section className="book-manifesto shell">
        <div className="manifesto-label">THE QUESTION</div>
        <blockquote>Se já sabemos organizar pessoas em torno de objetivos, responsabilidades, limites e resultados, por que continuamos a utilizar sistemas inteligentes como ferramentas isoladas à espera da próxima instrução?</blockquote>
      </section>

      <section className="book-equation">
        <div className="shell">
          <p className="eyebrow">A EQUAÇÃO DA EMPRESA AUMENTADA</p>
          <div className="equation-grid"><span>Receita ↑</span><span>Custos ↓</span><span>Velocidade ↑</span><span>Controlo ↑</span></div>
          <p className="equation-note">Tecnologia só produz valor quando altera uma variável económica ou operacional relevante.</p>
        </div>
      </section>

      <section id="edition" className="book-overview shell">
        <div>
          <p className="section-kicker">SOBRE O LIVRO</p>
          <h2>Não é um livro sobre prompts.</h2>
        </div>
        <div className="book-overview-copy">
          <p>É um livro sobre organização. Sobre o que muda quando capacidade computacional deixa de estar apenas dentro das ferramentas e começa a ocupar funções dentro da operação.</p>
          <p>Empresa Aumentada propõe uma arquitetura para combinar pessoas, agentes, tecnologia e processos sem confundir autonomia com ausência de governação.</p>
        </div>
      </section>

      <section className="toc shell">
        <p className="section-kicker">ESTRUTURA</p>
        <div className="toc-list">
          {toc.map((item, index) => <div className="toc-row" key={item}><span>PARTE {String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></div>)}
        </div>
      </section>

      <section className="book-tools shell">
        <p className="section-kicker">FRAMEWORKS</p>
        <div className="tool-grid">
          {["A Equação", "Agent Charter", "Human Decision Charter", "Operating Map", "Four Latencies", "30-Day Augmented Sprint"].map((item) => <article key={item}><span>◉</span><h3>{item}</h3><p>Framework proprietário apresentado e aplicado ao longo da edição.</p></article>)}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
