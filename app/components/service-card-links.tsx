"use client";

import { useEffect } from "react";

const serviceRoutes = [
  "/servicos/sites",
  "/servicos/automacoes",
  "/servicos/trafego-pago",
  "/servicos/marketplaces",
];

const serviceLabels = [
  "Conhecer o serviço de sites e landing pages",
  "Conhecer o serviço de automações e inteligência artificial",
  "Conhecer o serviço de tráfego pago",
  "Conhecer o serviço de marketplaces",
];

export default function ServiceCardLinks() {
  useEffect(() => {
    if (window.location.pathname !== "/") return;

    const cards = Array.from(document.querySelectorAll<HTMLElement>(".service-card"));
    const cleanups: Array<() => void> = [];

    cards.slice(0, serviceRoutes.length).forEach((card, index) => {
      const route = serviceRoutes[index];
      const label = serviceLabels[index];

      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", label);
      card.dataset.serviceRoute = route;

      const openRoute = () => {
        window.location.assign(route);
      };

      const handleClick = (event: Event) => {
        const target = event.target as HTMLElement | null;
        if (target?.closest("a, button")) return;
        openRoute();
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        openRoute();
      };

      const handleFocus = () => {
        card.style.outline = "2px solid #7040ff";
        card.style.outlineOffset = "-2px";
      };

      const handleBlur = () => {
        card.style.outline = "";
        card.style.outlineOffset = "";
      };

      card.addEventListener("click", handleClick);
      card.addEventListener("keydown", handleKeyDown);
      card.addEventListener("focus", handleFocus);
      card.addEventListener("blur", handleBlur);

      cleanups.push(() => {
        card.removeEventListener("click", handleClick);
        card.removeEventListener("keydown", handleKeyDown);
        card.removeEventListener("focus", handleFocus);
        card.removeEventListener("blur", handleBlur);
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return null;
}
