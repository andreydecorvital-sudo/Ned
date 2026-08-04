"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const homeNavigation = [
  { label: "Serviços", href: "/servicos" },
  { label: "Processo", href: "/processo" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "NED Score", href: "/ned-score" },
];

function configureNavigation(container: Element | null) {
  if (!container) return () => undefined;

  const anchors = Array.from(container.querySelectorAll<HTMLAnchorElement>(":scope > a"));
  if (anchors.length < homeNavigation.length) return () => undefined;

  anchors.slice(homeNavigation.length).forEach((anchor) => anchor.remove());
  anchors.slice(0, homeNavigation.length).forEach((anchor, index) => {
    const item = homeNavigation[index];
    anchor.href = item.href;
    anchor.textContent = item.label;
    anchor.removeAttribute("data-cursor");
    anchor.classList.remove("is-active");
  });
  container.setAttribute("data-page-navigation", "true");

  const observer = new MutationObserver(() => {
    anchors.forEach((anchor) => anchor.classList.remove("is-active"));
  });
  anchors.forEach((anchor) => observer.observe(anchor, { attributes: true, attributeFilter: ["class"] }));

  return () => observer.disconnect();
}

export default function ClientNavigation() {
  const pathname = usePathname();

  useEffect(() => {
    const cleanups: Array<() => void> = [];

    document.querySelectorAll<HTMLAnchorElement>('a[href="/#servicos"]').forEach((link) => {
      link.href = "/servicos";
    });

    if (pathname === "/") {
      cleanups.push(configureNavigation(document.querySelector(".site-header nav")));
      cleanups.push(configureNavigation(document.querySelector(".mobile-menu-links")));
    }

    if (pathname.startsWith("/servicos/")) {
      const nav = document.querySelector('nav[aria-label="Serviços da Ned"]');
      if (nav && !nav.querySelector('[data-services-overview="true"]')) {
        const overview = document.createElement("a");
        overview.href = "/servicos";
        overview.textContent = "Visão geral";
        overview.dataset.servicesOverview = "true";
        nav.prepend(overview);
        cleanups.push(() => overview.remove());
      }
    }

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [pathname]);

  return null;
}
