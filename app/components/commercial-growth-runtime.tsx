"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import CommercialHome from "./commercial-home";

function appendNavLink(container: Element | null, href: string, label: string, className = "") {
  if (!container || container.querySelector(`[data-commercial-link="${href}"]`)) return () => undefined;
  const link = document.createElement("a");
  link.href = href;
  link.textContent = label;
  link.dataset.commercialLink = href;
  if (className) link.className = className;
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

    const mobileNav = document.querySelector(".mobile-menu-links");
    cleanups.push(appendNavLink(mobileNav, "/ned-score", "NED Score"));
    cleanups.push(appendNavLink(mobileNav, "/analise-gratuita", "Análise gratuita"));

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
      setMountNode(null);
      node?.remove();
    };
  }, []);

  return mountNode ? createPortal(<CommercialHome />, mountNode) : null;
}
