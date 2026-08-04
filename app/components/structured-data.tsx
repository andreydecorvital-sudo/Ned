const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ned-git-main-vitaldecor.vercel.app";

export default function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Ned Marketing",
    url: siteUrl,
    telephone: "+55 11 91781-4612",
    description:
      "Estrutura de marketing para posicionamento, conteúdo, campanhas, conversão, tráfego pago e marketplaces.",
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
    serviceType: [
      "Estratégia e posicionamento de marca",
      "Marketing de conteúdo e direção criativa",
      "Campanhas e criativos publicitários",
      "Sites e landing pages",
      "Gestão de tráfego pago",
      "Marketing para marketplaces",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
