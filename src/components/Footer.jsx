import { HelpCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t shadow-inner px-6 py-3 flex flex-col md:flex-row md:justify-between md:items-center text-sm text-gray-600 gap-2 md:gap-0 text-center md:text-left">
      <span>
        © 2025 Prefeitura Municipal de Imbituba. Todos os direitos reservados.
      </span>

      <button
        aria-label="Ajuda"
        className="flex items-center justify-center gap-1 text-indigo-600 hover:underline md:justify-start"
        onClick={() => alert("Aqui pode abrir a página de ajuda ou suporte")}
      >
        <HelpCircle className="w-5 h-5" />
        Ajuda
      </button>
    </footer>
  );
}
