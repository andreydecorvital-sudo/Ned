import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ned Marketing",
    short_name: "Ned",
    description: "Sites, automações, tráfego e marketplaces para empresas que querem crescer.",
    start_url: "/",
    display: "standalone",
    background_color: "#08080a",
    theme_color: "#7040ff",
    lang: "pt-BR",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
