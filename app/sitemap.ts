import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ned-git-main-vitaldecor.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/lab", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/lab/maquina-quebrada", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/servicos/sites", changeFrequency: "monthly" as const, priority: 0.85 },
    { path: "/servicos/automacoes", changeFrequency: "monthly" as const, priority: 0.85 },
    { path: "/servicos/trafego-pago", changeFrequency: "monthly" as const, priority: 0.85 },
    { path: "/servicos/marketplaces", changeFrequency: "monthly" as const, priority: 0.85 },
    { path: "/privacidade", changeFrequency: "yearly" as const, priority: 0.35 },
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
