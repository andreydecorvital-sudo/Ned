# Tentativa de aplicação canônica da logo — SUPERADA

**Data original:** 04/08/2026  
**Correção:** 05/08/2026  
**Status:** SUPERADO / NÃO USAR COMO ESTADO ATUAL

## O que aconteceu

Uma imagem WebP com acabamento metálico foi interpretada incorretamente como a referência oficial da logo. A partir dela e da descrição do Brand OS, foram criados vetores aproximados e aplicações para header, rodapé, favicon, metadata e painel.

A tela administrativa também apresentou o render como “Referência visual oficial”, o que gerou uma aplicação confusa e visualmente diferente da logo escolhida.

## Por que a decisão foi revertida

- o WebP era um render de apresentação, não um arquivo limpo da marca;
- os SVGs foram construídos por aproximação;
- os vetores não reproduziam com fidelidade a logo escolhida;
- chamar esses arquivos de oficiais contrariava a regra de não substituir decisões aprovadas silenciosamente;
- as capas de Destaques aprovadas já existiam em outra pasta e foram ignoradas por engano.

## Correção aplicada

- render metálico retirado do repositório público;
- vetores aproximados removidos;
- favicon derivado removido;
- assinatura tipográfica temporária restaurada;
- Brand Kit refeito para explicar o status real;
- capas oficiais recuperadas de `public/brand/highlights`;
- sistema duplicado de Destaques removido;
- Brand OS atualizado para a versão 1.1.1.

## Estado válido

Consulte:

- `docs/NED_BRAND_OS_1.1_UPDATE.md`;
- `docs/brand-changelog/2026-08-05-correction-logo-and-highlights.md`;
- `public/brand/highlights/README.md`.

Este arquivo permanece somente para registrar a origem do erro e a reversão.
