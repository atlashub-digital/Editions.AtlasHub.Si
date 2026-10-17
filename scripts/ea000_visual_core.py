"""Shared vector art, canonical figures and page composition for EA-000.
The manuscript is a read-only input. No editorial text is rewritten here.
"""
from pathlib import Path
import json,math,re,html,hashlib,base64,copy
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph,Flowable
from reportlab.graphics.shapes import Drawing,Rect,Line,Circle,Polygon,PolyLine,String,Ellipse
from reportlab.graphics import renderPDF,renderSVG
from reportlab.lib.utils import ImageReader

ROOT=Path(__file__).resolve().parents[1];ED=ROOT/'editorial/ea000';VE=ED/'visual';PUB=ROOT/'public/ea000';IMG=PUB/'images';ART=PUB/'art';FIG=PUB/'figures'
for p in [VE,IMG,ART,FIG]:p.mkdir(parents=True,exist_ok=True)
for n,f in [('Crimson','CrimsonText-Regular.ttf'),('Crimson-Bold','CrimsonText-Bold.ttf'),('Crimson-Italic','CrimsonText-Italic.ttf'),('AtlasSans','LiberationSans-Regular.ttf'),('AtlasSans-Bold','LiberationSans-Bold.ttf')]:
 try:pdfmetrics.getFont(n)
 except KeyError:pdfmetrics.registerFont(TTFont(n,str(ED/'fonts'/f)))
NAVY='#06172b';CYAN='#58cce5';INK='#1c303d';PAPER='#fcfaf5';MUTED='#5d7380';LINE='#c5d3d6';GOLD='#b69966'
C=colors.HexColor
MASTER=ROOT/'content/empresa-aumentada-manuscript.json';SECTIONS=json.loads(MASTER.read_text(encoding='utf8'));SM={s['slug']:s for s in SECTIONS};FIGURES=json.loads((ED/'figures.json').read_text(encoding='utf8'));FM={f['file']:f for f in FIGURES}
PARTS=list(dict.fromkeys(s['part'] for s in SECTIONS if s.get('part')))
CH_PHOTO={7:'skyline-approved',12:'comercio',13:'farmacia',15:'clinica',16:'boardroom',17:'logistica'}
PART_PHOTO=['conhecimento','boardroom','organizacao','logistica','skyline-approved']
PART_ACCENT=[GOLD,CYAN,'#77b9bc','#b99668',CYAN]
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def quote(s):
 q=re.search(r'^> \*\*(.+?)\*\*',s['markdown'],re.M)
 if not q:q=re.search(r'^> (.+)',s['markdown'],re.M)
 q=q.group(1).replace('**','').strip() if q else ''
 if len(q)>285:
  first=re.split(r'(?<=[.!?])\s+',q)[0]
  if len(first)>35:q=first
 assert q in s['markdown'],s['slug'];return q
def dtext(d,s,x,y,sz=18,font='AtlasSans',col=INK,center=False):d.add(String(x,y,s,fontName=font,fontSize=sz,fillColor=C(col),textAnchor='middle' if center else 'start'))
def figure_drawing(f):
 """Retain every canonical box, label, edge, arrow endpoint and feedback path."""
 d=Drawing(f['width'],f['height']);H=f['height'];yy=lambda y:H-y
 for e in f['edges']:
  pts=[e['x1'],yy(e['y1']),e['x1'],yy((e['y1']+e['y2'])/2),e['x2'],yy((e['y1']+e['y2'])/2),e['x2'],yy(e['y2']-4)]
  d.add(PolyLine(pts,fillColor=None,strokeColor=C('#4c8798'),strokeWidth=1.6))
  d.add(Polygon([e['x2'],yy(e['y2']-4),e['x2']-4,yy(e['y2']-11),e['x2']+4,yy(e['y2']-11)],fillColor=C('#4c8798'),strokeColor=None))
 last=max(b['row'] for b in f['boxes'])
 for b in f['boxes']:
  dark=b['row']==0 or (b['row']==last and len(f['rows'])>2)
  x,y,w,h=b['x'],yy(b['y']+b['height']),b['width'],b['height']
  d.add(Rect(x,y,w,h,fillColor=C(NAVY if dark else '#edf2ef'),strokeColor=C(NAVY if dark else LINE),strokeWidth=.9))
  d.add(Rect(x,y,3,h,fillColor=C(CYAN if dark else '#80aab1'),strokeColor=None))
  for i,line in enumerate(b['lines']):
   dtext(d,line,x+w/2,yy(b['y']+h/2-(len(b['lines'])-1)*12+i*24+6),18,'AtlasSans-Bold' if dark else 'AtlasSans','#ffffff' if dark else INK,True)
 if f.get('feedbackEdge'):
  e=f['feedbackEdge'];d.add(PolyLine([42,yy(e['y1']),14,yy(e['y1']),14,yy(e['y2']),38,yy(e['y2'])],fillColor=None,strokeColor=C(GOLD),strokeWidth=1.6,strokeDashArray=[5,4]))
  d.add(Polygon([38,yy(e['y2']),31,yy(e['y2']-4),31,yy(e['y2']+4)],fillColor=C(GOLD),strokeColor=None))
 return d
