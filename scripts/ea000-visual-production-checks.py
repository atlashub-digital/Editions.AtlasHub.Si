from pathlib import Path
import json,hashlib,math,re,unicodedata
from pypdf import PdfReader
R=Path(__file__).resolve().parents[1];V=R/'editorial/ea000/visual';lib=json.loads((V/'asset-library.json').read_text(encoding='utf8'));reports=[]
def norm(s):return re.sub('[^a-z0-9]','',unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower())
for path in sorted((R/'public/downloads/visual').glob('*.pdf')):
 r=PdfReader(path);printing='impressao' in path.name;fmt='A5' if '_A5_' in path.name else 'A4';images=[];bleed_errors=[];figures=[]
 for i,p in enumerate(r.pages):
  margins=[float(p.trimbox.left-p.mediabox.left),float(p.trimbox.bottom-p.mediabox.bottom),float(p.mediabox.right-p.trimbox.right),float(p.mediabox.top-p.trimbox.top)]
  if any(abs(x*25.4/72-(3 if printing else 0))>.03 for x in margins):bleed_errors.append(i+1)
  xo=p.get('/Resources',{}).get('/XObject',{})
  if any(x.get_object().get('/Subtype')=='/Image' for x in xo.values()):
   def visitor(op,args,cm,tm):
    if op!=b'Do':return
    x=xo.get(args[0]);x=x.get_object() if x else None
    if x and x.get('/Subtype')=='/Image':
     w=math.hypot(cm[0],cm[1]);h=math.hypot(cm[2],cm[3]);images.append({'page':i+1,'pixels':[int(x['/Width']),int(x['/Height'])],'placed_mm':[round(w*25.4/72,2),round(h*25.4/72,2)],'effective_ppi':[round(int(x['/Width'])*72/w,1),round(int(x['/Height'])*72/h,1)],'colorspace':str(x.get('/ColorSpace'))})
   p.extract_text(visitor_operand_before=visitor)
 for a in [a for a in lib['assets'] if a['id'].startswith('EA000-FIG')]:
  locations=a['locations'][fmt];assert len(locations)==1,(a['id'],fmt,locations)
  assert norm('Figura '+str(a['number'])+' — '+a['description']) in norm(r.pages[locations[0]-1].extract_text()),a['id'];figures.append({'id':a['id'],'page':locations[0]})
 profile=None
 if printing:
  intent=r.trailer['/Root']['/OutputIntents'][0].get_object();icc=intent['/DestOutputProfile'].get_object();profile={'identifier':str(intent['/OutputConditionIdentifier']),'components':icc['/N'],'sha256':hashlib.sha256(icc.get_data()).hexdigest()};assert profile['sha256']==lib['print_profile']['sha256'];assert all(x['colorspace']=='/DeviceCMYK' for x in images)
 assert not bleed_errors
 reports.append({'file':path.name,'pages':len(r.pages),'figures':figures,'figureCount':len(figures),'bleedErrors':bleed_errors,'bleedMM':3 if printing else 0,'images':images,'below300ppi':[x['page'] for x in images if min(x['effective_ppi'])<300],'outputProfile':profile,'printApproval':False,'pdfxCertified':False})
(V/'qa/geometry-resolution-figures.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps([{'file':x['file'],'figures':x['figureCount'],'images':len(x['images']),'minimumEffectivePPI':min(min(i['effective_ppi']) for i in x['images']),'bleedErrors':x['bleedErrors']} for x in reports],ensure_ascii=False),flush=True)
