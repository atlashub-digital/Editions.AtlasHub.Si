import type { MetadataRoute } from 'next';
export default function sitemap():MetadataRoute.Sitemap {
 return ['','/livros','/livros/empresa-aumentada','/livros/empresa-aumentada/toolkit'].map(path=>({url:'https://editions.atlashub.si'+path}));
}
