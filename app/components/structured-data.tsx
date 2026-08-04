const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ned-git-main-vitaldecor.vercel.app";

export default function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Ned Marketing",
    url: siteUrl,
    telephone: "+55 11 91781-4612",
    description:
      "Agência de marketing para estratégia, posicionamento, conteúdo, presença digital, tráfego pago, conversão e marketplaces.",
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
    serviceType: [
      "Estratégia de marketing",
      "Posicionamento de marca",
      "Conteúdo e direção criativa",
      "Sites e landing pages",
      "Gestão de tráfego pago",
      "Marketing para marketplaces",
      "Mensuração e otimização",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
