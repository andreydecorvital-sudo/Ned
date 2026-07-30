const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ned-git-main-vitaldecor.vercel.app";

export default function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Ned Marketing",
    url: siteUrl,
    telephone: "+55 11 91781-4612",
    description:
      "Sites, landing pages, automações, tráfego e operação de marketplaces para empresas que querem crescer com estrutura.",
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
    serviceType: [
      "Desenvolvimento de sites",
      "Landing pages",
      "Automações empresariais",
      "Gestão de tráfego pago",
      "Operação de marketplaces",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
