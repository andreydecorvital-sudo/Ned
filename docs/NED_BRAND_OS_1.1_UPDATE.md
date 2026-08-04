# NED BRAND OS — Atualização 1.1

> **Versão complementar:** 1.1.0  
> **Data:** 04/08/2026  
> **Status:** ATIVO / LEITURA OBRIGATÓRIA APÓS `docs/NED_BRAND_OS.md`

Este documento atualiza o estado de implementação do Brand OS 1.0 sem substituir sua estratégia, posicionamento, tom, editorias ou histórico.

## 1. Logo e arquivos canônicos

### Estado anterior

A logo estava aprovada visualmente, mas registrada como pendente de vetorização e aplicação canônica.

### Estado atual

- a referência visual oficial está arquivada em `public/brand/ned-logo-primary.webp`;
- a marca não é mais reconstruída por fonte no header e no rodapé;
- foram criados derivados técnicos em SVG;
- favicon e metadata utilizam o sistema oficial;
- o painel administrativo possui uma área de consulta da marca.

### Arquivos

- `public/brand/ned-logo-primary.webp` — referência visual soberana;
- `public/brand/ned-logo-primary.svg` — versão editorial técnica;
- `public/brand/ned-logo-flat.svg` — versão branca plana;
- `public/brand/ned-logo-dark.svg` — versão preta;
- `public/brand/ned-wordmark.svg` — versão reduzida;
- `public/brand/ned-symbol-spiral.svg` — símbolo secundário;
- `public/brand/favicon.svg` — favicon institucional.

### Regra de fidelidade

O WebP aprovado continua sendo a fonte de comparação visual. Os vetores técnicos não autorizam mudanças silenciosas no desenho.

## 2. Site

Aplicado:

- logo vetorial no cabeçalho;
- logo completa no rodapé;
- navegação desktop e mobile com estado ativo;
- favicon oficial;
- manifest neutro;
- imagem social atualizada para o posicionamento vigente;
- base institucional sem roxo automático;
- menu com legibilidade maior;
- página Sobre sem mensagem defensiva sobre ausência de foto.

A espiral permanece secundária e aparece somente em aplicações de assinatura, favicon, metadata e microinteração.

## 3. Painel administrativo

Nova rota:

`/admin/marca`

Ela centraliza:

- referência visual oficial;
- versões técnicas da logo;
- download dos ativos;
- cores institucionais e editoriais;
- ordem dos Destaques do Instagram;
- caminhos esperados para os arquivos;
- pendências explícitas.

O painel principal e o dock administrativo passam a incluir o módulo **Marca**.

## 4. Instagram e Destaques

### Ordem do sistema

1. NED
2. Serviços
3. Cases
4. Lab
5. Resultados
6. Bastidores
7. Contato

### Arquivos esperados

- `public/brand/instagram/highlights/01-ned.webp`
- `public/brand/instagram/highlights/02-servicos.webp`
- `public/brand/instagram/highlights/03-cases.webp`
- `public/brand/instagram/highlights/04-lab.webp`
- `public/brand/instagram/highlights/05-resultados.webp`
- `public/brand/instagram/highlights/06-bastidores.webp`
- `public/brand/instagram/highlights/07-contato.webp`

As fotografias já escolhidas não estavam disponíveis no repositório nem na File Library durante esta implementação. Por isso:

- nenhum substituto foi gerado;
- nenhum ícone genérico foi usado no lugar das fotos;
- os espaços e nomes foram preparados;
- existe um overlay opcional em `public/brand/instagram/highlights/highlight-overlay.svg`.

Documento completo:

`docs/instagram/HIGHLIGHTS_SYSTEM.md`

## 5. Cores

A arquitetura vigente permanece:

- marca-mãe: preto profundo, off-white e cinza metálico;
- Mistérios: vermelho;
- Sites: verde;
- IA: azul;
- Automação: roxo;
- Marketplaces: laranja;
- Opiniões: preto e branco.

O roxo não deve voltar a representar a NED inteira.

## 6. Pendências reais

- arquivar as sete fotografias escolhidas nos caminhos canônicos;
- comparar os vetores técnicos lado a lado com o arquivo fonte antes de uso de impressão de alta precisão;
- produzir versão social rasterizada após a entrada das fotos finais;
- revisar aplicações físicas quando existirem.

## 7. Decisões preservadas

Esta atualização não altera:

- “Direção antes de ferramenta”;
- a frase principal da home;
- as três frentes comerciais;
- a base institucional neutra;
- a lógica de cores por editoria;
- a preferência de Andrey por não se expor em fotos;
- a transparência do portfólio;
- a regra de não inventar números, fotos ou cases.

## 8. Changelog

### 1.1.0 — 04/08/2026

- referência oficial da logo localizada e conectada ao sistema;
- derivados SVG criados;
- header, footer, favicon, manifest e Open Graph atualizados;
- estados ativos de navegação implementados;
- Brand Kit administrativo criado;
- sistema de Destaques formalizado;
- ausência das fotografias registrada sem substituição artificial;
- governança atualizada para próximos chats e agentes.
