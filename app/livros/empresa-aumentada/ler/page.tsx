import Link from 'next/link';
import { bookSections, sectionUrl } from '@/lib/book';
import { ResumeReading } from '@/components/atlas/reading-controls';
export const metadata={title:'Ler Empresa Aumentada',description:'Índice completo: 21 capítulos em cinco Partes.',alternates:{canonical:'/livros/empresa-aumentada/ler'},robots:{index:false,follow:true}};
export default function ReaderIndex(){
 return <div className="reader-light min-h-screen bg-[#F7F8FA] text-[#14202E]">
  <header className="reader-masthead"><Link href="/livros/empresa-aumentada">← Sobre o livro</Link><span>AtlasHub Editions</span></header>
  <main id="conteudo" className="reading-shell">
   <p className="reading-eyebrow">EA-000 · Sérgio Monteiro</p>
   <h1 className="reading-title">Empresa Aumentada</h1>
   <p className="mt-5 text-xl font-serif text-[#5A6B7E]">Da Inteligência Artificial à Organização Inteligente</p>
   <div className="my-8 flex flex-wrap gap-5"><Link className="reader-control" href={sectionUrl('nota-editorial')}>Começar a ler →</Link><ResumeReading slugs={bookSections.map(s=>s.slug)}/></div>
   <p className="mb-8 text-sm text-[#5A6B7E]">21 capítulos em cinco Partes. Os casos empresariais são cenários compostos e ilustrativos.</p>
   <nav aria-label="Índice do livro" className="reader-index">{bookSections.map((s,i)=><div key={s.slug}>
    {s.part && s.part!==bookSections[i-1]?.part && <h2>{s.part}</h2>}
    <Link href={sectionUrl(s.slug)}><span>{s.number || '·'}</span>{s.title}<span aria-hidden>→</span></Link>
   </div>)}</nav>
   <section className="edition-downloads" aria-label="Edições de revisão"><h2>Edições de revisão</h2><p>O mesmo texto em três formatos de leitura.</p><div><a href="/downloads/premium/EA-000_Empresa-Aumentada_A5_digital.pdf" download>Livro A5 · PDF</a><a href="/downloads/premium/EA-000_Empresa-Aumentada_A4_digital.pdf" download>Executive A4 · PDF</a><a href="/downloads/premium/EA-000_Empresa-Aumentada.epub" download>EPUB</a></div></section>
  </main><footer className="reading-footer">© AtlasHub · Todos os direitos reservados.</footer>
 </div>;
}
