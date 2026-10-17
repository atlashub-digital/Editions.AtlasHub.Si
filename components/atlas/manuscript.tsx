import Image from 'next/image';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Children, isValidElement, type ReactNode } from 'react';
import { headingId } from '@/lib/book';

function textOf(node: ReactNode): string {
  return Children.toArray(node).map(child => typeof child === 'string' || typeof child === 'number'
    ? String(child) : isValidElement<{children?: ReactNode}>(child) ? textOf(child.props.children) : '').join('');
}

export function Manuscript({ children }: { children: string }) {
  return <div className="manuscript"><Markdown remarkPlugins={[remarkGfm]} components={{
    h1: ({children}) => <h2 id={/^\d+\./.test(textOf(children))?headingId(textOf(children)):undefined}>{children}</h2>,
    h2: ({children}) => <h2 id={/^\d+\./.test(textOf(children))?headingId(textOf(children)):undefined}>{children}</h2>,
    h3: ({children}) => <h3>{children}</h3>,
    table: ({children}) => <div className="table-scroll" tabIndex={0} role="region" aria-label="Tabela do manuscrito"><table>{children}</table></div>,
    img: ({src,alt}) => typeof src === 'string' && src.startsWith('/diagrams/') ? <span className="editorial-figure" role="group" aria-label={alt}><Image src={src} alt={alt || 'Diagrama do manuscrito'} width={720} height={600} unoptimized style={{width:'100%',height:'auto'}} /><span className="editorial-caption">{alt}</span></span> : null,
  }}>{children}</Markdown></div>;
}
