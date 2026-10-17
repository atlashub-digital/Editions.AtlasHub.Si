from pathlib import Path
import importlib.util,json,re,html,copy,sys
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph,Spacer,PageBreak
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.pdfgen.canvas import Canvas
from pypdf import PdfReader,PdfWriter
from pypdf.generic import RectangleObject,NameObject,DictionaryObject,ArrayObject,NumberObject,DecodedStreamObject,TextStringObject,ContentStream
from lxml import html as LH
from ea000_visual_core import *
from ea000_markup import split_figure_paragraphs
spec=importlib.util.spec_from_file_location('baseline_pdf',ROOT/'scripts/ea000-pdf.py');B=importlib.util.module_from_spec(spec);spec.loader.exec_module(B)
OUT=ROOT/'public/downloads/visual';OUT.mkdir(exist_ok=True);B.VectorFigure=VisualFigure
class Doc(B.BookDoc):
 def __init__(self,*a,**kw):super().__init__(*a,**kw);self.artPages=set();self.events=[]
 def paint(self,c,d):
  c.saveState();c.translate(self.bleed,self.bleed)
  if not self.printing:c.setFillColor(C(PAPER));c.rect(0,0,self.tw,self.th,fill=1,stroke=0)
  c.setFont('AtlasSans',6.5);c.setFillColor(C(MUTED));c.drawString(self.margin,self.th-10*mm,'EMPRESA AUMENTADA');c.drawRightString(self.tw-self.margin,self.th-10*mm,'AT L A S H U B  E D I T I O N S')
  c.setStrokeColor(C(LINE));c.setLineWidth(.4);c.line(self.margin,12*mm,self.tw-self.margin,12*mm)
  c.setFont('AtlasSans',7);c.drawString(self.margin,8*mm,self.fmt+' · EA-000');c.drawRightString(self.tw-self.margin,8*mm,str(d.page));c.restoreState()
 def afterFlowable(self,f):
  if hasattr(f,'tocTitle'):
   level=getattr(f,'tocLevel',0);key=f.tocKey;self.canv.bookmarkPage(key);self.canv.addOutlineEntry(f.tocTitle,key,level,False);self.notify('TOCEntry',(level,f.tocTitle,self.page,key));self.bookmarks.append({'slug':key,'page':self.page,'title':f.tocTitle,'level':level});self.events.append({'slug':key,'page':self.page})
def cleanup(path,doc):
 reader=PdfReader(path);w=PdfWriter();w.clone_document_from_reader(reader)
 for p in w.pages:
  fonts=p.get('/Resources',{}).get('/Font',{}).get_object();stream=ContentStream(p.get_contents(),w);used=set();cur=None
  for args,op in stream.operations:
   if op==b'Tf':cur=args[0]
   elif op in [b'Tj',b'TJ',b"'",b'"']:used.add(cur)
  drop={name for name,font in fonts.items() if '/FontDescriptor' not in font.get_object()}
  assert not(used&drop),('live unembedded fonts',used&drop)
  if drop:
   stream.operations=[(a,o) for a,o in stream.operations if not(o==b'Tf' and a[0] in drop)];p.replace_contents(stream)
   for name in drop:del fonts[name]
  p.trimbox=RectangleObject([doc.bleed,doc.bleed,doc.bleed+doc.tw,doc.bleed+doc.th]);p.bleedbox=copy.copy(p.mediabox);p.compress_content_streams()
 if doc.printing:
  icc=DecodedStreamObject();icc.set_data(Path('C:/Windows/System32/spool/drivers/color/UncoatedFOGRA29.icc').read_bytes());icc[NameObject('/N')]=NumberObject(4)
  intent=DictionaryObject({NameObject('/Type'):NameObject('/OutputIntent'),NameObject('/S'):NameObject('/GTS_PDFX'),NameObject('/OutputConditionIdentifier'):TextStringObject('FOGRA29'),NameObject('/RegistryName'):TextStringObject('http://www.color.org'),NameObject('/Info'):TextStringObject('Uncoated FOGRA29; proposed, printer approval pending'),NameObject('/DestOutputProfile'):w._add_object(icc)})
  w.root_object[NameObject('/OutputIntents')]=ArrayObject([w._add_object(intent)])
 w.add_metadata({'/Title':'Empresa Aumentada — '+doc.fmt+' — Edição visual integral','/Author':'Sérgio Monteiro','/Subject':'Edição visual integral para homologação final. '+('CMYK Uncoated FOGRA29 proposto; sangria 3 mm; sem certificação PDF/X nem aprovação de gráfica.' if doc.printing else 'Digital; master editorial preservado; links e marcadores atualizados.')})
 with path.open('wb') as f:w.write(f)
