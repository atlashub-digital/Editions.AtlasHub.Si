"use client";
import Link from 'next/link';
import {useState} from 'react';
import LiveMark from './live-mark';

export type ChapterPreview={slug:string;title:string;number:string|null;part:string|null;excerpt:string};
const normal=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function KnowledgeCompass({chapters}:{chapters:ChapterPreview[]}){
 const [query,setQuery]=useState(''),[part,setPart]=useState('all'),[limit,setLimit]=useState(6);
 const parts=[...new Set(chapters.map(c=>c.part).filter((p):p is string=>Boolean(p)))];
 const filtered=chapters.filter(c=>(part==='all'||c.part===part)&&normal(c.title+' '+c.excerpt).includes(normal(query.trim())));
 function save(){const text=['ATLASHUB EDITIONS · PERCURSO DE LEITURA',part==='all'?'Todas as Partes':part,query?`Pesquisa em títulos e excertos: ${query}`:'',...filtered.map(c=>`${c.number} · ${c.title}\nhttps://editions.atlashub.si/livros/empresa-aumentada/ler/${c.slug}`)].filter(Boolean).join('\n\n');const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='AtlasHub-percurso-de-leitura.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 return <section className="knowledge-compass" id="explorador" aria-labelledby="compass-title"><div className="compass-intro"><div><p className="compass-eyebrow">EXPLORADOR EDITORIAL / EA–001</p><h2 id="compass-title">O conhecimento certo.<br/><span>Para o seu próximo passo.</span></h2><p>21 capítulos. Cinco Partes. Um percurso que pode começar pela pergunta que tem hoje.</p></div><LiveMark/></div>
  <div className="compass-search"><label htmlFor="chapter-search">Procurar nos títulos e excertos</label><div><span aria-hidden="true">⌕</span><input id="chapter-search" type="search" placeholder="Experimente: agentes, empresa, inteligência…" value={query} onChange={e=>{setQuery(e.target.value);setLimit(6);}}/>{query&&<button type="button" onClick={()=>setQuery('')} aria-label="Limpar pesquisa">×</button>}</div></div>
  <div className="compass-filters" role="group" aria-label="Filtrar por Parte"><button type="button" aria-pressed={part==='all'} onClick={()=>{setPart('all');setLimit(6);}}>Todo o livro</button>{parts.map((p,i)=><button type="button" title={p} aria-pressed={part===p} key={p} onClick={()=>{setPart(p);setLimit(6);}}>Parte {['I','II','III','IV','V'][i]}</button>)}</div>
  <div className="compass-results-heading"><p role="status">{filtered.length} {filtered.length===1?'capítulo encontrado':'capítulos encontrados'}{part!=='all'&&<> · {part}</>}</p><button type="button" onClick={save} disabled={!filtered.length}>Guardar percurso ↓</button></div>
  <div className="compass-grid">{filtered.slice(0,limit).map(c=><Link key={c.slug} href={'/livros/empresa-aumentada/ler/'+c.slug} className="compass-chapter"><span className="compass-number">{c.number}<b aria-hidden="true">↗</b></span><h3>{c.title}</h3><p>{c.excerpt}</p><span className="compass-read">Abrir no reader →</span></Link>)}</div>
  {!filtered.length&&<div className="compass-empty"><h3>Vamos tentar outro ponto de partida.</h3><p>Esta pesquisa usa os títulos e excertos iniciais. Experimente um termo mais curto ou explore todas as Partes.</p><button type="button" onClick={()=>{setQuery('');setPart('all');}}>Ver todos os capítulos</button></div>}
  {filtered.length>limit&&<button type="button" className="compass-more" onClick={()=>setLimit(limit+6)}>Explorar mais capítulos +</button>}
  <div className="compass-bridge"><div><p className="compass-eyebrow">DA LEITURA À EXPERIMENTAÇÃO</p><h3>Uma ideia merece ser posta à prova.</h3><p>Explore um cenário operacional, ajuste as hipóteses e descubra o que precisa de validar antes de automatizar.</p></div><a href="https://atlashub.si/#simulador">Abrir laboratório AtlasHub ↗</a></div>
 </section>;
}
