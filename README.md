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

## Deploy

Push na `main` → Vercel. Rode a migration `supabase/migrations` no projeto cloud antes do painel.
