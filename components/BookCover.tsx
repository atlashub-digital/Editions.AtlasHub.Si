export function BookCover({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "book-cover compact" : "book-cover"} aria-label="Empresa Aumentada cover">
      <span className="cover-imprint">ATLASHUB EDITIONS · EA–001</span>
      <div className="cover-title"><span>EMPRESA</span><strong>AUMENTADA</strong></div>
      <p>Da Inteligência Artificial<br />à Organização Inteligente</p>
      <div className="cover-rule" />
      <div className="cover-equation">RECEITA ↑ · CUSTOS ↓<br />VELOCIDADE ↑ · CONTROLO ↑</div>
      <div className="cover-author">SÉRGIO MONTEIRO</div>
    </div>
  );
}
