# Preparação de lançamento

## Conteúdo

O reader contém as 27 secções do manuscrito indicado pelo autor: 21 capítulos em cinco Partes, nota editorial, prefácio, epílogo, referências, glossário e biografia. Fonte: Google Drive, documento `1szLVmuW1s5_GOoEXrCd_ei3ezdzM31r5MmsiinDLtHs`, consultado em 3 de outubro de 2026. O índice foi confrontado com o Notion indicado em INTEGRATION_SOURCES.md.

A conversão preserva o texto, transforma tabelas HTML em Markdown, separadores em regras horizontais e 29 diagramas Mermaid em SVG. Cada secção guarda o SHA-256 do Markdown original. O toolkit reúne excertos dos capítulos 8, 9, 10, 18, 19 e 21; os downloads Markdown são editáveis, mas não constituem formulários preenchíveis. PDF e EPUB derivam do mesmo conteúdo do reader.

## Execução

Node 24 recomendado. Executar `npm ci`, `npm run typecheck`, `npm run lint`, `npm run test:content`, `npm run build` e `npm start`. Não são necessárias credenciais ou base de dados para esta versão de leitura livre. O workflow quality.yml executa estas verificações em pull requests e no main.

## Antes de publicar

O autor confirmou em 4 de outubro de 2026: edições abertas à comunidade, leitura livre e downloads sem registo, com publicação direta em main. Domínio confirmado: editions.atlashub.si. Não inclui pagamento, contas nem captura de emails.

Associar o repositório a uma conta de alojamento Next.js, executar o build e testar a preview. Associar editions.atlashub.si, aplicar os registos DNS fornecidos pelo alojamento e validar HTTPS. A metadata usa esse domínio; rever se o domínio final mudar. Verificar homepage, catálogo, livro, toolkit, capítulos, downloads, sitemap.xml e robots.txt após a publicação. O reader está deliberadamente marcado noindex; as páginas editoriais são indexáveis.

O alerta conhecido de npm audit restringe-se à cadeia de ferramentas ESLint/fast-glob/micromatch/braces; npm audit --omit=dev não reportou vulnerabilidades. Não foi aplicado o downgrade incompatível proposto por npm audit fix --force.
