import canonical from "@/content/empresa-aumentada-index.json";
/**
 * AtlasHub Editions — shared content model.
 *
 * Central source of truth for the flagship publication, editorial categories,
 * knowledge areas, business cases, ecosystem and metrics. Consumed by the
 * homepage and the book / reader routes so the content stays consistent.
 *
 * NOTE (brief §27): no invented sales figures, clients, awards, testimonials,
 * certifications, statistics, partners or non-existent authors are declared.
 * EA-002 / EA-003 are intentionally marked "Em preparação".
 */

export type NavLink = { label: string; href: string };

export const SITE_NAV: NavLink[] = [
  { label: "Livros", href: "/livros" },
  { label: "Temas", href: "/#temas" },
  { label: "Casos aplicados", href: "/#casos" },
  { label: "Ecossistema", href: "/#ecosystem" },
];

export const SITE_TAIL_NAV: NavLink[] = [
  { label: "AtlasHub.SI", href: "https://atlashub.si" },
];

export const FAIXA_WORDS = [
  "IDEIAS",
  "OPERAÇÕES",
  "TECNOLOGIA",
  "AUTOMAÇÃO",
  "CRESCIMENTO",
  "RESULTADOS",
];

export type Metric = {
  value: string;
  label: string;
  icon: "chapters" | "frameworks" | "cases" | "toolkit";
};

export const HERO_METRICS: Metric[] = [
  { value: "21", label: "capítulos", icon: "chapters" },
  { value: "5", label: "Partes", icon: "frameworks" },
  { value: "Casos", label: "ilustrativos", icon: "cases" },
  { value: "Toolkit", label: "executivo", icon: "toolkit" },
];

export type Category = {
  key: string;
  title: string;
  description: string;
  count?: string;
};

export const EDITORIAL_CATEGORIES: Category[] = [
  {
    key: "livros",
    title: "LIVROS",
    description: "Pensamento estruturado de longo prazo.",
    count: "EA–001",
  },
  {
    key: "papers",
    title: "EXECUTIVE PAPERS",
    description: "Inteligência para decisão.",
    count: "Em preparação",
  },
  {
    key: "guides",
    title: "FIELD GUIDES",
    description: "Do conceito à execução.",
    count: "Em preparação",
  },
  {
    key: "research",
    title: "RESEARCH",
    description: "Mercados, tecnologia e transformação.",
    count: "Em preparação",
  },
  {
    key: "frameworks",
    title: "FRAMEWORKS",
    description: "Modelos aplicáveis.",
    count: "Modelos aplicáveis",
  },
];

export type KnowledgeArea = {
  title: string;
  blurb: string;
};

export const KNOWLEDGE_AREAS: KnowledgeArea[] = [
  { title: "Inteligência Artificial", blurb: "Agentes, modelos e decisão." },
  { title: "Operações", blurb: "Processo, capacidade e escala." },
  { title: "Automação", blurb: "Fluxos autónomos e orquestração." },
  { title: "Growth", blurb: "Aquisição, retenção e expansão." },
  { title: "Retail", blurb: "Loja, multicanal e experiência." },
  { title: "E-commerce", blurb: "Conversão, dados e operação digital." },
  { title: "Indústria", blurb: "Produção, qualidade e previsão." },
  { title: "Supply Chain", blurb: "Fornecedores, logística e risco." },
  { title: "Real Estate", blurb: "Leads, propriedades e visitas." },
  { title: "Healthcare", blurb: "Capacidade, agenda e atendimento." },
  { title: "Leadership", blurb: "Governo, equipa e estratégia." },
];

export type BusinessCase = {
  key: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  topics: string[];
};

export const BUSINESS_CASES: BusinessCase[] = [
  {
    key: "retail",
    title: "Retail & Pharmacy",
    subtitle: "Operação comercial integrada",
    description:
      "Estoque, compras, CRM, campanhas, atendimento.",
    image: "/assets/atlas/case-retail.jpg",
    topics: ["Estoque", "Compras", "CRM", "Campanhas", "Atendimento"],
  },
  {
    key: "industry",
    title: "Industry & Supply Chain",
    subtitle: "Cadeia industrial e logística",
    description:
      "Fornecedores, fábricas, logística, risco.",
    image: "/assets/atlas/case-industry.jpg",
    topics: ["Fornecedores", "Fábricas", "Logística", "Risco"],
  },
  {
    key: "realestate",
    title: "Real Estate",
    subtitle: "Operação imobiliária de ponta a ponta",
    description:
      "Leads, CRM, propriedades, visitas e follow-up.",
    image: "/assets/atlas/case-realestate.jpg",
    topics: ["Leads", "CRM", "Propriedades", "Visitas", "Follow-up"],
  },
  {
    key: "healthcare",
    title: "Services & Healthcare",
    subtitle: "Capacidade, agenda e operação",
    description:
      "Agenda, capacidade, CRM, atendimento e operação.",
    image: "/assets/atlas/case-healthcare.jpg",
    topics: ["Agenda", "Capacidade", "CRM", "Atendimento", "Operação"],
  },
];

