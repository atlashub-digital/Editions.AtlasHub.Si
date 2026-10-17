from pathlib import Path
import json,zipfile,re,unicodedata,hashlib,csv
from lxml import etree,html
from pypdf import PdfReader
import pypdfium2 as pdfium
from PIL import Image,ImageDraw
R=Path(__file__).resolve().parents[1];E=R/'editorial/ea000';V=E/'visual';Q=V/'qa';P=R/'public/ea000'
def norm(s):return re.sub('[^a-z0-9]','',unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower())
blocks=[]
from ea000_markup import split_figure_paragraphs
for s in json.loads((E/'sections-html.json').read_text(encoding='utf8')):
 for e in split_figure_paragraphs(html.fragment_fromstring(s['html'],create_parent='div')).xpath('.//p|.//li|.//h1|.//h2|.//h3'):
  if len(norm(e.text_content()))>=45:blocks.append((s['slug'],norm(e.text_content())))
z=zipfile.ZipFile(R/'public/downloads/visual/EA-000_Empresa-Aumentada_visual.epub'); texts=[]
for n in z.namelist():
 if n.endswith('.xhtml'):texts.append(' '.join(etree.fromstring(z.read(n)).itertext()))
full=norm(' '.join(texts));missing=[s for s,t in blocks if t not in full];assert not missing,missing
(Q/'epub-text-preservation.json').write_text(json.dumps({'checkedBlocks':len(blocks),'missingBlocks':missing,'svgFigures':len([n for n in z.namelist() if '/figures/' in n and n.endswith('.svg')])},indent=2))
lib=json.loads((V/'asset-library.json').read_text(encoding='utf8'))
page_texts={fmt:[norm(p.extract_text() or '') for p in PdfReader(R/f'public/downloads/visual/EA-000_Empresa-Aumentada_{fmt}_visual_digital.pdf').pages] for fmt in ['A4','A5']}
for a in lib['assets']:
 a['locations']={}
 for fmt in ['A4','A5']:
  page=json.loads((V/f'pagination-{fmt}.json').read_text(encoding='utf8')); lookup={b['slug']:b['page'] for b in page['bookmarks']};loc=[]
  if a['id'].startswith('EA000-COVER'):loc=[1 if a['id'].endswith('FRONT') else page['pages']]
  elif a.get('destination') in lookup:loc=[lookup[a['destination']]]
  else:
   for slug,c in lib['chapters'].items():
    if c['art']==a.get('file') and slug in lookup:loc.append(lookup[slug])
   for i,p in enumerate(lib['parts']):
    if p['art']==a.get('file'):loc.append(lookup[f'parte-{i+1:02}'])
  if a['id'].startswith('EA000-CH'):loc=[lookup['capitulo-'+a['id'][-2:]]]
  if a['id'].startswith('EA000-PART'):loc=[lookup['parte-'+a['id'][-2:]]]
  if a['id'].startswith('EA000-FIG'):
   needle=norm('Figura '+str(a['number'])+' — '+a['description']);loc=[i+1 for i,t in enumerate(page_texts[fmt]) if needle in t]
  a['locations'][fmt]=sorted(set(loc))
(V/'asset-library.json').write_text(json.dumps(lib,ensure_ascii=False,indent=2),encoding='utf8')
with (V/'asset-library.csv').open('w',encoding='utf-8-sig',newline='') as f:
 w=csv.DictWriter(f,fieldnames=['id','kind','file','description','rights','pixels','resolution','locations','source','alt'],extrasaction='ignore');w.writeheader()
 for a in lib['assets']:w.writerow(a)
old=pdfium.PdfDocument(R/'public/downloads/premium/EA-000_Empresa-Aumentada_A4_digital.pdf');new=pdfium.PdfDocument(R/'public/downloads/visual/EA-000_Empresa-Aumentada_A4_visual_digital.pdf');im=Image.new('RGB',(1200,900),'#ddd');d=ImageDraw.Draw(im)
for k,(doc,n,label) in enumerate([(old,0,'A4 anterior · 307 páginas'),(new,0,'A4 visual integral · 323 páginas')]):
 p=doc[n].render(scale=1).to_pil().convert('RGB');p.thumbnail((580,840));im.paste(p,(k*600+10,40));d.text((k*600+20,15),label,fill='black')
im.save(V/'comparativo-capa.png')
print('PASS EPUB text + asset locations + comparison',flush=True)
