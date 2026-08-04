# Agendador de conteúdo do Instagram

Painel administrativo: `/admin/conteudo`.

## O que o MVP publica

- imagem no Feed;
- carrossel com 2 a 10 imagens e/ou vídeos;
- Reel com opção de aparecer também no Feed;
- Story com uma imagem ou um vídeo por item agendado;
- rascunhos, publicação imediata, agendamento e nova tentativa após falha.

## Integrações

1. **Neon/PostgreSQL** — a tabela `ned_social_posts` é criada automaticamente.
2. **Vercel Blob público** — armazena a mídia em uma URL que a Meta consegue buscar.
3. **Meta Graph API** — cria o contêiner de mídia e publica no Instagram.
4. **Upstash QStash** — chama `/api/internal/publish-social` na data e hora escolhidas.

## Variáveis de ambiente

Copie as chaves documentadas em `.env.example` para Production, Preview e Development conforme necessário. O painel mostra o estado de cada integração.

Para a Meta, use uma conta profissional e um token com permissão de publicação de conteúdo. O valor de `META_GRAPH_API_VERSION` deve ser definido explicitamente para facilitar futuras migrações de versão.

`SOCIAL_PUBLISH_SECRET` deve ser um valor aleatório forte e diferente da senha administrativa.

## Fluxo

1. O administrador envia a mídia diretamente do navegador ao Vercel Blob.
2. A NED salva o conteúdo e o horário no PostgreSQL.
3. A NED registra uma mensagem única no QStash com `Upstash-Not-Before`.
4. No horário, o QStash chama o endpoint interno autenticado.
5. O endpoint cria e publica o contêiner na Meta, registrando sucesso ou erro.

## Limites do primeiro MVP

- stickers interativos de Story, música, enquete, link e marcações continuam sendo recursos nativos do aplicativo e não são montados por este painel;
- cada item do tipo Story publica uma única mídia; uma sequência pode ser criada como vários itens no mesmo período;
- as mídias não são apagadas automaticamente do Blob quando uma publicação é removida da agenda;
- antes de uso em produção, valide dimensões, duração e codec dos arquivos conforme os requisitos atuais da Meta.
