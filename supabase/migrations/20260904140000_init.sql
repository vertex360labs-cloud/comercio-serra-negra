-- Comércio Serra Negra — schema v1
-- Campos BR: uf, cep, whatsapp com DDI 55. Sem zip_code / state / county.

create extension if not exists "pgcrypto";

create table public.categorias (
  id text primary key,
  slug text not null unique,
  nome text not null,
  descricao text not null default '',
  icone text not null default 'Shirt',
  ordem integer not null default 0
);

create table public.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text,
  whatsapp text,
  papel text not null default 'lojista' check (papel in ('lojista', 'admin')),
  created_at timestamptz not null default now()
);

create table public.negocios (
  id text primary key,
  slug text not null unique,
  nome text not null,
  nome_fantasia text,
  descricao text,
  descricao_seo text,
  categoria_id text not null references public.categorias (id),
  tags text[] not null default '{}',
  cep text not null default '',
  logradouro text not null default '',
  numero text,
  complemento text,
  bairro text not null default '',
  cidade text not null default 'Serra Negra',
  uf text not null default 'SP' check (uf = 'SP'),
  ponto_referencia text,
  lat double precision,
  lng double precision,
  whatsapp text,
  telefone text,
  instagram text,
  site_url text,
  email text,
  cnpj text,
  horarios jsonb not null default '[]'::jsonb,
  aberto_feriado boolean,
  fotos text[] not null default '{}',
  logo_url text,
  capa_url text,
  plano text not null default 'gratis' check (plano in ('gratis', 'destaque', 'vitrine_plus')),
  status text not null default 'rascunho'
    check (status in ('rascunho', 'publicado', 'pendente_verificacao', 'reivindicado', 'oculto')),
  fonte_dados text not null default 'manual'
    check (fonte_dados in ('manual', 'import_csv', 'google', 'dono', 'indicacao')),
  reivindicado_em timestamptz,
  verificado_em timestamptz,
  aceita_whatsapp_comercial boolean not null default true,
  dono_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index negocios_status_idx on public.negocios (status);
create index negocios_categoria_idx on public.negocios (categoria_id);
create index negocios_dono_idx on public.negocios (dono_id);
create index negocios_bairro_idx on public.negocios (bairro);

create table public.reivindicacoes (
  id uuid primary key default gen_random_uuid(),
  negocio_id text not null references public.negocios (id) on delete cascade,
  nome text not null,
  whatsapp text,
  email text not null,
  user_id uuid references auth.users (id) on delete set null,
  status text not null default 'pendente' check (status in ('pendente', 'aprovada', 'recusada')),
  created_at timestamptz not null default now()
);

create table public.leads_agencia (
  id uuid primary key default gen_random_uuid(),
  origem text not null default 'painel',
  negocio_id text references public.negocios (id) on delete set null,
  mensagem text,
  whatsapp text,
  email text,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger negocios_touch_updated_at
before update on public.negocios
for each row execute procedure public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfis (id, nome, papel)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
    'lojista'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.categorias enable row level security;
alter table public.perfis enable row level security;
alter table public.negocios enable row level security;
alter table public.reivindicacoes enable row level security;
alter table public.leads_agencia enable row level security;

create policy "categorias_leitura_publica"
  on public.categorias for select
  using (true);

create policy "negocios_leitura_publica"
  on public.negocios for select
  using (status in ('publicado', 'reivindicado'));

create policy "negocios_dono_le_o_seu"
  on public.negocios for select
  to authenticated
  using (dono_id = auth.uid());

create policy "negocios_dono_atualiza_o_seu"
  on public.negocios for update
  to authenticated
  using (dono_id = auth.uid())
  with check (dono_id = auth.uid());

create policy "negocios_insert_indicacao"
  on public.negocios for insert
  with check (fonte_dados = 'indicacao' and status = 'pendente_verificacao');

create policy "perfis_le_o_seu"
  on public.perfis for select
  to authenticated
  using (id = auth.uid());

create policy "perfis_atualiza_o_seu"
  on public.perfis for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "reivindicacoes_insert_publico"
  on public.reivindicacoes for insert
  with check (status = 'pendente');

create policy "reivindicacoes_le_as_suas"
  on public.reivindicacoes for select
  to authenticated
  using (user_id = auth.uid() or lower(email) = lower(auth.jwt()->>'email'));

create policy "leads_insert_autenticado"
  on public.leads_agencia for insert
  to authenticated
  with check (true);

insert into storage.buckets (id, name, public)
values ('fichas', 'fichas', true)
on conflict (id) do nothing;

create policy "fichas_leitura_publica"
  on storage.objects for select
  using (bucket_id = 'fichas');

create policy "fichas_upload_dono"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'fichas'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "fichas_update_dono"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'fichas'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create or replace function public.aprovar_reivindicacao(p_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  rec public.reivindicacoes%rowtype;
  email_atual text;
  dono_atual uuid;
begin
  email_atual := lower(auth.jwt() ->> 'email');
  if email_atual is null then
    raise exception 'precisa estar autenticado';
  end if;

  select * into rec from public.reivindicacoes where id = p_id;
  if not found then
    raise exception 'reivindicação não encontrada';
  end if;
  if rec.status <> 'pendente' then
    return rec.negocio_id;
  end if;
  if lower(rec.email) <> email_atual then
    raise exception 'este e-mail não é o da reivindicação';
  end if;

  select dono_id into dono_atual from public.negocios where id = rec.negocio_id;
  if dono_atual is not null and dono_atual <> auth.uid() then
    raise exception 'esta ficha já tem dono';
  end if;

  update public.negocios
    set dono_id = auth.uid(),
        reivindicado_em = now(),
        fonte_dados = 'dono'
    where id = rec.negocio_id;

  update public.reivindicacoes
    set status = 'aprovada',
        user_id = auth.uid()
    where id = p_id;

  return rec.negocio_id;
end;
$$;

revoke all on function public.aprovar_reivindicacao(uuid) from public;
grant execute on function public.aprovar_reivindicacao(uuid) to authenticated;
