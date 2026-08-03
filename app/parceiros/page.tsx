import type { Metadata } from "next";
import { ArrowRight, Check, Handshake, Network, ShieldCheck } from "lucide-react";
import CommercialLeadForm from "../components/commercial-lead-form";
import { CommercialPage } from "../components/commercial-shell";
import styles from "../commercial.module.css";

export const metadata: Metadata = {
  title: "Parceiros e indicações",
  description:
    "Programa de parceria da NED Marketing para profissionais que indicam ou precisam de execução técnica em sites, automações, CRM e marketplaces.",
  alternates: { canonical: "/parceiros" },
  openGraph: {
    title: "Parceiros NED",
    description: "Indique projetos, complemente seu serviço e participe de entregas com escopo claro.",
    url: "/parceiros",
  },
};

export default function PartnersPage() {
  return (
    <CommercialPage>
      <section className={`${styles.hero} ${styles.heroCompact}`}>
        <div>
          <span className={styles.eyebrow}>PROGRAMA DE PARCEIROS / NED</span>
          <h1>Você mantém a relação. A NED entra com a execução.</h1>
          <p className={styles.heroLead}>
            Social medias, designers, gestores de tráfego, fotógrafos, contadores, consultores e profissionais de tecnologia podem indicar demandas ou complementar projetos com a estrutura técnica da NED.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primary} href="#parceria">Quero conversar <ArrowRight size={16} /></a>
            <a className={styles.secondary} href="/maquina-de-clientes">Conhecer a principal solução</a>
          </div>
        </div>
        <aside className={styles.heroPanel}>
          <span className={styles.panelKicker}>MODELOS POSSÍVEIS</span>
          <h2 className={styles.panelTitle}>Indicação, parceria ou execução técnica.</h2>
          <ul className={styles.featureList}>
            <li><Check size={15} /> Comissão sobre o primeiro projeto efetivamente pago</li>
            <li><Check size={15} /> Execução em conjunto com responsabilidades definidas</li>
            <li><Check size={15} /> Terceirização técnica sem prometer o que não foi validado</li>
          </ul>
        </aside>
      </section>

      <section className={styles.sectionSoft}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>COMO FUNCIONA</span>
            <h2 className={styles.sectionTitle}>Parceria boa precisa de <span>regra clara.</span></h2>
          </div>
          <p>
            Antes de qualquer indicação, alinhamos escopo, participação, comunicação com o cliente e condição comercial. Não existe comissão sobre orçamento não aprovado ou pagamento não recebido.
          </p>
        </div>
        <div className={styles.grid3}>
          <article className={styles.card}>
            <span className={styles.toolIcon}><Network size={22} /></span>
            <h3>Você identifica a demanda</h3>
            <p>O parceiro apresenta uma empresa com necessidade real de site, CRM, automação, tráfego ou marketplace.</p>
          </article>
          <article className={styles.card}>
            <span className={styles.toolIcon}><ShieldCheck size={22} /></span>
            <h3>A NED valida o projeto</h3>
            <p>Diagnóstico, escopo, prazo e investimento são definidos antes de qualquer compromisso com o cliente.</p>
          </article>
          <article className={styles.card}>
            <span className={styles.toolIcon}><Handshake size={22} /></span>
            <h3>A parceria é remunerada</h3>
            <p>Na modalidade de indicação, a referência inicial é 10% do primeiro projeto após o pagamento, formalizada antes do fechamento.</p>
          </article>
        </div>
      </section>

      <section className={styles.splitSection}>
        <div>
          <span className={styles.eyebrow}>O QUE A NED PODE EXECUTAR</span>
          <h2>Estrutura técnica para complementar sua entrega.</h2>
          <p>
            Landing pages, sites institucionais, formulários, CRM, automações, painéis, integrações, diagnóstico interativo e soluções para operação de marketplaces.
          </p>
        </div>
        <aside className={styles.callout}>
          <Handshake size={28} />
          <strong>10% referência</strong>
          <p>A condição final depende do projeto e deve ser combinada por escrito antes da proposta ao cliente.</p>
        </aside>
      </section>

      <section className={styles.formSection} id="parceria">
        <div className={styles.formIntro}>
          <span className={styles.eyebrow}>APRESENTE SUA ATUAÇÃO</span>
          <h2>Vamos entender onde a parceria <span>encaixa.</span></h2>
          <p>
            O cadastro entra no CRM da NED com sua área, público e interesse. Não envie dados de clientes sem autorização; a primeira conversa deve ser apenas sobre a parceria.
          </p>
        </div>
        <CommercialLeadForm variant="partner" />
      </section>
    </CommercialPage>
  );
}
