# NED BRAND OS — Atualização 1.1.2

> **Versão complementar:** 1.1.2  
> **Data:** 05/08/2026  
> **Status:** ATIVO / LEITURA OBRIGATÓRIA APÓS `docs/NED_BRAND_OS.md`

Esta versão substitui o estado técnico descrito na 1.1.1. A estratégia, o posicionamento, o tom e as editorias permanecem válidos.

## 1. Logo

### Estado atual

**ARQUIVO OFICIAL DISPONÍVEL PARA USO DIGITAL**

O responsável da NED enviou a imagem correta da logo em 05/08/2026. Ela foi aplicada sem redesenho e sem reconstrução tipográfica.

Arquivo canônico digital:

`public/brand/ned-logo-official.webp`

O único tratamento realizado foi técnico:

- remoção da grande margem preta ao redor da composição;
- redimensionamento para carregamento web;
- preservação da proporção e do desenho original.

### Características preservadas

- `NED` branco e largo;
- textura sutil;
- detalhe próprio no encontro entre `E` e `D`;
- `MARKETING` espaçado;
- espiral ao final da assinatura;
- composição horizontal;
- base institucional preta.

### Aplicação atual

A logo oficial é utilizada em:

- cabeçalho;
- rodapé;
- login administrativo;
- painel administrativo;
- CRM;
- Brand Kit;
- imagem de compartilhamento social.

### Pendência de formato

O arquivo vetorial exato ainda não existe no repositório. Um vetor futuro deve ser criado somente a partir desta referência e comparado lado a lado antes de aprovação.

## 2. Site

Permanecem implementados:

- base institucional neutra;
- cores editoriais por contexto;
- navegação desktop e mobile com estado ativo;
- menu com legibilidade maior;
- popup neutro;
- painel e CRM sem roxo institucional automático;
- página Sobre com narrativa em primeira pessoa;
- logo oficial sem distorção;
- imagem social usando a logo correta.

O favicon continua neutro até existir uma versão isolada e validada do símbolo.

## 3. Brand Kit administrativo

A rota `/admin/marca` apresenta:

- logo oficial em tamanho de inspeção;
- download do arquivo digital;
- origem e tratamento aplicado;
- cores institucionais e editoriais;
- capas aprovadas dos Destaques;
- downloads individuais dos SVGs;
- regras de uso.

A tela não exibe mais render metálico, fallback provisório ou vetores aproximados.

## 4. Destaques do Instagram

A estrutura canônica permanece:

1. Comece — `public/brand/highlights/01-comece.svg`
2. Serviços — `public/brand/highlights/02-servicos.svg`
3. Trabalhos — `public/brand/highlights/03-trabalhos.svg`
4. Processo — `public/brand/highlights/04-processo.svg`
5. Sites — `public/brand/highlights/05-sites.svg`
6. Market — `public/brand/highlights/06-market.svg`
7. NED — `public/brand/highlights/07-ned.svg`

### Correções visuais

- a capa Comece não utiliza mais o filtro que gerava um quadrado cinza;
- a capa Serviços não utiliza mais o filtro que apagava os blocos;
- a tela não cria um segundo círculo sobre os SVGs;
- as capas são exibidas inteiras;
- a grade utiliza quatro colunas no desktop para evitar miniaturas espremidas.

Documento de referência:

`public/brand/highlights/README.md`

## 5. Cores

A arquitetura vigente permanece:

- marca-mãe: preto profundo, off-white e cinza metálico;
- Mistérios: vermelho;
- Sites: verde;
- IA: azul;
- Automação: roxo;
- Marketplaces: laranja;
- Opiniões: preto e branco.

O roxo não representa a NED inteira.

## 6. Pendências reais

- criar o vetor exato a partir da imagem oficial;
- validar uma versão reduzida da espiral para favicon;
- produzir versões para impressão somente após comparação visual;
- arquivar futuramente o arquivo fonte em maior resolução quando necessário.

## 7. Decisões preservadas

Esta atualização não altera:

- “Direção antes de ferramenta”;
- a frase principal da home;
- as três frentes comerciais;
- a base institucional neutra;
- a lógica de cores por editoria;
- a preferência de Andrey por não se expor em fotos;
- a transparência do portfólio;
- a regra de não inventar ativos, números ou cases.

## 8. Changelog

### 1.1.2 — 05/08/2026

- logo correta recebida do responsável da marca;
- arquivo WebP digital criado por recorte e redimensionamento, sem redesenho;
- fallback tipográfico removido;
- logo aplicada ao site, painel, login, CRM, Brand Kit e Open Graph;
- filtros defeituosos dos Destaques Comece e Serviços removidos;
- apresentação das capas corrigida;
- documentação atualizada para o estado real.
