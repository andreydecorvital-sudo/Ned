import type { Metadata } from "next";
import { ArrowRight, Check, Eye, Gamepad2, MessageSquareText, Target } from "lucide-react";
import { CommercialPage } from "../../components/commercial-shell";
import styles from "./case.module.css";

export const metadata: Metadata = {
  title: "Case A Máquina Quebrada — estratégia, jogo e conversão",
  description:
    "Conheça o contexto, as decisões, a mecânica e os próximos passos da experiência interativa A Máquina Quebrada, criada pela NED Marketing.",
  alternates: { canonical: "/portfolio/maquina-quebrada" },
};

const journey = [
  ["01", "Observar", "O usuário entra em uma operação aparentemente normal e procura sinais de problema."],
  ["02", "Investigar", "Cada ponto revela sintoma, consequência e uma direção possível de melhoria."],
  ["03", "Decidir", "Três desafios transformam a leitura em escolhas sobre oferta, atendimento e operação."],
  ["04", "Interpretar", "A combinação das decisões gera pontuação, perfil e maior gargalo da simulação."],
];

const mechanics = [
  {
    icon: Eye,
    title: "Descoberta visual",
    text: "Os problemas ficam distribuídos pela cena. A pessoa precisa observar antes de receber a explicação.",
  },
  {
    icon: Gamepad2,
    title: "Escolhas com consequência",
    text: "As respostas não servem apenas para avançar. Elas alteram notas, perfil e diagnóstico final.",
  },
  {
    icon: MessageSquareText,
    title: "Conclusão conversável",
    text: "O resultado organiza uma mensagem para WhatsApp usando o gargalo identificado na própria experiência.",
  },
];

const currentDeliveries = [
  "Cena interativa com três pontos investigáveis",
  "Explicação de sintoma, consequência e solução",
  "Desafio de clareza da oferta",
  "Priorização de contatos de atendimento",
  "Ordenação de pedidos por risco operacional",
  "Pontuação final, perfil e gargalo principal",
  "Resultado compartilhável e CTA contextualizado",
  "Experiência responsiva e sem cadastro obrigatório",
];

const nextVersion = [
  "Mais variações de cenário para aumentar a rejogabilidade",
  "Feedback visual mais forte entre descoberta e decisão",
  "Cartão final compartilhável com leitura mais clara",
  "Modo de áudio opcional, sem bloquear a experiência silenciosa",
  "Instrumentação para entender abandono e dificuldade por etapa",
];

