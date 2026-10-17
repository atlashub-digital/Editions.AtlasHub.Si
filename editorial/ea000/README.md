# EA-000 — Empresa Aumentada

Edição premium de revisão, outubro de 2026. O conteúdo estruturado em `content/empresa-aumentada-manuscript.json` é o master de publicação. `master.md`, HTML, PDF, EPUB e Reader são projeções; não devem receber correções textuais independentes.

## Fontes e reconciliação

Drive EA-000: https://drive.google.com/drive/folders/1PkytZhGjwP6pBsXs1yj10LFTbcBBxSqk

Export consultado: `EA-000_MASTER_EDITORIAL_EXPORT_v1.0.md`, 402.407 bytes no Drive. Manuscrito Google Docs preservado: https://docs.google.com/document/d/1N-PjVgteUdwXMSQNnr3P08ZmjELn2BT1DhGuo9MX4dg/edit

Notion, edição canônica em revisão: https://app.notion.com/p/658652fc5b9d83699a75014c6148b382 . Foram consultadas as 27 páginas-filhas. Também foram consultados o hub da obra e o projeto de publicação.

GitHub de origem: `atlashub-digital/Editions.AtlasHub.Si`, main `216bead638a7f4b0604652857d2b208bbf25419c`. O baseline preservado está em `sources/baseline.json`. As três bases têm 27 seções. A comparação normalizada entre GitHub e Notion encontrou equivalência textual, descontando separadores, tabelas e diagramas transformados. O export do Drive preserva a montagem anterior; não foi escolhido só por sua data mais recente.

## Identidade editorial

| Recurso | Identidade atual | Tratamento |
| --- | --- | --- |
| Empresa Aumentada | EA-000 | Código do master e das novas edições |
| Empresa Aumentada no Notion/GitHub anterior | EA-001, legado | Manter IDs, slugs e histórico; registrar alias |
| A Imobiliária Aumentada | EA-001 | Catálogo atual; nenhuma publicação nesta missão |
| A Clínica Aumentada | EA-002 | Reservado; não anunciar como livro existente |
| O E-commerce Aumentado | EA-003 | Catálogo atual; nenhuma publicação nesta missão |
| Agent Operating Models / AI for Retail | Códigos provisórios do site anterior | Cartões de preparação substituídos pelo catálogo atual na branch; identificadores e histórico anteriores registrados aqui |

Nenhuma URL de leitura foi renomeada. Os downloads antigos permanecem preservados. As novas provas vivem em `/downloads/premium/`.

## Alterações e limites

`changes.json` registra substituições de pt-BR e intervenções editoriais com antes/depois e motivo. Inclui a correção da passagem entre os capítulos 2 e 3, a distinção entre hipótese e causalidade, o arredondamento das ausências da clínica e a retirada da atribuição específica a Haugeland sem página verificável. Sua obra continua como leitura filosófica de enquadramento.

A biografia de revisão usa uma descrição conservadora. A versão original permanece no baseline e no registro de alterações. Os nomes de empresas, a participação no MG2+ e as distinções exigem evidência que vincule a atuação ao autor; a existência pública do projeto não comprova essa participação individual.

Não se declara homologação literária humana, factual irrestrita, autorização definitiva de assets ou aprovação final do autor. Os cenários da Parte IV são compostos e os números são didáticos. Os frameworks são modelos propostos pelo autor, não instrumentos científicos validados.

## Reprodução

Requisitos: Node 24, Python com reportlab, lxml, pypdf, pypdfium2 e Pillow. O export HTML usa `marked`; no ambiente de produção editorial pode-se indicar sua instalação com `CODEX_PRIMARY_RUNTIME_NODE_MODULES`.

1. Para reaplicar a normalização a partir do baseline: `node scripts/ea000-editorial.mjs`. Não usar esse passo para sobrescrever futuras revisões manuais do master.
2. `node scripts/ea000-figures.mjs`
3. `node scripts/ea000-html.mjs`
4. `node scripts/ea000-contract.mjs --sync`
5. `python scripts/ea000-pdf.py`
6. `python scripts/ea000-epub.py`
7. `python scripts/ea000-render-qa.py`
8. `node scripts/ea000-contract.mjs`, verificações do projeto e inspeção visual.

`ea000-reader.mjs` foi uma migração aplicada uma vez e não integra o comando de publicação recorrente. Alterações futuras no Reader devem ser feitas nos componentes existentes.

## Modelo AMF reutilizado

Foram examinados o Golden Pilot V1, o project manifest e o sincronizador editorial do EspelhoMeu. Reutilizam-se proveniência, master estruturado, projeções determinísticas, hashes, validação e gates branch → PR → preview → aprovação → release. As versões de referência são schema 0.2.0 e experience-core 0.2.1.

Não foi introduzida dependência direta dos pacotes: o Reader atual usa seções Markdown, enquanto o EspelhoMeu usa Publication/Program e contratos próprios de biblioteca. Forçar o pacote sem um adaptador verificado criaria uma migração desnecessária. Não foram copiados checkout, entitlements, tema nem lógica clínica.

## Impressão e papel

As provas têm formato de corte A5 148 × 210 mm e A4 210 × 297 mm, sangria de 3 mm e fontes incorporadas. Não são certificadas como PDF/X e não têm perfil de saída imposto. O papel não é simulado por ruído de impressão; a superfície digital é clara e o miolo de impressão é branco.

Proposta para orçamento e prova física: miolo offset premium natural de 80–90 g/m², baixa reflexão, boa opacidade e textura discreta; capa 300–350 g/m² com laminação mate. Confirmar fibra paralela à lombada, opacidade, volume específico, resistência e adequação à encadernação. Para A4, avaliar 90–100 g/m² e peso final do volume.

A lombada só poderá ser fechada com a paginação final, a espessura real do papel e a especificação da gráfica. As capas e contracapas são fornecidas separadas em provas de duas páginas, sem lombada fictícia. Também falta validar ISBN, ficha catalográfica e depósito conforme o plano de publicação definido pela editora.

## Homologação e rollback

O PR e a preview são a unidade de revisão. Após QA técnico verde, aprovar o texto global, biografia, figuras, capas e direitos; só então promover. Preservar o SHA produtivo anterior e os downloads anteriores. Rollback: reverter o commit de merge ou promover o deployment anterior; não reconstruir o manuscrito a partir de PDFs.

Sem pagamentos, ofertas ou campanhas. EA-001 e EA-003 só recebem o pipeline depois da homologação EA-000; EA-002 permanece reservado.
