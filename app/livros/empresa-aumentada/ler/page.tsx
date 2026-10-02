import Link from "next/link";

export const metadata = { title: "Ler · Empresa Aumentada" };

export default function ReadingPreviewPage() {
  return (
    <main className="reader">
      <header className="reader-header">
        <Link href="/livros/empresa-aumentada">← Empresa Aumentada</Link>
        <span>CAPÍTULO 07 / 21</span>
        <button type="button" aria-label="Reading settings">Aa</button>
      </header>

      <article className="reader-article">
        <p className="reader-part">PARTE III — A EMPRESA AUMENTADA</p>
        <p className="reader-chapter">CAPÍTULO 07</p>
        <h1>O que é uma Empresa Aumentada?</h1>
        <p className="reader-lead">Uma Empresa Aumentada não é a empresa que tem mais IA. É a empresa que organiza melhor a capacidade humana e computacional em torno de resultados.</p>

        <p>Durante anos, transformação digital significou colocar tecnologia dentro de processos existentes. Digitalizámos documentos, ligámos sistemas, criámos dashboards e automatizámos tarefas.</p>
        <p>A nova questão é diferente. O que acontece quando software deixa de apenas armazenar e transportar informação e passa também a interpretar contexto, utilizar ferramentas, executar ações e coordenar partes de uma missão?</p>

        <aside className="reader-principle">
          <span>PRINCÍPIO</span>
          <strong>A Empresa Aumentada começa pelo desenho da organização, não pela escolha do modelo.</strong>
        </aside>

        <h2>Uma definição operacional</h2>
        <p>Uma Empresa Aumentada é uma organização em que pessoas, agentes inteligentes, tecnologia e processos são desenhados como partes de um mesmo sistema operacional, com objetivos claros, autoridade delimitada, informação acessível, mecanismos de coordenação, métricas, escalamento e governação.</p>

        <div className="reader-framework">
          <span>FRAMEWORK</span>
          <h3>Business Objectives → People → Processes → Data → Systems → AI Agents → Governance → Results</h3>
          <p>O resultado regressa ao início do ciclo e altera prioridades, aprendizagem e desenho organizacional.</p>
        </div>

        <p>Esta edição digital será alimentada pelo manuscrito canónico e, numa fase posterior, permitirá navegação integral, progresso de leitura, referências, figuras e toolkits interativos.</p>

        <nav className="reader-next">
          <span>CONTINUAR</span>
          <strong>Capítulo 08 — Humanos definem o horizonte →</strong>
        </nav>
      </article>
    </main>
  );
}
