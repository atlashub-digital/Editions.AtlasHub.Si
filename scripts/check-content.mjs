import {readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const index=read('content/empresa-aumentada-index.json');
const sections=read('content/empresa-aumentada-manuscript.json');
const toolkit=read('content/empresa-aumentada-toolkit.json');
assert.equal(index.chapters.length,21);assert.equal(index.parts.length,5);
assert.equal(sections.length,27);assert.equal(new Set(sections.map(s=>s.slug)).size,27);
for(const chapter of index.chapters){const section=sections.find(s=>s.number===chapter.number);assert.ok(section);assert.equal(section.title,chapter.title);assert.equal(section.part,chapter.part);assert.ok(section.markdown.length>1000);}
for(const section of sections){assert.ok(!section.markdown.includes('<<<SECTION:'));assert.ok(!section.markdown.includes('```mermaid'));assert.ok(!/<\/?(?:table|callout)\b/.test(section.markdown),'Unconverted source markup: '+section.slug);for(const [,asset] of section.markdown.matchAll(/\]\((\/diagrams\/[^)]+)\)/g))assert.ok(existsSync('public'+asset),asset);}
for(const t of toolkit){const source=sections.find(s=>s.slug===t.chapter);assert.ok(source?.markdown.includes(t.markdown),t.slug);assert.ok(existsSync('public/downloads/'+t.slug+'.md'));}
for(const file of ['empresa-aumentada.pdf','empresa-aumentada.epub','empresa-aumentada-toolkit.pdf'])assert.ok(existsSync('public/downloads/'+file),file);
console.log('Canonical content, 27 sections, diagrams, toolkit extracts and downloads verified.');
