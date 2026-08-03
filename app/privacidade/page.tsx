import type { Metadata } from "next";
import styles from "./privacy.module.css";

const whatsappUrl = "https://wa.me/5511917814612?text=Ol%C3%A1%2C%20quero%20falar%20sobre%20meus%20dados%20pessoais%20tratados%20pela%20NED.";

export const metadata: Metadata = {
  title: "Privacidade e tratamento de dados",
  description: "Como a NED Marketing coleta, utiliza, protege e elimina os dados enviados pelo diagnóstico do site.",
  alternates: { canonical: "/privacidade" },
};

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a className={styles.brand} href="/" aria-label="NED Marketing">
          <strong>NED</strong>
          <small>PRIVACIDADE</small>
        </a>
        <a className={styles.back} href="/">Voltar ao site</a>
      </header>

      <div className={styles.content}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>AVISO DE PRIVACIDADE / NED</span>
          <h1>Seus dados com contexto e responsabilidade.</h1>
          <p>
            Esta página explica de forma objetiva como tratamos as informações enviadas pelo diagnóstico, pelas páginas de serviço e pelas experiências do NED LAB.
          </p>
        </section>

        <section className={styles.grid}>
          <article className={styles.card}>
            <h2>Dados coletados</h2>
            <ul>
              <li>Nome, empresa e número de WhatsApp.</li>
              <li>Tipo de negócio, desafio, serviço procurado e urgência.</li>
              <li>Página de origem, referência e parâmetros de campanha.</li>
              <li>Data, horário e versão do consentimento apresentado.</li>
            </ul>
          </article>

          <article className={styles.card}>
            <h2>Finalidade</h2>
            <p>
              Utilizamos os dados para responder ao diagnóstico, entender o projeto, organizar o atendimento comercial, registrar follow-ups e avaliar a origem dos contatos.
            </p>
          </article>

          <article className={styles.card}>
            <h2>Armazenamento e segurança</h2>
            <p>
              Os dados ficam em banco PostgreSQL acessado apenas pelo servidor. O painel administrativo é protegido por autenticação e as rotas internas não são indexadas por mecanismos de busca.
            </p>
          </article>

          <article className={styles.card}>
            <h2>Compartilhamento</h2>
            <p>
              Não comercializamos os dados recebidos. Eles podem ser processados por provedores de infraestrutura necessários ao funcionamento do site, do banco e da hospedagem.
            </p>
          </article>

          <article className={styles.card}>
            <h2>Retenção e eliminação</h2>
            <p>
              Mantemos as informações enquanto forem necessárias para o atendimento e a gestão comercial. O contato pode solicitar exclusão, respeitadas eventuais obrigações legais de conservação.
            </p>
          </article>

          <article className={styles.card}>
            <h2>Seus pedidos</h2>
            <p>
              Você pode solicitar confirmação do tratamento, acesso, correção, informações, revogação do consentimento ou exclusão pelos canais da NED.
            </p>
            <p><a href={whatsappUrl} target="_blank" rel="noreferrer">Falar sobre meus dados pelo WhatsApp</a></p>
          </article>
        </section>

        <div className={styles.notice}>
          <strong>Versão do aviso:</strong> agosto de 2026. Mudanças relevantes neste tratamento serão refletidas nesta página e em uma nova versão do consentimento do diagnóstico.
        </div>
      </div>
    </main>
  );
}
