"use client";

import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  Bot,
  Menu,
  MessageCircle,
  MonitorSmartphone,
  ShoppingBag,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import {
  useEffect,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import DiagnosticForm from "./components/diagnostic-form";

const whatsappNumber = "5511917814612";

const whatsappUrl = (message: string) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

const navigation = [
  { id: "servicos", label: "Serviços" },
  { id: "processo", label: "Processo" },
  { id: "marketplaces", label: "Marketplaces" },
  { id: "diagnostico", label: "Diagnóstico" },
];

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

const steps = [
  ["01", "Diagnóstico", "Entendemos sua operação, oferta, gargalos e objetivo real."],
  ["02", "Estratégia", "Definimos o sistema, as prioridades e o caminho mais eficiente."],
  ["03", "Execução", "Construímos, integramos e lançamos com atenção aos detalhes."],
  ["04", "Otimização", "Acompanhamos dados, corrigimos e buscamos crescimento contínuo."],
];

const manifestoLines = [
  ["01", "Site bonito sem estratégia", "é decoração."],
  ["02", "Tráfego sem estrutura", "é desperdício."],
  ["03", "Automação sem processo", "é confusão em alta velocidade."],
];

const reveal = {
  hidden: { opacity: 0, y: 42 },
  visible: { opacity: 1, y: 0 },
};

function Loader({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, delay: 0.18 } }}
          aria-hidden="true"
        >
          <motion.div
            className="loader-brand"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>NED</span>
            <small>MARKETING</small>
          </motion.div>
          <motion.div
            className="loader-line"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.85, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 460, damping: 34, mass: 0.18 });
  const ringY = useSpring(y, { stiffness: 460, damping: 34, mass: 0.18 });
  const [label, setLabel] = useState("");
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const [light, setLight] = useState(false);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);

      const element = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
      const interactive = element?.closest<HTMLElement>("[data-cursor]");
      setLabel(interactive?.dataset.cursor ?? "");
      setActive(Boolean(interactive));
      setLight(Boolean(element?.closest('[data-theme="dark"]')));
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [x, y]);

  return (
    <div
      className={`custom-cursor${visible ? " is-visible" : ""}${active ? " is-active" : ""}${light ? " is-light" : ""}`}
      aria-hidden="true"
    >
      <motion.span className="cursor-dot" style={{ x, y }} />
      <motion.span className="cursor-ring" style={{ x: ringX, y: ringY }}>
        <span>{label}</span>
      </motion.span>
    </div>
  );
}

function MagneticLink({
  href,
  children,
  className,
  external = false,
  cursorLabel = "ABRIR",
  trackingSource,
}: {
  href: string;
  children: ReactNode;
  className: string;
  external?: boolean;
  cursorLabel?: string;
  trackingSource?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 360, damping: 24 });
  const springY = useSpring(y, { stiffness: 360, damping: 24 });

  const onMove = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.14);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.2);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      className={className}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      data-cursor={cursorLabel}
      data-track={trackingSource}
    >
      {children}
    </motion.a>
  );
}

