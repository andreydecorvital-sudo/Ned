# Correção da logo e dos Destaques

**Data:** 05/08/2026  
**Brand OS:** 1.1.1

## Problema identificado

A área `/admin/marca` exibia um render metálico como “Referência visual oficial”. O arquivo não era uma logo limpa e a aparência não correspondia à marca escolhida.

Também haviam sido criados SVGs aproximados com base apenas na descrição textual da identidade. Esses arquivos passaram a ser usados no site, favicon e metadata sem validação visual suficiente.

Ao mesmo tempo, as capas aprovadas dos Destaques já existiam em `public/brand/highlights`, mas uma segunda estrutura vazia foi criada por engano.

## Correções

- removido o render metálico;
- removidos os vetores aproximados;
- removido o favicon derivado;
- restaurada uma assinatura tipográfica temporária no site;
- fallback marcado explicitamente como provisório;
- imagem social refeita sem logo aproximada;
- Brand Kit simplificado;
- capas oficiais dos Destaques conectadas à tela;
- estrutura duplicada de Destaques removida;
- documentação corrigida.

## Estado atual

### Logo

A direção visual está aprovada, mas o arquivo final exato continua pendente. Nenhuma aplicação aproximada será tratada como oficial.

### Destaques

Os ativos canônicos são:

- `public/brand/highlights/01-comece.svg`;
- `public/brand/highlights/02-servicos.svg`;
- `public/brand/highlights/03-trabalhos.svg`;
- `public/brand/highlights/04-processo.svg`;
- `public/brand/highlights/05-sites.svg`;
- `public/brand/highlights/06-market.svg`;
- `public/brand/highlights/07-ned.svg`.

## Regra adicionada

Uma descrição aprovada não autoriza a criação de um arquivo final por aproximação. Mockups, renders e estudos devem ser identificados pelo que são e nunca ocupar o lugar do ativo canônico.