def concept(n,w=600,h=280):
 d=Drawing(w,h)
 def ln(x,y,xx,yy,col=LINE,lw=1):d.add(Line(x,y,xx,yy,strokeColor=C(col),strokeWidth=lw))
 def circ(x,y,r,col=CYAN,fill=None):d.add(Circle(x,y,r,strokeColor=C(col),fillColor=C(fill) if fill else None,strokeWidth=1.2))
 if n==1:
  ln(50,80,550,80,GOLD,1)
  for x,year,label in [(100,'1950','TURING'),(330,'1955','PROPOSTA DARTMOUTH')]:
   circ(x,80,5,CYAN,NAVY);dtext(d,year,x,120,34,'Crimson',NAVY,True);dtext(d,label,x,45,11,'AtlasSans',MUTED,True)
 elif n==3:
  dtext(d,'AI',60,100,120,'Crimson',NAVY);dtext(d,'SI',355,100,120,'Crimson',NAVY);ln(267,65,267,235,CYAN,2)
 elif n in [5,10]:
  def iso(u,v,z):return (300+(u-v)*.85,70+(u+v)*.25+z)
  for z in [0,45,90,135]:
   pts=[iso(-110,-55,z),iso(110,-55,z),iso(110,55,z),iso(-110,55,z),iso(-110,-55,z)]
   for a,b in zip(pts,pts[1:]):ln(*a,*b,NAVY if z==135 else LINE,.9)
  for u in [-110,-37,37,110]:
   for v in [-55,55]:ln(*iso(u,v,0),*iso(u,v,135),LINE,.8)
  ln(*iso(-110,-55,90),*iso(110,-55,90),CYAN,3)
 elif n==8:
  circ(390,145,92,'#bed0d0');ln(45,145,555,145,NAVY,1);circ(390,145,6,CYAN,NAVY);ln(390,48,390,240,LINE,.8)
 elif n==14:
  d.add(Ellipse(300,140,140,100,fillColor=None,strokeColor=C(NAVY),strokeWidth=1))
  for r in [35,78,115]:d.add(Ellipse(300,140,r,100,fillColor=None,strokeColor=C(LINE),strokeWidth=.7))
  for y in [90,140,190]:ln(170,y,430,y,LINE,.7)
  ln(195,165,405,85,CYAN,2);circ(195,165,4,CYAN,NAVY);circ(405,85,4,CYAN,NAVY)
 elif n in [18,19]:
  if n==19:
   dtext(d,'ROI',55,123,80,'Crimson',NAVY);ln(265,150,555,150,CYAN,2)
   dtext(d,'Valor Criado − Investimento Total',410,180,16,'AtlasSans',INK,True);dtext(d,'Investimento Total',410,113,17,'AtlasSans',INK,True)
  else:
   for i,(label,sym) in enumerate([('Receita','↑'),('Custos','↓'),('Velocidade','↑'),('Controle','↑')]):
    x=30+i*145;dtext(d,sym,x+44,128,65,'Crimson',CYAN,True);dtext(d,label,x+44,70,17,'AtlasSans',NAVY,True);ln(x,40,x+110,40,LINE,.8)
 elif n==20:
  d.add(Polygon([230,225,300,248,370,225,356,107,300,52,244,107],fillColor=None,strokeColor=C(NAVY),strokeWidth=1.5));ln(268,148,295,121,CYAN,3);ln(295,121,338,180,CYAN,3)
 elif n==21:
  for i,word in enumerate(['1 processo','1 problema','1 objetivo','1 capacidade inteligente']):dtext(d,word,40,235-i*53,23,'Crimson',NAVY);ln(40,220-i*53,390,220-i*53,LINE,.7)
  dtext(d,'30',460,133,77,'Crimson',CYAN,True);dtext(d,'dias',460,95,22,'Crimson',NAVY,True)
 elif n==4:
  for i in range(5):
   x=55+i*17;y=205-i*34;dtext(d,'›',x,y,29,'Crimson',CYAN)
   for j in range(3):ln(x+40+j*95,y+9,x+105+j*95,y+9,LINE,1)
 elif n==6:
  for i in range(9):ln(40,50+i*17,245,50+i*17,LINE,.7)
  circ(430,142,68,NAVY);ln(294,142,362,142,CYAN,2);circ(430,142,7,CYAN,NAVY)
 else:
  # Abstract visual studies of distributed capacity; no labelled technical claims.
  count={2:5,9:7,11:9}.get(n,6)
  pts=[(300+160*math.cos(2*math.pi*i/count),140+100*math.sin(2*math.pi*i/count)) for i in range(count)]
  for i,(x,y) in enumerate(pts):
   ln(x,y,300,140,LINE,.8)
   if n==11:ln(x,y,*pts[(i+1)%count],LINE,.5)
   circ(x,y,8+(i%3)*3,CYAN if i%2==0 else '#7f9ca8')
  circ(300,140,24,NAVY);circ(300,140,8,CYAN)
 return d
