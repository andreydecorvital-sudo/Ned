import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Space_Grotesk } from "next/font/google";
import Analytics from "./components/analytics";
import LabLauncher from "./components/lab-launcher";
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
    default: "Ned Marketing — Sites, automações, tráfego e marketplaces",
    template: "%s | Ned Marketing",
  },
  description:
    "Sites, landing pages, automações, tráfego e operação de marketplaces para empresas que querem crescer com estratégia e estrutura.",
  applicationName: "Ned Marketing",
  authors: [{ name: "Ned Marketing" }],
  creator: "Ned Marketing",
  publisher: "Ned Marketing",
  keywords: [
    "criação de sites",
    "landing pages",
    "automação empresarial",
    "tráfego pago",
    "marketplaces",
    "Mercado Livre",
    "Shopee",
    "TikTok Shop",
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
    title: "Ned Marketing — Construímos sistemas que vendem",
    description:
      "Sites, automações, tráfego e marketplaces para empresas que querem crescer com estrutura.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ned Marketing — Construímos sistemas que vendem",
    description:
      "Sites, automações, tráfego e marketplaces para empresas que querem crescer com estrutura.",
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
  category: "Marketing e tecnologia",
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
        {children}
        <LabLauncher />
        <Analytics />
      </body>
    </html>
  );
}
