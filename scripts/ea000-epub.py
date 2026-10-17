import json,zipfile,re,html,posixpath,hashlib,copy
from pathlib import Path
from lxml import etree,html as LH
from ea000_markup import split_figure_paragraphs
ED=Path('editorial/ea000');OUT=Path('public/downloads/premium');OUT.mkdir(parents=True,exist_ok=True)
sections=json.loads((ED/'sections-html.json').read_text(encoding='utf8'));figures=json.loads((ED/'figures.json').read_text(encoding='utf8'));fm={x['file']:x for x in figures}
NS='http://www.w3.org/1999/xhtml';OPF='http://www.idpf.org/2007/opf';DC='http://purl.org/dc/elements/1.1/'
css='''@font-face{font-family:Crimson;src:url(fonts/CrimsonText-Regular.ttf)}@font-face{font-family:Crimson;src:url(fonts/CrimsonText-Bold.ttf);font-weight:bold}@font-face{font-family:Crimson;src:url(fonts/CrimsonText-Italic.ttf);font-style:italic}body{font-family:Crimson,serif;line-height:1.55;color:#172b37;margin:5%}h1,h2,h3{line-height:1.25;color:#0b2537;break-after:avoid}p{orphans:3;widows:3}figure{margin:1.5em 0;break-inside:avoid}img{max-width:100%;height:auto}figcaption{font-family:sans-serif;font-size:.78em;line-height:1.45;color:#456373}table{border-collapse:collapse;width:100%;font: .8em/1.45 sans-serif}th,td{border-bottom:1px solid #cad5d6;padding:.4em}th{background:#edf2f2}blockquote{border-left:2px solid #65c9d1;margin:1.5em 0;padding-left:1em}a{color:#215c75}pre{white-space:pre-wrap}hr{border:0;border-top:1px solid #cad5d6;margin:1.5em 0}'''
cover='''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 740 1050"><title>Empresa Aumentada, de Sérgio Monteiro</title><rect width="740" height="1050" fill="#0b2537"/><text x="65" y="90" font-family="sans-serif" font-size="19" fill="#65c9d1">AT L A S H U B   E D I T I O N S</text><text x="65" y="190" font-family="serif" font-size="34" fill="white">Sérgio Monteiro</text><text x="65" y="330" font-family="serif" font-size="85" fill="white">Empresa</text><text x="65" y="425" font-family="serif" font-size="85" fill="white">Aumentada</text><text x="65" y="505" font-family="sans-serif" font-size="25" fill="#b8d7df">Da Inteligência Artificial</text><text x="65" y="545" font-family="sans-serif" font-size="25" fill="#b8d7df">à Organização Inteligente</text><path d="M65 920V780H110V920 M140 920V720H190V920 M220 920V660H275V920 M305 920V750H360V920 M390 920V630H445V920 M475 920V700H530V920 M560 920V760H620V920 M650 920V710H680V920" fill="none" stroke="#557c88" stroke-width="2"/><path d="M65 850 C200 680 470 880 680 730" fill="none" stroke="#65c9d1" stroke-width="2"/><text x="65" y="995" font-family="sans-serif" font-size="16" fill="#b8d7df">EA-000 · EDIÇÃO DE REVISÃO · OUTUBRO 2026</text></svg>'''
Path('public/diagrams/ea000-cover.svg').write_text(cover,encoding='utf8')
def xhtml(title,body):return '<?xml version="1.0" encoding="UTF-8"?><html xmlns="'+NS+'" xmlns:epub="http://www.idpf.org/2007/ops" lang="pt-BR" xml:lang="pt-BR"><head><title>'+html.escape(title)+'</title><link rel="stylesheet" href="style.css"/></head><body>'+body+'</body></html>'
payload={'mimetype':b'application/epub+zip','META-INF/container.xml':b'<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>','OEBPS/style.css':css.encode(),'OEBPS/cover.svg':cover.encode(),'OEBPS/cover.xhtml':xhtml('Capa','<img src="cover.svg" alt="Capa: Empresa Aumentada — Sérgio Monteiro"/>').encode()}
items=[('nav','nav.xhtml','application/xhtml+xml','nav'),('style','style.css','text/css',''),('cover-image','cover.svg','image/svg+xml','cover-image'),('cover','cover.xhtml','application/xhtml+xml','')];spine=['cover'];nav=[]
for i,s in enumerate(sections):
 body=split_figure_paragraphs(LH.fragment_fromstring(s['html'],create_parent='div'))
 for im in body.findall('.//img'):
  filename=im.get('src','').split('/')[-1];f=fm[filename];im.set('src','diagrams/'+filename);im.set('alt',f['alt']);im.attrib.pop('width',None);im.attrib.pop('height',None)
  parent=im.getparent();fig=etree.Element('figure');clone=copy.deepcopy(im);clone.tail=None;fig.append(clone);cap=etree.SubElement(fig,'figcaption');cap.text='Figura '+str(f['number'])+' — '+f['title']+'. '+f['caption']
  if parent.tag=='p' and len(parent)==1 and not (parent.text or '').strip():parent.getparent().replace(parent,fig)
  else:parent.replace(im,fig)
 for e in body.iter():
  if e.tag=='h1':e.tag='h2'
 content=''.join(etree.tostring(e,encoding='unicode',method='xml') for e in body)
 title=('Capítulo '+str(int(s['number']))+' — ' if s['number'] else '')+s['title'];filename=s['slug']+'.xhtml';data=xhtml(title,'<h1>'+html.escape(title)+'</h1>'+content).encode();etree.fromstring(data);payload['OEBPS/'+filename]=data;items.append(('s'+str(i),filename,'application/xhtml+xml',''));spine.append('s'+str(i));nav.append('<li><a href="'+filename+'">'+html.escape(title)+'</a></li>')
