from pathlib import Path
import json,zipfile,hashlib,shutil
from pypdf import PdfReader,PdfWriter
R=Path(__file__).resolve().parents[1];V=R/'editorial/ea000/visual';O=R.parent/'ea000-final/delivery';O.mkdir(parents=True,exist_ok=True)
for p in (R/'public/downloads/visual').glob('*'):
 if p.suffix=='.epub' or not (O/p.name).exists():shutil.copy2(p,O/p.name)
for fmt in ['A4','A5']:
 r=PdfReader(O/f'EA-000_Empresa-Aumentada_{fmt}_visual_digital.pdf')
 for index,name in [(0,'Capa'),(-1,'Contracapa')]:
  w=PdfWriter();w.add_page(r.pages[index]);w.add_metadata({'/Title':f'EA-000 — {name} — {fmt}','/Author':'Sérgio Monteiro'})
  with (O/f'EA-000_{name}_{fmt}_editavel.pdf').open('wb') as f:w.write(f)
report='''# EA-000 — edição visual integral para homologação

O master editorial consolidado foi preservado. As edições A4 e A5 passaram de 307/419 para 323/435 páginas, respetivamente. Foram integradas cinco aberturas de partes, 21 aberturas de capítulos, capa e contracapa com texto vetorial, fotografia conceptual e 29 diagramas vetoriais redesenhados a partir da geometria canónica.

As frases das aberturas são excertos do manuscrito. As imagens não substituem texto editorial. O inventário identifica proveniência, direitos declarados, resolução nativa, destino, localização e textos alternativos. A fotografia do autor não foi substituída por uma pessoa gerada.

## Verificações executadas

- 1.346 blocos textuais conferidos nos quatro PDF: zero blocos ausentes.
- Fontes incorporadas; formatos de corte A4/A5; 87/88 ligações e marcadores atualizados.
- 29 SVG canónicos inalterados; relações, quantidade de setas e realimentação preservadas nas novas figuras.
- EPUB: 1.346 blocos presentes, 27 secções, cinco partes, 29 figuras; 81 documentos XML analisados e referências internas resolvidas. EPUBCheck 5.4.0 da nova versão: zero erros e zero avisos, com SHA-256 conferido no CI (run 39012170933).
- PDF digitais renderizados integralmente em folhas de contacto; aberturas e páginas com figuras exportadas para inspeção.
- Reader: 27 secções e 29 figuras verificadas em cada viewport de 1440 e 390 px; títulos, imagens, âncoras, tema, tamanho de texto e retoma aprovados no CI (run 39012170937). Acesso ao preview protegido bloqueado por 403 na integração Vercel; funcionamento do servidor de produção testado no CI. CI e preview não equivalem a homologação editorial.

## Impressão — condicionantes reais

As versões CMYK têm sangria de 3 mm, TrimBox/BleedBox e OutputIntent Uncoated FOGRA29 proposto, conferidos nas páginas. Os 29 diagramas estão presentes em cada PDF. Não são certificados PDF/X. A resolução efetiva mínima das imagens é de 120,4 ppp no A4 de impressão e 168,9 ppp no A5 de impressão. O skyline fornecido tem cerca de 144 ppp à largura A4, antes de considerar sangria. Não se afirma resolução nativa de 300 ppp por reamostragem. Aprovação da resolução pela gráfica ou originais maiores são necessários antes de imprimir.

Antes do envio à gráfica: confirmar perfil ICC, papel premium branco-natural ou marfim suave, opacidade, ligeira textura, acabamento mate, encadernação, largura de lombada e requisitos de imposição. Aprovar prova física e a resolução das imagens ou fornecer originais maiores. A textura física não é produzida pelo PDF.

Sem publicação em produção, substituição de ficheiros publicados ou envio para impressão. Homologação final da direção editorial pendente.
'''
(O/'EA-000_ALTERACOES_E_HOMOLOGACAO.md').write_text(report,encoding='utf8')
files=[]
for prefix in ['content','editorial/ea000','scripts','public/ea000','components/atlas','app/livros/empresa-aumentada/ler']:
 for p in (R/prefix).rglob('*'):
  if p.is_file() and '__pycache__' not in p.parts and p.suffix not in ['.pyc'] and (prefix!='scripts' or p.name.startswith('ea000')):files.append(p)
files.extend([R/'app/globals.css',R/'package.json',R/'package-lock.json'])
bundle=O/'EA-000_FONTES_ASSETS_SVG_QA.zip'
with zipfile.ZipFile(bundle,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for p in sorted(set(files)):z.write(p,p.relative_to(R))
 for p in O.glob('EA-000_*editavel.pdf'):z.write(p,'capas/'+p.name)
 z.write(O/'EA-000_ALTERACOES_E_HOMOLOGACAO.md','EA-000_ALTERACOES_E_HOMOLOGACAO.md')
manifest=[{'file':p.name,'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in O.iterdir() if p.is_file() and p.name!='EA-000_ENTREGA_SHA256.json']
(O/'EA-000_ENTREGA_SHA256.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps(manifest,ensure_ascii=False),flush=True)
