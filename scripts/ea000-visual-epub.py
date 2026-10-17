from ea000_visual_core import *
from lxml import etree,html as LH
from ea000_markup import split_figure_paragraphs
import zipfile,posixpath,unicodedata
OUT=ROOT/'public/downloads/visual';OUT.mkdir(exist_ok=True)
NS='http://www.w3.org/1999/xhtml';OPF='http://www.idpf.org/2007/opf';DC='http://purl.org/dc/elements/1.1/'
visual=json.loads((ROOT/'content/empresa-aumentada-visual.json').read_text(encoding='utf8'))
def xhtml(title,body):return ('<?xml version="1.0" encoding="UTF-8"?><html xmlns="'+NS+'" xmlns:epub="http://www.idpf.org/2007/ops" lang="pt-BR" xml:lang="pt-BR"><head><title>'+html.escape(title)+'</title><link rel="stylesheet" href="style.css"/></head><body>'+body+'</body></html>').encode()
css='''@font-face{font-family:Crimson;src:url(fonts/CrimsonText-Regular.ttf)}@font-face{font-family:Crimson;src:url(fonts/CrimsonText-Bold.ttf);font-weight:bold}@font-face{font-family:Crimson;src:url(fonts/CrimsonText-Italic.ttf);font-style:italic}@font-face{font-family:"Liberation Sans";src:url(fonts/LiberationSans-Regular.ttf)}@font-face{font-family:"Liberation Sans";src:url(fonts/LiberationSans-Bold.ttf);font-weight:bold}body{font-family:Crimson,serif;line-height:1.55;color:#1c303d;margin:5%}h1,h2,h3{line-height:1.25;color:#06172b;break-after:avoid}p{orphans:3;widows:3}figure{margin:1.5em 0;break-inside:avoid}img{max-width:100%;height:auto}figcaption{font-family:sans-serif;font-size:.8em;line-height:1.45;color:#456373}table{border-collapse:collapse;width:100%;font:.85em/1.45 sans-serif}th,td{border-bottom:1px solid #cad5d6;padding:.4em}th{background:#edf2f2}blockquote{border-left:2px solid #58cce5;margin:1.5em 0;padding-left:1em}a{color:#215c75}pre{white-space:pre-wrap}hr{border:0;border-top:1px solid #cad5d6;margin:1.5em 0}.opening{break-after:page;margin-bottom:2em}.opening .number{font:3em/1 serif;color:#3b7b8e}.opening .art{display:block;max-height:16em;margin:1.5em auto}.part{break-after:page;background:#06172b;color:#fff;padding:1em}.part h1{color:#fff}.part img{width:100%}.cover{margin:0}.cover img{width:100%}'''
payload={'mimetype':b'application/epub+zip','META-INF/container.xml':b'<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>','OEBPS/style.css':css.encode()}
items=[('nav','nav.xhtml','application/xhtml+xml','nav'),('style','style.css','text/css','')];spine=[];nav=[]
def add(id,file,mime,data,props=''):
 payload['OEBPS/'+file]=data;items.append((id,file,mime,props))
add('cover-image','cover-front.jpg','image/jpeg',(PUB/'cover-front.jpg').read_bytes(),'cover-image')
add('cover','cover.xhtml','application/xhtml+xml',xhtml('Capa','<div class="cover"><img src="cover-front.jpg" alt="Empresa Aumentada — Da Inteligência Artificial à Organização Inteligente. Sérgio Monteiro. AtlasHub Editions, EA-000."/></div>'));spine.append('cover')
lastpart=None;hsections=json.loads((ED/'sections-html.json').read_text(encoding='utf8'))
for i,s in enumerate(hsections):
 if s.get('part') and s['part']!=lastpart:
  lastpart=s['part'];pi=PARTS.index(lastpart);part=visual['parts'][pi];file=f'parte-{pi+1:02}.xhtml';id=f'part{pi}'
  add(id,file,'application/xhtml+xml',xhtml(lastpart,'<section class="part" epub:type="part"><img src="images/'+PART_PHOTO[pi]+'.jpg" alt="'+html.escape(part['alt'],quote=True)+'"/><h1>'+html.escape(lastpart)+'</h1></section>'));spine.append(id);nav.append('<li><a href="'+file+'">'+html.escape(lastpart)+'</a></li>')
 body=split_figure_paragraphs(LH.fragment_fromstring(s['html'],create_parent='div'))
 for im in body.findall('.//img'):
  filename=im.get('src','').split('/')[-1];f=FM[filename];im.set('src','figures/'+filename);im.set('alt',f['alt']);im.attrib.pop('width',None);im.attrib.pop('height',None)
  parent=im.getparent();fig=etree.Element('figure');clone=copy.deepcopy(im);clone.tail=None;fig.append(clone);cap=etree.SubElement(fig,'figcaption');cap.text='Figura '+str(f['number'])+' — '+f['title']+'. '+f['caption']+' Fonte: '+f['source']
  if parent.tag=='p' and len(parent)==1 and not(parent.text or '').strip():parent.getparent().replace(parent,fig)
  else:parent.replace(im,fig)
 heading_ids={}
 for el in body.iter():
  if el.tag=='h1':el.tag='h2'
  if el.tag=='h2':
   key=re.sub(r'[^a-z0-9]+','-',unicodedata.normalize('NFKD',el.text_content()).encode('ascii','ignore').decode().lower()).strip('-');heading_ids[key]=heading_ids.get(key,0)+1;el.set('id',key+('-'+str(heading_ids[key]) if heading_ids[key]>1 else ''))
  if el.tag=='a':
   href=el.get('href','')
   if href.startswith('/'):el.set('href','https://editions.atlashub.si'+href)
 content=''.join(etree.tostring(e,encoding='unicode',method='xml') for e in body)
 title=('Capítulo '+str(int(s['number']))+' — ' if s['number'] else '')+s['title']
 if s['number']:
  v=visual['chapters'][s['slug']];art=v['art'].replace('/ea000/','');opening='<section class="opening"><p class="number">'+s['number']+'</p><h1>'+html.escape(title)+'</h1><img class="art" src="'+art+'" alt="'+html.escape(v['alt'],quote=True)+'"/><blockquote>'+html.escape(v['quote'])+'</blockquote></section>'
 else:opening='<h1>'+html.escape(title)+'</h1>'
 file=s['slug']+'.xhtml';id='s'+str(i);add(id,file,'application/xhtml+xml',xhtml(title,opening+content));spine.append(id);nav.append('<li><a href="'+file+'">'+html.escape(title)+'</a></li>')
