import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/constants";
import { workProjectApi } from "../../services";
import BasePage from "../../components/layout/BasePage";
import BaseContent from "../../components/BaseContent";
import { LoadingSpinner } from "../../components";
import {
  Eye,
  Download,
  Calendar,
  User,
  FileText,
  ArrowLeft,
  Image as ImageIcon,
  ExternalLink,
  Clock,
  MapPin,
  Building,
} from "lucide-react";
import { formatDate } from "../../utils/dateUtils";
import { API_CONFIG } from "../../config/constants";
import { DocumentViewerModal } from "../../components";

export default function WorkProjectViewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { workProjectId, projectName } = location.state || {};

  const [workProject, setWorkProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false);

  useEffect(() => {
    if (!workProjectId) {
      navigate("/projectlistpage");
      return;
    }

    fetchWorkProject();
  }, [workProjectId, navigate]);

  const fetchWorkProject = async () => {
    setLoading(true);
    try {
      const response = await workProjectApi.getWorkProject(workProjectId);

      if (response.data?.content) {
        setWorkProject(response.data.content);
      } else {
        setWorkProject(null);
      }
    } catch (error) {
      console.error("Erro ao buscar fiscalização:", error);
      setWorkProject(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDocument = async (documentName) => {
    try {
      const response = await workProjectApi.downloadWorkProjectDocument(
        workProjectId,
        documentName
      );

      // Criar blob e fazer download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = documentName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar documento:", error);
    }
  };

  const handleViewDocument = async (documentName) => {
    try {
      const extension = documentName.split(".").pop().toLowerCase();

      // Apenas imagens serão visualizadas, outros tipos apenas download
      switch (extension) {
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
        case "webp":
        case "bmp":
        case "svg":
        case "tiff":
        case "tif":
          // Imagens: usar modal para visualização
          setSelectedDocument({ name: documentName, type: "image" });
          setDocumentViewerOpen(true);
          break;

        default:
          // Para todos os outros tipos (PDF, XLSX, DOCX, etc.): apenas download
          handleDownloadDocument(documentName);
      }
    } catch (error) {
      console.error("Erro ao processar documento:", error);
    }
  };

  const getDocumentUrl = async (documentName) => {
    try {
      console.log("Chamando API para documento:", documentName);
      const response = await workProjectApi.viewWorkProjectDocument(
        workProjectId,
        documentName
      );
      console.log("Resposta da API:", response);

      // Determinar o tipo MIME baseado na extensão do arquivo
      const extension = documentName.split(".").pop().toLowerCase();
      let mimeType = "application/octet-stream"; // tipo padrão

      switch (extension) {
        case "jpg":
        case "jpeg":
          mimeType = "image/jpeg";
          break;
        case "png":
          mimeType = "image/png";
          break;
        case "gif":
          mimeType = "image/gif";
          break;
        case "webp":
          mimeType = "image/webp";
          break;
        case "bmp":
          mimeType = "image/bmp";
          break;
        case "svg":
          mimeType = "image/svg+xml";
          break;
        case "tiff":
        case "tif":
          mimeType = "image/tiff";
          break;
      }

      console.log("Tipo MIME:", mimeType);
      const blob = new Blob([response.data], { type: mimeType });
      const url = URL.createObjectURL(blob);
      console.log("URL criada:", url);
      return url;
    } catch (error) {
      console.error("Erro ao obter URL do documento:", error);
      return null;
    }
  };

  const isImageFile = (filename) => {
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".bmp",
      ".webp",
      ".svg",
      ".tiff",
      ".tif",
    ];
    return imageExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
  };

  if (!workProjectId) {
    return null;
  }

  if (loading) {
    return (
      <BasePage pageTitle="Carregando...">
        <BaseContent pageTitle="Carregando..." onBack={() => navigate(-1)}>
          <div className="flex items-center justify-center min-h-96">
            <LoadingSpinner size="lg" />
          </div>
        </BaseContent>
      </BasePage>
    );
  }

  if (!workProject) {
    return (
      <BasePage pageTitle="Fiscalização não encontrada">
        <BaseContent
          pageTitle="Fiscalização não encontrada"
          onBack={() => navigate(-1)}
        >
          <div className="text-center py-12">
            <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Fiscalização não encontrada
            </h3>
            <p className="text-gray-500">
              A fiscalização solicitada não foi encontrada ou não existe.
            </p>
          </div>
        </BaseContent>
      </BasePage>
    );
  }

  return (
    <BasePage pageTitle={workProject.title}>
      <BaseContent
        pageTitle={workProject.title}
        onBack={() => navigate(-1)}
        breadcrumbs={[
          { label: "Projetos", onClick: () => navigate("/projectlistpage") },
          { label: projectName, onClick: () => navigate(-1) },
          { label: "Fiscalizações", onClick: () => navigate(-1) },
          { label: workProject.title },
        ]}
      >
        <div className="space-y-6">
          {/* Header com informações principais */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Eye className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {workProject.title}
                    </h1>
                    <p className="text-gray-600">ID: {workProject.id}</p>
                  </div>
                </div>

                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  {workProject.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">
                        Fiscal Responsável
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {workProject.fiscal?.name || "Não informado"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Data de Criação</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(workProject.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">
                        Última Atualização
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(workProject.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informações do Projeto */}
          {workProject.project && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Informações do Projeto
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Nome do Projeto</p>
                    <p className="text-sm font-medium text-gray-900">
                      {workProject.project.name || "Não informado"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Andamento</p>
                    <p className="text-sm font-medium text-gray-900">
                      {workProject.project.andamento_do_projeto ||
                        "Não informado"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Data de Início</p>
                    <p className="text-sm font-medium text-gray-900">
                      {workProject.project.start_date
                        ? formatDate(workProject.project.start_date)
                        : "Não informado"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documentos Adicionais */}
          {workProject.additional_documents &&
            workProject.additional_documents.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Documentos Adicionais
                  </h3>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    {workProject.additional_documents.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workProject.additional_documents.map(
                    (documentName, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {isImageFile(documentName) ? (
                              <ImageIcon className="w-4 h-4 text-orange-500" />
                            ) : (
                              <FileText className="w-4 h-4 text-purple-500" />
                            )}
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {documentName}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isImageFile(documentName) ? (
                            <button
                              onClick={() => handleViewDocument(documentName)}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Visualizar
                            </button>
                          ) : null}
                          <button
                            onClick={() => handleDownloadDocument(documentName)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 transition-colors"
                          >
                            <Download className="w-3 h-3" />
                            Baixar
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

          {/* Modal para visualizar documentos */}
          {documentViewerOpen && selectedDocument && (
            <DocumentViewerModal
              document={selectedDocument}
              workProjectId={workProject.id}
              onClose={() => {
                setDocumentViewerOpen(false);
                setSelectedDocument(null);
              }}
              onDownload={handleDownloadDocument}
              getDocumentUrl={getDocumentUrl}
            />
          )}
        </div>
      </BaseContent>
    </BasePage>
  );
}
