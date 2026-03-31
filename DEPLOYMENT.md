
# Instruções de Deploy (Vercel + PostgreSQL)

Para colocar este sistema em produção, siga os passos abaixo:

### 1. Banco de Dados (PostgreSQL)
- Crie um banco de dados PostgreSQL (Recomendado: **Supabase** ou **Vercel Postgres**).
- Obtenha a `DATABASE_URL`.

### 2. Configuração do Prisma
- No seu projeto local, execute `npx prisma generate` para criar o cliente.
- Execute `npx prisma db push` para subir o schema para o banco de dados.

### 3. Deploy na Vercel
- Conecte seu repositório GitHub à Vercel.
- Adicione as seguintes variáveis de ambiente:
  - `DATABASE_URL`: URL do banco PostgreSQL.
  - `JWT_SECRET`: Uma string aleatória para segurança.
  - `NEXT_PUBLIC_APP_URL`: URL base do seu app (ex: https://meuapp.com).

### 4. Middleware de Autenticação (Next.js)
- No Next.js, utilize o arquivo `middleware.ts` na raiz para interceptar rotas `/dashboard/*` e validar o cookie de sessão via JWT.

### 5. Rota Dinâmica `[username]`
- O App Router do Next.js cuidará automaticamente de `/[username]/page.tsx`. Use `generateMetadata` para SEO dinâmico baseado no banco de dados.

---

## 🚀 Melhorias Futuras Sugeridas

1. **Domínios Personalizados**: Implementar integração com a API da Vercel para permitir que usuários apontem seus próprios domínios (ex: `links.joaosilva.com.br`) para a página de bio.
2. **Templates Premium**: Criar um marketplace de temas avançados ou layouts "Video-First" para criadores de conteúdo.
3. **Smart Links**: Implementar links inteligentes que mudam de destino com base no dispositivo do usuário (iOS vs Android) ou localização geográfica.
