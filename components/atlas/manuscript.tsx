import Image from 'next/image';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

export function Manuscript({ children }: { children: string }) {
  return <div className="manuscript"><Markdown remarkPlugins={[remarkGfm, remarkBreaks]} components={{
    h1: ({children}) => <h2>{children}</h2>,
    h2: ({children}) => <h2>{children}</h2>,
    table: ({children}) => <div className="table-scroll" tabIndex={0} role="region" aria-label="Tabela do manuscrito"><table>{children}</table></div>,
    img: ({src,alt}) => typeof src === 'string' && src.startsWith('/diagrams/') ? <Image src={src} alt={alt || 'Diagrama do manuscrito'} width={1200} height={800} unoptimized style={{width:'100%',height:'auto'}} /> : null,
  }}>{children}</Markdown></div>;
}
