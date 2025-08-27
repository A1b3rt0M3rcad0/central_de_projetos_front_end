import { useState, useEffect } from "react";
import { FileText, Download, ArrowLeft, Eye } from "lucide-react";

import { API_CONFIG } from "../../config/constants";

export default function DocumentViewerModal({
  document,
  workProjectId,
  onClose,
  onDownload,
  getDocumentUrl,
}) {
  console.log("DocumentViewerModal props:", { document, workProjectId });
  const [documentUrl, setDocumentUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDocument = async () => {
      setLoading(true);
      setError(null);

      try {
        // Verificar se temos os dados necessários
        if (!workProjectId || !document.name) {
          throw new Error("Dados insuficientes para carregar a imagem");
        }

        // Usar a função getDocumentUrl que cria blob URL
        if (getDocumentUrl) {
          console.log("Tentando carregar imagem via blob:", document.name);
          const url = await getDocumentUrl(document.name);
          console.log("URL obtida:", url);
          if (url) {
            setDocumentUrl(url);
          } else {
            setError("Erro ao carregar imagem: URL não obtida");
          }
        } else {
          setError("Função getDocumentUrl não disponível");
        }
      } catch (err) {
        setError(`Erro ao carregar imagem: ${err.message}`);
        console.error("Erro ao carregar imagem:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [document.name, workProjectId, getDocumentUrl]);

  // Limpar URL do blob quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (documentUrl && documentUrl.startsWith("blob:")) {
        URL.revokeObjectURL(documentUrl);
      }
    };
  }, [documentUrl]);

  // Adicionar handler de erro para a imagem
  const handleImageError = (e) => {
    console.error("Erro ao carregar imagem:", e);
    setError("Erro ao carregar imagem no navegador. Tente baixar o arquivo.");
  };

  const renderContent = () => {
    try {
      if (loading) {
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando imagem...</p>
            </div>
          </div>
        );
      }

      if (error) {
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Erro ao carregar imagem
              </h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={() => onDownload(document.name)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
              >
                <Download className="w-4 h-4" />
                Baixar imagem
              </button>
            </div>
          </div>
        );
      }

      if (!documentUrl) {
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                URL da imagem não disponível
              </h3>
              <button
                onClick={() => onDownload(document.name)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
              >
                <Download className="w-4 h-4" />
                Baixar imagem
              </button>
            </div>
          </div>
        );
      }

      // Apenas imagens são renderizadas neste modal
      return (
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={documentUrl}
            alt={document.name}
            className="max-w-full max-h-full object-contain rounded-lg"
            onError={handleImageError}
            onLoad={() => console.log("Imagem carregada com sucesso")}
          />
        </div>
      );
    } catch (err) {
      console.error("Erro no renderContent:", err);
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Erro inesperado
            </h3>
            <p className="text-gray-500 mb-4">
              Ocorreu um erro inesperado ao renderizar a imagem.
            </p>
            <button
              onClick={() => onDownload(document.name)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
              <Download className="w-4 h-4" />
              Baixar imagem
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-white rounded-lg shadow-xl">
        {/* Header do modal */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Visualizar Imagem: {document.name}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDownload(document.name)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Baixar documento"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Fechar"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Conteúdo do modal */}
        <div className="flex-1 p-4 overflow-hidden">{renderContent()}</div>
      </div>
    </div>
  );
}
