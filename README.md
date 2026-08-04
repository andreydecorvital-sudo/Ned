# Ned Marketing

Site institucional e sistema de marca da NED Marketing.

## Fontes obrigatórias da marca

Antes de alterar posicionamento, identidade visual, conteúdo, componentes, experiências ou direção do site, consulte:

- [`docs/NED_BRAND_OS.md`](docs/NED_BRAND_OS.md) — fonte canônica das decisões vigentes.
- [`docs/history/2026-08-04-identidade-visual-e-brand-os.md`](docs/history/2026-08-04-identidade-visual-e-brand-os.md) — diagnóstico incorporado e contexto que conectou Instagram, site, GitHub, logo, espiral, materialidade e editorias.
- [`docs/README.md`](docs/README.md) — índice e ordem correta de consulta.

O Brand OS registra decisões aprovadas, posicionamento, sistema visual, editorias, regras do NED OS, histórico cronológico, governança e roadmap. O arquivo histórico preserva o motivo e a bagagem por trás dessas decisões.

Em caso de conflito, prevalece a decisão mais recente marcada como **APROVADO** no Brand OS e confirmada pelo estado atual do repositório.

## Stack

- Next.js 15
- TypeScript
- Space Grotesk + Bebas Neue
- Lucide Icons

## Rodando localmente

```bash
npm install
npm run dev
```

## Princípio de manutenção

Mudanças relevantes de marca ou direção criativa devem:

1. consultar as fontes obrigatórias;
2. explicar o problema que resolvem;
3. preservar um caminho de reversão;
4. atualizar o `NED_BRAND_OS.md` com data, versão e justificativa quando a decisão se tornar definitiva;
5. não substituir silenciosamente uma decisão aprovada.
