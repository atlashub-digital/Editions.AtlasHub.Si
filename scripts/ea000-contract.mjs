import fs from 'node:fs';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const master=JSON.parse(fs.readFileSync('content/empresa-aumentada-manuscript.json','utf8'));
const figures=JSON.parse(fs.readFileSync('editorial/ea000/figures.json','utf8'));
if(process.argv.includes('--sync')){
 const toolkit=JSON.parse(fs.readFileSync('content/empresa-aumentada-toolkit.json','utf8'));
 for(const t of toolkit){const s=master.find(s=>s.slug===t.chapter);const heading=s.markdown.match(new RegExp('^## \\d+\\. O '+t.title+'$','m'))?.[0];assert.ok(heading,t.slug);const start=s.markdown.indexOf(heading),end=s.markdown.indexOf('\n## ',start+heading.length);t.markdown=s.markdown.slice(start,end<0?undefined:end).trim();fs.writeFileSync('public/downloads/'+t.slug+'.md','# '+t.title+'\n\nTrecho de Empresa Aumentada, Sérgio Monteiro. EA-000.\n\n'+t.markdown+'\n');}
 fs.writeFileSync('content/empresa-aumentada-toolkit.json',JSON.stringify(toolkit,null,2)+'\n');
}
assert.equal(master.length,27);assert.equal(master.filter(s=>s.number).length,21);assert.equal(new Set(master.filter(s=>s.part).map(s=>s.part)).size,5);assert.equal(figures.length,29);
for(const s of master){assert.equal(hash(s.markdown),s.revisionSha256,'stale revision hash '+s.slug);assert.ok(!/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffd]/.test(s.markdown),'invalid character '+s.slug);for(const [,file] of s.markdown.matchAll(/\]\(\/diagrams\/([^)]+)\)/g)){const f=figures.find(f=>f.file===file);assert.ok(f,'figure metadata '+file);assert.ok(fs.readFileSync('public/diagrams/'+file,'utf8').includes('<desc'));}}
const expected=master.map(s=>'# '+(s.number?'Capítulo '+s.number+' — ':'')+s.title+'\n\n'+s.markdown).join('\n\n---\n\n')+'\n';assert.equal(fs.readFileSync('editorial/ea000/master.md','utf8'),expected,'Markdown export drift');
const manifest={schemaVersion:'1.0',project:'atlashub-editions',publication:{id:'EA-000',legacyIds:['EA-001'],slug:'empresa-aumentada',locale:'pt-BR',title:'Empresa Aumentada',author:'Sérgio Monteiro',canonicalUrl:'https://editions.atlashub.si/livros/empresa-aumentada',status:'editorial-review',master:'content/empresa-aumentada-manuscript.json',sections:27,chapters:21,parts:5,figures:29,masterSha256:hash(fs.readFileSync('content/empresa-aumentada-manuscript.json'))},adapter:'existing-git-json',amfReference:{schema:'0.2.0',experienceCore:'0.2.1',directDependency:false,adoptedPatterns:['provenance','master-projection','asset-hashes','validation','branch-preview-review-release']},gates:{technicalQA:'in-progress',editorialApproval:false,assetApproval:false,productionRelease:false,commercialActivation:false}};
if(process.argv.includes('--sync'))fs.writeFileSync('editorial/ea000/publication.manifest.json',JSON.stringify(manifest,null,2)+'\n');
else assert.equal(JSON.parse(fs.readFileSync('editorial/ea000/publication.manifest.json','utf8')).publication.masterSha256,manifest.publication.masterSha256,'Manifest projection drift');
console.log('PASS EA-000: 27 seções, 21 capítulos, 5 partes, 29 figuras, hashes e projeções.');
