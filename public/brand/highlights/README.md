# Destaques do Instagram — padrão aprovado

Status: **APROVADO**  
Data: **04/08/2026**  
Última correção técnica: **05/08/2026**

Estas capas formam o sistema oficial dos Destaques fixados da NED Marketing.

## Ordem e função

1. `01-comece.svg` — **Comece** — porta de entrada da marca; símbolo: espiral NED.
2. `02-servicos.svg` — **Serviços** — visão das frentes comerciais; símbolo: três blocos/módulos.
3. `03-trabalhos.svg` — **Trabalhos** — cases e portfólio; símbolo: enquadramento editorial.
4. `04-processo.svg` — **Processo** — briefing, direção, execução e aprendizado; símbolo: caminho de etapas.
5. `05-sites.svg` — **Sites** — sites, landing pages, UX e conversão; símbolo: portal arquitetônico com acento verde.
6. `06-market.svg` — **Market** — marketplaces, catálogo, anúncios e operação; símbolo: tag com acento laranja.
7. `07-ned.svg` — **NED** — marca, filosofia, bastidores e institucional; símbolo: wordmark NED + espiral.

## Regras visuais

- base preta profunda;
- off-white como cor estrutural;
- círculo externo fino;
- composição simples e legível em tamanho pequeno;
- sem texto explicativo dentro das capas;
- cada ícone precisa funcionar sozinho;
- cor apenas como acento semântico;
- verde reservado a Sites;
- laranja reservado a Market;
- os demais permanecem institucionais e neutros;
- evitar transformar os Destaques em uma sequência de serviços técnicos.

## Correções técnicas

Em 05/08/2026 foram corrigidos dois problemas de renderização:

- o filtro de grão de `01-comece.svg` criava um quadrado cinza sobre a espiral;
- o filtro de `02-servicos.svg` substituía os blocos por uma camada praticamente invisível.

Os filtros foram removidos sem alterar os símbolos aprovados.

Na tela `/admin/marca`, os SVGs devem ser apresentados:

- sem círculo adicional;
- sem `object-fit: cover`;
- com `object-fit: contain`;
- em grade ampla o suficiente para inspeção visual.

## Observação

Os arquivos em SVG são os ativos canônicos para uso e manutenção. Eles preservam a direção visual das capas aprovadas e permitem exportação em PNG/WebP sem perda de qualidade.
