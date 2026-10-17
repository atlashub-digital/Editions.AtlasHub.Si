import json,re,math,copy,html,os
from pathlib import Path
from lxml import html as LH
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT,TA_CENTER
from reportlab.lib.units import mm
from reportlab.platypus import BaseDocTemplate,PageTemplate,Frame,Paragraph,Spacer,PageBreak,Flowable,Table,TableStyle,KeepTogether,CondPageBreak
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.pdfgen.canvas import Canvas
from pypdf import PdfReader,PdfWriter
from pypdf.generic import RectangleObject
from ea000_markup import split_figure_paragraphs
from ea000_finalize import clean_unused_fonts

ROOT=Path.cwd(); ED=ROOT/'editorial/ea000'; OUT=ROOT/'public/downloads/premium';OUT.mkdir(parents=True,exist_ok=True)
SECTIONS=json.loads((ED/'sections-html.json').read_text(encoding='utf8'))
FIGURES=json.loads((ED/'figures.json').read_text(encoding='utf8'));FIGMAP={f['file']:f for f in FIGURES}
FONTDIR=ED/'fonts'
for n,f in [('Crimson','CrimsonText-Regular.ttf'),('Crimson-Bold','CrimsonText-Bold.ttf'),('Crimson-Italic','CrimsonText-Italic.ttf'),('Crimson-BoldItalic','CrimsonText-BoldItalic.ttf'),('AtlasSans','LiberationSans-Regular.ttf'),('AtlasSans-Bold','LiberationSans-Bold.ttf'),('AtlasSans-Italic','LiberationSans-Italic.ttf')]:pdfmetrics.registerFont(TTFont(n,str(FONTDIR/f)))
pdfmetrics.registerFontFamily('Crimson',normal='Crimson',bold='Crimson-Bold',italic='Crimson-Italic',boldItalic='Crimson-BoldItalic')
pdfmetrics.registerFontFamily('AtlasSans',normal='AtlasSans',bold='AtlasSans-Bold',italic='AtlasSans-Italic',boldItalic='AtlasSans-Bold')
NAVY=colors.HexColor('#0b2537'); INK=colors.HexColor('#172b37'); CYAN=colors.HexColor('#65c9d1'); MUTED=colors.HexColor('#55707d'); PAPER=colors.HexColor('#fbfaf6'); LINE=colors.HexColor('#cad5d6')

def plain(e):return ' '.join(e.itertext()).strip()
def inline(e):
 out=html.escape(e.text or '')
 for c in e:
  tag=c.tag.lower() if isinstance(c.tag,str) else '';v=inline(c)
  if tag in ['strong','b']:v='<b>'+v+'</b>'
  elif tag in ['em','i']:v='<i>'+v+'</i>'
  elif tag=='a' and c.get('href','').startswith(('https://','http://','#')):v='<a href="'+html.escape(c.get('href'),quote=True)+'" color="#215c75">'+v+'</a>'
  elif tag=='br':v='<br/>'
  elif tag=='code':v='<font name="AtlasSans">'+v+'</font>'
  out+=v+html.escape(c.tail or '')
 return out.replace('\\$','$')

class Rule(Flowable):
 def __init__(self,w):Flowable.__init__(self);self.width=w;self.height=11
 def draw(self):self.canv.setStrokeColor(LINE);self.canv.setLineWidth(.45);self.canv.line(0,5,self.width*.17,5)

