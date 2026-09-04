# PDR — Vitrine Serra Negra
**Portal de negócios locais + pé-na-porta para automação, sites e agentes de IA**

| Campo | Valor |
|---|---|
| Produto | Vitrine Serra Negra |
| Domínio pretendido | `vitrineserranegra.com.br` |
| Cidade-piloto | Serra Negra / SP (Circuito das Águas Paulista) |
| Versão do PDR | 1.0 |
| Data | 04/09/2026 |
| Stack | Next.js (App Router) · TypeScript · Tailwind · shadcn/ui · Supabase · Leaflet/OSM |
| Hospedagem prevista | Hostinger (Node) + Supabase Cloud |
| Fora de escopo v1 | WordPress, plugins de diretório, Google Maps pago, app nativo |

---

## 1. Por que este documento existe

Este PDR é o contrato de produto para construir o portal **no VS Code com Grok**, sem WordPress.

Ele resolve três coisas ao mesmo tempo:

1. O que construir agora (MVP em Serra Negra).
2. Como o código deve ser organizado para a IA não inventar campo americano (`zip_code`, `state`, `phone` no formato US).
3. Como o diretório vira conversa comercial (site, WhatsApp, agente, automação) sem parecer pitch frio.

**Regra de ouro (do modelo de diretório):** o site é o gancho. A receita no início vem do back-end de serviços, não do tráfego do portal.

---

## 2. Visão e posicionamento

### 2.1 O que é
Catálogo público, bonito e hiperlocal dos comércios, hotéis, restaurantes e serviços de Serra Negra. Cada negócio ganha uma ficha com WhatsApp, horário, mapa, fotos e (depois) agente de atendimento.

### 2.2 O que não é
- Não é Visit Serra Negra (turismo institucional já existe).
- Não é Econodata / consulta de CNPJ.
- Não é marketplace com checkout.
- Não é “agência de IA” na home.

Tom da marca: vitrine de rua, cidade de compras, fim de semana na serra. Moderno, local, prestativo.

### 2.3 Duas faces do mesmo produto

| Face | Público | Objetivo |
|---|---|---|
| A — Vitrine | Turista e morador | Encontrar loja, hotel, restaurante, horário, WhatsApp |
| B — Oficina | Dono do negócio | Reivindicar ficha, completar dados, ver “versão básica”, subir para destaque / agente / site |

A Face A gera credibilidade. A Face B gera cliente.

### 2.4 Promessa na ligação / e-mail
> “Coloquei a [loja] na Vitrine Serra Negra com os dados públicos. Queria só confirmar WhatsApp e horário. Te mando o link da página.”

---

## 3. Domínio e marca

**Nome canônico:** Vitrine Serra Negra  
**Domínio primário pretendido:** `vitrineserranegra.com.br`

Domínios de apoio (comprar quando possível e redirecionar 301):

- `guiaserranegra.com.br`
- `guiacomercialserranegra.com.br`
- `vitrinedaserranegra.com.br`

Motivo: “Guia Comercial Serra Negra” continua como **termo SEO** (H1 de hub, title, schema), mesmo se a marca for Vitrine. Não abandone a query.

Favicon / OG: vitrine iluminada + serra, sem ícone de robô.

---

## 4. Princípios de produto (Brasil + Serra Negra)

1. **WhatsApp é o CTA principal**, não “Ligar” nem e-mail.
2. **CEP via BrasilAPI** (não Zippopotam / Google Places como fonte única de endereço).
3. **Bairro importa** (Estância Suíça, Centro, Alto da Serra, zona rural).
4. **Horário de comércio local:** segunda a segunda é comum no centro; não assumir “fecha domingo”.
5. **Temporada:** sexta–domingo e feriado a cidade triplica. Destaques e eventos importam.
6. **LGPD:** cadastro gratuito usa dados públicos + opt-in para WhatsApp/e-mail de verificação. Sem lista vendida.
7. **CNPJ é opcional no MVP.** Muitos pontinhos de malha são MEI ou nem têm site; não bloquear ficha sem CNPJ.
8. **Uma cidade primeiro.** Circuito das Águas entra como entidade no schema e em 1–2 hubs, não como 9 diretórios.
9. **Leaflet + OSM no MVP.** Google Maps só se geocoding OSM falhar em lote.
10. **Conteúdo B2B vive em `/para-empresas` e nas categorias**, nunca no hero da home.

