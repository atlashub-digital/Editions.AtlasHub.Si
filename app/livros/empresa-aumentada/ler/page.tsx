import Link from 'next/link';
import { bookSections, sectionUrl } from '@/lib/book';
import { ResumeReading } from '@/components/atlas/reading-controls';
export const metadata={title:'Ler Empresa Aumentada',description:'Índice completo: 21 capítulos em cinco Partes.',alternates:{canonical:'/livros/empresa-aumentada/ler'},robots:{index:false,follow:true}};
export default function ReaderIndex(){
 return <div className="reader-light min-h-screen bg-[#F7F8FA] text-[#14202E]">
  <header className="reader-masthead"><Link href="/livros/empresa-aumentada">← Sobre o livro</Link><span>AtlasHub Editions</span></header>
  <main id="conteudo" className="reading-shell">
   <p className="reading-eyebrow">EA–001 · Sérgio Monteiro</p>
   <h1 className="reading-title">Empresa Aumentada</h1>
   <p className="mt-5 text-xl font-serif text-[#5A6B7E]">Da Inteligência Artificial à Organização Inteligente</p>
   <div className="my-8 flex flex-wrap gap-5"><Link className="reader-control" href={sectionUrl('nota-editorial')}>Começar a ler →</Link><ResumeReading slugs={bookSections.map(s=>s.slug)}/></div>
   <p className="mb-8 text-sm text-[#5A6B7E]">21 capítulos em cinco Partes. Os casos empresariais são cenários compostos e ilustrativos.</p>
   <nav aria-label="Índice do livro" className="reader-index">{bookSections.map((s,i)=><div key={s.slug}>
    {s.part && s.part!==bookSections[i-1]?.part && <h2>{s.part}</h2>}
    <Link href={sectionUrl(s.slug)}><span>{s.number || '·'}</span>{s.title}<span aria-hidden>→</span></Link>
   </div>)}</nav>
   <div className="mt-12 flex flex-wrap gap-6"><a href="/downloads/empresa-aumentada.pdf" download>Descarregar PDF ↓</a><a href="/downloads/empresa-aumentada.epub" download>Descarregar EPUB ↓</a></div>
  </main><footer className="reading-footer">© AtlasHub · Todos os direitos reservados.</footer>
 </div>;
}