class VectorFigure(Flowable):
 def __init__(self,f,w,maxh):Flowable.__init__(self);self.f=f;self.scale=min(w/f['width'],maxh/f['height']);self.width=w;self.height=f['height']*self.scale+8
 def draw(self):
  c=self.canv;f=self.f;c.saveState();c.translate((self.width-f['width']*self.scale)/2,5);c.scale(self.scale,self.scale)
  def yy(v):return f['height']-v
  for e in f['edges']:
   c.setStrokeColor(MUTED);c.setLineWidth(1.5);p=c.beginPath();p.moveTo(e['x1'],yy(e['y1']));p.lineTo(e['x1'],yy((e['y1']+e['y2'])/2));p.lineTo(e['x2'],yy((e['y1']+e['y2'])/2));p.lineTo(e['x2'],yy(e['y2']-4));c.drawPath(p)
   c.line(e['x2'],yy(e['y2']-4),e['x2']-4,yy(e['y2']-11));c.line(e['x2'],yy(e['y2']-4),e['x2']+4,yy(e['y2']-11))
  for b in f['boxes']:
   c.setFillColor(NAVY if b['row']==0 else colors.HexColor('#f1f5f5'));c.setStrokeColor(NAVY if b['row']==0 else LINE);c.setLineWidth(1);c.roundRect(b['x'],yy(b['y']+b['height']),b['width'],b['height'],5,fill=1,stroke=1)
   c.setFillColor(colors.white if b['row']==0 else INK);c.setFont('AtlasSans',18)
   for i,line in enumerate(b['lines']):c.drawCentredString(b['x']+b['width']/2,yy(b['y']+b['height']/2-(len(b['lines'])-1)*12+i*24+6),line)
  if f.get('feedbackEdge'):
   e=f['feedbackEdge'];c.setStrokeColor(MUTED);c.setLineWidth(1.4);c.setDash(5,4);p=c.beginPath();p.moveTo(42,yy(e['y1']));p.lineTo(14,yy(e['y1']));p.lineTo(14,yy(e['y2']));p.lineTo(38,yy(e['y2']));c.drawPath(p);c.setDash();c.line(38,yy(e['y2']),31,yy(e['y2']-4));c.line(38,yy(e['y2']),31,yy(e['y2']+4))
  c.restoreState()

class Opening(Flowable):
 def __init__(self,w,h,title,kicker,kind='chapter',num=None):Flowable.__init__(self);self.width=w;self.height=h;self.title=title;self.kicker=kicker;self.kind=kind;self.num=num
 def draw(self):
  c=self.canv;w=self.width;h=self.height
  c.setFillColor(MUTED);c.setFont('AtlasSans',8.2);c.drawString(0,h-13,self.kicker.upper())
  if self.num:c.setFillColor(colors.HexColor('#c4d6d7'));c.setFont('Crimson',72);c.drawRightString(w,h-66,self.num)
  c.setStrokeColor(CYAN);c.setLineWidth(1.5);c.line(0,h-28,w*.2,h-28)
  p=Paragraph(html.escape(self.title),ParagraphStyle('opening',fontName='Crimson',fontSize=27 if w<400 else 36,leading=30 if w<400 else 40,textColor=NAVY))
  _,ph=p.wrap(w*.86,h);p.drawOn(c,0,max(12,h-65-ph))

class PartLeaf(Flowable):
 def __init__(self,w,h,part):Flowable.__init__(self);self.width=w;self.height=h;self.part=part
 def draw(self):
  c=self.canv;w=self.width;h=self.height;c.setFillColor(NAVY);c.rect(-12*mm,-15*mm,w+24*mm,h+35*mm,fill=1,stroke=0)
  bits=re.split(r'\s[-—]\s',self.part,maxsplit=1);c.setFillColor(CYAN);c.setFont('AtlasSans',10);c.drawString(0,h*.73,bits[0]);
  p=Paragraph(html.escape(bits[-1].capitalize()),ParagraphStyle('part',fontName='Crimson',fontSize=30,leading=36,textColor=colors.white));_,ph=p.wrap(w*.9,h);p.drawOn(c,0,h*.63-ph)
  c.setStrokeColor(CYAN);c.setLineWidth(.7);c.line(0,h*.24,w*.25,h*.24)
  c.setFillColor(colors.HexColor('#b5c9d2'));c.setFont('AtlasSans',8);c.drawString(0,h*.16,'EMPRESA AUMENTADA · SÉRGIO MONTEIRO')

