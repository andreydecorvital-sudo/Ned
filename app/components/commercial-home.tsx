import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  Gauge,
  Handshake,
  MessageSquareText,
  SearchCheck,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import styles from "../commercial.module.css";

const machineFlow = [
  ["01", "Ser encontrado", "Google, Instagram, anúncios ou indicação."],
  ["02", "Convencer", "Oferta clara, página profissional e prova do que é entregue."],
  ["03", "Capturar", "Formulário, WhatsApp contextualizado e rastreamento de origem."],
  ["04", "Atender", "Pipeline, prioridade, histórico e follow-up para não perder oportunidades."],
];

const products = [
  {
    label: "ENTRADA DIGITAL",
    title: "NED Presença",
    price: "R$ 1.500",
    suffix: "a partir de",
    description: "Para empresas que ainda dependem apenas do Instagram ou possuem uma presença digital fraca.",
    features: ["Landing page responsiva", "Oferta e CTA organizados", "WhatsApp contextualizado", "Analytics e SEO básico"],
    href: "/maquina-de-clientes#planos",
  },
  {
    label: "PRODUTO PRINCIPAL",
    title: "NED Conversão",
    price: "R$ 2.500",
    suffix: "a partir de",
    description: "A estrutura completa para captar, organizar e acompanhar oportunidades comerciais.",
    features: ["Landing page comercial", "Diagnóstico e captura de leads", "CRM com pipeline", "Rastreamento e roteiros de atendimento"],
    href: "/maquina-de-clientes#diagnostico",
    featured: true,
  },
  {
    label: "PROCESSOS E INTEGRAÇÕES",
    title: "NED Automação",
    price: "Sob diagnóstico",
    suffix: "escopo personalizado",
    description: "Para negócios que perdem tempo em tarefas repetitivas, atendimento manual ou operação desconectada.",
    features: ["Mapeamento do processo", "Automação sob medida", "Integrações e painéis", "Implantação e suporte inicial"],
    href: "/servicos/automacoes",
  },
];

