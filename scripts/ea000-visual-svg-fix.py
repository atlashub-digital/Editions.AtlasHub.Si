from ea000_visual_core import *
from lxml import etree
for p in list(FIG.glob('*.svg'))+list(ART.glob('*.svg')):
 s=p.read_text(encoding='utf8');s=re.sub(r'<!DOCTYPE[\s\S]*?>\s*','',s)
 s=s.replace('font-family: Liberation Sans;','font-family: Liberation Sans, Arial, sans-serif;').replace('font-family: Crimson Text;','font-family: Crimson Text, Georgia, serif;')
 etree.fromstring(s.encode(),etree.XMLParser(load_dtd=False,no_network=True));p.write_text(s,encoding='utf8')
p=VE/'asset-library.json';lib=json.loads(p.read_text(encoding='utf8'))
for a in lib['assets']:
 file=a.get('file',a.get('art',''))
 if file and (ROOT/'public'/file.lstrip('/')).is_file():a['sha256']=sha(ROOT/'public'/file.lstrip('/'))
p.write_text(json.dumps(lib,ensure_ascii=False,indent=2),encoding='utf8')
print('PASS 44 SVG: external DTD removed; geometry, text and canonical sources preserved',flush=True)
