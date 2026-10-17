import Image from 'next/image';
import visual from '@/content/empresa-aumentada-visual.json';

export function VisualOpening({ slug }: { slug: string }) {
  const item = visual.chapters[slug as keyof typeof visual.chapters];
  if (!item) return null;
  return <section className={`visual-opening visual-opening--${item.treatment}`} aria-label={`Abertura do capítulo ${item.number}`}>
    <div className="visual-opening-art"><Image src={item.art.replace('/ea000/images/', '/ea000/web/')} alt={item.alt} width={1200} height={650} unoptimized priority style={{ width: '100%', height: '100%', objectFit: item.treatment === 'photographic' ? 'cover' : 'contain' }} /></div>
    <div className="visual-opening-copy"><span className="visual-opening-number" aria-hidden="true">{item.number}</span><p className="reading-eyebrow">{item.part}</p><h1 className="reading-title">{item.title}</h1><blockquote>{item.quote}</blockquote></div>
  </section>;
}

export function VisualParts() {
  return <div className="visual-parts" aria-label="As cinco partes da obra">{visual.parts.map(part => <article key={part.id} className="visual-part"><Image src={part.art.replace('/ea000/images/', '/ea000/web/')} alt={part.alt} width={800} height={420} unoptimized style={{width:'100%',height:'160px',objectFit:'cover'}}/><h2>{part.title}</h2></article>)}</div>;
}
