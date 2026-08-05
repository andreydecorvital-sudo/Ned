# STYLESEED.md — Ned Marketing

Este arquivo é o bloqueio visual permanente do projeto. Deve ser relido antes de qualquer alteração de interface, landing page, componente, criativo, carrossel, Story ou material de apresentação.

## Gramática principal

- **Output grammar:** `expressive-marketing`.
- **Objetivo:** comunicar uma proposta clara, provar competência e conduzir para uma única ação principal.
- **Princípio:** direção antes de ferramenta.
- **Fórmula de consistência:** DNA constante + universo variável.
- **Ordem narrativa base:** proposta → prova → mecanismo → exemplos → CTA.
- Para sequências, escolher a narrativa conforme o assunto. `Sequential-story` é uma opção, não uma obrigação.
- Carrosséis não devem repetir automaticamente gancho → três pistas → resposta.

## Identidade aprovada

- Marca: **Ned Marketing**.
- Personalidade: editorial, premium, tecnológica, alternativa, humana e segura.
- Base institucional: papel quente/off-white + preto fosco em camadas + cinza metálico.
- A marca-mãe é neutra. Cores entram por editoria e contexto.
- Tipografia de títulos: **Bebas Neue**, com uso controlado.
- Tipografia de corpo e interface: **Space Grotesk**.
- Copy principal: **“Sua marca não precisa de mais posts. Precisa de direção.”**
- Copy secundária: **“Não fazemos marketing barulhento. Construímos sistemas que vendem.”**
- A logo oficial é `public/brand/ned-logo-official.webp`. Nunca reconstruir a marca com fonte.
- O Brand OS e suas atualizações vigentes têm prioridade sobre qualquer referência externa.

## Arquitetura de editorias

- `misterios`: vermelho profundo.
- `sites`: verde elétrico.
- `ia`: azul elétrico.
- `automacao`: roxo.
- `marketplaces`: laranja.
- `opinioes`: preto e branco.

A cor da editoria deve funcionar como acento, sinal, objeto, recorte, palavra ou iluminação contextual. Nenhuma cor representa a NED inteira. Não transformar a editoria em fundo obrigatório ou template fixo.

## Regras obrigatórias

1. Cada tela ou peça deve ter **um único foco visual dominante**.
2. Usar hierarquia forte: título grande, texto curto e ação evidente.
3. Evitar textos pequenos; nunca reduzir a fonte para salvar uma composição sobrecarregada.
4. Não usar emojis como ícones.
5. Não usar preto puro como superfície única; criar profundidade com tons próximos, divisórias, textura e contraste.
6. Não usar cor editorial como preenchimento indiscriminado. Cor é linguagem contextual, não muleta.
7. Não criar fileiras de cards idênticos com o mesmo peso visual.
8. Não usar ícone decorativo em chip acima de todos os cards.
9. Não usar gradientes genéricos, brilhos neon, glows excessivos ou sombras de template.
10. Não inventar métricas, depoimentos, clientes, cases, dashboards, telas ou resultados.
11. Não usar mockups genéricos quando conteúdo real puder ser mostrado.
12. Não adicionar mascotes, personagens ou pessoas sem função narrativa e aprovação adequada.
13. Não transformar uma solução clara aprovada em uma seção escura ou futurista apenas por estilo.
14. Não hardcodar cores dispersas em componentes; usar tokens centralizados.
15. Microinterações devem ser discretas, úteis e compatíveis com `prefers-reduced-motion`.
16. Responsividade, contraste, legibilidade e acessibilidade são requisitos.
17. Não copiar temas, títulos, séries, layouts, combinações tipográficas ou campanhas de referências externas.
18. Referências servem para extrair princípios, nunca para servir de molde.
19. Não transformar o Instagram em perfil de dicas para designers, catálogo de serviços ou sequência de anúncios.
20. Não repetir automaticamente o mesmo formato narrativo, tipo de capa, CTA ou Story.
21. Os três slides de um carrossel devem compartilhar universo, mas variar escala, enquadramento, densidade e organização.
22. O Story deve complementar o conteúdo; nunca ser apenas a capa esticada.
23. Quando um ativo real for necessário e não estiver disponível, marcar `ATIVO REAL NECESSÁRIO — NÃO INVENTAR`.
24. Modelos e pessoas devem parecer reais, agir em contexto e evitar pose corporativa genérica.
25. Toda publicação deve revelar como a NED pensa, não apenas mostrar algo visualmente bonito.

