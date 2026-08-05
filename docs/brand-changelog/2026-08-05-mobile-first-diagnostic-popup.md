# Popup de diagnóstico mobile-first

**Data:** 05/08/2026

## Problema

O popup automático abria convite e formulário ao mesmo tempo. No mobile, as áreas ficavam empilhadas, o conteúdo assumia altura de página inteira e o botão de fechar não parecia óbvio.

## Decisões

- separar convite e diagnóstico;
- mostrar automaticamente apenas um convite compacto;
- abrir o formulário somente após intenção explícita;
- abrir o formulário diretamente quando a pessoa usa um CTA do site;
- trocar cinco etapas por quatro;
- pedir contexto antes dos dados pessoais;
- tornar o fechamento textual e sempre visível;
- manter os controles do formulário acessíveis no rodapé;
- não abrir teclado automaticamente;
- atrasar a aparição automática para 12 segundos e aproximadamente 28% de rolagem;
- preservar uma única exibição automática por sessão.

## Fluxo

1. Convite compacto.
2. Negócio.
3. Desafio.
4. Direção e momento.
5. Contato e consentimento.
6. Registro no CRM e abertura do WhatsApp.

## Mobile

- convite apresentado como folha inferior;
- formulário em `100dvh` após o aceite;
- barra superior fixa com `Fechar` e ícone;
- safe areas consideradas;
- conteúdo central rolável;
- navegação inferior preservada;
- títulos e opções reduzidos para leitura e toque.

## Texto principal

> Vamos entender o que sua empresa precisa melhorar?

> Responda quatro perguntas rápidas. A NED recebe o contexto e prepara a conversa no WhatsApp. Nada é enviado sem sua confirmação.

## Métricas preservadas

Os eventos continuam sendo enviados pelo canal `ned:diagnostic`, com novos detalhes de fase e modo de abertura para diferenciar convite automático, formulário iniciado e acionamento manual.
