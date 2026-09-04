# Regras para o Grok / Codex neste repo

Projeto: **Vitrine Serra Negra** (`vitrineserranegra.com.br`).
Leia sempre `PDR-Vitrine-Serra-Negra.md` e `src/types/negocio.ts` antes de gerar código.

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
