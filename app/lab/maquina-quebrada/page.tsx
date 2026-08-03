import type { Metadata } from "next";
import BrokenMachineGame from "./broken-machine-game";

export const metadata: Metadata = {
  title: "A Máquina Quebrada — NED LAB",
  description:
    "Encontre os gargalos de uma empresa virtual e descubra como pequenas falhas interrompem a jornada de venda.",
  alternates: {
    canonical: "/lab/maquina-quebrada",
  },
};

export default function BrokenMachinePage() {
  return <BrokenMachineGame />;
}