## Tokens conceituais

Os valores exatos devem permanecer centralizados no sistema de estilos do projeto.

- `surface-paper`: claro quente, nunca branco clínico sem intenção.
- `surface-ink`: preto fosco em camadas, nunca vazio chapado.
- `text-primary`: alto contraste.
- `text-muted`: legível, sem cinza fraco.
- `accent-contextual`: cor definida pela editoria ou pelo contexto.
- `border-subtle`: divisória discreta para estruturar sem virar card wall.
- `radius`: contido; evitar excesso de pílulas e arredondamento automático.
- `shadow`: rara e funcional.
- `materiality`: papel, impressão, vidro, concreto, metal, tecido ou textura real usada com intenção.

## Territórios visuais autorizados

Alternar conforme o assunto, sem repetir mecanicamente:

- editorial tipográfico;
- fotografia documental;
- arquitetura e espaço;
- natureza-morta de produto;
- materialidade e impressão;
- interface real;
- diagrama editorial;
- colagem controlada;
- cinematográfico plausível;
- preto e branco radical;
- cor editorial dominante;
- processo visível.

Nenhum território é identidade exclusiva da marca. A assinatura está no critério e na execução.

## Composição

- Alternar seções, polaridades, escalas e formatos para criar ritmo.
- Usar espaço, tipografia, fotografia e alinhamento antes de adicionar caixas.
- Cards só existem quando agrupam uma decisão ou conteúdo relacionado.
- Provas e exemplos devem ser reais e visualmente prioritários.
- O CTA principal deve ser único por seção ou carrossel.
- No mobile, preservar leitura e ação sem condensar tudo em blocos minúsculos.
- Não usar o mesmo território visual em duas publicações consecutivas.
- Evitar três capas consecutivas com pergunta, fundo escuro ou objeto central isolado.
- Evitar repetição de posição do título, CTA e interação de Story.

## Regra para Instagram

O Instagram da NED deve funcionar como revista editorial, portfólio vivo, laboratório de direção criativa, prova de pensamento e porta de entrada comercial.

Cada conteúdo pode ter direção própria, desde que preserve:

- voz;
- clareza;
- hierarquia;
- qualidade editorial;
- assinatura correta;
- leitura no celular;
- transparência sobre ativos e resultados.

Consistência é coerência, não monotonia.

## Gate de qualidade antes de entregar

Revisar toda mudança e só considerar pronta quando cumprir pelo menos estes pontos:

- [ ] Existe um foco visual inequívoco.
- [ ] A promessa principal é entendida em poucos segundos.
- [ ] O conteúdo pertence à NED e revela um raciocínio próprio.
- [ ] Não há aparência genérica de IA.
- [ ] Não há texto pequeno ou excesso de conteúdo.
- [ ] A tipografia segue os papéis definidos.
- [ ] A cor foi usada com intenção contextual.
- [ ] Não há cards repetitivos, métricas falsas ou mockups genéricos.
- [ ] Ativos, cases e resultados são reais ou corretamente rotulados como hipótese/estudo.
- [ ] A peça não copia uma referência externa.
- [ ] A composição não repete mecanicamente as publicações anteriores.
- [ ] O layout funciona em desktop, feed, Story e mobile conforme o formato.
- [ ] Contraste, foco de teclado e semântica estão adequados quando aplicável.
- [ ] O resultado foi renderizado e verificado visualmente antes da apresentação.

Se uma alteração contrariar este arquivo, ela deve ser corrigida antes de ser mostrada ou publicada.