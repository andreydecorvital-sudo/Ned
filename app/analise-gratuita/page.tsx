import type { Metadata } from "next";
import { ArrowRight, Check, SearchCheck, Video } from "lucide-react";
import CommercialLeadForm from "../components/commercial-lead-form";
import { CommercialPage } from "../components/commercial-shell";
import styles from "../commercial.module.css";

export const metadata: Metadata = {
  title: "Análise gratuita de site, Instagram ou marketplace",
  description:
    "Envie seu site, Instagram, Perfil da Empresa no Google ou marketplace e registre uma solicitação de análise inicial com a NED Marketing.",
  alternates: { canonical: "/analise-gratuita" },
  openGraph: {
    title: "Análise gratuita | NED Marketing",
    description: "Descubra os primeiros gargalos entre presença digital, oferta, atendimento e conversão.",
    url: "/analise-gratuita",
  },
};

const points = [
  "Clareza da oferta e do próximo passo",
  "Caminho entre visita e conversa no WhatsApp",
  "Problemas de navegação e experiência no celular",
  "Oportunidades de CRM, rastreamento e follow-up",
];

export default function FreeAnalysisPage() {
  return (
    <CommercialPage>
      <section className={`${styles.hero} ${styles.heroCompact}`}>
        <div>
          <span className={styles.eyebrow}>ANÁLISE INICIAL / SEM PROMESSA VAZIA</span>
          <h1>Mostre seu negócio. A NED aponta onde começar.</h1>
          <p className={styles.heroLead}>
            Envie um link do seu site, Instagram, Perfil da Empresa no Google ou marketplace. A solicitação entra no CRM com seu contexto e serve como ponto de partida para uma análise objetiva.
          </p>
          <div className={styles.heroMeta}>
            <span>Sem relatório genérico automático</span>
            <span>Contato direto pelo WhatsApp</span>
            <span>Sem compromisso de contratação</span>
          </div>
        </div>

        <aside className={styles.heroPanel}>
          <span className={styles.panelKicker}>O QUE PODE SER ANALISADO</span>
          <h2 className={styles.panelTitle}>A jornada entre atenção e contato.</h2>
          <ul className={styles.featureList}>
            {points.map((point) => (
              <li key={point}><Check size={15} /> {point}</li>
            ))}
          </ul>
        </aside>
      </section>

      <section className={styles.sectionSoft}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>COMO FUNCIONA</span>
            <h2 className={styles.sectionTitle}>Uma análise útil precisa de <span>contexto.</span></h2>
          </div>
          <p>
            O envio não gera uma promessa automática de resultado. A NED usa as informações para entender o cenário e responder com os pontos mais relevantes para o momento do negócio.
          </p>
        </div>
        <div className={styles.grid3}>
          <article className={styles.card}>
            <span className={styles.cardNumber}>01</span>
            <h3>Você envia o link</h3>
            <p>Site, Instagram, Google, Mercado Livre, Shopee ou outra presença que concentre a jornada do cliente.</p>
          </article>
          <article className={styles.card}>
            <span className={styles.cardNumber}>02</span>
            <h3>A NED organiza o diagnóstico</h3>
            <p>A solicitação entra no CRM com origem, necessidade, urgência e o canal que deve ser analisado.</p>
          </article>
          <article className={styles.card}>
            <span className={styles.cardNumber}>03</span>
            <h3>A conversa avança pelo WhatsApp</h3>
            <p>Quando houver aderência, a análise pode evoluir para vídeo curto, reunião ou proposta de implementação.</p>
          </article>
        </div>
      </section>

      <section className={styles.formSection} id="solicitar">
        <div className={styles.formIntro}>
          <span className={styles.eyebrow}>SOLICITAR ANÁLISE</span>
          <h2>Envie o principal <span>gargalo.</span></h2>
          <p>
            Quanto mais específico for o problema, mais objetiva será a resposta. Não envie senhas, documentos ou informações confidenciais.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.textLink} href="/ned-score">
              Prefere começar pelo NED Score? <ArrowRight size={15} />
            </a>
          </div>
        </div>
        <CommercialLeadForm variant="analysis" />
      </section>

      <section className={styles.splitSection}>
        <div>
          <span className={styles.eyebrow}>DIAGNÓSTICO PERSONALIZADO</span>
          <h2>O objetivo é mostrar direção, não entregar uma consultoria inteira de graça.</h2>
          <p>
            A análise inicial identifica o que merece atenção primeiro. Estratégia detalhada, implementação, criativos, páginas, automações e operação fazem parte dos serviços contratados.
          </p>
        </div>
        <aside className={styles.callout}>
          <Video size={28} />
          <strong>Análise em vídeo</strong>
          <p>Solicitações com bom contexto podem receber uma gravação curta mostrando os principais pontos observados.</p>
        </aside>
      </section>
    </CommercialPage>
  );
}