export default function CommercialHome() {
  return (
    <>
      <section className={styles.section} id="solucoes" data-theme="dark">
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>PRODUTO PRINCIPAL / NED</span>
            <h2 className={styles.sectionTitle}>
              Da descoberta ao <span>follow-up.</span>
            </h2>
          </div>
          <p>
            A Máquina de Clientes NED conecta presença digital, captação, WhatsApp e CRM em uma estrutura única. O objetivo não é apenas colocar um site no ar: é criar um caminho comercial que possa ser acompanhado e melhorado.
          </p>
        </div>

        <div className={styles.grid2}>
          <article className={styles.heroPanel}>
            <span className={styles.panelKicker}>MÁQUINA DE CLIENTES NED</span>
            <h3 className={styles.panelTitle}>Um sistema para transformar interesse em conversa.</h3>
            <div className={styles.heroActions}>
              <a className={styles.primary} href="/maquina-de-clientes">
                Conhecer a solução <ArrowRight size={16} />
              </a>
              <a className={styles.secondary} href="/analise-gratuita">
                Solicitar análise
              </a>
            </div>
          </article>

          <div className={styles.pipeline}>
            {machineFlow.map(([number, title, text]) => (
              <div className={styles.pipelineItem} key={number}>
                <span>{number}</span>
                <div>
                  <strong>{title}</strong>
                  <small>{text}</small>
                </div>
                <ArrowRight size={14} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionSoft} aria-labelledby="entradas-comerciais">
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>COMECE SEM ADIVINHAR</span>
            <h2 className={styles.sectionTitle} id="entradas-comerciais">
              Três formas de descobrir o <span>próximo passo.</span>
            </h2>
          </div>
          <p>
            Nem todo visitante está pronto para contratar. Por isso, o site oferece entradas diferentes para quem quer uma análise, uma pontuação objetiva ou uma solução operacional específica.
          </p>
        </div>

        <div className={styles.grid3}>
          <article className={styles.toolCard}>
            <span className={styles.toolIcon}><SearchCheck size={22} /></span>
            <h3>Análise gratuita</h3>
            <p>Envie seu site, Instagram ou marketplace. A NED registra o contexto e seleciona os pontos mais importantes para uma análise inicial.</p>
            <a className={styles.textLink} href="/analise-gratuita">Enviar meu negócio <ArrowRight size={15} /></a>
          </article>
          <article className={styles.toolCard}>
            <span className={styles.toolIcon}><Gauge size={22} /></span>
            <h3>NED Score</h3>
            <p>Responda um diagnóstico interativo e receba uma pontuação para oferta, presença digital, atendimento, dados e automação.</p>
            <a className={styles.textLink} href="/ned-score">Calcular meu Score <ArrowRight size={15} /></a>
          </article>
          <article className={styles.toolCard}>
            <span className={styles.toolIcon}><Wrench size={22} /></span>
            <h3>Marketplace Rescue</h3>
            <p>Uma entrada focada em catálogo, anúncios, cancelamentos, expedição, etiquetas e gargalos de Mercado Livre, Shopee e outras plataformas.</p>
            <a className={styles.textLink} href="/servicos/marketplaces">Analisar minha operação <ArrowRight size={15} /></a>
          </article>
        </div>
      </section>

      <section className={styles.section} id="produtos" data-theme="dark">
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>SOLUÇÕES COM ESCOPO CLARO</span>
            <h2 className={styles.sectionTitle}>Entenda o que você pode <span>comprar.</span></h2>
          </div>
          <p>
            Valores iniciais ajudam a filtrar expectativas. O investimento final depende do escopo, das integrações e do nível de personalização definido no diagnóstico.
          </p>
        </div>

        <div className={styles.grid3}>
          {products.map((product) => (
            <article
              className={`${styles.priceCard}${product.featured ? ` ${styles.priceCardFeatured}` : ""}`}
              key={product.title}
            >
              <span className={styles.priceLabel}>{product.label}</span>
              <h3>{product.title}</h3>
              <span className={styles.price}>{product.price} <small>{product.suffix}</small></span>
              <p>{product.description}</p>
              <ul className={styles.featureList}>
                {product.features.map((feature) => (
                  <li key={feature}><Check size={14} /> {feature}</li>
                ))}
              </ul>
              <a className={styles.textLink} href={product.href}>Ver solução <ArrowRight size={15} /></a>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.splitSection} data-theme="dark">
        <div>
          <span className={styles.eyebrow}>RECEITA RECORRENTE / EVOLUÇÃO</span>
          <h2>O projeto não precisa parar na publicação.</h2>
          <p>
            Após a implantação, a NED pode continuar acompanhando site, CRM, páginas, dados e melhorias de conversão. Assim, a estrutura evolui sem depender de um novo projeto para cada pequeno ajuste.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primary} href="/maquina-de-clientes#recorrencia">Conhecer planos mensais <ArrowRight size={15} /></a>
          </div>
        </div>
        <aside className={styles.callout}>
          <ShieldCheck size={28} />
          <strong>NED Care</strong>
          <p>Manutenção, pequenas alterações, revisão do CRM e acompanhamento técnico a partir de R$ 297 por mês.</p>
        </aside>
      </section>

      <section className={styles.sectionSoft} aria-labelledby="parceiros-home">
        <div className={styles.grid2}>
          <article className={styles.infoCard}>
            <Handshake size={30} />
            <h3 id="parceiros-home">Parceiros e indicações</h3>
            <p>Social medias, designers, gestores de tráfego, fotógrafos, contadores e consultores podem indicar projetos e receber comissão após o pagamento.</p>
            <div className={styles.heroActions}>
              <a className={styles.primary} href="/parceiros">Quero ser parceiro <ArrowRight size={15} /></a>
            </div>
          </article>
          <article className={styles.infoCard}>
            <MessageSquareText size={30} />
            <h3>Conversa com contexto</h3>
            <p>Todos os formulários entram no CRM com origem, campanha, serviço, necessidade e prioridade. A conversa começa com informação, não com uma mensagem vaga.</p>
            <div className={styles.heroActions}>
              <a className={styles.secondary} href="/analise-gratuita">Começar pela análise</a>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
