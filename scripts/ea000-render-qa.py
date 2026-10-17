from pathlib import Path
import json
import pypdfium2 as pdfium
from pypdf import PdfReader
from PIL import Image,ImageDraw
root=Path('public/downloads/premium');out=Path('editorial/ea000/qa');out.mkdir(parents=True,exist_ok=True)
for fmt in ['A5','A4']:
 p=root/f'EA-000_Empresa-Aumentada_{fmt}_digital.pdf'
 if not p.exists():continue
 reader=PdfReader(p);doc=pdfium.PdfDocument(str(p));texts=[q.extract_text() or '' for q in reader.pages]
 sample=set([0,1,2,3,4,5,8,10,15,len(texts)//2,len(texts)-1])
 sample.update(i for i,t in enumerate(texts) if 'Figura ' in t)
 tiles=[]
 for i in sorted(sample):
  im=doc[i].render(scale=1.15).to_pil().convert('RGB');im.save(out/f'{fmt}-pagina-{i+1:03d}.png');im.thumbnail((250,355));tile=Image.new('RGB',(270,385),'#ddd');tile.paste(im,((270-im.width)//2,8));ImageDraw.Draw(tile).text((10,365),f'{fmt} · {i+1}',fill='black');tiles.append(tile)
 for start in range(0,len(tiles),20):
  chunk=tiles[start:start+20];sheet=Image.new('RGB',(270*5,385*((len(chunk)+4)//5)),'white')
  for k,im in enumerate(chunk):sheet.paste(im,((k%5)*270,(k//5)*385))
  sheet.save(out/f'{fmt}-contato-{start//20+1}.jpg',quality=90)
 (out/f'{fmt}-texto.txt').write_text('\n\f\n'.join(texts),encoding='utf8')
 print(fmt,len(texts),'pages; near empty:',[i+1 for i,t in enumerate(texts) if len(t.strip())<45],flush=True)