def save_svg(d,path,title,alt):
 renderSVG.drawToFile(d,str(path));s=path.read_text(encoding='utf8').replace('<title>...</title>','<title>'+html.escape(title)+'</title>').replace('<desc>...</desc>','<desc>'+html.escape(alt)+'</desc>')
 s=s.replace('font-family: AtlasSans-Bold;','font-family: Liberation Sans; font-weight: bold;').replace('font-family: AtlasSans;','font-family: Liberation Sans;').replace('font-family: Crimson;','font-family: Crimson Text;')
 path.write_text(s,encoding='utf8')

class Painter:
 def __init__(self,c,w,h,printing=False):self.c=c;self.w=w;self.h=h;self.printing=printing
 def rect(self,x,y,w,h,col):self.c.setFillColor(C(col));self.c.rect(x,self.h-y-h,w,h,fill=1,stroke=0)
 def text(self,s,x,y,size=10,font='AtlasSans',col=INK):self.c.setFont(font,size);self.c.setFillColor(C(col));self.c.drawString(x,self.h-y-size*.78,s)
 def track(self,s,x,y,size=8,col=MUTED,spacing=1.4):
  self.c.saveState();t=self.c.beginText(x,self.h-y-size*.78);t.setFont('AtlasSans',size);t.setFillColor(C(col));t.setCharSpace(spacing);t.textOut(s);self.c.drawText(t);self.c.restoreState()
 def line(self,x,y,xx,yy,col=LINE,lw=.6):self.c.setStrokeColor(C(col));self.c.setLineWidth(lw);self.c.line(x,self.h-y,xx,self.h-yy)
 def para(self,s,x,y,w,size=20,lead=None,font='Crimson',col=INK):
  p=Paragraph(s,ParagraphStyle('art',fontName=font,fontSize=size,leading=lead or size*1.2,textColor=C(col),allowWidows=0,allowOrphans=0));_,hh=p.wrap(w,10000);p.drawOn(self.c,x,self.h-y-hh);return hh
 def photo(self,name,x,y,w,h):
  path=IMG/(name+('-cmyk' if self.printing else '')+'.jpg');im=ImageReader(str(path));iw,ih=im.getSize();sc=max(w/iw,h/ih)
  self.c.saveState();clip=self.c.beginPath();clip.rect(x,self.h-y-h,w,h);self.c.clipPath(clip,stroke=0,fill=0);self.c.drawImage(im,x+(w-iw*sc)/2,self.h-y-h+(h-ih*sc)/2,width=iw*sc,height=ih*sc);self.c.restoreState()
 def shade(self,x,y,w,h,a=.65):
  self.c.saveState();self.c.setFillColor(C(NAVY));self.c.setFillAlpha(a);self.c.rect(x,self.h-y-h,w,h,fill=1,stroke=0);self.c.restoreState()
 def brand(self,x,y,scale=1):
  self.c.saveState();self.c.translate(x,self.h-y-28*scale);self.c.scale(.35*scale,.35*scale)
  for pts,col in [([8,0,38,62,53,33,35,0],'#ffffff'),([49,49,68,64,88,0,66,0],CYAN),([36,0,54,29,68,0],'#ffffff')]:
   p=self.c.beginPath();p.moveTo(*pts[:2])
   for i in range(2,len(pts),2):p.lineTo(*pts[i:i+2])
   p.close();self.c.setFillColor(C(col));self.c.drawPath(p,fill=1,stroke=0)
  self.c.restoreState();self.text('AtlasHub',x+38*scale,y,20*scale,'AtlasSans-Bold','#ffffff');self.track('E D I T I O N S',x+39*scale,y+25*scale,6*scale,CYAN,.5*scale)
 def art(self,d,x,y,w,h):
  sc=min(w/d.width,h/d.height);self.c.saveState();self.c.translate(x+(w-d.width*sc)/2,self.h-y-d.height*sc);self.c.scale(sc,sc);renderPDF.draw(d,self.c,0,0);self.c.restoreState()
 def cover(self,back=False):
  w,h=self.w,self.h;m=w*.083;scale=w/595.2756
  bleed=8.504 if self.printing else 0
  self.photo('skyline-approved',-bleed,-bleed,w+2*bleed,h+2*bleed)
  if not back:
   self.track('EA-000',m,h*.045,10*scale,CYAN,2*scale)
   self.text('EMPRESA',m-2,h*.105,65*scale,'AtlasSans-Bold','#ffffff');self.text('AUMENTADA',m-2,h*.192,65*scale,'AtlasSans-Bold',CYAN)
   self.para('Da Inteligência Artificial<br/>à Organização Inteligente',m,h*.293,w-2*m,23*scale,28*scale,'Crimson','#ffffff')
   self.track('SÉRGIO MONTEIRO',m,h*.39,11*scale,'#ffffff',2*scale)
  else:
   self.shade(0,0,w,h,.68);self.track('ATLASHUB EDITIONS',m,h*.055,9*scale,CYAN,1.6*scale)
   hh=self.para('A próxima transformação da empresa começa na forma como ela se organiza.',m,h*.14,w-2*m,30*scale,36*scale,'Crimson','#ffffff')
   y=h*.14+hh+35*scale
   for t in ['Como combinar pessoas, agentes inteligentes, tecnologia, processos e dados em uma arquitetura orientada a resultados? Este ensaio propõe uma resposta de gestão: objetivos claros, capacidade coordenada, limites explícitos e responsabilidade humana.','Dos fundamentos da inteligência artificial aos cenários de operação, a pergunta permanece concreta: o que muda na receita, nos custos, na velocidade e no controle?']:
    y+=self.para(t,m,y,w-2*m,17*scale,24*scale,'Crimson','#e3ebee')+23*scale
  self.shade(0,h-85*scale,w,85*scale,.9);self.brand(m,h-65*scale,.9*scale);self.track('EA-000',w-m-50*scale,h-42*scale,7.5*scale,CYAN,scale)
 def part(self,index):
  w,h=self.w,self.h;m=w*.083;k=w/595.2756
  bleed=8.504 if self.printing else 0
  self.photo(PART_PHOTO[index],-bleed,-bleed,w+2*bleed,h*.63+bleed);self.rect(0,h*.59,w,h*.41,NAVY)
  self.track('PARTE '+['I','II','III','IV','V'][index],m,h*.625,10*k,PART_ACCENT[index],1.8*k)
  title=PARTS[index].split(' - ',1)[-1]
  hh=self.para(html.escape(title),m,h*.69,w-2*m,36*k,41*k,'Crimson','#ffffff')
  first=next(s for s in SECTIONS if s.get('part')==PARTS[index]);q=quote(first)
  self.line(m,h*.69+hh+22*k,m+55*k,h*.69+hh+22*k,PART_ACCENT[index],1)
  self.para(html.escape(q),m,h*.69+hh+39*k,w-2*m,13.5*k,18*k,'Crimson-Italic','#dae7e9')
 def chapter(self,s):
  n=int(s['number']);w,h=self.w,self.h;k=w/595.2756;m=w*.083;q=quote(s);accent=PART_ACCENT[PARTS.index(s['part'])]
  self.rect(0,0,w,h,PAPER)
  if n in CH_PHOTO:
   bleed=8.504 if self.printing else 0
   self.photo(CH_PHOTO[n],-bleed,-bleed,w+2*bleed,h*.39+bleed);self.rect(m,h*.34,86*k,92*k,NAVY);self.text(s['number'],m+10*k,h*.358,56*k,'Crimson','#ffffff')
   y=h*.48;self.track('CAPÍTULO '+s['number'],m+111*k,h*.417,8*k,MUTED,k)
   th=self.para(html.escape(s['title']),m,y,w-2*m,37*k,42*k,'Crimson',NAVY)
   yy=max(h*.70,y+th+27*k);self.line(m,yy,m+52*k,yy,accent,1);qh=self.para(html.escape(q),m,yy+22*k,w-2*m,18*k,24*k,'Crimson-Italic',INK)
   assert yy+22*k+qh<h-40*k,('chapter quote overflow',s['slug'])
  else:
   if n in [4,11,20,21]:
    self.rect(0,0,18*k,h,NAVY)
   self.track(s['part'].split(' - ')[0]+' / CAPÍTULO '+s['number'],m,h*.055,8*k,MUTED,k)
   self.text(s['number'],m-3*k,h*.12,88*k,'Crimson',NAVY)
   th=self.para(html.escape(s['title']),m,h*.265,w-2*m,35*k if len(s['title'])>53 else 39*k,42*k,'Crimson',NAVY)
   yy=h*.265+th+24*k;qh=self.para(html.escape(q),m,yy,w-2*m,18*k,24*k,'Crimson-Italic',INK)
   ay=max(h*.59,yy+qh+28*k);ah=h-ay-63*k
   assert ah>85*k,('chapter art overflow',s['slug'],ay)
   self.art(concept(n),m,ay,w-2*m,ah)
  self.track('AT L A S H U B  E D I T I O N S',m,h-29*k,6*k,MUTED,.6*k)

