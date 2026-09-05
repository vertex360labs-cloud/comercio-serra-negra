-- Campos de prova para reivindicação + vínculo sem auto-aprovar
alter table public.reivindicacoes
  add column if not exists cnpj text,
  add column if not exists localizacao_confirmada boolean not null default false,
  add column if not exists whatsapp_proprietario text,
  add column if not exists qtd_funcionarios integer,
  add column if not exists revisado_em timestamptz,
  add column if not exists revisado_por uuid references auth.users (id) on delete set null,
  add column if not exists nota_admin text;

-- Só vincula o user_id após magic link; NÃO aprova a ficha
create or replace function public.vincular_reivindicacao(p_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  rec public.reivindicacoes%rowtype;
  email_atual text;
begin
  email_atual := lower(auth.jwt() ->> 'email');
  if email_atual is null then
    raise exception 'precisa estar autenticado';
  end if;

  select * into rec from public.reivindicacoes where id = p_id;
  if not found then
    raise exception 'reivindicação não encontrada';
  end if;
  if lower(rec.email) <> email_atual then
    raise exception 'este e-mail não é o da reivindicação';
  end if;

  update public.reivindicacoes
    set user_id = auth.uid()
    where id = p_id;

  return rec.negocio_id;
end;
$$;

revoke all on function public.vincular_reivindicacao(uuid) from public;
grant execute on function public.vincular_reivindicacao(uuid) to authenticated;
