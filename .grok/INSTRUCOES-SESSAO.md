# Sessão Grok no VS Code — Vitrine Serra Negra

Objetivo: não travar a UI e não queimar token. Uma tarefa, sessão curta.

## Antes de pedir

1. `/new` (ou `/clear`) **por tarefa**. Não continue um chat que já implementou outra tela.
2. Peça só o recorte: arquivo, rota ou bug. Não diga “faz o portal”.
3. UI/layout/copy: `/model grok-4.5`. Schema, auth, tipos, Supabase: `/model grok-4.6`.
4. Desligue MCP da Hostinger neste workspace se a tarefa não for DNS/deploy. Dezenas de tools no contexto congelam o VS Code.

## Durante

- `/context` se a barra de contexto subir.
- Acima de **~50%**: `/compact`. Se ainda estiver pesado: `/new` e cole só o necessário.
- Não deixe Auto-accept varrer arquivo atrás de arquivo. Pare e restrinja o pedido.
- Não peça para ler `node_modules`, `.next`, `.env` ou o PDR inteiro.

## Se a UI congelar

1. **Stop** no painel do Grok.
2. Mate processos `grok-` (Activity Monitor ou `pkill -f grok-`).
3. Reabra o VS Code / a extensão e use `/new`. Não retome a sessão travada.

## Config pessoal (`~/.grok/config.toml`)

O `.grok/config.toml` **do repo** só aceita MCP, plugins e permissão. Compactação, gitignore e modelo padrão vivem no arquivo do usuário. Colar (ou já aplicado se o agente tiver acesso):

```toml
[models]
default = "grok-4.5"

[session]
auto_compact_threshold_percent = 50

[tools]
respect_gitignore = true
```

Depois: `/model grok-4.6` só em schema/auth. Conferir com `/context`.
