import Link from "next/link";
import type { Publication } from "@/lib/catalog";

export function PublicationCard({ item }: { item: Publication }) {
  const href = item.status === "published" ? `/livros/${item.slug}` : "#";
  return (
    <Link href={href} className={`publication-card ${item.status}`}>
      <div className="publication-meta"><span>{item.code}</span><span>{item.kind}</span></div>
      <div>
        <h3>{item.title}</h3>
        <p>{item.subtitle}</p>
      </div>
      <div className="publication-bottom"><span>{item.author}</span><span>{item.date}</span></div>
    </Link>
  );
}
