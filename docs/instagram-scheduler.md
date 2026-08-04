# Estúdio e agendador de conteúdo do Instagram

Painel administrativo: `/admin/conteudo`.

## O que o painel publica

- imagem no Feed;
- carrossel com 2 a 10 imagens e/ou vídeos;
- Reel com música ou som original elegível, capa e opção de aparecer também no Feed;
- Story com uma imagem ou um vídeo por item agendado;
- rascunhos, publicação imediata, agendamento e nova tentativa após falha.

## Recursos de alcance e engajamento

- busca de músicas royalty-free da Meta Sound Collection;
- busca de sons originais e áudios em alta para Reels;
- controle separado do volume da música e do áudio original do vídeo;
- nome do áudio original quando não houver música selecionada;
- capa própria para Reel;
- até três convites de colaboração;
- primeiro comentário automático;
- localização, texto alternativo e distribuição do Reel também no Feed;
- marcação de conteúdo gerado por IA;
- placar de preparação com legenda, CTA, hashtags, música, capa e outros itens.

A Instagram Audio API exige que a conta profissional seja conectada pela modalidade **Facebook Login**. O catálogo retornado pela Meta é o catálogo liberado para publicação por terceiros e pode variar por conta, região e disponibilidade.

A música da biblioteca é anexada automaticamente somente a **Reels**. Para Stories, Feed e carrossel, use mídia já editada com áudio licenciado ou finalize a música dentro do aplicativo do Instagram. Stickers interativos, enquete e link também continuam nativos do aplicativo.

## Integrações

1. **Neon/PostgreSQL** — a tabela `ned_social_posts` é criada e atualizada automaticamente.
2. **Vercel Blob público** — armazena mídia e capas em URLs que a Meta consegue buscar.
3. **Meta Graph API** — busca áudio elegível, cria o contêiner e publica no Instagram.
4. **Upstash QStash** — chama `/api/internal/publish-social` na data e hora escolhidas.

## Variáveis e permissões

Copie as chaves documentadas em `.env.example` para Production, Preview e Development conforme necessário. O painel mostra o estado de cada integração.

Para a Meta, use uma conta Business ou Creator vinculada a uma Página e um token obtido por Facebook Login. As permissões recomendadas são `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement` e `instagram_manage_comments`. A última é necessária para publicar o primeiro comentário.

O valor de `META_GRAPH_API_VERSION` deve ser definido explicitamente. `SOCIAL_PUBLISH_SECRET` deve ser aleatório, forte e diferente da senha administrativa.

## Fluxo

1. O administrador envia mídia e capa diretamente do navegador ao Vercel Blob.
2. Para Reels, pode pesquisar música ou som original e armazenar o `audio_id` selecionado.
3. A NED salva conteúdo, opções de engajamento e horário no PostgreSQL.
4. A NED registra uma mensagem única no QStash com `Upstash-Not-Before`.
5. No horário, o endpoint cria o contêiner com os recursos compatíveis, aguarda o processamento e publica.
6. Depois da publicação, a NED tenta enviar o primeiro comentário sem repetir o post caso apenas o comentário falhe.

## Limites atuais

- o catálogo musical completo do aplicativo não é exposto: a Meta retorna apenas áudios elegíveis para a conta e para publicação via API;
- a prévia de áudio pode não existir para todas as faixas e URLs de prévia podem ser temporárias;
- o aceite de um convite de colaboração depende da outra conta;
- cada Story publica uma única mídia; uma sequência deve ser criada como vários itens;
- as mídias não são apagadas automaticamente do Blob quando um item é removido da agenda;
- dimensões, duração e codecs devem seguir os requisitos vigentes da Meta.
