import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { FlagshipBook } from '@/lib/atlas-content';
export function BookCover({book,className,tilt=true,size='lg'}:{book:FlagshipBook;className?:string;tilt?:boolean;size?:'sm'|'md'|'lg'}) {
 const dims=size==='lg'?'w-[clamp(15rem,26vw,22rem)]':size==='md'?'w-[clamp(12rem,18vw,15rem)]':'w-[clamp(9rem,12vw,11rem)]';
 return <div className={cn('book-scene relative',className)} style={{perspective:'1100px'}}><div className={cn('book-3d relative',tilt&&'animate-float-soft')} style={{transform:tilt?'rotateY(-26deg) rotateX(4deg)':'none',transition:'transform .6s ease'}}><div aria-hidden="true" className="absolute inset-y-0 -left-5 w-5 bg-[#06172b] border-l border-cyan/25" style={{transformOrigin:'right',transform:'skewY(7deg)'}}><span className="absolute left-1 top-8 text-[7px] text-white" style={{writingMode:'vertical-rl'}}>{book.title} {book.titleAccent} · {book.author}</span></div><div className={cn('relative aspect-[210/297] overflow-hidden shadow-[0_24px_70px_#0007]',dims)}><Image src="/ea000/web/cover-front.jpg" alt={book.title+' '+book.titleAccent+' — '+book.author+'. AtlasHub Editions, EA-000.'} fill sizes={size==='lg'?'(max-width: 768px) 70vw, 350px':'250px'} unoptimized style={{objectFit:'cover'}}/></div></div></div>;
}
