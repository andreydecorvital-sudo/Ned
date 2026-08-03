import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  Globe2,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./service-page.module.css";
import { getService, serviceOrder, services, type ServiceSlug } from "../service-data";

const whatsappNumber = "5511917814612";

const iconBySlug = {
  sites: Globe2,
  automacoes: Bot,
  "trafego-pago": BarChart3,
  marketplaces: ShoppingBag,
} satisfies Record<ServiceSlug, typeof Globe2>;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return serviceOrder.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    return {
      title: "Serviço não encontrado",
    };
  }

  return {
    title: `${service.shortName} — Ned Marketing`,
    description: service.metaDescription,
    alternates: {
      canonical: `/servicos/${service.slug}`,
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      title: `${service.shortName} — Ned Marketing`,
      description: service.metaDescription,
      url: `/servicos/${service.slug}`,
      siteName: "Ned Marketing",
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.shortName} — Ned Marketing`,
      description: service.metaDescription,
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) notFound();

  const Icon = iconBySlug[service.slug];
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    service.whatsappMessage,
  )}`;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Voltar para a Ned Marketing">
          <strong>NED</strong>
          <small>MARKETING</small>
        </Link>

        <nav className={styles.serviceNav} aria-label="Serviços da Ned">
          {serviceOrder.map((itemSlug) => {
            const item = services[itemSlug];
            return (
              <Link
                key={item.slug}
                className={item.slug === service.slug ? styles.activeNav : undefined}
                href={`/servicos/${item.slug}`}
              >
                {item.shortName}
              </Link>
            );
          })}
        </nav>

        <a
          className={styles.headerCta}
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          data-track={`servico_${service.slug}_header`}
        >
          Conversar <ArrowRight size={16} />
        </a>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <Link className={styles.backLink} href="/#servicos">
            <ArrowLeft size={15} /> Todos os serviços
          </Link>

          <span className={styles.eyebrow}>
            SERVIÇO {service.number} / {service.eyebrow}
          </span>
          <h1>
            {service.title}
            <span>{service.accent}</span>
          </h1>
          <p className={styles.heroLead}>{service.description}</p>

          <div className={styles.heroActions}>
            <a
              className={styles.primaryCta}
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              data-track={`servico_${service.slug}_hero`}
            >
              Falar sobre meu projeto <MessageCircle size={18} />
            </a>
            <a className={styles.secondaryCta} href="#entregas">
              Ver o que entregamos <ArrowRight size={17} />
            </a>
          </div>

          <ul className={styles.heroPoints}>
            {service.heroPoints.map((point) => (
              <li key={point}>
                <Check size={14} /> {point}
              </li>
            ))}
          </ul>
        </div>

        <aside className={styles.heroPanel} aria-label={`Visão geral do serviço ${service.shortName}`}>
          <div className={styles.panelTop}>
            <span className={styles.panelIcon}>
              <Icon size={27} strokeWidth={1.7} />
            </span>
            <strong>{service.number}</strong>
          </div>
          <span className={styles.panelLabel}>SISTEMA DE ENTREGA</span>
          <div className={styles.signalList}>
            {service.heroPoints.map((point, index) => (
              <div className={styles.signalItem} key={point}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{point}</strong>
                <i />
              </div>
            ))}
          </div>
          <div className={styles.panelFoot}>
            <span>NED / {service.shortName.toUpperCase()}</span>
            <b>ESTRUTURA ATIVA</b>
          </div>
        </aside>
      </section>

      <section className={styles.sectionLight}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.eyebrow}>O PROBLEMA</span>
            <h2>{service.problemTitle}</h2>
          </div>
          <p>{service.problemIntro}</p>
        </div>

        <div className={styles.problemGrid}>
          {service.problems.map((problem, index) => (
            <article className={styles.problemCard} key={problem.title}>
              <span className={styles.cardIndex}>{String(index + 1).padStart(2, "0")}</span>
              <h3>{problem.title}</h3>
              <p>{problem.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} id="entregas">
        <div className={styles.splitSection}>
          <div className={styles.stickyTitle}>
            <span className={styles.eyebrow}>O QUE ENTREGAMOS</span>
            <h2>Estrutura para o projeto funcionar de verdade.</h2>
            <p>
              O escopo final depende do diagnóstico. A lista abaixo mostra os blocos que podem
              compor a solução, sem pacotes genéricos ou itens desnecessários.
            </p>
          </div>

          <div className={styles.deliverableList}>
            {service.deliverables.map((deliverable, index) => (
              <div className={styles.deliverableItem} key={deliverable}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{deliverable}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionLight}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.eyebrow}>COMO TRABALHAMOS</span>
            <h2>Processo claro antes de execução acelerada.</h2>
          </div>
          <p>
            O objetivo é tomar decisões com contexto, construir a base certa e deixar o projeto
            preparado para ser medido e evoluído.
          </p>
        </div>

        <div className={styles.processGrid}>
          {service.process.map((step) => (
            <article className={styles.processCard} key={step.number}>
              <span className={styles.cardIndex}>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.sectionLight}>
        <div className={styles.audienceFaq}>
          <div className={styles.audienceBox}>
            <span className={styles.eyebrow}>PARA QUEM FAZ SENTIDO</span>
            <h2>Um serviço para resolver uma necessidade real.</h2>
            <ul className={styles.audienceList}>
              {service.audience.map((item) => (
                <li key={item}>
                  <Check size={16} /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.faqBox}>
            <span className={styles.eyebrow}>DÚVIDAS FREQUENTES</span>
            <h2>Antes de começar.</h2>
            <div className={styles.faqList}>
              {service.faqs.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.relatedSection}`}>
        <span className={styles.eyebrow}>SERVIÇOS RELACIONADOS</span>
        <div className={styles.relatedGrid}>
          {service.related.map((relatedSlug) => {
            const related = services[relatedSlug];
            return (
              <Link
                className={styles.relatedCard}
                key={related.slug}
                href={`/servicos/${related.slug}`}
              >
                <small>SERVIÇO {related.number}</small>
                <h3>{related.shortName}</h3>
                <ArrowRight size={22} />
              </Link>
            );
          })}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <span className={styles.eyebrow}>PRÓXIMO PASSO</span>
        <h2>Vamos entender onde esse serviço entra na sua empresa.</h2>
        <p>
          A primeira conversa serve para entender o problema, verificar o que já existe e definir
          se a NED é a estrutura certa para o projeto.
        </p>
        <a
          className={styles.primaryCta}
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          data-track={`servico_${service.slug}_final`}
        >
          Conversar com a NED <MessageCircle size={18} />
        </a>
      </section>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} NED MARKETING</span>
        <Link href="/">Voltar para a página inicial</Link>
      </footer>
    </main>
  );
}
