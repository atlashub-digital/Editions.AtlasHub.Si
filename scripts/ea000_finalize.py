from pathlib import Path
from pypdf import PdfReader,PdfWriter
from pypdf.generic import ContentStream

def clean_unused_fonts(path):
    reader=PdfReader(path);writer=PdfWriter();writer.clone_document_from_reader(reader);removed=0
    plans=[]
    for page in writer.pages:
        fonts=page['/Resources'].get('/Font',{}).get_object();stream=ContentStream(page.get_contents(),writer);current=None;used=set()
        for operands,op in stream.operations:
            if op==b'Tf':current=operands[0]
            elif op in [b'Tj',b'TJ',b"'",b'"']:used.add(current)
        helvetica={name for name,font in fonts.items() if font.get_object().get('/BaseFont')=='/Helvetica'}
        if used & helvetica:return 0
        plans.append((page,fonts,stream,helvetica))
    for page,fonts,stream,drop in plans:
        if drop:
            stream.operations=[(operands,op) for operands,op in stream.operations if not (op==b'Tf' and operands[0] in drop)]
            page.replace_contents(stream)
            for name in drop:
                if name in fonts:del fonts[name];removed+=1
        page.compress_content_streams()
    with Path(path).open('wb') as f:writer.write(f)
    return removed

if __name__=='__main__':
    for p in Path('public/downloads/premium').glob('*.pdf'):print(p.name,'unused font resources removed',clean_unused_fonts(p),flush=True)