class Cover(Flowable):
 def __init__(self,w,h,fmt):Flowable.__init__(self);self.width=w;self.height=h;self.fmt=fmt
 def draw(self):
  c=self.canv;w=self.width;h=self.height
  c.setFillColor(NAVY);c.rect(-30*mm,-40*mm,w+65*mm,h+85*mm,fill=1,stroke=0)
  c.setFillColor(CYAN);c.setFont('AtlasSans',8.5);c.drawString(0,h-8,'AT L A S H U B   E D I T I O N S')
  c.setFillColor(colors.white);c.setFont('Crimson',20 if w<400 else 26);c.drawString(0,h-65,'Sérgio Monteiro')
  p=Paragraph('Empresa<br/>Aumentada',ParagraphStyle('cover',fontName='Crimson',fontSize=49 if w<400 else 69,leading=48 if w<400 else 66,textColor=colors.white));_,ph=p.wrap(w,h);p.drawOn(c,0,h-96-ph)
  p=Paragraph('Da Inteligência Artificial<br/>à Organização Inteligente',ParagraphStyle('sub',fontName='AtlasSans',fontSize=12 if w<400 else 16,leading=18 if w<400 else 23,textColor=colors.HexColor('#b8d7df')));_,sh=p.wrap(w,h);p.drawOn(c,0,h-112-ph-sh)
  # Geometria arquitetônica vetorial: metáfora visual, sem texto nem dados fabricados.
  base=h*.11;c.setLineWidth(.55)
  heights=[.13,.21,.16,.28,.18,.34,.24,.16,.25,.19,.3,.14]
  bw=w/len(heights)
  for i,bh in enumerate(heights):
   x=i*bw;c.setStrokeColor(colors.HexColor('#406572'));c.rect(x,base,bw*.69,h*bh,fill=0,stroke=1)
   for k in range(1,int(h*bh/12)):
    c.setStrokeColor(colors.HexColor('#284a5b'));c.line(x+3,base+k*12,x+bw*.69-3,base+k*12)
  c.setStrokeColor(CYAN);c.setLineWidth(.8);p=c.beginPath();p.moveTo(0,base+h*.08);p.curveTo(w*.25,base+h*.28,w*.65,base+h*.02,w,base+h*.2);c.drawPath(p)
  for i in [1,3,5,8,10]:c.setFillColor(CYAN);c.circle(i*bw+bw*.35,base+h*heights[i],2.2,fill=1,stroke=0)
  c.setFont('AtlasSans',7.3);c.setFillColor(colors.HexColor('#b8d7df'));c.drawString(0,0,'EA-000  /  '+self.fmt+'  /  EDIÇÃO DE REVISÃO · OUTUBRO 2026')

class BackCover(Flowable):
 def __init__(self,w,h):Flowable.__init__(self);self.width=w;self.height=h
 def draw(self):
  c=self.canv;w=self.width;h=self.height;c.setFillColor(NAVY);c.rect(-30*mm,-40*mm,w+65*mm,h+85*mm,fill=1,stroke=0)
  st=ParagraphStyle('back',fontName='Crimson',fontSize=18 if w<400 else 24,leading=25 if w<400 else 32,textColor=colors.white)
  p=Paragraph('A próxima transformação da empresa começa na forma como ela se organiza.',st);_,ph=p.wrap(w,h);p.drawOn(c,0,h*.76-ph)
  st=ParagraphStyle('backbody',fontName='Crimson',fontSize=12 if w<400 else 16,leading=18 if w<400 else 24,textColor=colors.HexColor('#c5dce1'))
  text='Como combinar pessoas, agentes inteligentes, tecnologia, processos e dados em uma arquitetura orientada a resultados? Este ensaio propõe uma resposta de gestão: objetivos claros, capacidade coordenada, limites explícitos e responsabilidade humana.<br/><br/>Dos fundamentos da inteligência artificial aos cenários de operação, a pergunta permanece concreta: o que muda na receita, nos custos, na velocidade e no controle?'
  p=Paragraph(text,st);_,ph=p.wrap(w,h);p.drawOn(c,0,h*.49-ph)
  c.setStrokeColor(CYAN);c.line(0,h*.12,w*.25,h*.12);c.setFillColor(CYAN);c.setFont('AtlasSans',8);c.drawString(0,h*.07,'EMPRESA AUMENTADA · SÉRGIO MONTEIRO');c.setFont('AtlasSans',7);c.drawString(0,0,'AtlasHub Editions · EA-000 · Prova editorial')

