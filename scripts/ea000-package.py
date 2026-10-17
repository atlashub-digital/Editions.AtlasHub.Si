import json,zipfile,hashlib,importlib.metadata
from pathlib import Path
from pypdf import PdfReader,PdfWriter
ROOT=Path.cwd();ED=ROOT/'editorial/ea000';ART=ROOT/'public/downloads/premium';DEST=ROOT.parent/'output';DEST.mkdir(exist_ok=True)
reports=json.loads((ED/'qa/pdf-preflight.json').read_text(encoding='utf8'))
assert len(reports)==4 and all(not x['missingTextBlocks'] and x['allFontsEmbedded'] and x['trimValid'] for x in reports)
epub=json.loads((ED/'qa/epub-structural.json').read_text(encoding='utf8'))
browser=json.loads((ED/'qa/reader-browser.json').read_text(encoding='utf8')) if (ED/'qa/reader-browser.json').exists() else {'status':'PENDING','reason':'Acesso visual à preview não concluído neste ambiente.'}
changes=json.loads((ED/'changes.json').read_text(encoding='utf8'))
qa='''# EA-000 — Entrega de revisão premium

Esta é uma edição efetiva de revisão, com arquivos e fontes de composição. Não é uma autorização de publicação final.

## Produção e conferência

- 27 seções, incluindo os 21 capítulos, cinco partes e materiais complementares.
- 29 diagramas vetoriais com títulos, legendas, fontes, alt text e estado de homologação.
- A5: 419 páginas; A4 Executive: 307 páginas, com composição e paginação próprias.
- Quatro PDFs: leitura digital e prova de pré-impressão em cada formato.
- Capas e contracapas em provas separadas, sem inventar a lombada.
- 1.346 blocos de texto comparados com o master em cada PDF: nenhuma omissão detectada.
- Fontes usadas e recursos tipográficos incorporados; formatos de corte e sangria conferidos.
- EPUB: 27 seções, 29 figuras e validação estrutural de 61 documentos XML/XHTML/SVG, referências e navegação.
- Revisão rastreável: 312 grupos de alterações, 564 ocorrências, com 11 intervenções editoriais além da normalização lexical.
- Build local de produção: PASS, 37 rotas. TypeScript: PASS. Contrato de conteúdo: PASS.
- Primeiro commit do PR #4: CI GREEN. O estado do último SHA deve ser conferido no PR.

## Limites de aprovação

- EPUBCheck não foi executado: a validação feita é estrutural, não uma certificação EPUBCheck.
- Os PDFs de impressão são provas: não há certificação PDF/X nem perfil ICC de gráfica escolhido.
- Papel, encadernação, opacidade, prova física e espessura da lombada dependem da gráfica e da homologação final.
- A biografia foi reduzida de modo conservador. Os claims específicos originais ficam preservados para confirmação do autor.
- A homologação global do texto, da capa e dos assets continua pendente.
- A preview Vercel está protegida por autenticação. O acesso administrativo pela conexão atual retornou 403 no escopo atlas-hub1.
- Nenhum pagamento, oferta ou campanha foi ativado. A produção anterior não foi promovida nem substituída.

## Revisão na plataforma

PR: https://github.com/atlashub-digital/Editions.AtlasHub.Si/pull/4

Preview: https://editions-atlas-hub-si-git-feat-ea000-premium-edition-atlas-hub1.vercel.app/livros/empresa-aumentada/ler

O README da edição contém reconciliação EA-000/EA-001, fontes, proposta de papel, reutilização AMF, reprodução e rollback. FACT_CHECK.md distingue evidência documental de atribuições ainda pendentes.
'''
qa+='\n## QA do navegador\n\nEstado registrado: '+browser['status']+'.\n'
(ED/'QA_E_ENTREGA.md').write_text(qa,encoding='utf8')
reader=PdfReader(ART/'EA-000_Empresa-Aumentada_A5_digital.pdf');samples=PdfWriter()
for i in [0,11,12,112,125,len(reader.pages)-1]:samples.add_page(reader.pages[i])
samples.add_metadata({'/Title':'EA-000 — Amostra gráfica de revisão','/Author':'Sérgio Monteiro'})
with (ART/'EA-000_Amostra-Grafica_A5.pdf').open('wb') as f:samples.write(f)
requirements='\n'.join(p+'=='+importlib.metadata.version(p) for p in ['reportlab','pypdf','pypdfium2','lxml','Pillow'])+'\n';(ED/'requirements-editorial.txt').write_text(requirements,encoding='utf8')
items=[]
for p in ART.iterdir():
 folder='01_CAPA_E_IDENTIDADE' if 'Capa-Contracapa' in p.name else '05_QA_E_ENTREGA';items.append((p,folder+'/'+p.name))
for p in [ED/'master.md',ROOT/'content/empresa-aumentada-manuscript.json',ED/'changes.json',ED/'README.md',ED/'FACT_CHECK.md',ED/'sources/baseline.json',ED/'publication.manifest.json']:items.append((p,'00_MASTER_EDITORIAL/'+p.name))
for p in list((ROOT/'public/diagrams').glob('capitulo-*.svg'))+[ED/'figure-specs.json',ED/'figures.json']:items.append((p,'02_MEDIA_EDITORIAL/'+p.name))
items.append((ROOT/'public/diagrams/ea000-cover.svg','01_CAPA_E_IDENTIDADE/ea000-cover.svg'))
for p in (ED/'fonts').iterdir():items.append((p,'06_FONTES_COMPOSICAO/editorial/ea000/fonts/'+p.name))
for p in (ROOT/'scripts').glob('ea000*'):
 if p.is_file():items.append((p,'06_FONTES_COMPOSICAO/scripts/'+p.name))
for p in [ED/'sections-html.json',ED/'reader-premium.css',ED/'figure-specs.json',ED/'figures.json',ED/'README.md']:items.append((p,'06_FONTES_COMPOSICAO/editorial/ea000/'+p.name))
items.append((ED/'requirements-editorial.txt','06_FONTES_COMPOSICAO/requirements-editorial.txt'))
for p in (ROOT/'content').glob('empresa-aumentada-*.json'):items.append((p,'06_FONTES_COMPOSICAO/content/'+p.name))
for p in (ROOT/'public/diagrams').glob('capitulo-*.svg'):items.append((p,'06_FONTES_COMPOSICAO/public/diagrams/'+p.name))
items.append((ED/'sources/baseline.json','06_FONTES_COMPOSICAO/editorial/ea000/sources/baseline.json'))
for p in list((ED/'qa').glob('*.json'))+[ED/'QA_E_ENTREGA.md']:items.append((p,'05_QA_E_ENTREGA/'+p.name))
manifest=[{'path':name,'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p,name in items]
target=DEST/'EA-000_Premium_Review_2026-10-17.zip'
with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as z:
 for p,name in items:z.write(p,name)
 z.writestr('MANIFEST_SHA256.json',json.dumps(manifest,ensure_ascii=False,indent=2))
with zipfile.ZipFile(target) as z:
 assert z.testzip() is None
 for item in manifest:assert hashlib.sha256(z.read(item['path'])).hexdigest()==item['sha256']
print(json.dumps({'package':str(target),'files':len(items),'bytes':target.stat().st_size,'hashValidation':'PASS'},ensure_ascii=False))
