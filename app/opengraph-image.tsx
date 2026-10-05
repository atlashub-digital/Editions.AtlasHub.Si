import { ImageResponse } from 'next/og';
export const alt='AtlasHub Editions — Conhecimento para Empresas Reais';
export const size={width:1200,height:630};
export const contentType='image/png';
export default function Image(){return new ImageResponse(<div style={{display:'flex',flexDirection:'column',justifyContent:'space-between',width:'100%',height:'100%',padding:70,background:'#071425',color:'#f4f8ff',fontFamily:'sans-serif'}}><div style={{display:'flex',fontSize:26,letterSpacing:7,color:'#55c7ff'}}>ATLASHUB · EDITIONS</div><div style={{display:'flex',flexDirection:'column',fontSize:72,fontWeight:800,lineHeight:1.08}}><span>CONHECIMENTO PARA</span><span style={{color:'#55c7ff'}}>EMPRESAS REAIS.</span></div><div style={{display:'flex',fontSize:25,color:'#8ea0b5'}}>Empresa Aumentada · Sérgio Monteiro · EA–001</div></div>,size)}
