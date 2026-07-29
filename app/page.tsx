import {
  ArrowRight,
  BarChart3,
  Bot,
  MessageCircle,
  MonitorSmartphone,
  ShoppingBag,
} from "lucide-react";

const whatsappUrl = "https://wa.me/55XXXXXXXXXXX";

const services = [
  {
    icon: MonitorSmartphone,
    number: "01",
    title: "Sites que trabalham por você",
    text: "Landing pages e sites institucionais pensados para transformar atenção em conversa e conversa em venda.",
  },
  {
    icon: Bot,
    number: "02",
    title: "Automações que economizam tempo",
    text: "Processos conectados, atendimento mais rápido e menos tarefas repetitivas na sua operação.",
  },
  {
    icon: BarChart3,
    number: "03",
    title: "Tráfego com estratégia",
    text: "Campanhas orientadas por dados, posicionamento e conversão — não por métricas de vaidade.",
  },
  {
    icon: ShoppingBag,
    number: "04",
    title: "Marketplaces com visão de negócio",
    text: "Estrutura, catálogo, anúncios e operação para vender melhor em Mercado Livre, Shopee, Amazon e TikTok Shop.",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Ned Marketing — início">
          <span className="brand-main">NED</span>
          <span className="brand-sub">MARKETING</span>
        </a>

        <nav aria-label="Navegação principal">
          <a href="#servicos">Serviços</a>
          <a href="#processo">Processo</a>
          <a href="#marketplaces">Marketplaces</a>
        </nav>

        <a className="header-cta" href={whatsappUrl} target="_blank" rel="noreferrer">
          Falar com Ned <ArrowRight size={17} />
        </a>
      </header>

      <section className="hero paper" id="inicio">
        <div className="hero-copy">
          <span className="eyebrow">ESTRATÉGIA • DESIGN • PERFORMANCE</span>
          <h1>
            Não fazemos marketing <span>barulhento.</span>
            <br />
            Construímos sistemas que vendem.
          </h1>
          <p>
            Sites, automações, tráfego e marketplaces para empresas que querem crescer com estrutura — e não depender de improviso.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href={whatsappUrl} target="_blank" rel="noreferrer">
              Começar um projeto <ArrowRight size={18} />
            </a>
            <a className="button button-secondary" href="#servicos">Conhecer serviços</a>
          </div>
        </div>

        <div className="target" aria-hidden="true">
          <div className="target-ring ring-one" />
          <div className="target-ring ring-two" />
          <div className="target-ring ring-three" />
          <div className="target-line target-line-x" />
          <div className="target-line target-line-y" />
          <span className="target-word word-top">FOCO</span>
          <span className="target-word word-right">DADOS</span>
          <span className="target-word word-bottom">RESULTADOS</span>
          <span className="target-word word-left">PROCESSOS</span>
          <span className="target-plus">+</span>
        </div>
      </section>

      <section className="services dark-section" id="servicos">
        <div className="section-heading">
          <span className="eyebrow purple">O QUE CONSTRUÍMOS</span>
          <h2>Marketing não é postagem.<br />É <span>estrutura.</span></h2>
          <p>Cada serviço da Ned existe para resolver uma parte real da operação e fazer o negócio avançar.</p>
        </div>

        <div className="service-grid">
          {services.map(({ icon: Icon, number, title, text }) => (
            <article className="service-card" key={number}>
              <div className="card-top">
                <Icon size={30} strokeWidth={1.6} />
                <span>{number}</span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="process paper" id="processo">
        <div className="section-heading dark-copy">
          <span className="eyebrow">COMO TRABALHAMOS</span>
          <h2>Menos achismo.<br /><span>Mais processo.</span></h2>
        </div>
        <div className="steps">
          {[
            ["01", "Diagnóstico", "Entendemos sua operação, oferta, gargalos e objetivo real."],
            ["02", "Estratégia", "Definimos o sistema, as prioridades e o caminho mais eficiente."],
            ["03", "Execução", "Construímos, integramos e lançamos com atenção aos detalhes."],
            ["04", "Otimização", "Acompanhamos dados, corrigimos e buscamos crescimento contínuo."],
          ].map(([number, title, text]) => (
            <article className="step" key={number}>
              <span className="step-number">{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="marketplaces dark-section" id="marketplaces">
        <div className="market-copy">
          <span className="eyebrow purple">MARKETPLACES</span>
          <h2>Quem vende online precisa de operação. Não só de anúncio.</h2>
          <p>
            Organizamos presença, catálogo, criativos, tráfego e processos para transformar marketplaces em um canal de crescimento sustentável.
          </p>
          <div className="platforms" aria-label="Plataformas atendidas">
            <span>Mercado Livre</span><span>Shopee</span><span>Amazon</span><span>TikTok Shop</span>
          </div>
        </div>
        <div className="market-panel">
          <span className="panel-kicker">OPERAÇÃO CONECTADA</span>
          <strong>Catálogo</strong>
          <span className="connector" />
          <strong>Anúncios</strong>
          <span className="connector" />
          <strong>Dados</strong>
          <span className="connector" />
          <strong>Escala</strong>
        </div>
      </section>

      <section className="cta paper">
        <span className="eyebrow">CASES E PORTFÓLIO</span>
        <h2>Quer conhecer nossos projetos e resultados?</h2>
        <p>Converse diretamente com Ned e receba uma apresentação selecionada para o seu tipo de negócio.</p>
        <a className="button button-primary" href={whatsappUrl} target="_blank" rel="noreferrer">
          <MessageCircle size={19} /> Conversar no WhatsApp
        </a>
      </section>

      <footer>
        <a className="brand footer-brand" href="#inicio">
          <span className="brand-main">NED</span>
          <span className="brand-sub">MARKETING</span>
        </a>
        <p>Sites, automações e tráfego para empresas que querem crescer.</p>
        <span>© {new Date().getFullYear()} Ned Marketing</span>
      </footer>
    </main>
  );
}
