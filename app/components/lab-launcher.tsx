"use client";

import {
  ArrowRight,
  Boxes,
  FlaskConical,
  Laptop,
  MessageCircle,
  ScanLine,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./lab-launcher.module.css";

function trackLabShowcase(destination: "game" | "lab") {
  window.dispatchEvent(
    new CustomEvent("ned:lab", {
      detail: {
        event_name: "home_showcase_click",
        experiment: "maquina_quebrada",
        destination,
      },
    }),
  );
}

function HomeLabShowcase() {
  return (
    <section className={styles.homeShowcase} aria-labelledby="ned-lab-home-title">
      <div className={styles.homeBackdropWord} aria-hidden="true">
        LAB
      </div>
      <div className={styles.homeGrid}>
        <motion.div
          className={styles.homeCopy}
          initial={{ opacity: 0, y: 42 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.28 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.homeKicker}>
            <span>
              <FlaskConical size={15} /> NED LAB
            </span>
            <small>NOVO / EXPERIMENTO 001</small>
          </div>

          <h2 id="ned-lab-home-title">
            Descubra onde sua empresa <span>perde vendas.</span>
          </h2>
          <p>
            Criamos experiências interativas para transformar estratégia em algo que você consegue
            testar. No primeiro jogo, você investiga uma empresa, encontra três gargalos e toma
            decisões sobre oferta, atendimento e operação.
          </p>

          <div className={styles.homeMeta} aria-label="Informações do experimento">
            <span>03 minutos</span>
            <span>Sem cadastro</span>
            <span>Resultado compartilhável</span>
          </div>

          <div className={styles.homeActions}>
            <a
              className={styles.homePrimary}
              href="/lab/maquina-quebrada"
              data-cursor="JOGAR"
              onClick={() => trackLabShowcase("game")}
            >
              Jogar A Máquina Quebrada <ArrowRight size={18} />
            </a>
            <a
              className={styles.homeSecondary}
              href="/lab"
              data-cursor="EXPLORAR"
              onClick={() => trackLabShowcase("lab")}
            >
              Conhecer o NED LAB
            </a>
          </div>
        </motion.div>

        <motion.a
          className={styles.experimentCard}
          href="/lab/maquina-quebrada"
          aria-label="Jogar A Máquina Quebrada"
          data-cursor="JOGAR"
          onClick={() => trackLabShowcase("game")}
          initial={{ opacity: 0, x: 54, rotate: 1.5 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -8 }}
        >
          <div className={styles.cardTopbar}>
            <span>EXPERIMENTO INTERATIVO / 001</span>
            <strong>
              <i /> DISPONÍVEL
            </strong>
          </div>

          <div className={styles.machineStage}>
            <div className={styles.machineGrid} aria-hidden="true" />
            <div className={styles.machineOrbit} aria-hidden="true" />
            <div className={`${styles.machineOrbit} ${styles.machineOrbitSmall}`} aria-hidden="true" />

            <div className={styles.machineStatus}>
              <small>SAÚDE DA MÁQUINA</small>
              <strong>67%</strong>
              <span>DIAGNÓSTICO INCOMPLETO</span>
            </div>

            <div className={`${styles.signalCard} ${styles.signalSite}`}>
              <Laptop size={17} />
              <div>
                <small>01 / OFERTA</small>
                <strong>CTA genérico</strong>
              </div>
              <i />
            </div>

            <div className={`${styles.signalCard} ${styles.signalService}`}>
              <MessageCircle size={17} />
              <div>
                <small>02 / ATENDIMENTO</small>
                <strong>Leads sem prioridade</strong>
              </div>
              <i />
            </div>

            <div className={`${styles.signalCard} ${styles.signalOperation}`}>
              <Boxes size={17} />
              <div>
                <small>03 / OPERAÇÃO</small>
                <strong>Pedido atrasado</strong>
              </div>
              <i />
            </div>

            <div className={styles.scanBadge}>
              <ScanLine size={15} /> INVESTIGUE OS 03 PONTOS
            </div>
          </div>

          <div className={styles.cardFooter}>
            <div>
              <span>
                <Sparkles size={14} /> JOGO 001
              </span>
              <h3>A Máquina Quebrada</h3>
              <p>Encontre os gargalos antes que eles continuem afastando clientes.</p>
            </div>
            <span className={styles.cardArrow}>
              <ArrowRight size={21} />
            </span>
          </div>
        </motion.a>
      </div>
    </section>
  );
}

export default function LabLauncher() {
  const pathname = usePathname();
  const [homeTarget, setHomeTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (pathname !== "/") {
      setHomeTarget(null);
      return;
    }

    const anchor = document.querySelector<HTMLElement>(".capability-strip");
    if (!anchor) return;

    let target = document.getElementById("ned-lab-home-showcase-host");
    let created = false;

    if (!target) {
      target = document.createElement("div");
      target.id = "ned-lab-home-showcase-host";
      anchor.insertAdjacentElement("afterend", target);
      created = true;
    }

    setHomeTarget(target);

    return () => {
      setHomeTarget(null);
      if (created) target?.remove();
    };
  }, [pathname]);

  if (pathname.startsWith("/lab")) return null;

  if (pathname === "/") {
    return homeTarget ? createPortal(<HomeLabShowcase />, homeTarget) : null;
  }

  return (
    <a className={styles.launcher} href="/lab" aria-label="Abrir NED LAB" data-cursor="JOGAR">
      <span className={styles.icon}>
        <FlaskConical size={17} />
      </span>
      <span className={styles.copy}>
        <small>NOVO</small>
        <strong>NED LAB</strong>
      </span>
    </a>
  );
}