class BookDoc(BaseDocTemplate):
 def __init__(self,filename,fmt,printing):
  self.tw,self.th=(148*mm,210*mm) if fmt=='A5' else (210*mm,297*mm);self.bleed=3*mm if printing else 0;self.printing=printing;self.fmt=fmt;self.section='';self.bookmarks=[]
  margin=17*mm if fmt=='A5' else 27*mm;self.margin=margin;top=18*mm if fmt=='A5' else 24*mm;bottom=18*mm if fmt=='A5' else 24*mm
  super().__init__(str(filename),pagesize=(self.tw+2*self.bleed,self.th+2*self.bleed),leftMargin=margin+self.bleed,rightMargin=margin+self.bleed,topMargin=top+self.bleed,bottomMargin=bottom+self.bleed,title='Empresa Aumentada — '+fmt,author='Sérgio Monteiro',pageCompression=1)
  self.addPageTemplates(PageTemplate('normal',[Frame(self.leftMargin,self.bottomMargin,self.width,self.height,id='body',leftPadding=0,rightPadding=0,topPadding=0,bottomPadding=0)],onPage=self.paint))
 def paint(self,c,d):
  c.saveState();c.translate(self.bleed,self.bleed)
  if not self.printing:c.setFillColor(PAPER);c.rect(0,0,self.tw,self.th,fill=1,stroke=0)
  if d.page>1:
   c.setFillColor(MUTED);c.setFont('AtlasSans',6.5);c.drawString(self.margin,self.th-10*mm,'EMPRESA AUMENTADA');c.drawRightString(self.tw-self.margin,self.th-10*mm,'AT L A S H U B  E D I T I O N S')
   c.setStrokeColor(LINE);c.setLineWidth(.4);c.line(self.margin,12*mm,self.tw-self.margin,12*mm)
   c.setFillColor(MUTED);c.setFont('AtlasSans',7);c.drawString(self.margin,8*mm,self.fmt+' · EA-000');c.drawRightString(self.tw-self.margin,8*mm,str(d.page))
  c.restoreState()
 def afterFlowable(self,f):
  if hasattr(f,'tocTitle'):
   key=f.tocKey;self.canv.bookmarkPage(key);self.canv.addOutlineEntry(f.tocTitle,key,0,False);self.notify('TOCEntry',(0,f.tocTitle,self.page,key));self.bookmarks.append({'slug':key,'page':self.page,'title':f.tocTitle})

def styles(fmt):
 size=11.1 if fmt=='A5' else 12.1;lead=15.2 if fmt=='A5' else 17.2
 b=ParagraphStyle('body',fontName='Crimson',bulletFontName='AtlasSans',fontSize=size,leading=lead,textColor=INK,spaceAfter=5 if fmt=='A5' else 7,allowWidows=0,allowOrphans=0,splitLongWords=False)
 return { 'body':b,'small':ParagraphStyle('small',parent=b,fontName='AtlasSans',fontSize=7.4 if fmt=='A5' else 8.6,leading=10.2 if fmt=='A5' else 12,spaceAfter=6),
 'h1':ParagraphStyle('h1',parent=b,fontName='Crimson-Bold',fontSize=15 if fmt=='A5' else 19,leading=18 if fmt=='A5' else 23,spaceBefore=14,spaceAfter=7,keepWithNext=True),
 'h2':ParagraphStyle('h2',parent=b,fontName='Crimson-Bold',fontSize=12.2 if fmt=='A5' else 14.4,leading=15.5 if fmt=='A5' else 18,spaceBefore=11,spaceAfter=5,keepWithNext=True),
 'h3':ParagraphStyle('h3',parent=b,fontName='AtlasSans-Bold',fontSize=8.7 if fmt=='A5' else 10.4,leading=12 if fmt=='A5' else 14,spaceBefore=9,spaceAfter=4,keepWithNext=True),
 'quote':ParagraphStyle('quote',parent=b,fontName='Crimson-Italic',leftIndent=9*mm,rightIndent=5*mm,textColor=NAVY,borderColor=CYAN,borderWidth=0,borderPadding=7,spaceBefore=7,spaceAfter=9),
 'list':ParagraphStyle('list',parent=b,leftIndent=9,firstLineIndent=0,bulletIndent=0,spaceAfter=3),
 'cell':ParagraphStyle('cell',fontName='AtlasSans',fontSize=7.5 if fmt=='A5' else 9.3,leading=10 if fmt=='A5' else 13,textColor=INK,spaceAfter=2,splitLongWords=True)}