---

## 5. Personas

### P1 — Turista de compras (fim de semana)
Quer: malha, couro, almoço, hotel, “o que está aberto agora”.  
Sucesso: 3 cliques até o WhatsApp da loja.

### P2 — Morador
Quer: farmácia, oficina, clínica, padaria, horário.  
Sucesso: busca por categoria + bairro.

### P3 — Dono de loja / hotel (cliente real)
Dor: Instagram no lugar de site, WhatsApp pessoal, reserva no direct, Google desatualizado.  
Sucesso: reivindica ficha em 2 minutos e pede “como destacar” ou “agente no WhatsApp”.

---

## 6. Escopo do MVP (v1)

### Entra
- Home com busca + categorias + destaques + mapa resumo
- Listagem `/negocios` com filtros (categoria, bairro, aberto agora, tem WhatsApp)
- Ficha `/negocios/[slug]`
- Hubs de conteúdo: `/guia-comercial`, `/o-que-fazer-em-serra-negra`, `/comercio-local`, `/para-empresas`
- Categorias piloto (seção 9)
- Cadastro público “indique um negócio” e “é o dono? reivindique”
- Painel mínimo do lojista (magic link e-mail ou WhatsApp code)
- Mapa Leaflet com cluster
- SEO: metadata, sitemap, JSON-LD LocalBusiness, páginas estáticas geradas
- Admin interno (você): CRUD de negócios, import CSV, marcar destaque
- Seed de 80–150 fichas de Serra Negra

### Não entra no MVP
- Pagamento recorrente automatizado (pode ser PIX manual + flag `plano`)
- Agente de IA em produção no perfil (placeholder + demo em 1 ficha vitrine)
- App, PWA avançado, i18n inglês
- Multi-cidade completa
- Review próprio estilo TripAdvisor (começa com nota Google se houver, senão sem)
- Chat ao vivo seu no site (CTA é WhatsApp seu)

---

## 7. Stack e decisões técnicas

| Camada | Escolha | Por quê |
|---|---|---|
| App | Next.js 15 App Router + TS | SSR/SSG para SEO local |
| UI | Tailwind 4 + shadcn/ui | Edição rápida com Grok |
| DB / Auth | Supabase (Postgres + Auth + Storage) | Painel, fotos, RLS |
| ORM | Cliente Supabase + types gerados (`database.ts`) | Evita Prisma+SQLite no deploy Hostinger |
| Mapa | react-leaflet + OSM, `'use client'` isolado | Sem key paga |
| CEP | BrasilAPI `https://brasilapi.com.br/api/cep/v2/{cep}` | Padrão BR |
| WhatsApp | `https://wa.me/55{ddd}{numero}?text=` | CTA nativo |
| Imagens | Supabase Storage + `next/image` | |
| Deploy | Hostinger Node **ou** Vercel (se Hostinger Node complicar) | Decisão na semana 2 |
| E-mail transacional | Resend / Brevo | Não usar SMTP da Hostinger para outreach |

**Leaflet:** todo mapa vive em `src/components/mapa/` com dynamic import `ssr: false`.

```ts
const MapaDinamico = dynamic(() => import("@/components/mapa/MapaDinamico"), { ssr: false });
```

---

## 8. Modelo de dados (obrigatório para a IA)

Arquivo canônico: `src/types/negocio.ts`.  
**Proibido** no código: `zip_code`, `state` (use `uf`), `phone` sem DDD, `county`.

