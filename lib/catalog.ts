export type Publication = {
  code: string;
  slug: string;
  kind: "Book" | "Executive Paper" | "Field Guide" | "Research";
  title: string;
  subtitle: string;
  author: string;
  date: string;
  themes: string[];
  status: "published" | "coming-soon";
};

export const publications: Publication[] = [
  {
    code: "EA–001",
    slug: "empresa-aumentada",
    kind: "Book",
    title: "Empresa Aumentada",
    subtitle: "Da Inteligência Artificial à Organização Inteligente",
    author: "Sérgio Monteiro",
    date: "Outubro 2026",
    themes: ["Inteligência Artificial", "Agentes", "Operações", "Transformação"],
    status: "published",
  },
  {
    code: "EA–002",
    slug: "agent-operating-models",
    kind: "Executive Paper",
    title: "Agent Operating Models",
    subtitle: "Designing governable intelligent capability",
    author: "AtlasHub Research",
    date: "Em preparação",
    themes: ["Agentes", "Governance", "Operations"],
    status: "coming-soon",
  },
  {
    code: "EA–003",
    slug: "ai-for-retail",
    kind: "Field Guide",
    title: "AI for Retail",
    subtitle: "From isolated tools to augmented operations",
    author: "AtlasHub Editions",
    date: "Em preparação",
    themes: ["Retail", "Operations", "AI"],
    status: "coming-soon",
  },
];

export const empresaAumentada = publications[0];
