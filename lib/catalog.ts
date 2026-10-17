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
    code: "EA-000",
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
    code: "EA-001",
    slug: "a-imobiliaria-aumentada",
    kind: "Book",
    title: "A Imobiliária Aumentada",
    subtitle: "Próximo volume do catálogo editorial",
    author: "Sérgio Monteiro",
    date: "Em preparação",
    themes: ["Imobiliário", "Operações", "Agentes"],
    status: "coming-soon",
  },
  {
    code: "EA-003",
    slug: "o-ecommerce-aumentado",
    kind: "Book",
    title: "O E-commerce Aumentado",
    subtitle: "Volume em preparação editorial",
    author: "Sérgio Monteiro",
    date: "Em preparação",
    themes: ["E-commerce", "Operações", "Agentes"],
    status: "coming-soon",
  },
];

export const empresaAumentada = publications[0];
