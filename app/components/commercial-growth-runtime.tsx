"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import CommercialHome from "./commercial-home";
import PortfolioPreview from "./portfolio-preview";

export default function CommercialGrowthRuntime() {
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (window.location.pathname !== "/") return;

    const legacyServices = document.getElementById("servicos");
    if (!legacyServices) return;

    let node = document.getElementById("ned-commercial-growth");
    if (!node) {
      node = document.createElement("div");
      node.id = "ned-commercial-growth";
      legacyServices.parentNode?.insertBefore(node, legacyServices);
    }
    setMountNode(node);

    // The commercial home already contains the current marketing overview.
    // Keep the legacy section mounted for React, but remove it from layout so
    // its viewport animations cannot leave an empty 350px card grid behind.
    const previousLegacyDisplay = legacyServices.style.display;
    legacyServices.style.display = "none";
    legacyServices.setAttribute("aria-hidden", "true");

    const scrollIndicator = document.querySelector<HTMLAnchorElement>(".scroll-indicator");
    const previousScrollHref = scrollIndicator?.getAttribute("href") ?? null;
    if (scrollIndicator) scrollIndicator.href = "#ned-commercial-growth";

    const heroEyebrow = document.querySelector<HTMLElement>(".hero-copy > .eyebrow");
    const heroTitle = document.querySelector<HTMLElement>(".hero-copy > h1");
    const heroCopy = document.querySelector<HTMLElement>(".hero-copy > p");
    if (heroEyebrow) heroEyebrow.textContent = "ESTRATÉGIA • CRIAÇÃO • PERFORMANCE";
    if (heroTitle) {
      heroTitle.innerHTML = "Marketing que chama atenção.<br />E transforma interesse em <span>crescimento.</span>";
    }
    if (heroCopy) {
      heroCopy.textContent = "Estratégia, posicionamento, conteúdo, presença digital, tráfego e marketplaces para empresas que querem ser encontradas, escolhidas e lembradas.";
    }

    const headerCta = document.querySelector<HTMLAnchorElement>(".header-cta");
    const headerText = headerCta?.querySelector("span");
    if (headerCta) headerCta.href = "/analise-gratuita";
    if (headerText) headerText.textContent = "Solicitar análise";

    const heroLinks = document.querySelectorAll<HTMLAnchorElement>(".hero-actions a");
    if (heroLinks[0]) {
      heroLinks[0].href = "/analise-gratuita";
      const textNode = Array.from(heroLinks[0].childNodes).find((item) => item.nodeType === Node.TEXT_NODE);
      if (textNode) textNode.textContent = "Solicitar análise ";
    }
    if (heroLinks[1]) {
      heroLinks[1].href = "/servicos";
      heroLinks[1].textContent = "Conhecer nossos serviços";
    }

    const installMobileCta = () => {
      const mobileCta = document.querySelector<HTMLAnchorElement>(".mobile-menu-cta");
      if (!mobileCta) return;
      mobileCta.href = "/analise-gratuita";
      const textNode = Array.from(mobileCta.childNodes).find((item) => item.nodeType === Node.TEXT_NODE);
      if (textNode) textNode.textContent = "Solicitar análise ";
    };
    installMobileCta();
    const menuObserver = new MutationObserver(installMobileCta);
    menuObserver.observe(document.body, { childList: true, subtree: true });

    const diagnostic = document.querySelector<HTMLElement>("section.diagnostic");
    const diagnosticTitle = diagnostic?.querySelector<HTMLElement>("h2");
    const diagnosticCopy = diagnostic?.querySelector<HTMLElement>(".diagnostic-copy > p");
    const benefits = diagnostic?.querySelectorAll<HTMLElement>(".diagnostic-benefits p");
    if (diagnosticTitle) diagnosticTitle.innerHTML = "Cinco etapas.<br /><span>Uma análise melhor.</span>";
    if (diagnosticCopy) {
      diagnosticCopy.textContent = "Conte sobre o negócio, o objetivo e o principal desafio. A NED usa esse contexto para identificar prioridades antes de recomendar qualquer serviço.";
    }
    if (benefits?.[0]) benefits[0].textContent = "Leva poucos minutos e organiza o momento da empresa.";
    if (benefits?.[1]) benefits[1].textContent = "Ajuda a identificar a prioridade de marketing.";
    if (benefits?.[2]) benefits[2].textContent = "A conversa começa com contexto, não com pacote pronto.";

    const finalCta = document.querySelector<HTMLElement>("section.cta");
    const finalEyebrow = finalCta?.querySelector<HTMLElement>(".eyebrow");
    const finalTitle = finalCta?.querySelector<HTMLElement>("h2");
    const finalCopy = finalCta?.querySelector<HTMLElement>("p");
    const finalLink = finalCta?.querySelector<HTMLAnchorElement>("a");
    if (finalEyebrow) finalEyebrow.textContent = "NED SCORE / DIAGNÓSTICO DE MARKETING";
    if (finalTitle) finalTitle.textContent = "Descubra onde sua marca está perdendo força.";
    if (finalCopy) finalCopy.textContent = "Responda oito perguntas e receba uma leitura inicial sobre oferta, posicionamento, presença, aquisição, atendimento e consistência.";
    if (finalLink) {
      finalLink.href = "/ned-score";
      finalLink.removeAttribute("target");
      finalLink.removeAttribute("rel");
      const textNode = Array.from(finalLink.childNodes).find((item) => item.nodeType === Node.TEXT_NODE);
      if (textNode) textNode.textContent = " Calcular meu NED Score";
    }

    return () => {
      menuObserver.disconnect();
      legacyServices.style.display = previousLegacyDisplay;
      legacyServices.removeAttribute("aria-hidden");
      if (scrollIndicator) {
        if (previousScrollHref === null) scrollIndicator.removeAttribute("href");
        else scrollIndicator.setAttribute("href", previousScrollHref);
      }
      node?.remove();
    };
  }, []);

  return mountNode
    ? createPortal(
        <>
          <CommercialHome />
          <PortfolioPreview />
        </>,
        mountNode,
      )
    : null;
}