for i,p in enumerate(sorted(Path('public/diagrams').glob('capitulo-*.svg'))):payload['OEBPS/diagrams/'+p.name]=p.read_bytes();items.append(('figure'+str(i),'diagrams/'+p.name,'image/svg+xml',''))
for name in ['CrimsonText-Regular.ttf','CrimsonText-Bold.ttf','CrimsonText-Italic.ttf','CrimsonText-BoldItalic.ttf']:
 payload['OEBPS/fonts/'+name]=(ED/'fonts'/name).read_bytes();items.append(('font'+str(len(items)),'fonts/'+name,'font/ttf',''))
for name in ['OFL-CrimsonText.txt']:
 payload['OEBPS/fonts/'+name]=(ED/'fonts'/name).read_bytes();items.append(('license','fonts/'+name,'text/plain',''))
payload['OEBPS/nav.xhtml']=xhtml('Sumário','<nav epub:type="toc" id="toc"><h1>Empresa Aumentada</h1><ol>'+''.join(nav)+'</ol></nav>').encode()
manifest=''.join('<item id="'+i+'" href="'+href+'" media-type="'+mime+'"'+(' properties="'+props+'"' if props else '')+'/>' for i,href,mime,props in items)
payload['OEBPS/content.opf']=('<?xml version="1.0"?><package xmlns="'+OPF+'" version="3.0" unique-identifier="book-id" xml:lang="pt-BR"><metadata xmlns:dc="'+DC+'"><dc:identifier id="book-id">urn:atlashub:editions:ea000:premium-review:2026-10</dc:identifier><dc:title>Empresa Aumentada — Da Inteligência Artificial à Organização Inteligente</dc:title><dc:creator>Sérgio Monteiro</dc:creator><dc:language>pt-BR</dc:language><dc:publisher>AtlasHub Editions</dc:publisher><dc:rights>Todos os direitos reservados. Edição de revisão, homologação final pendente.</dc:rights><meta property="dcterms:modified">2026-10-17T00:00:00Z</meta></metadata><manifest>'+manifest+'</manifest><spine>'+''.join('<itemref idref="'+i+'"/>' for i in spine)+'</spine></package>').encode()
target=OUT/'EA-000_Empresa-Aumentada.epub'
with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as z:
 for name,data in payload.items():z.writestr(name,data,compress_type=zipfile.ZIP_STORED if name=='mimetype' else zipfile.ZIP_DEFLATED)
with zipfile.ZipFile(target) as z:
 assert z.infolist()[0].filename=='mimetype' and z.infolist()[0].compress_type==zipfile.ZIP_STORED
 assert z.read('mimetype')==b'application/epub+zip'
 checked=0
 for name in z.namelist():
  if name.endswith(('.xml','.opf','.xhtml','.svg')):
   tree=etree.fromstring(z.read(name));checked+=1
   for e in tree.iter():
    for attr in ['href','src']:
     t=e.get(attr,'').split('#')[0]
     if t and ':' not in t:assert posixpath.normpath(posixpath.join(posixpath.dirname(name),t)) in payload,(name,t)
 report={'file':target.name,'sections':len(sections),'figures':len(figures),'xmlDocumentsParsed':checked,'referencesResolved':True,'mimetypeFirstUncompressed':True,'epubcheckExecuted':False,'status':'STRUCTURAL_VALIDATION_PASS; EPUBCHECK_PENDING','sha256':hashlib.sha256(target.read_bytes()).hexdigest()}
 (ED/'qa/epub-structural.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8');print(json.dumps(report,ensure_ascii=False))
