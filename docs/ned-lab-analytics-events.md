# Eventos de analytics — NED LAB 001

Todos os eventos enviados pelo experimento usam o prefixo `ned_lab_` no GA4 e recebem automaticamente:

- `experiment`: `maquina_quebrada`
- `lab_session_id`: identificador anônimo da sessão do navegador
- `page_path`
- `page_title`
- `transport_type`: `beacon`

## Aquisição e início

- `ned_lab_experiment_viewed`
- `ned_lab_game_started`

## Investigação

- `ned_lab_problem_found`: interação original do jogo
- `ned_lab_problem_discovered_unique`: primeira descoberta de cada gargalo
- `ned_lab_all_problems_found`

## Desafios

- `ned_lab_challenge_sequence_started`
- `ned_lab_challenge_viewed`
- `ned_lab_challenge_answer_selected`
- `ned_lab_challenge_completed`

Parâmetros relevantes: `challenge`, `answer`, `score`, `position`.

## Resultado

- `ned_lab_game_completed`
- `ned_lab_result_viewed`
- `ned_lab_completion_timing`
- `ned_lab_game_restarted`
- `ned_lab_game_abandoned`

Parâmetros relevantes: `score`, `profile`, `bottleneck`, `elapsed_seconds`, `stage`, `problems_found`.

## Compartilhamento

- `ned_lab_share_card_available`
- `ned_lab_share_card_opened`
- `ned_lab_result_shared`
- `ned_lab_result_card_downloaded`
- `ned_lab_result_link_copied`
- `ned_lab_result_share_cancelled`
- `ned_lab_result_card_error`

O parâmetro `method` diferencia compartilhamento de imagem nativo, link nativo e fallback para área de transferência.

## Conversão

O clique no WhatsApp continua sendo registrado como `whatsapp_click`, com `source: ned_lab_result`.

## Funis recomendados no GA4

1. `experiment_viewed` → `game_started` → `all_problems_found` → `game_completed`
2. `game_completed` → `share_card_opened` → `result_shared` ou `result_card_downloaded`
3. `game_completed` → `whatsapp_click`, filtrando `source = ned_lab_result`
4. Abandono por `stage` e `challenge` usando `game_abandoned`
