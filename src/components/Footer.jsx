import { HelpCircle, Heart, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../config/constants";

export default function Footer() {
  const navigate = useNavigate();
  let dataAtual = new Date();
  let anoAtual = dataAtual.getFullYear();

  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200/50 shadow-inner">
      <div className="px-6 py-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          {/* Informações da Prefeitura */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="font-medium">
                © {anoAtual} Prefeitura Municipal de Imbituba
              </span>
            </div>
            <span className="hidden md:block text-gray-400">•</span>
            <span className="text-gray-500">Todos os direitos reservados</span>
          </div>

          {/* Links e Ações */}
          <div className="flex items-center gap-4">
            <button
              aria-label="Ajuda"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
              onClick={() => navigate(ROUTES.HELP)}
            >
              <HelpCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-medium">Ajuda</span>
            </button>

            <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
              <span>Desenvolvido por Alberto da S. Mercado</span>
            </div>
          </div>
        </div>

        {/* Versão do sistema */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>Sistema de Gestão de Projetos</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
