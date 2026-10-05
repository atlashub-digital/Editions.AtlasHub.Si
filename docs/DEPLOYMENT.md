# Deploy de AtlasHub Editions

Next.js 16 App Router, React 19 e TypeScript. Node.js 24.x. Lockfile e Next.js fixados para builds reproduzíveis.

Executar `npm ci`, `npm run typecheck`, `npm run lint`, `npm run test:content` e `npm run build`. Produção local: `npm start`. Desenvolvimento: `npm run dev`. A CI executa os checks em pushes para main e pull requests.

## Vercel

Importar o repositório, selecionar main como Production Branch e Root Directory na raiz. Preset Next.js; instalar com `npm ci`, construir com `npm run build`, Output Directory padrão Next.js. Remover overrides anteriores de output estático, se existirem. O vercel.json identifica o framework.

Testar no preview homepage, `/livros`, `/livros/empresa-aumentada`, `/livros/empresa-aumentada/ler`, navegação dos capítulos, toolkit e downloads PDF/EPUB. Depois associar editions.atlashub.si e configurar o DNS indicado pela Vercel. A configuração no repositório não confirma que o domínio esteja publicado.

Leitura e downloads abertos não exigem credenciais comerciais. AtlasHub.Si é um projeto Vercel separado, com domínio e API próprios.

## Promoção para AtlasHub

Desenvolvimento em nexflowx-hub/Editions.AtlasHub.Si. A contribuição e o pull request para atlashub-digital/Editions.AtlasHub.Si serão preparados posteriormente, comparando primeiro o main do destino. Preservar README, LICENSE, CONTRIBUTING, SECURITY e documentação da foundation. Não substituir o histórico de destino nem fazer force push.
