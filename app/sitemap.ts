import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ned-git-main-vitaldecor.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/servicos", changeFrequency: "monthly" as const, priority: 0.95 },
    { path: "/portfolio", changeFrequency: "monthly" as const, priority: 0.95 },
    { path: "/processo", changeFrequency: "monthly" as const, priority: 0.9 },
    { path: "/sobre", changeFrequency: "monthly" as const, priority: 0.9 },
    { path: "/analise-gratuita", changeFrequency: "monthly" as const, priority: 0.9 },
    { path: "/ned-score", changeFrequency: "monthly" as const, priority: 0.78 },
    { path: "/servicos/marketing-conteudo", changeFrequency: "monthly" as const, priority: 0.9 },
    { path: "/servicos/sites", changeFrequency: "monthly" as const, priority: 0.85 },
    { path: "/servicos/trafego-pago", changeFrequency: "monthly" as const, priority: 0.85 },
    { path: "/servicos/marketplaces", changeFrequency: "monthly" as const, priority: 0.85 },
    { path: "/servicos/automacoes", changeFrequency: "monthly" as const, priority: 0.6 },
    { path: "/maquina-de-clientes", changeFrequency: "monthly" as const, priority: 0.65 },
    { path: "/parceiros", changeFrequency: "monthly" as const, priority: 0.65 },
    { path: "/lab", changeFrequency: "monthly" as const, priority: 0.72 },
    { path: "/lab/maquina-quebrada", changeFrequency: "monthly" as const, priority: 0.75 },
    { path: "/privacidade", changeFrequency: "yearly" as const, priority: 0.35 },
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
