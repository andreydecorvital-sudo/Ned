"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ClientNavigation() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.startsWith("/servicos/")) return;

    const nav = document.querySelector('nav[aria-label="Serviços da Ned"]');
    if (!nav || nav.querySelector('[data-services-overview="true"]')) return;

    const overview = document.createElement("a");
    overview.href = "/servicos";
    overview.textContent = "Visão geral";
    overview.dataset.servicesOverview = "true";
    nav.prepend(overview);

    return () => overview.remove();
  }, [pathname]);

  return null;
}
