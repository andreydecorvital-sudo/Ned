# STYLESEED.md — Ned Marketing

Este arquivo é o bloqueio visual permanente do projeto. Deve ser relido antes de qualquer alteração de interface, landing page, componente, criativo ou material de apresentação.

## Gramática principal

- **Output grammar:** `expressive-marketing`
- **Objetivo:** comunicar uma proposta clara, provar competência e conduzir para uma única ação principal.
- **Ordem narrativa:** proposta → prova → mecanismo → exemplos → CTA.
- Para carrosséis e sequências, usar `sequential-story`: gancho → contexto → explicação/prova → ação → fechamento.

## Identidade aprovada

- Marca: **Ned Marketing**.
- Personalidade: editorial, premium, tecnológica, alternativa e segura.
- Base visual: papel claro + preto fosco em contraste.
- Acento único: roxo, usado com parcimônia.
- Tipografia de títulos: **Bebas Neue**.
- Tipografia de corpo e interface: **Space Grotesk**.
- Copy principal: **“Não fazemos marketing barulhento. Construímos sistemas que vendem.”**
- O mockup aprovado é a referência visual prioritária.

## Regras obrigatórias

1. Cada tela ou peça deve ter **um único foco visual dominante**.
2. Usar hierarquia forte: título grande, texto curto, ação evidente.
3. Evitar textos pequenos; nunca reduzir a fonte para salvar uma composição sobrecarregada.
4. Não usar emojis como ícones.
5. Não usar preto puro como superfície única; criar profundidade com tons próximos, divisórias e contraste.
6. Não usar roxo padrão de IA como preenchimento indiscriminado. O roxo é um acento, não o layout inteiro.
7. Não criar fileiras de cards idênticos com o mesmo peso visual.
8. Não usar ícone decorativo em chip acima de todos os cards.
9. Não usar gradientes genéricos, brilhos neon, glows excessivos ou sombras de template.
10. Não inventar métricas, depoimentos, cases, dashboards ou resultados.
11. Não usar mockups genéricos quando o conteúdo real do produto puder ser mostrado.
12. Não adicionar mascotes ou personagens ao site sem aprovação explícita.
13. Não transformar o hero claro aprovado em uma seção escura.
14. Não hardcodar cores dispersas em componentes; usar tokens centralizados.
15. Microinterações devem ser discretas, úteis e compatíveis com `prefers-reduced-motion`.
16. Responsividade, contraste, legibilidade e acessibilidade são requisitos, não polimento opcional.

## Tokens conceituais

Os valores exatos devem permanecer centralizados no sistema de estilos do projeto.

- `surface-paper`: claro quente, nunca branco clínico sem intenção.
- `surface-ink`: preto fosco em camadas, nunca vazio chapado.
- `text-primary`: alto contraste.
- `text-muted`: legível, sem cinza fraco.
- `accent`: roxo Ned.
- `border-subtle`: divisória discreta para estruturar sem virar card wall.
- `radius`: contido; evitar excesso de pílulas e arredondamento automático.
- `shadow`: rara e funcional.

## Composição

- Alternar seções e formatos para criar ritmo.
- Usar espaço, tipografia e alinhamento antes de adicionar caixas.
- Cards só existem quando agrupam uma decisão ou conteúdo relacionado.
- Provas e exemplos devem ser reais e visualmente prioritários.
- O CTA principal deve ser único por seção.
- No mobile, preservar leitura e ação sem condensar tudo em blocos minúsculos.

## Gate de qualidade antes de entregar

Revisar toda mudança e só considerar pronta quando cumprir pelo menos estes pontos:

- [ ] Existe um foco visual inequívoco.
- [ ] A promessa principal é entendida em poucos segundos.
- [ ] Não há aparência genérica de IA.
- [ ] Não há texto pequeno ou excesso de conteúdo.
- [ ] A tipografia segue os papéis definidos.
- [ ] O roxo foi usado como acento, não como muleta.
- [ ] Não há cards repetitivos, métricas falsas ou mockups genéricos.
- [ ] O layout funciona em desktop e mobile.
- [ ] Contraste, foco de teclado e semântica estão adequados.
- [ ] O resultado foi renderizado e verificado visualmente antes da apresentação.

Se uma alteração contrariar este arquivo, ela deve ser corrigida antes de ser mostrada ou publicada.