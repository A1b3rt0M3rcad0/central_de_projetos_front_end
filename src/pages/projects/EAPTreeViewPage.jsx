import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import BasePage from "../../components/layout/BasePage";
import BaseContent from "../../components/BaseContent";
import EAPTreeDiagram from "../../components/ui/EAPTreeDiagram";
import eapService from "../../services/api/eap";
import {
  ArrowLeft,
  Maximize2,
  RefreshCw,
  AlertCircle,
  Network,
  Loader2,
} from "lucide-react";

export default function EAPTreeViewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const project = location.state?.project;

  const [eapData, setEapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);

  // Carregar dados da EAP do projeto
  useEffect(() => {
    loadProjectEAP();
  }, [id]);

  const loadProjectEAP = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eapService.getProjectEAP(id);

      if (response.eap) {
        setEapData(response.eap);
      } else {
        setEapData(null);
        setError("Este projeto não possui uma EAP");
      }
    } catch (err) {
      console.error("Erro ao carregar EAP:", err);
      if (err.response?.status === 404) {
        setEapData(null);
        setError("Este projeto não possui uma EAP");
      } else {
        setError("Erro ao carregar EAP do projeto");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExportEAP = async () => {
    try {
      const result = await eapService.exportEAP(eapData.id);
      if (result.success) {
        // Sucesso na exportação
        console.log("EAP exportada com sucesso");
      }
    } catch (error) {
      console.error("Erro ao exportar EAP:", error);
    }
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  // Loading
  if (loading) {
    return (
      <BasePage pageTitle="">
        <BaseContent
          pageTitle={`📊 Visualização da EAP - ${project?.name || ""}`}
          onBack={() => navigate(`/project/${id}/eap`)}
        >
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Carregando EAP do projeto...</p>
            </div>
          </div>
        </BaseContent>
      </BasePage>
    );
  }

  // Error ou sem EAP
  if (error || !eapData) {
    return (
      <BasePage pageTitle="">
        <BaseContent
          pageTitle={`📊 Visualização da EAP - ${project?.name || ""}`}
          onBack={() => navigate(`/project/${id}/eap`)}
        >
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-center max-w-md">
              <div className="bg-red-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {error || "EAP não encontrada"}
              </h2>
              <p className="text-gray-600 mb-6">
                {error === "Este projeto não possui uma EAP"
                  ? "Este projeto ainda não possui uma Estrutura Analítica. Crie uma EAP primeiro para visualizar a árvore hierárquica."
                  : "Ocorreu um erro ao carregar a EAP do projeto. Tente novamente."}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => navigate(`/project/${id}/eap`)}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium inline-flex items-center gap-2"
                >
                  <Network className="w-5 h-5" />
                  Gerenciar EAP
                </button>
                <button
                  onClick={loadProjectEAP}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Tentar Novamente
                </button>
              </div>
            </div>
          </div>
        </BaseContent>
      </BasePage>
    );
  }

  const mainContent = (
    <div className="h-full">
      {/* Árvore da EAP - Ocupa toda a tela */}
      <EAPTreeDiagram
        eapData={eapData}
        onExport={handleExportEAP}
        onFullscreen={toggleFullscreen}
        className="h-[calc(100vh-200px)]"
      />
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Network className="w-6 h-6 text-teal-600" />
            <h1 className="text-xl font-bold text-gray-900">
              {eapData.name} - Visualização da EAP
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/project/${id}/eap`)}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <Maximize2 className="w-5 h-5" />
              Sair da Tela Cheia
            </button>
          </div>
        </div>
        <div className="h-[calc(100vh-80px)]">
          <EAPTreeDiagram
            eapData={eapData}
            onExport={handleExportEAP}
            className="h-full"
          />
        </div>
      </div>
    );
  }

  return (
    <BasePage pageTitle="">
      <BaseContent
        pageTitle={
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-teal-600" />
            <span>Árvore da EAP - {eapData?.name || project?.name || ""}</span>
          </div>
        }
        onBack={() => navigate(`/project/${id}/eap`)}
        breadcrumbs={[
          { label: "Projetos", onClick: () => navigate("/projectlistpage") },
          {
            label: project?.name || "Projeto",
            onClick: () => navigate(`/project/${id}/eap`),
          },
          { label: "EAP" },
          { label: "Árvore" },
        ]}
      >
        {mainContent}
      </BaseContent>
    </BasePage>
  );
}
