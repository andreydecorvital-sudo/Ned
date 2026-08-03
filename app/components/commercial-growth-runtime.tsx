"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import CommercialHome from "./commercial-home";

function appendNavLink(container: Element | null, href: string, label: string) {
  if (!container || container.querySelector(`[data-commercial-link="${href}"]`)) return () => undefined;
  const link = document.createElement("a");
  link.href = href;
  link.textContent = label;
  link.dataset.commercialLink = href;
  container.appendChild(link);
  return () => link.remove();
}

export default function CommercialGrowthRuntime() {
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (window.location.pathname !== "/") return;

    const services = document.getElementById("servicos");
    if (!services) return;

    let node = document.getElementById("ned-commercial-growth");
    if (!node) {
      node = document.createElement("div");
      node.id = "ned-commercial-growth";
      services.parentNode?.insertBefore(node, services);
    }
    setMountNode(node);

    const cleanups: Array<() => void> = [];

    const desktopNav = document.querySelector(".site-header nav");
    cleanups.push(appendNavLink(desktopNav, "/ned-score", "NED Score"));
    cleanups.push(appendNavLink(desktopNav, "/analise-gratuita", "Análise"));

    const installMobileLinks = () => {
      const mobileNav = document.querySelector(".mobile-menu-links");
      if (!mobileNav) return;
      cleanups.push(appendNavLink(mobileNav, "/ned-score", "NED Score"));
      cleanups.push(appendNavLink(mobileNav, "/analise-gratuita", "Análise gratuita"));
    };
    installMobileLinks();
    const menuObserver = new MutationObserver(installMobileLinks);
    menuObserver.observe(document.body, { childList: true, subtree: true });
    cleanups.push(() => menuObserver.disconnect());

    const headerCta = document.querySelector<HTMLAnchorElement>(".header-cta");
    const headerText = headerCta?.querySelector("span");
    if (headerCta) headerCta.href = "/analise-gratuita";
    if (headerText) headerText.textContent = "Análise gratuita";

    const heroLinks = document.querySelectorAll<HTMLAnchorElement>(".hero-actions a");
    if (heroLinks[0]) {
      heroLinks[0].href = "/analise-gratuita";
      const textNode = Array.from(heroLinks[0].childNodes).find((item) => item.nodeType === Node.TEXT_NODE);
      if (textNode) textNode.textContent = "Solicitar análise ";
    }
    if (heroLinks[1]) {
      heroLinks[1].href = "/maquina-de-clientes";
      heroLinks[1].textContent = "Conhecer a Máquina de Clientes";
    }

    const mobileCta = document.querySelector<HTMLAnchorElement>(".mobile-menu-cta");
    if (mobileCta) {
      mobileCta.href = "/analise-gratuita";
      const textNode = Array.from(mobileCta.childNodes).find((item) => item.nodeType === Node.TEXT_NODE);
      if (textNode) textNode.textContent = "Solicitar análise ";
    }

    const diagnostic = document.querySelector<HTMLElement>("section.diagnostic");
    const diagnosticTitle = diagnostic?.querySelector<HTMLElement>("h2");
    const diagnosticCopy = diagnostic?.querySelector<HTMLElement>(".diagnostic-copy > p");
    const benefits = diagnostic?.querySelectorAll<HTMLElement>(".diagnostic-benefits p");
    if (diagnosticTitle) diagnosticTitle.innerHTML = "Cinco etapas.<br /><span>Uma conversa melhor.</span>";
    if (diagnosticCopy) {
      diagnosticCopy.textContent = "As respostas são registradas no CRM antes de o WhatsApp abrir, para que a conversa comece com contexto e nenhuma oportunidade dependa apenas da mensagem enviada.";
    }
    if (benefits?.[0]) benefits[0].textContent = "Leva poucos minutos e organiza a necessidade.";
    if (benefits?.[1]) benefits[1].textContent = "Contato salvo com consentimento e origem.";
    if (benefits?.[2]) benefits[2].textContent = "WhatsApp aberto com um resumo pronto.";

    const finalCta = document.querySelector<HTMLElement>("section.cta");
    const finalEyebrow = finalCta?.querySelector<HTMLElement>(".eyebrow");
    const finalTitle = finalCta?.querySelector<HTMLElement>("h2");
    const finalCopy = finalCta?.querySelector<HTMLElement>("p");
    const finalLink = finalCta?.querySelector<HTMLAnchorElement>("a");
    if (finalEyebrow) finalEyebrow.textContent = "NED SCORE / DIAGNÓSTICO INTERATIVO";
    if (finalTitle) finalTitle.textContent = "Descubra onde sua estrutura comercial está vazando.";
    if (finalCopy) finalCopy.textContent = "Responda oito perguntas e receba uma pontuação para oferta, presença digital, atendimento, dados e automação.";
    if (finalLink) {
      finalLink.href = "/ned-score";
      finalLink.removeAttribute("target");
      finalLink.removeAttribute("rel");
      const textNode = Array.from(finalLink.childNodes).find((item) => item.nodeType === Node.TEXT_NODE);
      if (textNode) textNode.textContent = " Calcular meu NED Score";
    }

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      node?.remove();
    };
  }, []);

  return mountNode ? createPortal(<CommercialHome />, mountNode) : null;
}
