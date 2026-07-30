import type { Metadata } from "next";
import { Bebas_Neue, Space_Grotesk } from "next/font/google";
import RuntimeLinkConfig from "./runtime-link-config";
import "./globals.css";
import "./overrides.css";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Ned Marketing — Sites, automações e tráfego",
  description: "Sistemas digitais para empresas que querem crescer.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${bebasNeue.variable} ${spaceGrotesk.variable}`}>
        <RuntimeLinkConfig />
        {children}
      </body>
    </html>
  );
}
