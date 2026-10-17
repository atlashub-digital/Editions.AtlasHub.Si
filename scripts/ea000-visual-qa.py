import sys,json,re,hashlib,unicodedata
from pathlib import Path
from lxml import html as LH
from pypdf import PdfReader
import pypdfium2 as pdfium
from PIL import Image,ImageOps,ImageDraw
from ea000_markup import split_figure_paragraphs
R=Path(__file__).resolve().parents[1]; E=R/'editorial/ea000'; Q=E/'visual/qa'; Q.mkdir(parents=True,exist_ok=True)
O=R/'public/downloads/visual'; P=R/'public/ea000'
def norm(s):return re.sub('[^a-z0-9]','',unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower())
blocks=[]
for s in json.loads((E/'sections-html.json').read_text(encoding='utf8')):
 root=split_figure_paragraphs(LH.fragment_fromstring(s['html'],create_parent='div'))
 for e in root.xpath('.//p|.//li|.//h1|.//h2|.//h3'):
  if len(norm(e.text_content()))>=45:blocks.append((s['slug'],norm(e.text_content()),e.text_content()[:100]))
reports=[]
figs=json.loads((E/'figures.json').read_text(encoding='utf8'))
for path in sorted(O.glob('*.pdf')):
 r=PdfReader(path); texts=[re.sub(r'^EMPRESA AUMENTADA\s*AT L A S H U B\s+E D I T I O N S\s*A[45]\s*·\s*EA-000\s*\d+\s*','',p.extract_text() or '') for p in r.pages];full=norm(' '.join(texts));missing=[{'section':a,'excerpt':c} for a,b,c in blocks if b not in full];fonts={};badtrim=[];colors=set();fmt='A5' if '_A5_' in path.name else 'A4';printing='impressao' in path.name
 for i,p in enumerate(r.pages):
  for ref in p.get('/Resources',{}).get('/Font',{}).values():
   f=ref.get_object();d=f.get('/FontDescriptor');d=d.get_object() if d else {};fonts[str(f.get('/BaseFont'))]=any(k in d for k in ['/FontFile','/FontFile2','/FontFile3'])
  expected=(148,210) if fmt=='A5' else (210,297)
  if any(abs(float(v)/72*25.4-e)>.1 for v,e in zip([p.trimbox.width,p.trimbox.height],expected)):badtrim.append(i+1)
  for x in p.get('/Resources',{}).get('/XObject',{}).values():
   x=x.get_object()
   if x.get('/Subtype')=='/Image':colors.add(str(x.get('/ColorSpace')))
 report={'file':path.name,'pages':len(r.pages),'checkedTextBlocks':len(blocks),'missingTextBlocks':missing,'allFontsEmbedded':all(fonts.values()),'fonts':fonts,'trimErrors':badtrim,'imageColorSpaces':sorted(colors),'outputIntentPresent':'/OutputIntents' in r.trailer['/Root'],'links':sum(len(p.get('/Annots',[])) for p in r.pages),'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'pdfxCertified':False,'printerApproval':False}
 reports.append(report);(Q/'pdf-preflight.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2),encoding='utf8');print(json.dumps({**report,'missingTextBlocks':len(missing)},ensure_ascii=False),flush=True)
 assert len(blocks)==1346 and not missing and not badtrim and all(fonts.values())
 if not printing and '--no-render' not in sys.argv:
  doc=pdfium.PdfDocument(path); target=Q/fmt;target.mkdir(exist_ok=True);pagination=json.loads((E/f'visual/pagination-{fmt}.json').read_text(encoding='utf8'));selected=set(pagination['art_pages'])|{i+1 for i,t in enumerate(texts) if re.search(r'Figura\s+\d+\s*[—–-]',t)}
  for start in range(0,len(doc),48):
   contact=Image.new('RGB',(8*178,6*268),'#ddd');d=ImageDraw.Draw(contact)
   for j in range(start,min(start+48,len(doc))):
    im=doc[j].render(scale=.38).to_pil().convert('RGB');im.thumbnail((174,248));x=((j-start)%8)*178;y=((j-start)//8)*268;contact.paste(im,(x,y));d.text((x+4,y+250),str(j+1),fill='black')
   contact.save(target/f'contact-{start//48+1:02}.jpg',quality=85)
  for n in sorted(selected):doc[n-1].render(scale=1.2).to_pil().convert('RGB').save(target/f'p{n:03}.png')
  for i,start in enumerate(range(0,len(pagination['art_pages']),12)):
   contact=Image.new('RGB',(4*250,3*375),'#ddd');d=ImageDraw.Draw(contact)
   for j,n in enumerate(pagination['art_pages'][start:start+12]):
    im=Image.open(target/f'p{n:03}.png');im.thumbnail((246,349));x=j%4*250;y=j//4*375;contact.paste(im,(x,y));d.text((x+4,y+352),str(n),fill='black')
   contact.save(target/f'art-{i+1}.jpg',quality=90)
  if fmt=='A4':
   for n,name in [(0,'cover-front'),(len(doc)-1,'cover-back')]:doc[n].render(scale=2).to_pil().convert('RGB').save(P/f'{name}.jpg',quality=96)
print('PASS full PDFs',flush=True)
