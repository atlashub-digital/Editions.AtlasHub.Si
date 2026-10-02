import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PublicationCard } from "@/components/PublicationCard";
import { publications } from "@/lib/catalog";

export const metadata = { title: "Books" };

export default function BooksPage() {
  const books = publications.filter((item) => item.kind === "Book");
  return (
    <main>
      <SiteHeader />
      <section className="catalogue-page shell">
        <p className="eyebrow">ATLASHUB EDITIONS · BOOKS</p>
        <h1>Long-form ideas<br />built to last.</h1>
        <p className="catalogue-lead">Books that connect technology, operations, management and organizational design.</p>
        <div className="publication-grid books-only">
          {books.map((item) => <PublicationCard item={item} key={item.code} />)}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