export type EcosystemStep = {
  index: string;
  label: string;
  description: string;
  href: string;
  domain: string;
  status: string;
};

export const ECOSYSTEM_STEPS: EcosystemStep[] = [
  {
    index: "01",
    label: "EDITIONS",
    description: "Conhecimento",
    href: "/",
    domain: "editions.atlashub.si",
    status: "Você está aqui",
  },
  {
    index: "02",
    label: "ACADEMY",
    description: "Capacidade",
    href: "https://academy.atlashub.si",
    domain: "academy.atlashub.si",
    status: "Em preparação",
  },
  {
    index: "03",
    label: "APP",
    description: "Inteligência Operacional",
    href: "https://app.atlashub.si",
    domain: "app.atlashub.si",
    status: "Em preparação",
  },
  {
    index: "04",
    label: "ATLASHUB",
    description: "Implementação",
    href: "https://atlashub.si",
    domain: "atlashub.si",
    status: "Implementação",
  },
];

/* ----------------------------------------------------------------------------
   Flagship publication — EA–001 EMPRESA AUMENTADA
---------------------------------------------------------------------------- */

export type Chapter = {
  number: string;
  part: string;
  title: string;
};

export type Framework = {
  code: string;
  title: string;
  description: string;
};

export type FlagshipBook = {
  code: string;
  slug: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  author: string;
  chapterCount: number;
  edition: string;
  published: string;
  partCount: number;
  language: string;
  summary: string;
  description: string;
  chapters: Chapter[];
  frameworks: Framework[];
  ebookCta: string;
  readCta: string;
};

export const FLAGSHIP_BOOK: FlagshipBook = {
  code: "EA–001",
  slug: "empresa-aumentada",
  title: "EMPRESA",
  titleAccent: "AUMENTADA",
  subtitle: "Da Inteligência Artificial à Organização Inteligente",
  author: "Sérgio Monteiro",
  chapterCount: canonical.chapters.length,
  edition: "1.ª edição · AtlasHub Editions",
  published: "AtlasHub Editions",
  partCount: canonical.parts.length,
  language: "Português",
  summary:
    "Uma proposta de desenho organizacional para empresas em que pessoas, agentes inteligentes, tecnologia e processos passam a operar como partes de um mesmo sistema.",
  description:
    "Empresa Aumentada é a proposta de desenho organizacional da AtlasHub para empresas que pretendem operar com pessoas, agentes inteligentes, tecnologia e processos integrados num único sistema. Do primeiro modelo de inteligência artificial aplicado à reconfiguração completa da organização, o livro percorre decisão, operações, automação e crescimento — sempre com foco em resultados mensuráveis. Um ensaio executivo sobre gestão, operações e transformação organizacional.",
  chapters: canonical.chapters,
  frameworks: [
  {
    "code": "FW-01",
    "title": "A Equação da Empresa Aumentada",
    "description": "Modelo de gestão e desenho organizacional apresentado no manuscrito."
  },
  {
    "code": "FW-02",
    "title": "Agent Charter",
    "description": "Modelo de gestão e desenho organizacional apresentado no manuscrito."
  },
  {
    "code": "FW-03",
    "title": "Human Decision Charter",
    "description": "Modelo de gestão e desenho organizacional apresentado no manuscrito."
  },
  {
    "code": "FW-04",
    "title": "Operating Map",
    "description": "Modelo de gestão e desenho organizacional apresentado no manuscrito."
  },
  {
    "code": "FW-05",
    "title": "Result Map",
    "description": "Modelo de gestão e desenho organizacional apresentado no manuscrito."
  },
  {
    "code": "FW-06",
    "title": "Augmented Sprint Canvas",
    "description": "Modelo de gestão e desenho organizacional apresentado no manuscrito."
  },
  {
    "code": "FW-07",
    "title": "Value Realization Map",
    "description": "Modelo de gestão e desenho organizacional apresentado no manuscrito."
  }
],
  ebookCta: "Obter eBook",
  readCta: "Começar a ler",
};