function InteractiveTarget() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 90, damping: 18 });
  const smoothY = useSpring(y, { stiffness: 90, damping: 18 });

  const move = (event: ReactMouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientX - rect.left) / rect.width - 0.5) * 26);
    y.set(((event.clientY - rect.top) / rect.height - 0.5) * 26);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="target-stage" onMouseMove={move} onMouseLeave={reset} data-cursor="MOVER">
      <motion.div className="target target-back" style={{ x: smoothX, y: smoothY }} aria-hidden="true">
        <div className="target-ring ring-one" />
        <motion.div
          className="target-ring ring-two"
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="target-ring ring-three"
          style={{ x: smoothX, y: smoothY }}
          animate={{ scale: [1, 1.045, 1] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="target-line target-line-x" />
        <div className="target-line target-line-y" />
        <span className="target-word word-top">FOCO</span>
        <span className="target-word word-right">DADOS</span>
        <span className="target-word word-bottom">RESULTADOS</span>
        <span className="target-word word-left">PROCESSOS</span>
        <span className="target-plus">+</span>
        <span className="target-index">NED / 001</span>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");

  useEffect(() => {
    const introSeen = window.sessionStorage.getItem("ned-intro-seen");
    const delay = prefersReducedMotion || introSeen ? 80 : 1450;
    const timeout = window.setTimeout(() => {
      setLoading(false);
      window.sessionStorage.setItem("ned-intro-seen", "true");
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const sectionIds = ["inicio", "servicos", "processo", "marketplaces", "diagnostico"];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries[0]?.target.id) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      { rootMargin: "-25% 0px -58% 0px", threshold: [0.08, 0.2, 0.45] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const startProjectUrl = whatsappUrl(
    "Olá, Ned! Conheci o site e quero conversar sobre um projeto para minha empresa.",
  );
  const portfolioUrl = whatsappUrl(
    "Olá, Ned! Quero conhecer os cases e o portfólio da Ned Marketing.",
  );

  return (
    <>
      <Loader visible={loading} />
      <CustomCursor />

      <main className={loading ? "page-is-loading" : "page-is-ready"}>
        <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
          <a className="brand" href="#inicio" aria-label="Ned Marketing — início" data-cursor="TOPO">
            <span className="brand-main">NED</span>
            <span className="brand-sub">MARKETING</span>
          </a>

          <nav aria-label="Navegação principal">
            {navigation.map((item) => (
              <a
                key={item.id}
                className={activeSection === item.id ? "is-active" : undefined}
                href={`#${item.id}`}
                data-cursor="VER"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <MagneticLink
            className="header-cta"
            href={startProjectUrl}
            external
            cursorLabel="CHAMAR"
            trackingSource="header"
          >
            <span>Falar com Ned</span> <ArrowRight size={17} />
          </MagneticLink>

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

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="mobile-menu"
              initial={{ clipPath: "inset(0 0 100% 0)" }}
              animate={{ clipPath: "inset(0 0 0% 0)" }}
              exit={{ clipPath: "inset(0 0 100% 0)" }}
              transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
              data-theme="dark"
            >
              <span className="mobile-menu-kicker">NAVEGAÇÃO / 001</span>
              <div className="mobile-menu-links">
                {navigation.map((item, index) => (
                  <a
                    key={item.id}
                    className={activeSection === item.id ? "is-active" : undefined}
                    href={`#${item.id}`}
                    onClick={closeMenu}
                  >
                    {item.label} <span>{String(index + 1).padStart(2, "0")}</span>
                  </a>
                ))}
              </div>
              <a
                className="mobile-menu-cta"
                href={startProjectUrl}
                target="_blank"
                rel="noreferrer"
                data-track="menu_mobile"
              >
                Começar um projeto <ArrowRight />
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="hero paper" id="inicio">
          <div className="hero-grid-mark" aria-hidden="true" />
          <div className="hero-copy">
            <motion.span
              className="eyebrow"
              initial={{ opacity: 0, y: 18 }}
              animate={!loading ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: 0.55 }}
            >
              ESTRATÉGIA • DESIGN • PERFORMANCE
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={!loading ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              transition={{ duration: 0.85, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              Não fazemos marketing <span>barulhento.</span>
              <br />
              Construímos sistemas que vendem.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={!loading ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.65, delay: 0.22 }}
            >
              Sites, automações, tráfego e marketplaces para empresas que querem crescer com estrutura — e não depender de improviso.
            </motion.p>

            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 24 }}
              animate={!loading ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.65, delay: 0.32 }}
            >
              <MagneticLink
                className="button button-primary"
                href={startProjectUrl}
                external
                cursorLabel="CHAMAR"
                trackingSource="hero"
              >
                Começar um projeto <ArrowRight size={18} />
              </MagneticLink>
              <MagneticLink className="button button-secondary" href="#servicos" cursorLabel="EXPLORAR">
                Conhecer serviços
              </MagneticLink>
            </motion.div>
          </div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.88, rotate: -5 }}
            animate={!loading ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.88, rotate: -5 }}
            transition={{ duration: 1, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <InteractiveTarget />
          </motion.div>

          <motion.a
            className="scroll-indicator"
            href="#servicos"
            initial={{ opacity: 0 }}
            animate={!loading ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.7 }}
            data-cursor="DESCER"
          >
            <span>SCROLL PARA EXPLORAR</span>
            <motion.span animate={{ y: [0, 7, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
              <ArrowDown size={15} />
            </motion.span>
          </motion.a>
        </section>

        <div className="capability-strip" data-theme="dark" aria-label="Áreas de atuação">
          <div className="capability-track">
            {["SITES", "AUTOMAÇÕES", "TRÁFEGO", "MARKETPLACES", "ESTRATÉGIA", "DESIGN", "SITES", "AUTOMAÇÕES", "TRÁFEGO", "MARKETPLACES", "ESTRATÉGIA", "DESIGN"].map((item, index) => (
              <span key={`${item}-${index}`}>{item}<b>+</b></span>
            ))}
          </div>
        </div>

        <section className="services dark-section" id="servicos" data-theme="dark">
          <motion.div
            className="section-heading"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="eyebrow purple">O QUE CONSTRUÍMOS</span>
            <h2>Marketing não é postagem.<br />É <span>estrutura.</span></h2>
            <p>Cada serviço da Ned existe para resolver uma parte real da operação e fazer o negócio avançar.</p>
          </motion.div>

          <div className="service-grid">
            {services.map(({ icon: Icon, number, title, text }, index) => (
              <motion.article
                className="service-card"
                key={number}
                initial={{ opacity: 0, y: 44 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.65, delay: index * 0.08 }}
                whileHover={{ y: -8 }}
                data-cursor="VER"
              >
                <div className="card-glow" />
                <div className="card-top">
                  <Icon size={30} strokeWidth={1.6} />
                  <span>{number}</span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="card-arrow"><ArrowRight size={17} /></span>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="manifesto" data-theme="dark" aria-labelledby="manifesto-title">
          <div className="manifesto-intro">
            <span className="eyebrow purple">MANIFESTO NED</span>
            <h2 id="manifesto-title">O problema nunca foi falta de barulho.</h2>
            <p>O problema é investir sem estratégia, executar sem processo e esperar resultado no improviso.</p>
          </div>

          <div className="manifesto-lines">
            {manifestoLines.map(([number, statement, conclusion], index) => (
              <motion.article
                key={number}
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.65, delay: index * 0.1 }}
                data-cursor="LER"
              >
                <span>{number}</span>
                <p>{statement} <strong>{conclusion}</strong></p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="process paper" id="processo">
          <motion.div
            className="section-heading dark-copy"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75 }}
          >
            <span className="eyebrow">COMO TRABALHAMOS</span>
            <h2>Menos achismo.<br /><span>Mais processo.</span></h2>
          </motion.div>

          <div className="steps">
            {steps.map(([number, title, text], index) => (
              <motion.article
                className="step"
                key={number}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                data-cursor="ETAPA"
              >
                <span className="step-number">{number}</span>
                <span className="step-line" />
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="marketplaces dark-section" id="marketplaces" data-theme="dark">
          <motion.div
            className="market-copy"
            initial={{ opacity: 0, x: -48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8 }}
          >
            <span className="eyebrow purple">MARKETPLACES</span>
            <h2>Quem vende online precisa de operação. Não só de anúncio.</h2>
            <p>
              Organizamos presença, catálogo, criativos, tráfego e processos para transformar marketplaces em um canal de crescimento sustentável.
            </p>
            <div className="platforms" aria-label="Plataformas atendidas">
              <span>Mercado Livre</span><span>Shopee</span><span>Amazon</span><span>TikTok Shop</span>
            </div>
          </motion.div>

          <motion.div
            className="market-panel"
            initial={{ opacity: 0, x: 48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, delay: 0.12 }}
            data-cursor="FLUXO"
          >
            <div className="panel-orbit orbit-one" />
            <div className="panel-orbit orbit-two" />
            <span className="panel-kicker">OPERAÇÃO CONECTADA</span>
            {["Catálogo", "Anúncios", "Dados", "Escala"].map((item, index) => (
              <div className="flow-item" key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
                {index < 3 && <motion.i animate={{ scaleY: [0.25, 1, 0.25] }} transition={{ duration: 2, repeat: Infinity, delay: index * 0.16 }} />}
              </div>
            ))}
          </motion.div>
        </section>

        <section className="diagnostic paper" id="diagnostico">
          <motion.div
            className="diagnostic-copy"
            initial={{ opacity: 0, x: -42 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75 }}
          >
            <span className="eyebrow">COMECE PELO DIAGNÓSTICO</span>
            <h2>Quatro respostas.<br /><span>Uma conversa melhor.</span></h2>
            <p>
              Responda às perguntas e o WhatsApp será aberto com um resumo do seu negócio, do desafio e do momento do projeto.
            </p>
            <div className="diagnostic-benefits">
              <span>01</span><p>Leva menos de dois minutos.</p>
              <span>02</span><p>Sem cadastro e sem formulário burocrático.</p>
              <span>03</span><p>A conversa já começa com contexto.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 42 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.12 }}
          >
            <DiagnosticForm />
          </motion.div>
        </section>

        <section className="cta paper">
          <motion.div
            initial={{ opacity: 0, y: 46 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <span className="eyebrow">CASES E PORTFÓLIO</span>
            <h2>Quer conhecer nossos projetos e resultados?</h2>
            <p>Converse diretamente com Ned e receba uma apresentação selecionada para o seu tipo de negócio.</p>
            <MagneticLink
              className="button button-primary"
              href={portfolioUrl}
              external
              cursorLabel="CHAMAR"
              trackingSource="portfolio"
            >
              <MessageCircle size={19} /> Conversar no WhatsApp
            </MagneticLink>
          </motion.div>
        </section>

        <footer data-theme="dark">
          <div className="footer-identity">
            <a className="brand footer-brand" href="#inicio" data-cursor="TOPO">
              <span className="brand-main">NED</span>
              <span className="brand-sub">MARKETING</span>
            </a>
            <p>Sites, automações, tráfego e marketplaces para empresas que querem crescer.</p>
          </div>
          <div className="footer-links">
            {navigation.map((item) => <a key={item.id} href={`#${item.id}`}>{item.label}</a>)}
          </div>
          <div className="footer-meta">
            <a href={startProjectUrl} target="_blank" rel="noreferrer" data-track="footer">+55 11 91781-4612</a>
            <span>Atendimento em todo o Brasil</span>
            <span>© {new Date().getFullYear()} Ned Marketing</span>
          </div>
        </footer>

        <a
          className="whatsapp-float"
          href={startProjectUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Falar com a Ned Marketing pelo WhatsApp"
          data-cursor="CHAMAR"
          data-track="botao_flutuante"
        >
          <MessageCircle size={21} />
          <span>Falar com Ned</span>
        </a>
      </main>
    </>
  );
}