```ts
export type Uf = "SP"; // v1 só SP

export type PlanoNegocio = "gratis" | "destaque" | "vitrine_plus";

export type StatusNegocio =
  | "rascunho"
  | "publicado"
  | "pendente_verificacao"
  | "reivindicado"
  | "oculto";

export interface Categoria {
  id: string;
  slug: string;
  nome: string;
  descricao: string;
  icone: string;
  ordem: number;
}

export interface HorarioFuncionamento {
  dia: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo
  abre: string | null;  // "09:00"
  fecha: string | null; // "18:00"
  fechado: boolean;
}

export interface Negocio {
  id: string;
  slug: string;
  nome: string;
  nome_fantasia: string | null;
  descricao: string | null;
  descricao_seo: string | null;

  categoria_id: string;
  tags: string[];

  cep: string;           // 13930000 ou 13930-000
  logradouro: string;
  numero: string | null;
  complemento: string | null;
  bairro: string;
  cidade: string;        // "Serra Negra"
  uf: Uf;
  ponto_referencia: string | null;

  lat: number | null;
  lng: number | null;

  whatsapp: string | null; // só dígitos com DDI 55
  telefone: string | null;
  instagram: string | null;
  site_url: string | null;
  email: string | null;

  cnpj: string | null;

  horarios: HorarioFuncionamento[];
  aberto_feriado: boolean | null;

  fotos: string[];
  logo_url: string | null;
  capa_url: string | null;

  plano: PlanoNegocio;
  status: StatusNegocio;
  fonte_dados: "manual" | "import_csv" | "google" | "dono" | "indicacao";
  reivindicado_em: string | null;
  verificado_em: string | null;

  aceita_whatsapp_comercial: boolean;
  created_at: string;
  updated_at: string;
}
```

### Tabelas Supabase (v1)

- `categorias`
- `negocios`
- `horarios` (ou jsonb em `negocios.horarios`)
- `reivindicacoes` (negocio_id, nome, whatsapp, email, status)
- `leads_agencia` (origem, negocio_id, mensagem, whatsapp)
- `paginas_conteudo` (hubs SEO, markdown/MDX)

RLS: leitura pública só `status = publicado`. Escrita: service role (admin) + dono autenticado na própria ficha.

---

## 9. Categorias piloto (Serra Negra)

Ordem da home:

1. Malhas e tricô  
2. Couro e acessórios  
3. Artesanato e presentes  
4. Hotéis e pousadas  
5. Restaurantes e bares  
6. Cafeterias e doces  
7. Turismo rural e experiências  
8. Saúde e bem-estar  
9. Serviços locais (oficina, farmácia, imobiliária, contábil)  
10. Eventos e espaços  

Slug exemplos: `malhas`, `couro`, `hoteis`, `restaurantes`, `cafeterias`, `turismo-rural`, `saude`, `servicos`.

---

## 10. Arquitetura de rotas

```
/                                 home
/negocios                         listagem + mapa
/negocios?categoria=malhas&bairro=centro
/negocios/[slug]                  ficha
/categorias/[slug]                hub de categoria (SEO + lista)
/bairros/[slug]                   hub de bairro
/guia-comercial                   hub “Guia Comercial Serra Negra”
/o-que-fazer-em-serra-negra
/comercio-local
/para-empresas                    Face B (sem cara de ads)
/para-empresas/pousadas
/para-empresas/lojas
/indicar                          formulário público
/reivindicar/[slug]
/painel                           lojista
/painel/negocio
/admin                            seu CRUD (proteger)
/diagnostico                      isca: “como está sua loja no Google”
```

Expansão futura (não criar páginas vazias agora):

- `/circuito-das-aguas`
- `/amparo`, `/socorro`, `/lindoia` — só depois do MVP validado

---

## 11. SEO — grupos semânticos

### Grupo 1 — Tráfego local (Face A)
Queries alvo:
- guia comercial serra negra
- lojas de malhas em serra negra
- onde comprar couro em serra negra
- turismo de compras serra negra sp
- melhores restaurantes em serra negra
- hotéis e pousadas serra negra
- horário do comércio de serra negra

On-page: title com cidade + UF, H1 humano, FAQ no hub, lista de negócios reais (não lorem).

Schema: `LocalBusiness` / `LodgingBusiness` / `Restaurant` + `TouristDestination` na home.

### Grupo 2 — Autoridade B2B (Face B)
Só em `/para-empresas/*` e bloco no rodapé da ficha do *próprio* lojista logado.

