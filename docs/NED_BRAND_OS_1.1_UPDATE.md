# NED BRAND OS — Atualização 1.1.1

> **Versão complementar:** 1.1.1  
> **Data da correção:** 05/08/2026  
> **Status:** ATIVO / LEITURA OBRIGATÓRIA APÓS `docs/NED_BRAND_OS.md`

Esta versão corrige a atualização 1.1.0. A estratégia, o posicionamento, o tom e as editorias permanecem válidos. O que muda é o estado técnico atribuído à logo e aos Destaques.

## 1. Logo

### Estado correto

**DIREÇÃO VISUAL APROVADA / ARQUIVO FINAL EXATO PENDENTE**

O arquivo WebP anteriormente chamado de referência oficial era um render metálico de apresentação. Ele não era uma logo limpa e não deveria ter sido utilizado como fonte canônica.

Os SVGs produzidos a partir da descrição textual também eram aproximações. Eles foram removidos porque não correspondiam com fidelidade ao desenho escolhido.

### Aplicação atual

O header e o rodapé usam uma assinatura temporária composta por:

- `NED`;
- `MARKETING`;
- espiral discreta.

Essa composição existe apenas como fallback e está identificada no código como provisória. Ela não deve ser apresentada como a logo final.

### Regra de implementação

- não vetorizar por adivinhação;
- não chamar mockup ou render de arquivo oficial;
- não criar derivados definitivos sem o arquivo exato;
- substituir o fallback apenas quando a logo correta estiver disponível.

## 2. Site

Permanecem válidos e implementados:

- base institucional neutra;
- cores editoriais por contexto;
- navegação desktop e mobile com estado ativo;
- menu com legibilidade maior;
- popup neutro;
- painel e CRM sem roxo institucional automático;
- página Sobre com narrativa em primeira pessoa;
- imagem social alinhada ao posicionamento, sem usar uma logo aproximada.

O favicon voltou a usar o ícone neutro anterior até existir o símbolo final correto.

## 3. Brand Kit administrativo

A rota `/admin/marca` permanece ativa, mas agora apresenta somente:

- estado real da logo;
- assinatura temporária;
- cores institucionais e editoriais;
- capas aprovadas dos Destaques;
- regras de uso.

A tela não exibe mais o render metálico nem oferece vetores aproximados para download.

## 4. Destaques do Instagram

As capas aprovadas já estavam no repositório. A estrutura correta é:

1. Comece — `public/brand/highlights/01-comece.svg`
2. Serviços — `public/brand/highlights/02-servicos.svg`
3. Trabalhos — `public/brand/highlights/03-trabalhos.svg`
4. Processo — `public/brand/highlights/04-processo.svg`
5. Sites — `public/brand/highlights/05-sites.svg`
6. Market — `public/brand/highlights/06-market.svg`
7. NED — `public/brand/highlights/07-ned.svg`

Esses arquivos são canônicos para as capas. O sistema duplicado em `public/brand/instagram/highlights` foi removido.

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

- recuperar ou exportar o arquivo exato da logo escolhida;
- conferir a logo em tamanhos pequenos antes de criar favicon e símbolo reduzido;
- criar versões clara, escura e plana somente a partir do desenho correto;
- substituir a assinatura temporária após validação visual.

## 7. Decisões preservadas

Esta correção não altera:

- “Direção antes de ferramenta”;
- a frase principal da home;
- as três frentes comerciais;
- a base institucional neutra;
- a lógica de cores por editoria;
- a preferência de Andrey por não se expor em fotos;
- a transparência do portfólio;
- a regra de não inventar ativos, números ou cases.

## 8. Changelog

### 1.1.1 — 05/08/2026

- render metálico removido;
- SVGs aproximados removidos;
- fallback tipográfico restaurado e identificado como provisório;
- favicon provisório revertido para o ícone neutro anterior;
- Brand Kit simplificado;
- capas de Destaques aprovadas recuperadas da pasta correta;
- documentação corrigida para refletir o estado real.
