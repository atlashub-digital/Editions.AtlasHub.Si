import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const root=process.cwd(),out=path.join(root,'editorial/ea000/visual/qa/browser-ci');fs.mkdirSync(out,{recursive:true});
const master=JSON.parse(fs.readFileSync('content/empresa-aumentada-manuscript.json','utf8'));
const figures=JSON.parse(fs.readFileSync('editorial/ea000/figures.json','utf8'));
const base=process.env.EA000_TEST_BASE_URL||'http://127.0.0.1:3000';
const browser=await chromium.launch({headless:true});const results=[];
try{
 for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:width===390?844:1000}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  let count=0;
  for(const section of master){
   const response=await page.goto(base+'/livros/empresa-aumentada/ler/'+section.slug,{waitUntil:'domcontentloaded'});assert.equal(response.status(),200);
   await page.locator('img').evaluateAll(images=>images.forEach(i=>i.loading='eager'));
   await page.waitForFunction(()=>Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0),{},{timeout:30000});
   assert.equal((await page.locator('h1').innerText()).trim(),section.title);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert.equal(overflow,false,section.slug+' overflow');
   const figureCount=await page.locator('img[src*="/ea000/figures/"]').count();count+=figureCount;
   const brokenAnchors=await page.locator('a[href^="#"]').evaluateAll(links=>links.map(a=>a.getAttribute('href')).filter(h=>h.length>1&&!document.getElementById(decodeURIComponent(h.slice(1)))));assert.deepEqual(brokenAnchors,[]);
   if(['capitulo-01','capitulo-07','capitulo-21'].includes(section.slug)){
    await page.getByRole('button',{name:'Tema escuro',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.reader-light')?.dataset.theme==='night');
    await page.getByRole('button',{name:'Aumentar texto',exact:true}).click();assert.equal(await page.evaluate(()=>document.documentElement.style.getPropertyValue('--reading-size')),'1.35rem');
    await page.screenshot({path:path.join(out,'reader-'+width+'-'+section.slug+'.png')});
    await page.getByRole('button',{name:'Tema claro',exact:true}).click();
   }
   if(section.slug==='capitulo-07'){
    const fig=page.locator('img[src*="/ea000/figures/"]').first();await fig.scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'figure-'+width+'.png')});
   }
   results.push({width,slug:section.slug,status:200,imagesLoaded:true,h1Exact:true,figureCount,horizontalOverflow:false,anchorsValid:true});
  }
  assert.equal(count,figures.length);
  await page.goto(base+'/livros/empresa-aumentada/ler',{waitUntil:'domcontentloaded'});await page.getByRole('link',{name:'Retomar leitura →'}).waitFor();
  assert.equal(await page.locator('.reader-index a').count(),27);assert.equal(await page.locator('.visual-part').count(),5);
  await page.locator('img').evaluateAll(images=>images.forEach(i=>i.loading='eager'));await page.waitForFunction(()=>Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0));
  await page.screenshot({path:path.join(out,'index-'+width+'.png')});assert.deepEqual(errors,[]);results.push({width,indexSections:27,parts:5,figures:count,resume:true,javascriptErrors:errors});await context.close();
 }
}finally{await browser.close();fs.writeFileSync(path.join(out,'reader-browser.json'),JSON.stringify({mode:'real Next.js production server in CI; live protected Vercel preview separately pending',results},null,2));}
console.log('PASS full Reader desktop/mobile: 27 sections, 21 chapters, 5 parts, 29 figures per viewport.');
