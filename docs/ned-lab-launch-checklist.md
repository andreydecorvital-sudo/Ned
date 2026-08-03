# Checklist operacional — lançamento NED LAB 001

## Antes de publicar

- Confirmar `NEXT_PUBLIC_SITE_URL` com o domínio oficial.
- Confirmar `NEXT_PUBLIC_GA_ID` no ambiente de produção.
- Testar uma partida completa em desktop.
- Testar uma partida completa em Android.
- Testar uma partida completa em iPhone.
- Gerar e abrir o PNG 1080 × 1920 px.
- Testar o compartilhamento nativo de imagem.
- Testar o fallback de download.
- Testar a cópia do link.
- Confirmar o clique no WhatsApp após o resultado.

## GA4 em tempo real

Confirmar pelo menos estes eventos:

- `ned_lab_experiment_viewed`
- `ned_lab_game_started`
- `ned_lab_all_problems_found`
- `ned_lab_game_completed`
- `ned_lab_share_card_opened`
- `ned_lab_result_shared` ou `ned_lab_result_card_downloaded`
- `whatsapp_click` com `source = ned_lab_result`

## Publicação

- Atualizar o link da bio com UTM.
- Publicar o Reel de lançamento.
- Publicar o carrossel.
- Publicar a sequência de Stories com link.
- Enviar a mensagem de WhatsApp para contatos selecionados.
- Repostar resultados apenas com autorização.

## Revisão

- Revisar abandono e erros após 48 horas.
- Revisar conclusão, compartilhamento e WhatsApp após sete dias.
- Não publicar estatísticas comportamentais sem volume suficiente.
