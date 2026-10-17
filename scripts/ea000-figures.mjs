import fs from 'node:fs';
const specs=JSON.parse(fs.readFileSync('editorial/ea000/figure-specs.json','utf8'));
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const wrap=(s,n)=>{const a=[];let l='';for(const w of s.split(' ')){if((l+' '+w).trim().length>n&&l){a.push(l);l=w}else l=(l+' '+w).trim()}if(l)a.push(l);return a};
const figures=specs.map((s,i)=>{
 const width=720,gap=20,pad=42,rowGap=42;let y=24;const boxes=[],edges=[];
 for(const [ri,row] of s.rows.entries()){
  const bw=(width-pad*2-gap*(row.length-1))/row.length;
  const lines=row.map(t=>wrap(t,Math.floor(bw/9.4)));
  const bh=Math.max(70,...lines.map(a=>a.length*24+22));
  row.forEach((t,ci)=>boxes.push({row:ri,col:ci,x:pad+ci*(bw+gap),y,width:bw,height:bh,lines:lines[ci]}));
  y+=bh+rowGap;
 }
 if(!s.noArrows&&s.kind!=='matrix')for(let ri=0;ri<s.rows.length-1;ri++){
  const a=boxes.filter(b=>b.row===ri),b=boxes.filter(b=>b.row===ri+1);
  for(let j=0;j<a.length;j++)for(let k=0;k<b.length;k++)if(a.length===1||b.length===1||j===k)edges.push({x1:a[j].x+a[j].width/2,y1:a[j].y+a[j].height,x2:b[k].x+b[k].width/2,y2:b[k].y});
 }
 const height=y-rowGap+24;
 const feedback=s.feedback?{x:14,y1:boxes.at(-1).y+boxes.at(-1).height/2,y2:boxes[0].y+boxes[0].height/2}:null;
 let drawing='<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke="#456373" stroke-width="1.4"/></marker></defs>';
 for(const e of edges)drawing+='<path d="M'+e.x1+','+e.y1+' L'+e.x1+','+(e.y1+e.y2)/2+' L'+e.x2+','+(e.y1+e.y2)/2+' L'+e.x2+','+(e.y2-4)+'" fill="none" stroke="#456373" stroke-width="1.6" marker-end="url(#arrow)"/>';
 if(feedback)drawing+='<path d="M42,'+feedback.y1+' H14 V'+feedback.y2+' H38" fill="none" stroke="#456373" stroke-width="1.4" stroke-dasharray="5 4" marker-end="url(#arrow)"/>';
 for(const b of boxes){drawing+='<g><rect x="'+b.x+'" y="'+b.y+'" width="'+b.width+'" height="'+b.height+'" rx="5" fill="'+(b.row===0?'#0b2537':'#f1f5f5')+'" stroke="'+(b.row===0?'#0b2537':'#adc1c7')+'"/><text font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="'+(b.row===0?'#ffffff':'#142d3c')+'">';b.lines.forEach((l,k)=>drawing+='<tspan x="'+(b.x+b.width/2)+'" y="'+(b.y+b.height/2-(b.lines.length-1)*12+k*24+6)+'">'+esc(l)+'</tspan>');drawing+='</text></g>';}
 fs.writeFileSync('public/diagrams/'+s.file,'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+width+' '+height+'" role="img" aria-labelledby="title desc"><title id="title">'+esc(s.title)+'</title><desc id="desc">'+esc(s.caption)+'</desc>'+drawing+'</svg>');
 return {...s,number:i+1,chapter:s.file.match(/capitulo-\d+/)[0],width,height,boxes,edges,feedbackEdge:feedback,source:'Elaboração editorial a partir do framework e dos cenários de Sérgio Monteiro.',rights:'Conteúdo do autor; desenho AtlasHub Editions. Homologação final pendente.',status:'REVIEW',alt:s.title+'. '+s.caption};
});
fs.writeFileSync('editorial/ea000/figures.json',JSON.stringify(figures,null,2)+'\n');
const master=JSON.parse(fs.readFileSync('content/empresa-aumentada-manuscript.json','utf8'));
for(const s of master)s.markdown=s.markdown.replace(/!\[[^\]]*\]\(\/diagrams\/([^)]+)\)/g,(all,file)=>{const f=figures.find(x=>x.file===file);return f?'![Figura '+f.number+' — '+f.title+'. '+f.caption+'](/diagrams/'+f.file+')':all});
fs.writeFileSync('content/empresa-aumentada-manuscript.json',JSON.stringify(master,null,2)+'\n');
console.log('29 figuras vetoriais e legendas geradas.');
