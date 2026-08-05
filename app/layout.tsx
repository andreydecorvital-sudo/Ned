import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Space_Grotesk } from "next/font/google";
import Analytics from "./components/analytics";
import ClientNavigation from "./components/client-navigation";
import DiagnosticPopup from "./components/diagnostic-popup";
import LegalFooter from "./components/legal-footer";
import SiteRuntime from "./components/site-runtime";
import StructuredData from "./components/structured-data";
import "./globals.css";
import "./overrides.css";
import "./runtime.css";
import "./brand-tokens.css";
import "./brand-commercial.css";
import "./admin-brand.css";

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
    default: "Ned Marketing — marketing, conteúdo, conversão e marketplaces",
    template: "%s | Ned Marketing",
  },
  description:
    "Marketing para empresas que precisam apresentar melhor sua marca, gerar oportunidades e vender com mais direção. Escopo e investimento definidos após análise.",
  applicationName: "Ned Marketing",
  authors: [{ name: "Ned Marketing" }],
  creator: "Ned Marketing",
  publisher: "Ned Marketing",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
  },
  keywords: [
    "agência de marketing",
    "estratégia de marketing",
    "marketing de conteúdo",
    "posicionamento de marca",
    "campanhas publicitárias",
    "criação de sites",
    "landing pages",
    "tráfego pago",
    "marketplaces",
    "Mercado Livre",
    "Shopee",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Ned Marketing",
    title: "Ned Marketing — direção para sua marca ser escolhida",
    description:
      "Marketing, conteúdo, conversão e marketplaces para empresas que querem transformar interesse em oportunidades.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ned Marketing — marketing com direção",
    description:
      "Posicionamento, conteúdo, páginas, campanhas e marketplaces organizados conforme o problema real da empresa.",
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
    { media: "(prefers-color-scheme: light)", color: "#f1eee7" },
    { media: "(prefers-color-scheme: dark)", color: "#08080a" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${bebasNeue.variable} ${spaceGrotesk.variable}`}>
        <StructuredData />
        <SiteRuntime />
        <ClientNavigation />
        {children}
        <LegalFooter />
        <DiagnosticPopup />
        <Analytics />
      </body>
    </html>
  );
}
