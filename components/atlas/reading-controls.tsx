"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export function ReadingControls({slug}: {slug: string}) {
  const [large,setLarge]=useState(false);
  useEffect(()=>{document.documentElement.style.setProperty('--reading-size','1.125rem'); return ()=>{document.documentElement.style.removeProperty('--reading-size');};},[]);
  useEffect(()=>{try {localStorage.setItem('editions-last-section',slug);} catch {}},[slug]);
  return <button className="reader-control" type="button" aria-pressed={large} onClick={()=>{
    const next=!large; setLarge(next); document.documentElement.style.setProperty('--reading-size',next?'1.35rem':'1.125rem');
  }}>Aa · {large?'Texto normal':'Aumentar texto'}</button>;
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
