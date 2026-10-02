import Link from "next/link";
import { AtlasMark } from "./AtlasMark";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <div className="footer-brand"><AtlasMark className="footer-mark" /><span>AtlasHub Editions</span></div>
          <p>Books, research and executive intelligence for the augmented age.</p>
        </div>
        <div className="footer-links">
          <Link href="/livros">Books</Link>
          <a href="https://academy.atlashub.si">Academy</a>
          <a href="https://atlashub.si">AtlasHub.SI</a>
        </div>
      </div>
      <div className="shell footer-bottom">© 2026 AtlasHub Editions · People | Technology | Results</div>
    </footer>
  );
}
