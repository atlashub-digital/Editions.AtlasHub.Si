import json,re,hashlib,unicodedata
from pathlib import Path
from lxml import html as LH
from pypdf import PdfReader
from ea000_markup import split_figure_paragraphs
ED=Path('editorial/ea000');OUT=Path('public/downloads/premium');QA=ED/'qa';QA.mkdir(parents=True,exist_ok=True)
sections=json.loads((ED/'sections-html.json').read_text(encoding='utf8'))
def norm(s):return re.sub(r'[^a-z0-9]','',unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower())
blocks=[]
for s in sections:
 root=split_figure_paragraphs(LH.fragment_fromstring(s['html'],create_parent='div'))
 for e in root.xpath('.//p|.//li|.//h1|.//h2|.//h3'):
  v=norm(e.text_content())
  if len(v)>=45:blocks.append((s['slug'],v,e.text_content()[:100]))
reports=[]
for p in sorted(OUT.glob('EA-000_Empresa-Aumentada_*.pdf')):
 r=PdfReader(p)
 def page_text(page):
  t=page.extract_text() or ''
  t=re.sub(r'^EMPRESA AUMENTADA\s*AT L A S H U B\s+E D I T I O N S\s*A[45]\s*·\s*EA-000\s*\d+\s*','',t)
  return t
 text='\n'.join(page_text(q) for q in r.pages);normalized=norm(text)
 missing=[{'section':slug,'excerpt':original} for slug,v,original in blocks if v not in normalized]
 fonts={};issues=[]
 for page in r.pages:
  for font in page.get('/Resources',{}).get('/Font',{}).values():
   f=font.get_object();base=str(f.get('/BaseFont'));desc=f.get('/FontDescriptor')
   if not desc and f.get('/DescendantFonts'):desc=f['/DescendantFonts'][0].get_object().get('/FontDescriptor')
   desc=desc.get_object() if desc else {};fonts[base]=any(k in desc for k in ['/FontFile','/FontFile2','/FontFile3'])
  if abs(float(page.trimbox.width)/72*25.4-(148 if '_A5_' in p.name else 210))>.1:issues.append('TRIM_SIZE')
 report={'file':p.name,'pages':len(r.pages),'fonts':fonts,'allFontsEmbedded':all(fonts.values()),'checkedTextBlocks':len(blocks),'missingTextBlocks':missing,'trimValid':not issues,'pdfxCertified':False,'outputIntentPresent':'/OutputIntents' in r.trailer['/Root'],'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'bytes':p.stat().st_size}
 reports.append(report);print(json.dumps({**report,'missingTextBlocks':len(missing)},ensure_ascii=False),flush=True)
 assert not issues,(p,issues)
 (QA/'pdf-preflight.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2),encoding='utf8')