Queries:
- como automatizar reservas de pousadas em serra negra
- atendimento automático whatsapp para hotéis circuito das águas
- criar site para loja em serra negra
- agência de marketing digital em serra negra

**Não** colocar “criação de sites” no hero. Quebra o pé-na-porta.

### Grupo 3 — Geo entidade
No `Organization` e em um parágrafo do `/guia-comercial`:
Serra Negra · Circuito das Águas Paulista · próximo a Socorro, Amparo, Lindóia, Águas de Lindóia.

Uma página `/circuito-das-aguas` curta, sem fingir cobertura das 9 cidades.

---

## 12. Conversão (máquina de vendas)

Funil v1, nesta ordem:

1. **Você** cadastra o lote grátis (CSV + admin).
2. E-mail / WhatsApp: “confirme os dados da vitrine”.
3. Dono abre a ficha → CTA “Sou o dono”.
4. Painel mostra checklist: foto, horário, WhatsApp, Instagram.
5. Banner não agressivo: “Versão básica. Quer destaque na vitrine do fim de semana?”
6. Página `/diagnostico`: nome da loja → checklist simples (tem site? Google? WhatsApp comercial?) → botão WhatsApp **seu**.
7. Em **uma** ficha vitrine (sua demo): widget de perguntas frequentes da loja (“vocês abrem domingo?”, “tem tamanho GG?”) para o dono ver o agente existindo.

Preços no MVP: texto, não gateway. Ex.: Destaque mensal / Pacote site / Agente WhatsApp. Fechamento humano.

Lead vai para tabela `leads_agencia` + notificação no seu WhatsApp.

---

## 13. Estrutura de pastas (repo)

```
vitrine-serra-negra/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── negocios/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── categorias/[slug]/page.tsx
│   │   ├── bairros/[slug]/page.tsx
│   │   ├── guia-comercial/page.tsx
│   │   ├── o-que-fazer-em-serra-negra/page.tsx
│   │   ├── comercio-local/page.tsx
│   │   ├── para-empresas/
│   │   ├── indicar/page.tsx
│   │   ├── reivindicar/[slug]/page.tsx
│   │   ├── diagnostico/page.tsx
│   │   ├── painel/
│   │   ├── admin/
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/Header.tsx Footer.tsx
│   │   ├── mapa/MapaDinamico.tsx MarcadorLoja.tsx
│   │   ├── negocio/NegocioCard.tsx NegocioFicha.tsx WhatsAppButton.tsx
│   │   ├── busca/BarraBusca.tsx Filtros.tsx
│   │   └── forms/CepFields.tsx IndicarForm.tsx
│   ├── hooks/useCep.ts useNegocios.ts
│   ├── lib/supabase.ts utils.ts whatsapp.ts seo.ts brasilapi.ts
│   ├── content/hubs/          # MDX dos hubs
│   └── types/negocio.ts
├── supabase/migrations/
├── public/
├── AGENTS.md                  # regras para o Grok no repo
└── package.json
```

---

## 14. Arquivo `AGENTS.md` (colar no repo)

A IA deve obedecer:

- Sempre `cidade = "Serra Negra"` e `uf = "SP"` no MVP.
- Telefone/WhatsApp: gravar só dígitos `55` + DDD `19` + número.
- CEP: máscara `#####-###`, consulta BrasilAPI, preenche logradouro/bairro/cidade/uf; cidade travada em Serra Negra se o CEP não for da cidade (avisar).
- Componentes Leaflet: `'use client'` + dynamic import.
- Textos em pt-BR. “WhatsApp”, não “text us”.
- Slug: `slugify` sem acento (`malhas-da-serra`).
- Não criar campos `zip`, `county`, `suite`.
- Não vender IA na home.

---

## 15. Requisitos de interface

### Home
- Busca (“malha”, “pousada”, “almoço”)
- Grade de categorias
- “Abertos agora” (se houver horário)
- Mapa compacto
- 6–12 destaques (`plano != gratis` ou curadoria)
- Faixa: “É dono de um negócio? Veja sua vitrine”

