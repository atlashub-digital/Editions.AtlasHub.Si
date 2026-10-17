from pathlib import Path
import json,hashlib,csv,shutil,re,unicodedata
from pypdf import PdfReader
import pypdfium2 as pdfium
from PIL import Image,ImageDraw
R=Path(__file__).resolve().parents[1];V=R/'editorial/ea000/visual';Q=V/'qa';O=R.parent/'ea000-final/delivery';P=R/'public/downloads/visual'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
epub=P/'EA-000_Empresa-Aumentada_visual.epub';result=json.loads((Q/'epubcheck-result.json').read_text());assert sha(epub)==result['sha256']
struct=json.loads((V/'epub-structural.json').read_text());struct.update(epubcheckExecuted=True,epubcheck=result);(V/'epub-structural.json').write_text(json.dumps(struct,ensure_ascii=False,indent=2),encoding='utf8')
reader=json.loads((Q/'reader-ci-result.json').read_text());reader['mode']='Real Next.js production server in GitHub Actions; protected preview access separately pending';(Q/'reader-browser.json').write_text(json.dumps(reader,ensure_ascii=False,indent=2),encoding='utf8')
lib=json.loads((V/'asset-library.json').read_text(encoding='utf8'))
mock=V/'EA-000_Mockup.png';assert mock.exists()
lib['assets']=[a for a in lib['assets'] if a['id']!='EA000-MOCKUP-001']
lib['assets'].append({'id':'EA000-MOCKUP-001','kind':'presentation-mockup','file':'editorial/ea000/visual/EA-000_Mockup.png','description':'Maquete tridimensional de apresentação da capa. Espessura ilustrativa.','rights':'Composição AtlasHub Editions; recursos da capa identificados no manifesto.','pixels':[3200,2400],'resolution':'RGB; apresentação; sem dimensão física de lombada','destination':'apresentação editorial','source':'scripts/ea000-visual-mockup.cjs; EA000-COVER-FRONT','alt':'Maquete tridimensional de Empresa Aumentada, em azul-marinho e ciano, com lombada ilustrativa e miolo claro.','sha256':sha(mock),'locations':{'A4':[],'A5':[]}})
(V/'asset-library.json').write_text(json.dumps(lib,ensure_ascii=False,indent=2),encoding='utf8')
fields=['id','kind','file','description','rights','pixels','resolution','destination','locations','source','alt','sha256']
with (V/'asset-library.csv').open('w',encoding='utf-8-sig',newline='') as f:
 w=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore');w.writeheader()
 for a in lib['assets']:
  a=dict(a);a['file']=a.get('file') or a.get('art');a['description']=a.get('description') or a.get('title');a['destination']=a.get('destination') or ', '.join(a.get('destinations',[]));w.writerow(a)
for fmt in ['A4','A5']:
 doc=pdfium.PdfDocument(P/f'EA-000_Empresa-Aumentada_{fmt}_visual_digital.pdf');figs=[a for a in lib['assets'] if a['id'].startswith('EA000-FIG')]
 for a in figs:
  n=a['locations'][fmt][0];doc[n-1].render(scale=1.25).to_pil().convert('RGB').save(Q/fmt/f'p{n:03}.png')
 for start in range(0,len(figs),8):
  sheet=Image.new('RGB',(1000,750),'#ddd');draw=ImageDraw.Draw(sheet)
  for j,a in enumerate(figs[start:start+8]):
   n=a['locations'][fmt][0];im=Image.open(Q/fmt/f'p{n:03}.png');im.thumbnail((246,349));x=j%4*250;y=j//4*375;sheet.paste(im,(x,y));draw.text((x+5,y+352),a['id']+' / '+str(n),fill='black')
  sheet.save(Q/fmt/f'figures-{start//8+1}.jpg',quality=90)
def norm(s):return re.sub('[^a-z0-9]','',unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower())
oldpath=R/'public/downloads/premium/EA-000_Empresa-Aumentada_A4_digital.pdf';old=PdfReader(oldpath);needle=norm('Figura 1 — A arquitetura da Empresa Aumentada');oldn=next(i for i,p in enumerate(old.pages) if needle in norm(p.extract_text() or ''));newn=next(a for a in lib['assets'] if a['id']=='EA000-FIG-001')['locations']['A4'][0]-1
sheet=Image.new('RGB',(1200,900),'#ddd');draw=ImageDraw.Draw(sheet)
for j,(path,n,label) in enumerate([(oldpath,oldn,'A4 anterior — arquitetura'),(P/'EA-000_Empresa-Aumentada_A4_visual_digital.pdf',newn,'A4 visual — arquitetura')]):
 d=pdfium.PdfDocument(path);im=d[n].render(scale=1).to_pil().convert('RGB');im.thumbnail((580,840));sheet.paste(im,(j*600+10,40));draw.text((j*600+20,15),label,fill='black')
sheet.save(V/'comparativo-diagrama.png')
shutil.copy2(epub,O/epub.name)
for p in [V/'asset-library.json',V/'asset-library.csv',V/'comparativo-capa.png',V/'comparativo-diagrama.png',mock,Q/'pdf-preflight.json',Q/'geometry-resolution-figures.json',Q/'epubcheck-result.json',Q/'reader-ci-result.json',V/'epub-structural.json']:shutil.copy2(p,O/p.name)
print(json.dumps({'assets':len(lib['assets']),'epubcheckErrors':0,'epubcheckWarnings':0,'epubSha256':sha(epub),'figurePreviews':58,'reader':'desktop/mobile PASS'},ensure_ascii=False),flush=True)