export default function BrokenMachineCasePage() {
  return (
    <CommercialPage>
      <section className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>ESTUDO DE CASO / NED LAB 001</span>
          <h1>A Máquina <span>Quebrada.</span></h1>
          <p className={styles.lead}>
            Um conteúdo interativo sobre oferta, atendimento e operação. O projeto transforma
            problemas empresariais abstratos em uma investigação jogável com escolhas e consequências.
          </p>
          <div className={styles.actions}>
            <a className={styles.primary} href="/lab/maquina-quebrada">
              Jogar experiência <ArrowRight size={17} />
            </a>
            <a className={styles.secondary} href="/portfolio">Voltar aos trabalhos</a>
          </div>
        </div>

        <div className={styles.heroVisual} aria-label="Representação da cena de investigação">
          <div className={styles.grid} aria-hidden="true" />
          <div className={styles.monitor} aria-hidden="true" />
          <div className={styles.phone} aria-hidden="true" />
          <div className={styles.box} aria-hidden="true" />
          <span className={styles.hotspot} style={{ top: "18%", left: "54%" }}><Target size={17} /></span>
          <span className={styles.hotspot} style={{ right: "9%", bottom: "48%" }}><Target size={17} /></span>
          <span className={styles.hotspot} style={{ bottom: "22%", left: "18%" }}><Target size={17} /></span>
          <span className={styles.visualCaption}>03 GARGALOS / 03 DECISÕES</span>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>O DESAFIO</span>
            <h2>Explicar problemas reais sem criar <span>mais uma lista genérica.</span></h2>
          </div>
          <p>
            Oferta confusa, atendimento sem prioridade e operação dependente de memória são problemas
            importantes, mas costumam ser comunicados de forma abstrata e pouco memorável.
          </p>
        </div>

        <div className={styles.twoColumn}>
          <article className={styles.card}>
            <span>01</span>
            <h3>Problema de comunicação</h3>
            <p>Um post tradicional poderia explicar os três gargalos, mas deixaria o visitante apenas consumindo uma conclusão pronta.</p>
          </article>
          <article className={styles.card}>
            <span>02</span>
            <h3>Direção escolhida</h3>
            <p>Fazer a pessoa observar, descobrir e decidir. O aprendizado deveria acontecer durante a interação, não apenas no texto final.</p>
          </article>
        </div>

        <div className={styles.quote}>
          Nem todo problema faz barulho. Alguns continuam funcionando enquanto afastam clientes.
        </div>
      </section>

      <div className={styles.softWrap}>
        <section className={styles.sectionSoft}>
          <div className={styles.sectionHead}>
            <div>
              <span className={styles.eyebrow}>JORNADA DA EXPERIÊNCIA</span>
              <h2>Da curiosidade ao <span>diagnóstico.</span></h2>
            </div>
            <p>Cada etapa possui uma função específica. Não existe clique decorativo sem relação com o que a pessoa precisa compreender.</p>
          </div>
          <div className={styles.journey}>
            {journey.map(([number, title, text]) => (
              <article className={styles.lightCard} key={number}>
                <span>{number}</span><h3>{title}</h3><p>{text}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>MECÂNICAS</span>
            <h2>O jogo como <span>meio, não enfeite.</span></h2>
          </div>
          <p>A mecânica precisa ajudar a explicar o problema, revelar capacidade de execução e conduzir para uma ação coerente.</p>
        </div>
        <div className={styles.threeColumn}>
          {mechanics.map(({ icon: Icon, title, text }, index) => (
            <article className={styles.card} key={title}>
              <span><Icon size={22} /></span><h3>{String(index + 1).padStart(2, "0")} / {title}</h3><p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <div className={styles.softWrap}>
        <section className={styles.sectionSoft}>
          <div className={styles.sectionHead}>
            <div>
              <span className={styles.eyebrow}>O QUE FOI CONSTRUÍDO</span>
              <h2>Entrega verificável. <span>Sem resultado inventado.</span></h2>
            </div>
            <p>O projeto é próprio da NED. Ele comprova raciocínio, design e desenvolvimento da experiência, mas não é apresentado como resultado comercial de cliente.</p>
          </div>
          <div className={styles.twoColumn}>
            <article className={styles.lightCard}>
              <span>ATUAL</span>
              <h3>Versão publicada</h3>
              <ul className={styles.list}>
                {currentDeliveries.map((item) => <li key={item}><Check size={14} /> {item}</li>)}
              </ul>
            </article>
            <article className={styles.lightCard}>
              <span>PRÓXIMA ITERAÇÃO</span>
              <h3>Evolução planejada</h3>
              <ul className={styles.list}>
                {nextVersion.map((item) => <li key={item}><Check size={14} /> {item}</li>)}
              </ul>
            </article>
          </div>
        </section>
      </div>

      <section className={styles.finalCta}>
        <div>
          <span className={styles.eyebrow}>EXPERIMENTE ANTES DE JULGAR</span>
          <h2>Encontre os gargalos. <span>Depois tome as decisões.</span></h2>
        </div>
        <div>
          <p>A experiência leva poucos minutos, funciona sem cadastro e apresenta o resultado com base apenas nas escolhas da simulação.</p>
          <div className={styles.actions}>
            <a className={styles.primary} href="/lab/maquina-quebrada">Jogar agora <ArrowRight size={17} /></a>
            <a className={styles.secondary} href="/analise-gratuita">Analisar minha empresa</a>
          </div>
        </div>
      </section>
    </CommercialPage>
  );
}
