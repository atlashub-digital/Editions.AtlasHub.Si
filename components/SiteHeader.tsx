import Link from "next/link";
import { AtlasMark } from "./AtlasMark";

export function SiteHeader() {
  return (
    <header className="site-header shell">
      <Link className="site-brand" href="/">
        <AtlasMark className="brand-mark" />
        <span><strong>AtlasHub</strong> Editions</span>
      </Link>
      <nav className="site-nav" aria-label="Primary">
        <Link href="/livros">Books</Link>
        <a href="#papers">Papers</a>
        <a href="#research">Research</a>
        <a href="https://academy.atlashub.si">Academy ↗</a>
      </nav>
    </header>
  );
}
