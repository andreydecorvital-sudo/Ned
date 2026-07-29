import type { Metadata } from "next";
import "@fontsource/bebas-neue";
import "@fontsource-variable/space-grotesk";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ned Marketing — Sites, automações e tráfego",
  description: "Sistemas digitais para empresas que querem crescer.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
