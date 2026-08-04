# Aplicação canônica da logo e dos Destaques

**Data:** 04/08/2026  
**Brand OS:** atualização 1.1.0

## Problema

O site já havia absorvido a base neutra e as cores por editoria, mas ainda utilizava uma marca digital provisória construída por texto. A referência visual aprovada existia no repositório, porém não estava conectada ao header, rodapé, metadata ou painel.

As fotografias escolhidas para os Destaques do Instagram também não possuíam caminhos canônicos nem regras documentadas de aplicação.

## Decisões

- preservar `public/brand/ned-logo-primary.webp` como referência visual soberana;
- criar versões SVG técnicas para interface e escala;
- substituir a marca tipográfica provisória por arquivos de marca;
- manter a espiral como símbolo secundário e pouco frequente;
- preparar o sistema de Destaques sem gerar fotos substitutas;
- centralizar os ativos em um Brand Kit administrativo;
- atualizar navegação, favicon, manifest e imagem social.

## Implementação

### Marca

- `public/brand/ned-logo-primary.svg`
- `public/brand/ned-logo-flat.svg`
- `public/brand/ned-logo-dark.svg`
- `public/brand/ned-wordmark.svg`
- `public/brand/ned-symbol-spiral.svg`
- `public/brand/favicon.svg`

### Instagram

- `public/brand/instagram/highlights/highlight-overlay.svg`
- `docs/instagram/HIGHLIGHTS_SYSTEM.md`

### Site

- logo canônica no header e rodapé;
- estado ativo na navegação desktop e mobile;
- favicon e manifest neutros;
- Open Graph alinhado à mensagem atual;
- hierarquia do menu refinada;
- texto da página Sobre menos defensivo.

### Administração

- nova rota `/admin/marca`;
- Brand Kit no painel principal;
- acesso pelo dock administrativo;
- visualização da referência oficial, derivados, cores e Destaques.

## Limite preservado

As sete fotografias aprovadas para os Destaques não estavam disponíveis no GitHub nem na File Library durante a implementação. Nenhuma imagem genérica ou gerada foi usada para ocupar o lugar delas.

Os caminhos foram preparados para receber os arquivos reais sem exigir nova reforma da interface.

## Reversão

As mudanças estão isoladas em componentes de marca, assets públicos e documentação. A referência WebP original não foi alterada.
