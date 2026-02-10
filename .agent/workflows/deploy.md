---
description: Como fazer o deploy para o Cloudflare Pages
---

Para publicar seu projeto no Cloudflare Pages, siga estas etapas:

### 1. Preparação do Projeto
O projeto já foi configurado para o Cloudflare. Note as seguintes mudanças:
- `next.config.ts`: Removido `output: "export"` para suportar API Routes.
- `app/api/generate/route.ts`: Adicionado `export const runtime = 'edge'`.
- `package.json`: Adicionado script `pages:build`.

### 2. Criar Projeto no Cloudflare
1. Acesse o [Painel do Cloudflare](https://dash.cloudflare.com/).
2. Vá em **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Selecione seu repositório do GitHub.

### 3. Configurações de Build
No momento da criação, use as seguintes configurações:
- **Framework preset**: `Next.js` (ou deixe em manual se preferir usar o script customizado).
- **Build command**: `npm run pages:build` (ou o padrão do Cloudflare para Next.js).
- **Build output directory**: `.vercel/output` (O `@cloudflare/next-on-pages` gera a saída aqui).

### 4. Variáveis de Ambiente (CRÍTICO)
No painel do Cloudflare Pages, vá em **Settings** > **Environment variables** e adicione as seguintes:
- `NEXT_PUBLIC_SUPABASE_URL`: Sua URL do Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Sua Anon Key do Supabase.
- `NEXT_PUBLIC_OPENAI_API_KEY`: Sua chave da OpenAI (opcional, se usar o global_config no DB).

### 5. Configuração de Compatibilidade (Importante)
Em **Settings** > **Functions** > **Compatibility flags**, adicione a flag:
- `nodejs_compat` (para compatibilidade com APIs do Node.js que o Next.js possa usar).

### 6. Publicação
Sempre que você der `git push` para a branch principal, o Cloudflare fará o deploy automático.

---
// turbo-all
Para testar localmente antes de subir:
```bash
npm run pages:build
npx wrangler pages dev .vercel/output
```
