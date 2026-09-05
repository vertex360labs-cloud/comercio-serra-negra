# Regras para o Grok neste repo

Projeto: **Vitrine Serra Negra** (`vitrineserranegra.com.br`). App npm: `vitrine-serra-negra`.
Fluxo de sessão no VS Code: `.grok/INSTRUCOES-SESSAO.md`.

## Operação (uma tarefa, pouco contexto)

- Uma tarefa por turno. Não empilhar portal, seed, deploy ou refatoração no mesmo turno.
- Não varrer o repositório. Não listar `src/` inteiro. Não abrir `node_modules`, `.next`, `.env`, lockfiles nem páginas/componentes fora do pedido.
- Não reler o mesmo arquivo na sessão. Se já está no contexto, use o que leu.
- Não carregar o PDR inteiro. Abra `PDR-Vitrine-Serra-Negra.md` só se a tarefa mudar regra de produto — e só o trecho necessário. Não resuma o produto sem pedido.
- `src/types/negocio.ts` é a fonte da verdade de domínio **quando existir** (neste repo já existe). Leia só se a tarefa tocar tipos, ficha ou persistência. Não recrie a app se o arquivo faltar: anote e siga.
- Ignore sempre: `node_modules`, `.next`, `.env`, `.env.local`.
- Leaflet somente em `src/components/mapa/` com `'use client'` e `dynamic(..., { ssr: false })`.
- Contexto ~50% ou mais: `/compact`. Tarefa nova: `/new`. UI congelada: Stop e mate processos `grok-`.

## Idioma e mercado

- Interface e copy em pt-BR.
- Cidade do MVP: Serra Negra. UF: SP. DDD padrão: 19.
- WhatsApp é o CTA principal (link `https://wa.me/55...`).
- Não usar WordPress, plugin de diretório, nem campos US: `zip_code`, `zip`, `state` (use `uf`), `county`, `suite`.

## Dados

- CEP: máscara `#####-###`, consulta `https://brasilapi.com.br/api/cep/v2/{cep}`.
- WhatsApp/telefone: persistir somente dígitos com DDI 55.
- Slug sem acento.
- Não exigir CNPJ para publicar ficha.

## Next.js

- App Router + TypeScript.
- Leaflet somente em `src/components/mapa/` com `'use client'` e `dynamic(..., { ssr: false })`.
- Não vender IA / automação no hero da home. Isso vive em `/para-empresas` e no painel do lojista.

## Tom

Vitrine de comércio local da serra. Prestativo. Não parecer prefeitura nem agência de marketing.
