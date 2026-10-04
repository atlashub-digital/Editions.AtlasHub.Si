import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { bookSections, getSection, readerBase, sectionUrl } from '@/lib/book';
import { Manuscript } from '@/components/atlas/manuscript';
import { ReadingControls } from '@/components/atlas/reading-controls';

type Props = {params:Promise<{section:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return bookSections.map(s=>({section:s.slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const s=getSection((await params).section); if(!s)return {};
  return {title:s.title+' · Empresa Aumentada',description:'Empresa Aumentada, de Sérgio Monteiro. '+s.title,alternates:{canonical:sectionUrl(s.slug)},robots:{index:false,follow:true}};
}
export default async function ChapterPage({params}:Props){
  const s=getSection((await params).section);if(!s)notFound();
  const i=bookSections.indexOf(s),prev=bookSections[i-1],next=bookSections[i+1];
  return <div className="reader-light min-h-screen bg-[#F7F8FA] text-[#14202E]">
    <header className="reader-masthead"><Link href={readerBase}>← Índice</Link><span>Empresa Aumentada</span><ReadingControls slug={s.slug}/></header>
    <main id="conteudo" className="reading-shell">
      <p className="reading-eyebrow">{s.part || 'EA–001 · Sérgio Monteiro'}</p>
      {s.number && <p className="mt-4 text-sm text-[#5A6B7E]">Capítulo {s.number} / 21</p>}
      <h1 className="reading-title">{s.title}</h1>
      <Manuscript>{s.markdown}</Manuscript>
      <nav className="reading-pagination" aria-label="Entre capítulos">
        {prev?<Link href={sectionUrl(prev.slug)}>← {prev.title}</Link>:<span/>}
        {next?<Link href={sectionUrl(next.slug)}>{next.title} →</Link>:<Link href={readerBase}>Voltar ao índice →</Link>}
      </nav>
    </main>
    <footer className="reading-footer">© AtlasHub · Sérgio Monteiro · Todos os direitos reservados.</footer>
  </div>;
}