### Ficha
- Nome, categoria, bairro
- Botão WhatsApp verde sticky no mobile
- Endereço + “como chegar” (geo OSM)
- Horários
- Instagram / site se existirem
- Mapa
- Negócios próximos
- Rodapé discreto: “Vitrine mantida como iniciativa local” (não “minha agência” em destaque público)

### Admin
- Import CSV: nome, categoria, whatsapp, cep, logradouro, numero, bairro
- Publicar / ocultar / destacar
- Gerar slug

---

## 16. Integrações

| Integração | Uso | MVP |
|---|---|---|
| BrasilAPI CEP | formulários | sim |
| Nominatim / CEP→latlng | geocode em lote | sim, com cache |
| wa.me | CTA | sim |
| Resend/Brevo | verificar e-mail do dono | opcional v1.1 |
| Google Places | enriquecer depois | não |
| Grok API | texto SEO / diagnóstico | v1.1, não bloquear v1 |

Centro do mapa padrão: **Serra Negra** ≈ `-22.6123, -46.7006` (ajustar no seed). Zoom 15 no centro comercial.

---

## 17. Fases

### Fase 0 — Fundação (1–2 dias)
Repo Next.js + shadcn + types + layout + home estática com 8 cards mock.

### Fase 1 — Diretório (3–5 dias)
Supabase, listagem, ficha, mapa, categorias, seed 30 fichas reais do centro.

### Fase 2 — SEO + hubs (2 dias)
Páginas semânticas, sitemap, schema, domínio apontado.

### Fase 3 — Pé-na-porta (2–3 dias)
Indicar / reivindicar / painel mínimo / admin CSV / WhatsApp seu nos leads.

### Fase 4 — Isca comercial (depois das primeiras conversas)
Diagnóstico, 1 agente demo, planos em texto.

Não pular para Fase 4 com site vazio.

---

## 18. Critérios de pronto (MVP)

- [ ] Home e listagem no ar em `vitrineserranegra.com.br` (ou preview)
- [ ] ≥ 80 negócios publicados, maioria com WhatsApp ou endereço
- [ ] Ficha indexável com JSON-LD
- [ ] Mapa não quebra no SSR
- [ ] CEP autocomplete no cadastro
- [ ] Você consegue importar CSV no admin
- [ ] Um dono consegue reivindicar e corrigir horário
- [ ] `/guia-comercial` ranqueia a expressão “guia comercial serra negra” no title
- [ ] Zero menção a “IA” acima da dobra da home

---

## 19. Riscos

| Risco | Mitigação |
|---|---|
| Hostinger Node chato com Next standalone | Build `output: standalone` ou Vercel no front |
| OSM geocode fraco em zona rural | lat/lng manual no admin |
| Dono acha que é prefeitura | Tom de vitrine, não de órgão |
| LGPD em disparo | só dados públicos + “corrija ou peça remoção” |
| Scope creep multi-cidade | cidade fixa no type `cidade` |

---

## 20. Primeiro prompt para o Grok no VS Code

Depois de criar o repo:

> Leia `PDR-Vitrine-Serra-Negra.md` e `src/types/negocio.ts`.  
> Inicialize Next.js App Router + Tailwind + shadcn.  
> Implemente layout, home com categorias da seção 9, `NegocioCard` mock e `MapaDinamico` com dynamic import.  
> Não use WordPress. Não invente campos gringos. pt-BR. Cidade Serra Negra / SP.

---

## 21. Decisões em aberto (não bloqueiam o código)

1. Confirmar compra de `vitrineserranegra.com.br`.
2. Deploy: Hostinger Node vs Vercel + domínio Hostinger/Registro.br.
3. Auth do painel: e-mail mágico Supabase vs código no WhatsApp.
4. Seu número comercial para leads (wa.me).
5. Se o título SEO usa “Vitrine” ou “Guia Comercial” (recomendado: title `Guia Comercial Serra Negra | Vitrine Serra Negra`).

---

*Fim do PDR 1.0 — usar este arquivo como contexto permanente do projeto.*