for i,p in enumerate(sorted(FIG.glob('*.svg'))):add('fig'+str(i),'figures/'+p.name,'image/svg+xml',p.read_bytes())
for i,p in enumerate(sorted(ART.glob('*.svg'))):add('art'+str(i),'art/'+p.name,'image/svg+xml',p.read_bytes())
for i,p in enumerate(sorted(IMG.glob('*.jpg'))):
 if '-cmyk' not in p.stem:add('photo'+str(i),'images/'+p.name,'image/jpeg',p.read_bytes())
for i,name in enumerate(['CrimsonText-Regular.ttf','CrimsonText-Bold.ttf','CrimsonText-Italic.ttf','CrimsonText-BoldItalic.ttf','LiberationSans-Regular.ttf','LiberationSans-Bold.ttf']):add('font'+str(i),'fonts/'+name,'font/ttf',(ED/'fonts'/name).read_bytes())
for i,name in enumerate(['OFL-CrimsonText.txt','LICENSE_LIBERATION']):add('license'+str(i),'fonts/'+name,'text/plain',(ED/'fonts'/name).read_bytes())
add('back-image','cover-back.jpg','image/jpeg',(PUB/'cover-back.jpg').read_bytes());add('back','contracapa.xhtml','application/xhtml+xml',xhtml('Contracapa','<img src="cover-back.jpg" alt="Contracapa editorial de Empresa Aumentada, AtlasHub Editions."/>'));spine.append('back')
payload['OEBPS/nav.xhtml']=xhtml('Sumário','<nav epub:type="toc" id="toc"><h1>Empresa Aumentada</h1><ol>'+''.join(nav)+'</ol></nav>')
manifest=''.join('<item id="'+i+'" href="'+href+'" media-type="'+mime+'"'+(' properties="'+props+'"' if props else '')+'/>' for i,href,mime,props in items)
metadata='<dc:identifier id="book-id">urn:atlashub:editions:ea000:visual:2026-10</dc:identifier><dc:title>Empresa Aumentada — Da Inteligência Artificial à Organização Inteligente</dc:title><dc:creator>Sérgio Monteiro</dc:creator><dc:language>pt-BR</dc:language><dc:publisher>AtlasHub Editions</dc:publisher><dc:rights>Todos os direitos reservados. Homologação editorial final pendente.</dc:rights><meta property="dcterms:modified">2026-10-17T05:00:00Z</meta><meta property="schema:accessMode">textual</meta><meta property="schema:accessMode">visual</meta><meta property="schema:accessibilityFeature">tableOfContents</meta><meta property="schema:accessibilityFeature">structuralNavigation</meta><meta property="schema:accessibilityFeature">alternativeText</meta><meta property="schema:accessibilitySummary">Texto responsivo; sumário navegável; imagens e diagramas com texto alternativo e legendas. Sem certificação formal de conformidade.</meta>'
payload['OEBPS/content.opf']=('<?xml version="1.0"?><package xmlns="'+OPF+'" version="3.0" unique-identifier="book-id" xml:lang="pt-BR"><metadata xmlns:dc="'+DC+'">'+metadata+'</metadata><manifest>'+manifest+'</manifest><spine>'+''.join('<itemref idref="'+i+'"/>' for i in spine)+'</spine></package>').encode()
target=OUT/'EA-000_Empresa-Aumentada_visual.epub'
with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as z:
 for name,data in payload.items():z.writestr(name,data,compress_type=zipfile.ZIP_STORED if name=='mimetype' else zipfile.ZIP_DEFLATED)
checked=0
for name,data in payload.items():
 if name.endswith(('.xml','.opf','.xhtml','.svg')):
  tree=etree.fromstring(data,etree.XMLParser(load_dtd=False,no_network=True));checked+=1
  ids=[el.get('id') for el in tree.iter() if el.get('id')];assert len(ids)==len(set(ids)),(name,'duplicate IDs')
  if name.endswith('.svg'):assert b'<!DOCTYPE' not in data,(name,'external DTD')
  for el in tree.iter():
   for attr in ['href','src']:
    ref=el.get(attr,'').split('#')[0]
    if ref and ':' not in ref:assert posixpath.normpath(posixpath.join(posixpath.dirname(name),ref)) in payload,(name,ref)
report={'file':target.name,'sections':27,'chapters':21,'parts':5,'figures':29,'xmlDocumentsParsed':checked,'referencesResolved':True,'epubcheckExecuted':False,'master_sha256':sha(MASTER),'sha256':sha(target)}
(VE/'epub-structural.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8');print(json.dumps(report,ensure_ascii=False))
