import type { Metadata } from "next";
import { ArrowRight, Check, LayoutTemplate, Megaphone, MessageSquareText, Target } from "lucide-react";
import { CommercialPage } from "../../components/commercial-shell";
import styles from "../../client-pages.module.css";

export const metadata: Metadata = {
  title: "Marketing e conteúdo — posicionamento, campanhas e criativos",
  description:
    "Posicionamento, direção criativa, campanhas, conteúdo e peças comerciais para marcas que precisam comunicar melhor o que vendem.",
  alternates: { canonical: "/servicos/marketing-conteudo" },
};

const deliveries = [
  {
    icon: Target,
    title: "Posicionamento e mensagem",
    text: "Público, proposta de valor, diferenciais, oferta principal, tom de voz e mensagem que precisa ser repetida com consistência.",
  },
  {
    icon: Megaphone,
    title: "Campanhas e direção criativa",
    text: "Conceito, promessa, ângulos de comunicação, hierarquia de textos e direção visual para uma ação ou período comercial.",
  },
  {
    icon: LayoutTemplate,
    title: "Peças e calendário",
    text: "Criativos estáticos, carrosséis, Stories, anúncios, capas, peças informativas e organização do que será publicado.",
  },
  {
    icon: MessageSquareText,
    title: "Copy e chamadas para ação",
    text: "Títulos, legendas, anúncios, textos de apoio e CTAs conectados ao objetivo real da campanha ou conteúdo.",
  },
];

const fit = [
  "A marca publica, mas a comunicação não parece ter uma direção.",
  "A empresa tem uma boa entrega, porém explica mal o que vende.",
  "O conteúdo está visualmente aceitável, mas não gera entendimento ou conversa.",
  "Existe uma campanha, lançamento ou oferta que precisa de conceito e peças.",
  "A empresa quer parar de depender de ideias soltas e urgências semanais.",
];

export default function MarketingContentPage() {
  return (
    <CommercialPage>
      <section className={`${styles.hero} ${styles.heroCompact}`}>
        <div>
          <span className={styles.eyebrow}>SERVIÇO / MARKETING E CONTEÚDO</span>
          <h1>Comunicação bonita não basta. <span>Ela precisa cumprir uma função.</span></h1>
          <p className={styles.heroLead}>
            A NED transforma posicionamento e objetivo comercial em campanhas, conteúdo e peças que ajudam o público a entender, lembrar e escolher a marca.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="/analise-gratuita">Solicitar análise <ArrowRight size={17} /></a>
            <a className={styles.secondaryButton} href="/portfolio">Ver trabalhos</a>
          </div>
        </div>
        <aside className={styles.heroPanel}>
          <span className={styles.panelLabel}>ENTREGAS POSSÍVEIS</span>
          <div className={styles.panelStack}>
            {deliveries.map((item, index) => (
              <div className={styles.panelItem} key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong><small>{item.text}</small>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className={styles.pageSection}>
        <div className={styles.sectionHead}>
          <div><span className={styles.eyebrow}>O QUE PODE SER ENTREGUE</span><h2 className={styles.sectionTitle}>Da direção à <span>peça final.</span></h2></div>
          <p>O projeto não precisa incluir tudo. As entregas são combinadas conforme o objetivo, a frequência, os canais e os materiais que a empresa já possui.</p>
        </div>
        <div className={styles.valueGrid}>
          {deliveries.map(({ icon: Icon, title, text }) => (
            <article className={styles.valueCard} key={title}>
              <span className={styles.cardIcon}><Icon size={22} /></span><h3>{title}</h3><p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.pageSectionDark}>
        <div className={styles.sectionHead}>
          <div><span className={styles.eyebrow}>QUANDO FAZ SENTIDO</span><h2 className={styles.sectionTitle}>Sinais de que a marca precisa <span>organizar a comunicação.</span></h2></div>
          <p>O problema nem sempre é falta de postagem. Muitas vezes é ausência de prioridade, mensagem ou continuidade entre o que a empresa promete e o que mostra.</p>
        </div>
        <ul className={styles.checkList}>
          {fit.map((item) => <li key={item}><Check size={15} /> {item}</li>)}
        </ul>
      </section>

      <section className={styles.pageSectionSoft}>
        <div className={styles.ctaBand}>
          <div><h2>Mostre como sua marca comunica hoje.</h2><p>A NED analisa o cenário antes de recomendar campanha, frequência, formato ou volume de produção.</p></div>
          <a className={styles.secondaryButton} href="/analise-gratuita">Solicitar análise <ArrowRight size={16} /></a>
        </div>
      </section>
    </CommercialPage>
  );
}
