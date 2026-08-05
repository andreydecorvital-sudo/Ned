import type { Metadata } from "next";
import { AlertTriangle, ArrowLeft, Check, Instagram } from "lucide-react";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import NedBrandMark from "@/app/components/ned-brand-mark";
import styles from "./brand-kit.module.css";

export const metadata: Metadata = {
  title: "Marca e Instagram",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const highlights = [
  ["01", "NED", "/brand/instagram/highlights/01-ned.webp", "Institucional"],
  ["02", "Serviços", "/brand/instagram/highlights/02-servicos.webp", "Visão geral"],
  ["03", "Cases", "/brand/instagram/highlights/03-cases.webp", "Trabalhos"],
  ["04", "Lab", "/brand/instagram/highlights/04-lab.webp", "Experiências"],
  ["05", "Resultados", "/brand/instagram/highlights/05-resultados.webp", "Evidências"],
  ["06", "Bastidores", "/brand/instagram/highlights/06-bastidores.webp", "Processo"],
  ["07", "Contato", "/brand/instagram/highlights/07-contato.webp", "Próximo passo"],
] as const;

const colors = [
  ["Marca-mãe", "#08080a", "Preto profundo"],
  ["Papel", "#f1eee7", "Branco quebrado"],
  ["Mistérios", "#ff2b32", "Vermelho"],
  ["Sites", "#25ff74", "Verde"],
  ["IA", "#1268ff", "Azul"],
  ["Automação", "#8e65ff", "Roxo"],
  ["Marketplaces", "#ff7a1a", "Laranja"],
] as const;

export default async function BrandKitPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a href="/admin"><ArrowLeft size={16} /> Voltar ao painel</a>
        <span>NED BRAND OS / APLICAÇÃO</span>
      </header>

      <div className={styles.shell}>
        <section className={styles.hero}>
          <div>
            <span className={styles.eyebrow}>MARCA E INSTAGRAM</span>
            <h1>Decisões aprovadas. <em>Sem ativos inventados.</em></h1>
          </div>
          <p>
            Este painel organiza cores, editorias e Destaques. A logo final continua aprovada como direção, mas o arquivo limpo e exato ainda precisa ser recuperado antes de qualquer aplicação definitiva.
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div>
              <span>01 / LOGO</span>
              <h2>Status real da marca</h2>
            </div>
            <p>O render metálico e os vetores aproximados foram removidos da interface. Eles não representam com fidelidade a logo escolhida.</p>
          </div>

          <div className={styles.rules}>
            <AlertTriangle size={20} />
            <div>
              <strong>Assinatura temporária em uso</strong>
              <span>O site usa uma composição limpa de NED + Marketing + espiral apenas para não deixar a marca ausente. Ela não é apresentada como logo oficial.</span>
            </div>
            <NedBrandMark />
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div>
              <span>02 / CORES</span>
              <h2>Marca neutra. Editorias contextuais.</h2>
            </div>
            <p>O roxo representa Automação. Ele não funciona como cor automática da NED inteira.</p>
          </div>
          <div className={styles.colorGrid}>
            {colors.map(([name, value, use]) => (
              <article key={name}>
                <span className={styles.swatch} style={{ background: value }} />
                <strong>{name}</strong>
                <small>{use} / {value}</small>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div>
              <span>03 / INSTAGRAM</span>
              <h2>Destaques organizados como sistema</h2>
            </div>
            <p>As capas devem usar as fotografias já escolhidas. Enquanto os arquivos não estiverem no repositório, os espaços abaixo mostram somente ordem, nome e caminho esperado.</p>
          </div>

          <div className={styles.highlightGrid}>
            {highlights.map(([number, name, file, purpose]) => (
              <article className={styles.highlightCard} key={file}>
                <div className={styles.highlightPreview}>
                  <span>{number}</span>
                </div>
                <strong>{name}</strong>
                <small>{purpose}</small>
                <code>{file}</code>
                <span className={styles.pending}>FOTO ORIGINAL PENDENTE</span>
              </article>
            ))}
          </div>

          <div className={styles.rules}>
            <Instagram size={20} />
            <div>
              <strong>Regra de aplicação</strong>
              <span>Fotografia real, assunto centralizado, leitura no recorte circular e tratamento discreto. Nenhuma imagem gerada entra como substituta.</span>
            </div>
            <Check size={18} />
          </div>
        </section>
      </div>
    </main>
  );
}
