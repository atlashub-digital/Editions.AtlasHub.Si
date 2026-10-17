"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export function ReadingControls({slug}: {slug: string}) {
  const [large,setLarge]=useState(false);
  const [night,setNight]=useState(false);
  useEffect(()=>{const reader=document.querySelector<HTMLElement>('.reader-light');if(reader)reader.dataset.theme=night?'night':'paper';},[night]);
  useEffect(()=>{document.documentElement.style.setProperty('--reading-size','1.125rem'); return ()=>{document.documentElement.style.removeProperty('--reading-size');};},[]);
  useEffect(()=>{try {localStorage.setItem('editions-last-section',slug);} catch {}},[slug]);
  return <div className="reader-preferences"><button className="reader-control" type="button" aria-label={large?'Texto normal':'Aumentar texto'} aria-pressed={large} onClick={()=>{
    const next=!large; setLarge(next); document.documentElement.style.setProperty('--reading-size',next?'1.35rem':'1.125rem');
  }}>Aa {large?'−':'+'}</button><button className="reader-control" type="button" aria-pressed={night} onClick={()=>setNight(!night)}>{night?'Tema claro':'Tema escuro'}</button></div>;
}

export function ResumeReading({slugs}: {slugs:string[]}) {
  const [slug,setSlug]=useState<string|null>(null);
  useEffect(()=>{
    let saved:string|null=null;
    try {saved=localStorage.getItem('editions-last-section');} catch {}
    if(saved && slugs.includes(saved)) queueMicrotask(()=>setSlug(saved));
  },[slugs]);
  return slug ? <Link className="reader-control" href={'/livros/empresa-aumentada/ler/'+slug}>Retomar leitura →</Link> : null;
}
