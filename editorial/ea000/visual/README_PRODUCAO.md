# EA-000 — produção da edição visual integral

Master consolidado preservado: `content/empresa-aumentada-manuscript.json`, SHA-256 `b53ddc0beab6534530ebdd272e2f1a760a1ae7aacc482e9113d12ff394aedb3a`.

Entregas para homologação: https://drive.google.com/drive/folders/1dS7VewhDv8KoRxxvWrZa6O4I_NsYSwFe

A4: 323 páginas. A5: 435 páginas. Quatro PDF integrais, EPUB, capas editáveis, 66 recursos com proveniência/alt/localização, 29 SVG técnicos e mockup. O ZIP de produção contém os recursos de resolução integral, fontes licenciadas, master, composição e prévias. As imagens em `public/ea000/web` são derivações otimizadas para o Reader.

## Reprodução

Sobre um checkout deste branch, integrar os recursos do ZIP de produção, preservando a estrutura de pastas. Instalar ReportLab, pypdf, pypdfium2, Pillow e lxml. A produção original utilizou Windows e o perfil instalado UncoatedFOGRA29.icc; a gráfica deve indicar o perfil definitivo antes de uma nova conversão CMYK.

1. `python scripts/ea000-visual-pdf.py`: compor A4/A5 digital e impressão a partir do master.
2. `python scripts/ea000-visual-qa.py`: conferir os 1.346 blocos e fontes; renderizar e exportar a capa.
3. `python scripts/ea000-visual-epub.py`: compor EPUB responsivo com IDs únicos e SVG sem DTD externas.
4. `python scripts/ea000-visual-extra-qa.py` e `python scripts/ea000-visual-production-checks.py`: conferir texto EPUB, localizações, diagramas, geometria e resolução efetiva.
5. Executar EPUBCheck 5.4.0 no novo EPUB. Atualizar o SHA esperado e o relatório do ficheiro efetivamente verificado; resultados antigos não homologam novas exportações.
6. `python scripts/ea000-visual-finalize.py` exige coincidência entre o EPUB e o SHA aprovado no relatório. `python scripts/ea000-visual-package.py` gera os ficheiros de produção e o manifesto de hashes.

As derivações web devem ser atualizadas se a capa ou as imagens mudarem. O master e os SVG canónicos em `public/diagrams` não foram alterados.

## QA e limites de homologação

Os quatro PDF preservam os 1.346 blocos e contêm 29 diagramas, com fontes incorporadas, sumários e marcadores atualizados. As versões CMYK têm 3 mm de sangria e OutputIntent conferido. A resolução efetiva mínima é 120,4 ppp no A4 e 168,9 ppp no A5 de impressão: a gráfica deve aceitar estes recursos ou receber originais maiores.

EPUB entregue: SHA-256 `d74bf7f8edfcab00de67ac6999b5d04fa5f835db2405e454363ae56f73c1e09c`. EPUBCheck 5.4.0: zero erros e zero avisos, [run 39012170933](https://github.com/atlashub-digital/Editions.AtlasHub.Si/actions/runs/39012170933).

Reader: 27 secções e 29 figuras em cada viewport (1440/390 px), imagens, títulos, âncoras, tema, tamanho e retoma verificados no [run 39012170937](https://github.com/atlashub-digital/Editions.AtlasHub.Si/actions/runs/39012170937). Acesso ao preview protegido não verificado ao vivo: integração Vercel retorna 403 para atlas-hub1 e não há CLI disponível. O servidor de produção foi testado no CI.

Sem certificação PDF/X nem aprovação de gráfica. Papel, ICC, resolução, imposição, encadernação e lombada final dependem da gráfica e da prova física. A textura pertence ao papel. O mockup tem espessura ilustrativa.

Este PR permanece em draft. Produção, downloads publicados e edição baseline preservados. Homologação editorial final necessária antes de merge/promoção/envio para impressão.
