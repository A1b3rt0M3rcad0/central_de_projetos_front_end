import { HelpCircle } from "lucide-react";

export default function Footer() {
  let dataAtual = new Date();
  let anoAtual = dataAtual.getFullYear();
  return (
    <footer className="bg-white border-t border-gray-200 shadow-inner px-6 py-3 flex flex-col md:flex-row md:justify-between md:items-center text-sm text-gray-600 gap-2 md:gap-0 text-center md:text-left">
      <span>
        © {anoAtual} Prefeitura Municipal de Imbituba. Todos os direitos
        reservados.
      </span>

      <button
        aria-label="Ajuda"
        className="flex items-center justify-center gap-1 text-indigo-600 hover:underline transition"
        onClick={() => alert("Aqui pode abrir a página de ajuda ou suporte")}
      >
        <HelpCircle className="w-5 h-5" />
        Ajuda
      </button>
    </footer>
  );
}
