import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ned Marketing",
    short_name: "NED",
    description:
      "Marketing, conteúdo, conversão e marketplaces organizados com direção antes de ferramenta.",
    start_url: "/",
    display: "standalone",
    background_color: "#08080a",
    theme_color: "#08080a",
    lang: "pt-BR",
    icons: [
      {
        src: "/brand/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any maskable",
      },
    ],
  };
}
