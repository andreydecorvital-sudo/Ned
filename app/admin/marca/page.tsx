import type { Metadata } from "next";
import { ArrowLeft, Check, Download, Instagram } from "lucide-react";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import styles from "./brand-kit.module.css";

export const metadata: Metadata = {
  title: "Marca e Instagram",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const highlights = [
  ["01", "Comece", "/brand/highlights/01-comece.svg", "Porta de entrada"],
  ["02", "Serviços", "/brand/highlights/02-servicos.svg", "Frentes comerciais"],
  ["03", "Trabalhos", "/brand/highlights/03-trabalhos.svg", "Cases e portfólio"],
  ["04", "Processo", "/brand/highlights/04-processo.svg", "Como a NED trabalha"],
  ["05", "Sites", "/brand/highlights/05-sites.svg", "UX e conversão"],
  ["06", "Market", "/brand/highlights/06-market.svg", "Marketplaces"],
  ["07", "NED", "/brand/highlights/07-ned.svg", "Marca e bastidores"],
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
            <h1>Arquivos reais. <em>Aplicação sem distorção.</em></h1>
          </div>
          <p>
            A logo abaixo é exatamente a imagem enviada e aprovada. O único tratamento aplicado foi remover a margem preta excedente para ela funcionar no site sem ficar minúscula ou espremida.
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div>
              <span>01 / LOGO</span>
              <h2>Logo oficial da NED</h2>
            </div>
            <p>Arquivo raster oficial para uso digital. Nenhum vetor aproximado ou reconstrução por fonte está sendo usado.</p>
          </div>

          <article className={styles.logoCard}>
            <div className={styles.logoStage}>
              <img src="/brand/ned-logo-official.webp" alt="Logo oficial NED Marketing" />
            </div>
            <div className={styles.logoMeta}>
              <div>
                <strong>NED Marketing</strong>
                <small>Imagem enviada pelo responsável da marca • recorte técnico sem redesenho</small>
              </div>
              <a href="/brand/ned-logo-official.webp" download>
                <Download size={14} /> Baixar arquivo
              </a>
            </div>
          </article>
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
              <h2>Capas dos Destaques</h2>
            </div>
            <p>As capas agora aparecem inteiras, sem um segundo círculo cortando os SVGs e sem filtros que apagam ou deformam os símbolos.</p>
          </div>

          <div className={styles.highlightGrid}>
            {highlights.map(([number, name, file, purpose]) => (
              <article className={styles.highlightCard} key={file}>
                <div className={styles.highlightPreview}>
                  <img src={file} alt={`Capa do destaque ${name}`} />
                </div>
                <div className={styles.highlightMeta}>
                  <span className={styles.highlightNumber}>{number}</span>
                  <div>
                    <strong>{name}</strong>
                    <small>{purpose}</small>
                  </div>
                </div>
                <a className={styles.assetLink} href={file} download>
                  <Download size={12} /> Baixar SVG
                </a>
              </article>
            ))}
          </div>

          <div className={styles.rules}>
            <Instagram size={20} />
            <div>
              <strong>Regra de aplicação</strong>
              <span>Base preta, off-white estrutural, símbolos centralizados e cor usada apenas como acento semântico.</span>
            </div>
            <Check size={18} />
          </div>
        </section>
      </div>
    </main>
  );
}