def htmlflows(parent,st,w,maxh):
 out=[]
 for e in parent:
  tag=e.tag.lower() if isinstance(e.tag,str) else ''
  if tag in ['p','div']:
   images=e.findall('.//img')
   if images:
    for im in images:
     file=im.get('src','').split('/')[-1];f=FIGMAP.get(file)
     if not f:raise ValueError('Unknown figure '+file)
     pic=VectorFigure(f,w,maxh*.70);caption=Paragraph('<b>Figura '+str(f['number'])+' · '+html.escape(f['title'])+'</b><br/>'+html.escape(f['caption'])+'<br/><i>Fonte: elaboração do autor; redesenho AtlasHub Editions.</i>',st['small'])
     out.append(KeepTogether([Spacer(1,6),pic,caption,Spacer(1,7)]))
   elif plain(e):out.append(Paragraph(inline(e),st['body']))
  elif tag in ['h1','h2','h3','h4','h5','h6']:
   key='h1' if tag=='h1' else 'h2' if tag=='h2' else 'h3';out.append(Paragraph(inline(e),st[key]))
  elif tag=='blockquote':
   for p in e.findall('./p'):out.append(Paragraph(inline(p),st['quote']))
  elif tag in ['ul','ol']:
   for i,li in enumerate(e.findall('./li')):out.append(Paragraph(inline(li),st['list'],bulletText='•' if tag=='ul' else str(i+1)+'.'))
  elif tag=='hr':out.append(Rule(w))
  elif tag=='table':
   rows=[]
   for tr in e.findall('.//tr'):
    cells=tr.findall('./th')+tr.findall('./td');rows.append([Paragraph(inline(c),st['cell']) for c in cells])
   if rows:
    n=max(map(len,rows));rows=[r+[Paragraph('',st['cell'])]*(n-len(r)) for r in rows]
    t=Table(rows,colWidths=[w/n]*n,repeatRows=1,hAlign='LEFT');t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#e7eeee')),('LINEBELOW',(0,0),(-1,0),.7,MUTED),('LINEBELOW',(0,1),(-1,-1),.3,LINE),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),5),('RIGHTPADDING',(0,0),(-1,-1),5),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5)]));out.extend([Spacer(1,6),t,Spacer(1,9)])
  elif tag=='pre':out.append(Paragraph(html.escape(plain(e)),st['small']))
  elif tag=='img':raise ValueError('Unwrapped figure')
  else:out.extend(htmlflows(e,st,w,maxh))
 return out