class VisualLeaf(Flowable):
 def __init__(self,doc,kind,data=None):super().__init__();self.width=doc.width;self.height=doc.height-1;self.kind=kind;self.data=data
 def draw(self):
  c=self.canv;doc=c._doctemplate;c.saveState();tx,ty=c.absolutePosition(0,0);c.translate(-tx,-ty);c.translate(doc.bleed,doc.bleed)
  p=Painter(c,doc.tw,doc.th,doc.printing);p.rect(-doc.bleed,-doc.bleed,doc.tw+2*doc.bleed,doc.th+2*doc.bleed,NAVY if self.kind in ['cover','back','part'] else PAPER)
  if self.kind in ['cover','back']:p.cover(self.kind=='back')
  elif self.kind=='part':p.part(self.data)
  else:p.chapter(self.data)
  doc.artPages.add(doc.page);c.restoreState()

class VisualFigure(Flowable):
 def __init__(self,f,w,maxh):super().__init__();self.f=f;self.d=figure_drawing(f);self.scale=min(w/f['width'],maxh/f['height']);self.width=w;self.height=f['height']*self.scale+8
 def draw(self):
  self.canv.saveState();self.canv.translate((self.width-self.d.width*self.scale)/2,4);self.canv.scale(self.scale,self.scale);renderPDF.draw(self.d,self.canv,0,0);self.canv.restoreState()
