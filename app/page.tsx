import { SiteHeader } from "@/components/atlas/site-header";
import { SiteFooter } from "@/components/atlas/site-footer";
import { Hero } from "@/components/atlas/hero";
import { KnowledgeCompass } from "@/components/atlas/knowledge-compass";
import { bookSections } from "@/lib/book";

import { PublicationCard } from "@/components/atlas/publication-card";
import { CategoryCard } from "@/components/atlas/category-card";
import { TopicCard } from "@/components/atlas/topic-card";
import { BusinessCaseCard } from "@/components/atlas/business-case-card";
import { EcosystemFlow } from "@/components/atlas/ecosystem-flow";
import { PeopleTechnologyResults } from "@/components/atlas/ptr-band";
import { SectionHeader } from "@/components/atlas/section-header";
import {
  EDITORIAL_CATEGORIES,
  KNOWLEDGE_AREAS,
  BUSINESS_CASES,
} from "@/lib/atlas-content";

export const metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return (
    <div className="home-page flex min-h-screen flex-col bg-background">
      <SiteHeader home />

      <main className="flex-1">
        {/* Hero */}
        <Hero />
        <KnowledgeCompass chapters={bookSections.filter(section=>section.number).map(section=>({slug:section.slug,title:section.title,number:section.number,part:section.part,excerpt:section.markdown.split('\n').filter(line=>line.trim()&&!line.startsWith('#')&&!line.startsWith('!')&&!line.startsWith('>'))[0]?.replace(/[*_`\[\]]/g,'').slice(0,220)||''}))}/>

{/* Featured publication */}
        <section
          id="destaque"
          className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
          aria-labelledby="destaque-title"
        >
          <SectionHeader
            eyebrow="Publicação em destaque"
            title={
              <span id="destaque-title">
                EA–001 — <span className="text-gradient-atlas">Empresa Aumentada</span>
              </span>
            }
            description="Da Inteligência Artificial à Organização Inteligente. O livro fundador da AtlasHub Editions. Leitura e downloads gratuitos, abertos à comunidade."
            className="mb-10"
          />
          <PublicationCard />
        </section>

        {/* Editorial categories */}
        <section
          id="livros"
          className="scroll-mt-20 border-y border-cloud/10 bg-ink-soft"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <SectionHeader
              eyebrow="Categorias editoriais"
              title="Publicações para decisão"
              description="Cada formato cumpre um papel no percurso do conceito à execução empresarial."
              className="mb-12"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {EDITORIAL_CATEGORIES.map((c, i) => (
                <CategoryCard key={c.key} category={c} delay={i * 80} />
              ))}
            </div>
          </div>
        </section>

        {/* Knowledge areas */}
        <section id="temas" className="scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <SectionHeader
              eyebrow="Áreas de conhecimento"
              title="Conteúdo por área empresarial"
              description="Explore os temas que ligam tecnologia, pessoas e operação empresarial."
              className="mb-12"
            />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {KNOWLEDGE_AREAS.map((area, i) => (
                <TopicCard key={area.title} area={area} delay={i * 50} />
              ))}
            </div>
          </div>
        </section>

        {/* Real companies / business cases */}
        <section
          id="casos"
          className="scroll-mt-20 border-t border-cloud/10 bg-ink-soft"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <SectionHeader
              eyebrow="Casos empresariais"
              title="Aplicações no contexto empresarial"
              description="Cenários compostos e ilustrativos por sector; não representam resultados de clientes."
              className="mb-12"
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {BUSINESS_CASES.map((item, i) => (
                <BusinessCaseCard key={item.key} item={item} delay={i * 80} />
              ))}
            </div>
          </div>
        </section>

        {/* Ecosystem */}
        <section id="ecosystem" className="scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <SectionHeader
              eyebrow="Ecossistema AtlasHub"
              title="Do conhecimento à implementação"
              description="Editions é a camada de conhecimento de um sistema que vai da ideia ao resultado operacional."
              className="mb-12"
            />
            <EcosystemFlow />
          </div>
        </section>

        {/* People · Technology · Results — closing brand band */}
        <PeopleTechnologyResults />
      </main>

      <SiteFooter />
    </div>
  );
}
