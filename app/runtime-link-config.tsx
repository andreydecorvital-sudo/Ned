"use client";

import { useEffect } from "react";

const legacyWhatsappNumber = "5511949780458";
const currentWhatsappNumber = "5511917814612";

export default function RuntimeLinkConfig() {
  useEffect(() => {
    const updateWhatsappLinks = () => {
      document
        .querySelectorAll<HTMLAnchorElement>(`a[href*="${legacyWhatsappNumber}"]`)
        .forEach((link) => {
          link.href = link.href.replace(legacyWhatsappNumber, currentWhatsappNumber);
        });
    };

    updateWhatsappLinks();

    const observer = new MutationObserver(updateWhatsappLinks);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
