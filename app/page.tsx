"use client";

import { ArrowDown, ArrowRight, Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import CommercialHome from "./components/commercial-home";
import DiagnosticForm from "./components/diagnostic-form";
import PortfolioPreview from "./components/portfolio-preview";

const whatsappNumber = "5511917814612";

const whatsappUrl = (message: string) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

const navigation = [
  { label: "Serviços", href: "/servicos" },
  { label: "Processo", href: "/processo" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "NED Score", href: "/ned-score" },
];

const steps = [
  ["01", "Diagnóstico", "Entendemos marca, público, oferta, canais, gargalos e objetivo real."],
  ["02", "Estratégia", "Definimos prioridades, mensagem, frentes de atuação e o caminho mais coerente."],
  ["03", "Execução", "Criamos, publicamos e conectamos as entregas com atenção aos detalhes."],
  ["04", "Otimização", "Acompanhamos dados, aprendizados e oportunidades para melhorar a próxima decisão."],
];

function StaticTarget() {
  return (
    <div className="target-stage" aria-hidden="true">
      <div className="target target-back">
        <div className="target-ring ring-one" />
        <div className="target-ring ring-two" />
        <div className="target-ring ring-three" />
        <div className="target-line target-line-x" />
        <div className="target-line target-line-y" />
        <span className="target-word word-top">MARCA</span>
        <span className="target-word word-right">MÍDIA</span>
        <span className="target-word word-bottom">CRESCIMENTO</span>
        <span className="target-word word-left">ESTRATÉGIA</span>
        <span className="target-plus">+</span>
        <span className="target-index">NED / MARKETING</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const contactUrl = whatsappUrl(
    "Olá, Ned! Conheci o site e quero conversar sobre marketing para minha empresa.",
  );

  return (
    <main className="page-is-ready">
      <header className="site-header">
        <a className="brand" href="/" aria-label="NED Marketing — início">
          <span className="brand-main">NED</span>
          <span className="brand-sub">MARKETING</span>
        </a>

        <nav aria-label="Navegação principal">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>

        <a className="header-cta" href="/analise-gratuita">
          <span>Solicitar análise</span> <ArrowRight size={17} />
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {menuOpen && (
        <div className="mobile-menu" data-theme="dark">
          <span className="mobile-menu-kicker">NAVEGAÇÃO / NED</span>
          <div className="mobile-menu-links">
            {navigation.map((item, index) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label} <span>{String(index + 1).padStart(2, "0")}</span>
              </a>
            ))}
          </div>
          <a className="mobile-menu-cta" href="/analise-gratuita">
            Solicitar análise <ArrowRight />
          </a>
        </div>
      )}

      <section className="hero paper" id="inicio">
        <div className="hero-grid-mark" aria-hidden="true" />
        <div className="hero-copy">
          <span className="eyebrow">ESTRATÉGIA • CRIAÇÃO • PERFORMANCE</span>
          <h1>
            Marketing que chama atenção.
            <br />
            E transforma interesse em <span>crescimento.</span>
          </h1>
          <p>
            Estratégia, posicionamento, conteúdo, presença digital, tráfego e marketplaces para empresas que querem ser encontradas, escolhidas e lembradas.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="/analise-gratuita">
              Solicitar análise <ArrowRight size={18} />
            </a>
            <a className="button button-secondary" href="/servicos">
              Conhecer nossos serviços
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <StaticTarget />
        </div>

        <a className="scroll-indicator" href="#servicos">
          <span>SCROLL PARA EXPLORAR</span>
          <span><ArrowDown size={15} /></span>
        </a>
      </section>

      <div className="capability-strip" data-theme="dark" aria-label="Áreas de atuação">
        <div className="capability-track">
          {["ESTRATÉGIA", "POSICIONAMENTO", "CONTEÚDO", "TRÁFEGO", "SITES", "MARKETPLACES", "ESTRATÉGIA", "POSICIONAMENTO", "CONTEÚDO", "TRÁFEGO", "SITES", "MARKETPLACES"].map((item, index) => (
            <span key={`${item}-${index}`}>{item}<b>+</b></span>
          ))}
        </div>
      </div>

      <div id="servicos">
        <CommercialHome />
        <PortfolioPreview />
      </div>

      <section className="process paper" id="processo">
        <div className="section-heading dark-copy">
          <span className="eyebrow">COMO TRABALHAMOS</span>
          <h2>Menos achismo.<br /><span>Mais direção.</span></h2>
          <p>Cada etapa termina com uma decisão, uma entrega ou um próximo passo claro.</p>
        </div>

        <div className="steps">
          {steps.map(([number, title, text]) => (
            <article className="step" key={number}>
              <span className="step-number">{number}</span>
              <span className="step-line" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="marketplaces dark-section" id="marketplaces" data-theme="dark">
        <div className="market-copy">
          <span className="eyebrow purple">MARKETPLACES</span>
          <h2>Quem vende online precisa de presença, comunicação e operação.</h2>
          <p>
            Organizamos catálogo, anúncios, criativos, tráfego, reputação e rotina comercial para transformar marketplaces em um canal mais consistente para a marca.
          </p>
          <div className="platforms" aria-label="Plataformas atendidas">
            <span>Mercado Livre</span><span>Shopee</span><span>Amazon</span><span>TikTok Shop</span>
          </div>
          <div className="hero-actions">
            <a className="button button-primary" href="/servicos/marketplaces">
              Conhecer o serviço <ArrowRight size={17} />
            </a>
          </div>
        </div>

        <div className="market-panel" aria-label="Frentes de atuação em marketplaces">
          <div className="panel-orbit orbit-one" />
          <div className="panel-orbit orbit-two" />
          <span className="panel-kicker">MARKETING E OPERAÇÃO</span>
          {["Posicionamento", "Catálogo", "Campanhas", "Otimização"].map((item, index) => (
            <div className="flow-item" key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
              {index < 3 && <i />}
            </div>
          ))}
        </div>
      </section>

      <section className="diagnostic paper" id="diagnostico">
        <div className="diagnostic-copy">
          <span className="eyebrow">COMECE PELA ANÁLISE</span>
          <h2>Cinco etapas.<br /><span>Uma conversa melhor.</span></h2>
          <p>
            Conte sobre o negócio, o objetivo e o principal desafio. A NED usa esse contexto para identificar prioridades antes de recomendar qualquer serviço.
          </p>
          <div className="diagnostic-benefits">
            <span>01</span><p>Leva poucos minutos e organiza o momento da empresa.</p>
            <span>02</span><p>Ajuda a identificar a prioridade de marketing.</p>
            <span>03</span><p>A conversa começa com contexto, não com pacote pronto.</p>
          </div>
        </div>

        <div>
          <DiagnosticForm />
        </div>
      </section>

      <section className="cta paper">
        <div>
          <span className="eyebrow">NED SCORE / DIAGNÓSTICO DE MARKETING</span>
          <h2>Descubra onde sua marca está perdendo força.</h2>
          <p>Responda oito perguntas e receba uma leitura inicial sobre oferta, posicionamento, presença, aquisição, atendimento e consistência.</p>
          <a className="button button-primary" href="/ned-score">
            Calcular meu NED Score <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <footer data-theme="dark">
        <div className="footer-identity">
          <a className="brand footer-brand" href="/">
            <span className="brand-main">NED</span>
            <span className="brand-sub">MARKETING</span>
          </a>
          <p>Estratégia, criação, presença digital, tráfego e marketplaces para marcas que querem crescer com mais direção.</p>
        </div>
        <div className="footer-links">
          {navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </div>
        <div className="footer-meta">
          <a href={contactUrl} target="_blank" rel="noreferrer">+55 11 91781-4612</a>
          <span>Atendimento em todo o Brasil</span>
          <span>© {new Date().getFullYear()} NED Marketing</span>
        </div>
      </footer>

      <a
        className="whatsapp-float"
        href={contactUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar com a NED Marketing pelo WhatsApp"
      >
        <MessageCircle size={21} />
        <span>Falar com Ned</span>
      </a>
    </main>
  );
}