def build(fmt,printing):
 suffix='impressao' if printing else 'digital';target=OUT/f'EA-000_Empresa-Aumentada_{fmt}_visual_{suffix}.pdf';doc=Doc(target,fmt,printing)
 st=B.styles(fmt);st['cell'].fontSize=8.2 if fmt=='A5' else 9.7;st['cell'].leading=11 if fmt=='A5' else 13.4
 if printing:
  st['body'].textColor=colors.CMYKColor(0,0,0,.95);st['cell'].textColor=colors.CMYKColor(0,0,0,.95)
 w,h=doc.width,doc.height;story=[VisualLeaf(doc,'cover'),PageBreak()]
 story.extend([Spacer(1,h*.12),Paragraph('Empresa Aumentada',st['h1']),Paragraph('Da Inteligência Artificial à Organização Inteligente',st['body']),Spacer(1,10),Paragraph('Sérgio Monteiro',st['body']),Spacer(1,h*.12),Paragraph('AtlasHub Editions · EA-000<br/>Edição visual integral · outubro de 2026<br/>'+fmt+' · Homologação editorial final pendente',st['small']),Paragraph('© Sérgio Monteiro / AtlasHub Editions. Todos os direitos reservados. Os cenários empresariais são compostos e ilustrativos. Nenhum exemplo constitui promessa de desempenho.',st['small']),Paragraph('Texto consolidado preservado. Composição, arte conceptual e diagramas: AtlasHub Editions, com apoio de inteligência artificial e supervisão editorial. Crimson Text e Liberation Sans sob SIL Open Font License.',st['small']),Paragraph('Esta edição não foi enviada para impressão. Papel, encadernação, perfil de cor e lombada exigem aprovação da gráfica e prova física. ISBN e ficha catalográfica não foram atribuídos nesta etapa.',st['small']),PageBreak()])
 story.append(Paragraph('Sumário',st['h1']));toc=TableOfContents();toc.levelStyles=[ParagraphStyle('parttoc',parent=st['body'],fontName='Crimson-Bold',fontSize=9.8 if fmt=='A5' else 11,leading=13.6 if fmt=='A5' else 16,spaceBefore=6,rightIndent=18),ParagraphStyle('chtoc',parent=st['body'],fontSize=9.4 if fmt=='A5' else 10.6,leading=13 if fmt=='A5' else 15,spaceBefore=3,leftIndent=9,rightIndent=18)];toc.dotsMinLevel=0;story.extend([toc,PageBreak()])
 lastpart=None
 for s in B.SECTIONS:
  if s.get('part') and s['part']!=lastpart:
   lastpart=s['part'];pi=PARTS.index(lastpart);leaf=VisualLeaf(doc,'part',pi);leaf.tocTitle=lastpart;leaf.tocKey=f'parte-{pi+1:02}';leaf.tocLevel=0;story.extend([leaf,PageBreak()])
  title=('Capítulo '+str(int(s['number']))+' — ' if s['number'] else '')+s['title']
  if s['number']:opening=VisualLeaf(doc,'chapter',s)
  else:opening=B.Opening(w,108 if fmt=='A5' else 150,s['title'],'AtlasHub Editions')
  opening.tocTitle=title;opening.tocKey=s['slug'];opening.tocLevel=1 if s['number'] else 0;story.append(opening)
  if s['number']:story.append(PageBreak())
  if s['number'] and 12<=int(s['number'])<=17:story.append(Paragraph('CENÁRIO COMPOSTO E ILUSTRATIVO',st['small']))
  parent=split_figure_paragraphs(LH.fragment_fromstring(s['html'],create_parent='div'));story.extend(B.htmlflows(parent,st,w,h));story.append(PageBreak())
 story.extend([Paragraph('Créditos da edição visual',st['h1']),Paragraph('O conteúdo textual, as referências e os conceitos provêm do master consolidado de Sérgio Monteiro. As imagens de arquitetura, organizações e operações são ilustrações conceptuais; não representam casos reais identificados nem retratos do autor. A fonte de cada diagrama acompanha a respetiva figura.',st['body']),Paragraph('Recursos: skyline fornecido no pacote de integração aprovado; imagens conceptuais produzidas para EA-000 com OpenAI ImageGen; grafismos e diagramas vetoriais AtlasHub Editions. Inventário de direitos, resolução, destinos e textos alternativos no manifesto de produção.',st['body']),Paragraph('Proposta física: papel premium branco-natural ou marfim suave, opaco, ligeiramente texturado e acabamento mate. A textura é característica do papel. Perfil de impressão proposto: Uncoated FOGRA29, sujeito à gráfica. A resolução nativa de alguns recursos fornecidos exige aprovação ou substituição por originais de maior resolução antes do envio final.',st['body']),PageBreak(),VisualLeaf(doc,'back')])
 def convert_cmyk(col):
  col=colors.toColor(col)
  if isinstance(col,colors.CMYKColor):return col
  return colors.CMYKColor(*colors.rgb2cmyk(*col.rgb()),alpha=col.alpha)
 def maker(*a,**kw):
  canvas=Canvas(*a,**{**kw,'initialFontName':'Crimson'})
  if printing:canvas._enforceColorSpace=convert_cmyk
  return canvas
 doc.multiBuild(story,maxPasses=7,canvasmaker=maker);cleanup(target,doc)
 seen={b['slug']:b for b in doc.bookmarks};ordered=[seen[k] for k in seen];pagecount=len(PdfReader(target).pages);artpages={1,pagecount}|{b['page'] for b in ordered if b['slug'].startswith(('capitulo-','parte-'))};report={'file':target.name,'format':fmt,'printing':printing,'pages':pagecount,'trim_mm':[148,210] if fmt=='A5' else [210,297],'bleed_mm':3 if printing else 0,'bookmarks':ordered,'art_pages':sorted(artpages),'master_sha256':sha(MASTER),'pdfxCertified':False,'print_homologation':False,'sha256':sha(target)}
 (VE/f'pagination-{fmt}{"-print" if printing else ""}.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8');print(json.dumps({k:v for k,v in report.items() if k not in ['bookmarks','art_pages']},ensure_ascii=False),flush=True)
if __name__=='__main__':
 fmt=sys.argv[1] if len(sys.argv)>1 else None
 for size in ([fmt] if fmt else ['A4','A5']):
  for printing in ([True] if '--print-only' in sys.argv else [False,True]):build(size,printing)
