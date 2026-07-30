import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="not-found-page paper">
      <div>
        <span className="eyebrow">ERRO / 404</span>
        <h1>404</h1>
        <h2>Essa página saiu do processo.</h2>
        <p>
          O endereço pode ter mudado ou nunca ter existido. Volte para a página principal e continue explorando a Ned Marketing.
        </p>
        <a href="/">
          <ArrowLeft size={18} /> Voltar para o início
        </a>
      </div>
    </main>
  );
}
