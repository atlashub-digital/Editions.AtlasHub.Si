import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { HERO_METRICS, FAIXA_WORDS } from "@/lib/atlas-content";
import { MetricItem } from "./metric";

export function Hero() {
  return <section className="editions-hero" aria-labelledby="hero-title">
    <div className="editions-hero-scene"><Image src="/assets/atlas/hero-editions-v2.png" alt="Empresa Aumentada, de Sérgio Monteiro, numa mesa de escritório com vista sobre a cidade" fill priority sizes="(max-width: 767px) 200vw, 100vw" /></div>
    <div className="editions-hero-copy">
      <span className="hero-accent" aria-hidden="true" />
      <h1 id="hero-title"><span>CONHECIMENTO PARA</span><strong>EMPRESAS REAIS.</strong></h1>
      <p>Livros, research, frameworks e inteligência<br className="hero-desktop-break" /> aplicada para transformar tecnologia<br className="hero-desktop-break" /> em resultados.</p>
      <div className="editions-hero-actions">
        <Link href="/livros" className="hero-primary">Explorar Publicações <ChevronRight aria-hidden="true" /></Link>
        <Link href="/livros/empresa-aumentada" className="hero-secondary">Empresa Aumentada <ChevronRight aria-hidden="true" /></Link>
      </div>
      <div className="editions-hero-metrics">{HERO_METRICS.map(metric=><MetricItem key={metric.label} metric={metric}/>)}</div>
    </div>
    <Link className="hero-book-link" href="/livros/empresa-aumentada" aria-label="Conhecer o livro Empresa Aumentada" />
    <div className="editions-hero-strip" aria-label="Ideias, Operações, Tecnologia, Automação, Crescimento, Resultados">{FAIXA_WORDS.map(word=><span key={word}>{word}</span>)}</div>
  </section>;
}
