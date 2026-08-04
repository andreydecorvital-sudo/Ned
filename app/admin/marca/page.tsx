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

const logos = [
  {
    name: "Referência visual oficial",
    file: "/brand/ned-logo-primary.webp",
    note: "Imagem final aprovada, preservada sem redesenho.",
    dark: true,
  },
  {
    name: "Marca vetorial para interface",
    file: "/brand/ned-logo-flat.svg",
    note: "Versão técnica branca, sem textura e escalável.",
    dark: true,
  },
  {
    name: "Marca para fundos claros",
    file: "/brand/ned-logo-dark.svg",
    note: "Versão preta para papel, documentos e superfícies claras.",
    dark: false,
  },
  {
    name: "Símbolo reduzido",
    file: "/brand/ned-symbol-spiral.svg",
    note: "Uso pontual em favicon, selo, loading e microinterações.",
    dark: true,
  },
] as const;

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
            <h1>Uma fonte visual. <em>Aplicações consistentes.</em></h1>
          </div>
          <p>
            Este painel centraliza a logo aprovada, as versões técnicas, as cores por editoria e a estrutura dos Destaques. Arquivos ausentes continuam marcados como pendentes, sem substituição por imagens genéricas.
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div>
              <span>01 / LOGO</span>
              <h2>Marca oficial e derivados</h2>
            </div>
            <p>A referência WebP é a fonte visual aprovada. Os SVGs existem para interface, escala e aplicações técnicas.</p>
          </div>

          <div className={styles.logoGrid}>
            {logos.map((logo) => (
              <article className={`${styles.logoCard} ${logo.dark ? styles.darkCard : styles.lightCard}`} key={logo.file}>
                <div className={styles.logoStage}>
                  <img src={logo.file} alt={logo.name} />
                </div>
                <div className={styles.logoMeta}>
                  <div><strong>{logo.name}</strong><small>{logo.note}</small></div>
                  <a href={logo.file} download><Download size={14} /> Abrir arquivo</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div>
              <span>02 / CORES</span>
              <h2>Marca neutra. Editorias contextuais.</h2>
            </div>
            <p>O roxo representa Automação. Ele não volta a funcionar como cor automática da NED inteira.</p>
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
            <p>As capas usam as fotografias já escolhidas. Como os arquivos não estão no repositório, os espaços abaixo mostram o nome e o caminho exato esperado.</p>
          </div>

          <div className={styles.highlightGrid}>
            {highlights.map(([number, name, file, purpose]) => (
              <article className={styles.highlightCard} key={file}>
                <div className={styles.highlightPreview} style={{ backgroundImage: `url(${file})` }}>
                  <img src="/brand/instagram/highlights/highlight-overlay.svg" alt="" />
                  <span>{number}</span>
                </div>
                <strong>{name}</strong>
                <small>{purpose}</small>
                <code>{file}</code>
                <span className={styles.pending}>ARQUIVO PENDENTE</span>
              </article>
            ))}
          </div>

          <div className={styles.rules}>
            <Instagram size={20} />
            <div>
              <strong>Regra de aplicação</strong>
              <span>Fotografia real, assunto centralizado, leitura no recorte circular e espiral usada somente como assinatura discreta.</span>
            </div>
            <Check size={18} />
          </div>
        </section>
      </div>
    </main>
  );
}
