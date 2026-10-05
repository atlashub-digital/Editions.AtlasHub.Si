import Link from 'next/link';
import toolkit from '@/content/empresa-aumentada-toolkit.json';
import { Manuscript } from '@/components/atlas/manuscript';
import { sectionUrl } from '@/lib/book';
export const metadata={title:'Toolkit · Empresa Aumentada',description:'Artefactos de trabalho extraídos do manuscrito canónico.',alternates:{canonical:'/livros/empresa-aumentada/toolkit'}};
export default function ToolkitPage(){return <div className="reader-light min-h-screen bg-[#F7F8FA] text-[#14202E]">
 <header className="reader-masthead"><Link href="/livros/empresa-aumentada">← Sobre o livro</Link><Link href="/livros/empresa-aumentada/ler">Ler o livro →</Link></header>
 <main id="conteudo" className="reading-shell"><p className="reading-eyebrow">EA–001 · Materiais de trabalho</p><h1 className="reading-title">Toolkit executivo</h1>
 <p className="my-6 text-[#5A6B7E]">Seleção de artefactos do manuscrito. Cada material mantém o texto do livro e remete para o capítulo de origem.</p>
 <a className="reader-control" href="/downloads/empresa-aumentada-toolkit.pdf" download>Descarregar toolkit em PDF ↓</a>
 <nav aria-label="Materiais" className="reader-index my-8">{toolkit.map(t=><Link key={t.slug} href={'#'+t.slug}>{t.title} ↓</Link>)}</nav>
 {toolkit.map(t=><section id={t.slug} key={t.slug} className="scroll-mt-24 border-t border-slate-200 py-10"><Manuscript>{t.markdown}</Manuscript><Link className="reader-control" href={sectionUrl(t.chapter)}>Ler no contexto do capítulo →</Link><a className="reader-control ml-4" href={'/downloads/'+t.slug+'.md'} download>Texto editável ↓</a></section>)}
 </main><footer className="reading-footer">© AtlasHub · Todos os direitos reservados.</footer></div>}
