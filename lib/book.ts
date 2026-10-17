import manuscript from '@/content/empresa-aumentada-manuscript.json';
export const bookSections = manuscript;
export const bookBase = '/livros/empresa-aumentada';
export const readerBase = `${bookBase}/ler`;
export const sectionUrl = (slug: string) => `${readerBase}/${slug}`;
export const getSection = (slug: string) => bookSections.find(section => section.slug === slug);
export const headingId = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const sectionHeadings = (markdown: string) => [...markdown.matchAll(/^## (\d+\..+)$/gm)].map(match => ({title:match[1],id:headingId(match[1].replace(/[*_`]/g,''))}));
