import type { Metadata } from "next";
import BrokenMachineGame from "./broken-machine-game";
import fixes from "./experience-fixes.module.css";
import LabJourneyAnalytics from "./lab-journey-analytics";
import ResultShareLayer from "./result-share-layer";

export const metadata: Metadata = {
  title: "A Máquina Quebrada — NED LAB",
  description:
    "Encontre os gargalos de uma empresa virtual, tome decisões sobre oferta, atendimento e operação e compartilhe seu resultado.",
  alternates: {
    canonical: "/lab/maquina-quebrada",
  },
  openGraph: {
    title: "A Máquina Quebrada — NED LAB",
    description:
      "Encontre três gargalos, tome as decisões e descubra a saúde da sua máquina de vendas.",
    type: "website",
    url: "/lab/maquina-quebrada",
  },
  twitter: {
    card: "summary_large_image",
    title: "A Máquina Quebrada — NED LAB",
    description: "Você consegue encontrar os gargalos antes que eles encontrem seus clientes?",
  },
};

export default function BrokenMachinePage() {
  return (
    <div className={fixes.experience}>
      <BrokenMachineGame />
      <ResultShareLayer />
      <LabJourneyAnalytics />
    </div>
  );
}
