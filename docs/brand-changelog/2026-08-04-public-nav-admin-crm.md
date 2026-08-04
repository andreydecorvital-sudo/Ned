# Alinhamento da navegação pública, painel e CRM

> **Data:** 04/08/2026  
> **Status:** implementação de alinhamento com a Brand OS

## Problemas identificados

- a navegação comercial ainda herdava um sublinhado roxo de uma regra global antiga;
- o rodapé comercial não exibia o acesso discreto ao painel administrativo;
- o painel, login e CRM ainda usavam roxo como cor institucional geral;
- interações do pipeline, cards, foco e botões não refletiam a base neutra definida no Brand OS.

## Alterações

- sublinhado da navegação comercial trocado por branco/off-white;
- regra antiga de `nav a::after` neutralizada no header e no footer comerciais;
- cadeado restaurado no rodapé com acesso a `/admin` e identificação acessível para painel e CRM;
- painel administrativo atualizado para preto, off-white e cinzas;
- dock administrativo neutralizado, com item ativo em off-white;
- login e shell do CRM atualizados;
- pipeline com estados neutros e cores funcionais apenas para prioridade, status, alerta e sucesso;
- CTAs principais do CRM convertidos para off-white com texto preto;
- roxo removido dos estados genéricos de hover, foco, seleção e arraste.

## Regra preservada

Cores continuam permitidas quando comunicam função operacional real, como:

- azul para contato e prioridade potencial;
- verde para reunião e fechamento;
- âmbar para proposta e alerta;
- vermelho para perda, atraso e exclusão.

O roxo permanece reservado ao universo de Automação e não funciona mais como cor padrão do painel ou do CRM.
