# Comércio Serra Negra

Guia comercial de Serra Negra/SP. Next.js App Router, Tailwind, shadcn/ui, Supabase e mapa Leaflet.

## Local

```bash
npm install
cp .env.example .env.local
supabase start
# copie as chaves do `supabase status -o env` para o .env.local
npm run dev
```

- Site: http://localhost:3000
- Studio: http://127.0.0.1:54323
- E-mail mágico (Mailpit): http://127.0.0.1:54324

## Variáveis (Vercel)

| Variável | Uso |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Projeto Supabase na nuvem |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin, import CSV, indicar |
| `NEXT_PUBLIC_SITE_URL` | URL pública (ex.: https://comercio-serra-negra.vercel.app) |
| `ADMIN_EMAIL` | E-mail que entra em `/admin` |
| `NEXT_PUBLIC_WHATSAPP_COMERCIAL` | DDI+DDD+número para o diagnóstico |

Sem Supabase na nuvem, a home e a listagem caem no seed local. Painel, reivindicar e admin precisam do projeto remoto.

## Seed remoto (Supabase cloud)

Com `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` no ambiente (ou `.env.local`):

```bash
npm run seed:remoto
```

Faz upsert de categorias e negócios mock no projeto cloud. Não rode isso em produção sem revisar os dados.

## E-mail (aprovação + magic link)

| Variável | Uso |
|---|---|
| `RESEND_API_KEY` | Envia o e-mail "ficha aprovada" (+ serviços) |
| `EMAIL_FROM` | Remetente Resend |

Sem `RESEND_API_KEY`, a aprovação no admin ainda funciona; só o e-mail é pulado.

Template magic link pt-BR: `supabase/templates/magic_link.html`. No free tier do Supabase, cole o HTML em Authentication → Email Templates → Magic Link (assunto único reduz o agrupamento no Gmail).

## Deploy

Push na `main` → Vercel. Rode a migration `supabase/migrations` no projeto cloud antes do painel.
