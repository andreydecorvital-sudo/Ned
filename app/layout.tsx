import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Space_Grotesk } from "next/font/google";
import Analytics from "./components/analytics";
import ClientNavigation from "./components/client-navigation";
import DiagnosticPopup from "./components/diagnostic-popup";
import LabLauncher from "./components/lab-launcher";
import LegalFooter from "./components/legal-footer";
import ServiceCardLinks from "./components/service-card-links";
import SiteRuntime from "./components/site-runtime";
import StructuredData from "./components/structured-data";
import "./globals.css";
import "./overrides.css";
import "./runtime.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ned-git-main-vitaldecor.vercel.app";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ned Marketing — Estratégia, criação, tráfego e crescimento",
    template: "%s | Ned Marketing",
  },
  description:
    "Agência de marketing para posicionamento, conteúdo, presença digital, tráfego pago, conversão e marketplaces. Projetos e investimentos definidos após análise.",
  applicationName: "Ned Marketing",
  authors: [{ name: "Ned Marketing" }],
  creator: "Ned Marketing",
  publisher: "Ned Marketing",
  keywords: [
    "agência de marketing",
    "estratégia de marketing",
    "posicionamento de marca",
    "conteúdo e criativos",
    "criação de sites",
    "landing pages",
    "tráfego pago",
    "marketplaces",
    "Mercado Livre",
    "Shopee",
    "marketing digital",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Ned Marketing",
    title: "Ned Marketing — Marketing para ser encontrado, escolhido e lembrado",
    description:
      "Estratégia, criação, presença digital, mídia e conversão para empresas que querem crescer com mais direção.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ned Marketing — Estratégia, criação e crescimento",
    description:
      "Marketing integrado para posicionar marcas, criar demanda e transformar atenção em oportunidades.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "Marketing e publicidade",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f0ea" },
    { media: "(prefers-color-scheme: dark)", color: "#08080a" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${bebasNeue.variable} ${spaceGrotesk.variable}`}>
        <StructuredData />
        <SiteRuntime />
        <ServiceCardLinks />
        <ClientNavigation />
        {children}
        <LegalFooter />
        <DiagnosticPopup />
        <LabLauncher />
        <Analytics />
      </body>
    </html>
  );
}
