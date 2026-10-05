import manuscript from '@/content/empresa-aumentada-manuscript.json';
export const bookSections = manuscript;
export const bookBase = '/livros/empresa-aumentada';
export const readerBase = `${bookBase}/ler`;
export const sectionUrl = (slug: string) => `${readerBase}/${slug}`;
export const getSection = (slug: string) => bookSections.find(section => section.slug === slug);