def build(fmt,printing):
 suffix='impressao-prova' if printing else 'digital';name='EA-000_Empresa-Aumentada_'+fmt+'_'+suffix+'.pdf';target=OUT/name
 doc=BookDoc(target,fmt,printing);st=styles(fmt);w,h=doc.width,doc.height;story=[]
 story.extend([Cover(w,h-2,fmt+' EXECUTIVE' if fmt=='A4' else 'LIVRO'),PageBreak()])
 story.extend([Spacer(1,h*.13),Paragraph('Empresa Aumentada',st['h1']),Paragraph('Da Inteligência Artificial à Organização Inteligente',st['body']),Spacer(1,10),Paragraph('Sérgio Monteiro',st['body']),Spacer(1,h*.14),Paragraph('AtlasHub Editions · EA-000<br/>Edição premium de revisão · outubro de 2026<br/>Português brasileiro · '+fmt,st['small']),Paragraph('© Sérgio Monteiro / AtlasHub Editions. Todos os direitos reservados. Os cenários empresariais são compostos e ilustrativos. Nenhum exemplo constitui promessa de desempenho.',st['small']),Paragraph('Preparação editorial e composição: AtlasHub Editions, com apoio de inteligência artificial e supervisão editorial. Tipografia: Crimson Text e Liberation Sans, sob SIL Open Font License. Diagramas vetoriais: elaboração editorial a partir dos modelos do autor.',st['small']),Paragraph('Esta prova aguarda homologação editorial final. A versão para impressão exige validação de perfil de cor, papel, encadernação e prova física com a gráfica. ISBN e ficha catalográfica não foram atribuídos nesta etapa.',st['small']),PageBreak()])
 story.append(Paragraph('Sumário',st['h1']));toc=TableOfContents();toc.levelStyles=[ParagraphStyle('toc',parent=st['body'],fontSize=9.6 if fmt=='A5' else 11,leading=13.5 if fmt=='A5' else 16,spaceBefore=4,leftIndent=0,firstLineIndent=0,rightIndent=18)];toc.dotsMinLevel=0;story.extend([toc,PageBreak()])
 lastpart=None
 for s in SECTIONS:
  if s.get('part') and s['part']!=lastpart:
   lastpart=s['part'];story.extend([PartLeaf(w,h-2,lastpart),PageBreak()])
  title=('Capítulo '+str(int(s['number']))+' · ' if s['number'] else '')+s['title']
  opening=Opening(w,108 if fmt=='A5' else 150,s['title'],'Capítulo '+str(int(s['number'])) if s['number'] else 'AtlasHub Editions',num=s['number']);opening.tocTitle=title;opening.tocKey=s['slug'];story.append(opening)
  if s['number'] and 12<=int(s['number'])<=17:story.append(Paragraph('CENÁRIO COMPOSTO E ILUSTRATIVO',st['small']))
  parent=split_figure_paragraphs(LH.fragment_fromstring(s['html'],create_parent='div'));story.extend(htmlflows(parent,st,w,h));story.append(PageBreak())
 story.append(BackCover(w,h-2))
 doc.multiBuild(story,maxPasses=5,canvasmaker=lambda *a,**kw:Canvas(*a,**{**kw,'initialFontName':'Crimson'}))
 clean_unused_fonts(target)
 if printing:
  reader=PdfReader(target);writer=PdfWriter();writer.clone_document_from_reader(reader)
  for page in writer.pages:page.trimbox=RectangleObject([doc.bleed,doc.bleed,doc.bleed+doc.tw,doc.bleed+doc.th]);page.bleedbox=copy.copy(page.mediabox)
  writer.add_metadata({'/Title':'Empresa Aumentada — '+fmt+' — Prova de impressão','/Author':'Sérgio Monteiro','/Subject':'Prova de pré-impressão com sangria de 3 mm; sem certificação PDF/X; homologação gráfica pendente.'})
  with target.open('wb') as f:writer.write(f)
  covers=PdfWriter();updated=PdfReader(target);covers.add_page(updated.pages[0]);covers.add_page(updated.pages[-1]);covers.add_metadata({'/Title':'EA-000 — '+fmt+' — Capa e contracapa, sem lombada','/Author':'Sérgio Monteiro'})
  with (OUT/('EA-000_Capa-Contracapa_'+fmt+'_prova.pdf')).open('wb') as f:covers.write(f)
 summary={'file':name,'format':fmt,'printing':printing,'pages':len(PdfReader(target).pages),'trim_mm':[148,210] if fmt=='A5' else [210,297],'bleed_mm':3 if printing else 0,'bookmarks':doc.bookmarks[-27:],'pdfx':False}
 (ED/('pagination-'+fmt+('-print' if printing else '')+'.json')).write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding='utf8');print(json.dumps({k:v for k,v in summary.items() if k!='bookmarks'},ensure_ascii=False),flush=True)
 return target

if __name__=='__main__':
 for fmt in ['A5','A4']:
  for printing in [False,True]:build(fmt,printing)
