import {
  ArrowRight,
  Gauge,
  Handshake,
  Megaphone,
  MessageSquareText,
  SearchCheck,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import styles from "../commercial.module.css";
import marketingStyles from "./marketing-home.module.css";

const marketingJourney = [
  ["01", "Atrair", "Conteúdo, mídia, Google, redes sociais, indicação e marketplaces."],
  ["02", "Posicionar", "Mensagem, oferta e identidade para a marca ser entendida e lembrada."],
  ["03", "Converter", "Páginas, campanhas e chamadas que conduzem para uma ação clara."],
  ["04", "Relacionar", "Atendimento, acompanhamento e experiência para não desperdiçar interesse."],
];

const marketingFronts = [
  {
    seal: "/brand/seals/ned-seal-focus.webp",
    accent: "institutional",
    number: "01",
    label: "ESTRATÉGIA E POSICIONAMENTO",
    title: "Definir o que sua marca precisa representar.",
    description:
      "Organizamos público, proposta de valor, diferenciais, mensagem e prioridades para que as ações de marketing tenham uma direção comum.",
    tags: ["Diagnóstico", "Posicionamento", "Oferta", "Planejamento"],
    href: "/analise-gratuita",
  },
  {
    seal: "/brand/seals/ned-seal-spiral.webp",
    accent: "content",
    number: "02",
    label: "CONTEÚDO E CRIAÇÃO",
    title: "Transformar estratégia em comunicação que chama atenção.",
    description:
      "Direção criativa, campanhas, peças, roteiros e conteúdo para apresentar a marca com mais clareza, personalidade e consistência.",
    tags: ["Campanhas", "Criativos", "Conteúdo", "Copy"],
    href: "/portfolio",
  },
  {
    seal: "/brand/seals/ned-seal-sites.webp",
    accent: "sites",
    number: "03",
    label: "PRESENÇA DIGITAL E CONVERSÃO",
    title: "Facilitar a decisão de quem já demonstrou interesse.",
    description:
      "Sites e landing pages que explicam a oferta, fortalecem a percepção da marca e conduzem o visitante para o próximo passo.",
    tags: ["Sites", "Landing pages", "WhatsApp", "Experiência"],
    href: "/servicos/sites",
  },
  {
    seal: "/brand/seals/ned-seal-automation-flow.webp",
    accent: "automation",
    number: "04",
    label: "TRÁFEGO E AQUISIÇÃO",
    title: "Levar a mensagem certa para pessoas com potencial real.",
    description:
      "Planejamento de mídia e campanhas conectadas à oferta, ao criativo, à página e à capacidade de atendimento do negócio.",
    tags: ["Meta Ads", "Google Ads", "Públicos", "Campanhas"],
    href: "/servicos/trafego-pago",
  },
  {
    seal: "/brand/seals/ned-seal-marketplaces.webp",
    accent: "marketplaces",
    number: "05",
    label: "MARKETPLACES E VENDAS",
    title: "Melhorar presença, comunicação e desempenho nos canais de venda.",
    description:
      "Estratégia para catálogo, anúncios, criativos, reputação e operação em Mercado Livre, Shopee, Amazon e TikTok Shop.",
    tags: ["Catálogo", "Anúncios", "Criativos", "Operação"],
    href: "/servicos/marketplaces",
  },
  {
    seal: "/brand/seals/ned-seal-systems.webp",
    accent: "systems",
    number: "06",
    label: "MENSURAÇÃO E OTIMIZAÇÃO",
    title: "Usar dados para melhorar a próxima decisão de marketing.",
    description:
      "Acompanhamos origem, comportamento, contatos e qualidade das oportunidades para corrigir mensagens, páginas e campanhas.",
    tags: ["Analytics", "Conversão", "Testes", "Aprendizado"],
    href: "/processo",
  },
];

export default function CommercialHome() {
  return (
    <>
      <section className={styles.section} id="solucoes" data-theme="dark">
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>MARKETING INTEGRADO / NED</span>
            <h2 className={styles.sectionTitle}>
              Atenção não basta. Sua marca precisa ser <span>escolhida.</span>
            </h2>
          </div>
          <p>
            A NED conecta estratégia, criação, presença digital, mídia e acompanhamento comercial. A tecnologia entra quando ajuda a executar melhor — nunca como substituta de uma boa ideia, uma oferta clara ou uma marca relevante.
          </p>
        </div>

        <div className={styles.grid2}>
          <article className={styles.heroPanel}>
            <span className={styles.panelKicker}>ESTRATÉGIA DE CRESCIMENTO NED</span>
            <h3 className={styles.panelTitle}>Marketing para atrair, convencer e manter sua marca em movimento.</h3>
            <div className={styles.heroActions}>
              <a className={styles.primary} href="/servicos">
                Conhecer os serviços <ArrowRight size={16} />
              </a>
              <a className={styles.secondary} href="/analise-gratuita">
                Solicitar análise
              </a>
            </div>
          </article>

          <div className={styles.pipeline}>
            {marketingJourney.map(([number, title, text]) => (
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
            <span className={styles.eyebrow}>COMECE PELO CONTEXTO</span>
            <h2 className={styles.sectionTitle} id="entradas-comerciais">
              Entenda o que melhorar <span>primeiro.</span>
            </h2>
          </div>
          <p>
            Nem toda empresa precisa da mesma solução. Por isso, o site oferece caminhos para analisar a marca, identificar gargalos e conhecer a forma de trabalho antes de conversar sobre investimento.
          </p>
        </div>

        <div className={styles.grid3}>
          <article className={styles.toolCard}>
            <span className={styles.toolIcon}><SearchCheck size={22} /></span>
            <h3>Análise inicial</h3>
            <p>Envie seu site, Instagram ou marketplace. A NED observa posicionamento, comunicação, jornada e oportunidades mais evidentes.</p>
            <a className={styles.textLink} href="/analise-gratuita">Enviar meu negócio <ArrowRight size={15} /></a>
          </article>
          <article className={styles.toolCard}>
            <span className={styles.toolIcon}><Gauge size={22} /></span>
            <h3>NED Score</h3>
            <p>Responda um diagnóstico interativo e receba uma leitura inicial sobre oferta, presença, aquisição, atendimento e consistência.</p>
            <a className={styles.textLink} href="/ned-score">Calcular meu Score <ArrowRight size={15} /></a>
          </article>
          <article className={styles.toolCard}>
            <span className={styles.toolIcon}><Megaphone size={22} /></span>
            <h3>Portfólio vivo</h3>
            <p>Veja experiências, campanhas conceituais e ferramentas próprias que demonstram estratégia, direção criativa e capacidade de execução.</p>
            <a className={styles.textLink} href="/portfolio">Ver projetos <ArrowRight size={15} /></a>
          </article>
        </div>
      </section>

      <section className={marketingStyles.marketingSection} id="frentes" data-theme="dark">
        <div className={marketingStyles.marketingEditorial}>
          <div className={marketingStyles.marketingEditorialIntro}>
            <Image
              className={marketingStyles.marketingEditorialSeal}
              src="/brand/seals/ned-seal-wordmark.webp"
              alt=""
              width={132}
              height={132}
              aria-hidden="true"
            />
            <span className={styles.eyebrow}>COMO A NED PODE ATUAR</span>
            <h2>Uma estratégia. Diferentes frentes de <span>marketing.</span></h2>
            <p>
              O escopo é definido após a análise do negócio. Podemos atuar em uma necessidade específica ou conectar várias frentes quando isso fizer sentido para o objetivo e para o momento da empresa.
            </p>
            <a className={styles.primary} href="/analise-gratuita">
              Analisar meu momento <ArrowRight size={16} />
            </a>
          </div>

          <div className={marketingStyles.marketingDirectionList}>
            {marketingFronts.map(({ seal, accent, number, label, title, description, tags, href }) => (
              <article className={marketingStyles.marketingDirection} data-accent={accent} key={number}>
                <span className={marketingStyles.marketingDirectionIcon} aria-hidden="true">
                  <Image src={seal} alt="" width={72} height={72} />
                </span>
                <div className={marketingStyles.marketingDirectionBody}>
                  <span className={marketingStyles.marketingDirectionLabel}>{number} / {label}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <ul className={marketingStyles.marketingTags}>
                    {tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                </div>
                <a className={marketingStyles.marketingDirectionLink} href={href} aria-label={`Conhecer ${label.toLowerCase()}`}>
                  <ArrowRight size={19} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.splitSection} data-theme="dark">
        <div>
          <span className={styles.eyebrow}>ACOMPANHAMENTO E EVOLUÇÃO</span>
          <h2>Marketing melhora quando existe continuidade.</h2>
          <p>
            Depois de uma entrega ou campanha, a NED pode continuar acompanhando conteúdo, páginas, mídia, dados e oportunidades de melhoria. A frequência, o escopo e o investimento são definidos após análise.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primary} href="/maquina-de-clientes#continuidade">Entender o acompanhamento <ArrowRight size={15} /></a>
          </div>
        </div>
        <aside className={styles.callout}>
          <TrendingUp size={28} />
          <strong>Marketing contínuo</strong>
          <p>Planejamento, criação, campanhas, páginas e otimizações organizadas conforme a prioridade real da empresa.</p>
        </aside>
      </section>

      <section className={styles.sectionSoft} aria-labelledby="parceiros-home">
        <div className={styles.grid2}>
          <article className={styles.infoCard}>
            <Handshake size={30} />
            <h3 id="parceiros-home">Parceiros e indicações</h3>
            <p>Social medias, designers, fotógrafos, gestores de tráfego, contadores e consultores podem indicar projetos ou construir entregas em conjunto com a NED.</p>
            <div className={styles.heroActions}>
              <a className={styles.primary} href="/parceiros">Quero ser parceiro <ArrowRight size={15} /></a>
            </div>
          </article>
          <article className={styles.infoCard}>
            <MessageSquareText size={30} />
            <h3>Conversa com contexto</h3>
            <p>Antes de propor qualquer serviço, entendemos o negócio, o objetivo, o público, o desafio e a prioridade. A proposta nasce da análise — não de um pacote pronto.</p>
            <div className={styles.heroActions}>
              <a className={styles.secondary} href="/analise-gratuita">Começar pela análise</a>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
