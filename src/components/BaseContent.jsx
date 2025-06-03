import { ArrowLeft } from "lucide-react";

function BaseContent({ pageTitle, onBack, children }) {
  return (
    <div className="flex flex-col h-full">
      {/* Barra superior */}
      <div className="flex items-center gap-4 p-4 border-b bg-white shadow-sm">
        <button
          onClick={onBack}
          aria-label="Voltar"
          className="p-2 rounded-md hover:bg-blue-50 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-lg font-semibold text-gray-700">{pageTitle}</h2>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-auto p-6 bg-gray-50">{children}</div>
    </div>
  );
}

export default BaseContent;
