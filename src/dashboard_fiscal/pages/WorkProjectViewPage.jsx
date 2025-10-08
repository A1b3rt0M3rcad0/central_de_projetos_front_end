import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  Calendar,
  FileText,
  Download,
  Trash2,
  Plus,
  X,
  AlertCircle,
  Image as ImageIcon,
  Eye,
} from "lucide-react";
import { fiscalApiService } from "../services/fiscalApi";

function WorkProjectViewPage() {
  const navigate = useNavigate();
  const { workProjectId } = useParams();
  const [workProject, setWorkProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingPhotos, setAddingPhotos] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    document: null,
  });
  const [deleting, setDeleting] = useState(false);
  const [imageModal, setImageModal] = useState({
    show: false,
    url: null,
    name: null,
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadWorkProject();
  }, [workProjectId]);

  const loadWorkProject = async () => {
    try {
      setLoading(true);
      console.log("🔍 Buscando detalhes da fiscalização:", workProjectId);
      const response = await fiscalApiService.getWorkProject(workProjectId);
      console.log("✅ Resposta recebida:", response.data);
      setWorkProject(response.data.content);
    } catch (error) {
      console.error("❌ Erro ao carregar fiscalização:", error);
      console.error("Detalhes do erro:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPhotos = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    try {
      setAddingPhotos(true);
      await fiscalApiService.addDocuments(workProjectId, selectedFiles);
      loadWorkProject(); // Recarregar dados
    } catch (error) {
      console.error("Erro ao adicionar fotos:", error);
      alert("Erro ao adicionar fotos. Tente novamente.");
    } finally {
      setAddingPhotos(false);
    }
  };

  const handleDeleteDocument = async (documentName) => {
    try {
      setDeleting(true);
      await fiscalApiService.deleteDocument(workProjectId, documentName);
      setDeleteModal({ show: false, document: null });
      loadWorkProject(); // Recarregar dados
    } catch (error) {
      console.error("Erro ao deletar documento:", error);
      alert("Erro ao deletar documento. Tente novamente.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDownloadDocument = async (documentName) => {
    try {
      const response = await fiscalApiService.getDocument(
        workProjectId,
        documentName
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", documentName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Erro ao baixar documento:", error);
      alert("Erro ao baixar documento. Tente novamente.");
    }
  };

  const handleViewImage = async (documentName) => {
    try {
      const response = await fiscalApiService.getDocument(
        workProjectId,
        documentName
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setImageModal({ show: true, url, name: documentName });
    } catch (error) {
      console.error("Erro ao visualizar imagem:", error);
      alert("Erro ao visualizar imagem. Tente novamente.");
    }
  };

  const isImageFile = (filename) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];
    return imageExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Carregando fiscalização...
          </p>
        </div>
      </div>
    );
  }

  if (!workProject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl p-8 text-center shadow-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            Fiscalização não encontrada
          </p>
          <button
            onClick={() => navigate("/fiscal/projects")}
            className="mt-4 text-orange-600 font-semibold"
          >
            Voltar aos projetos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white sticky top-0 z-50 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-orange-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="font-bold text-lg line-clamp-1">
                {workProject.title}
              </h1>
              <p className="text-xs text-orange-100">
                Detalhes da fiscalização
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-4 py-6 space-y-6">
        {/* Informações Gerais */}
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-600" />
            Informações
          </h2>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Título</p>
              <p className="text-sm font-medium text-gray-800">
                {workProject.title}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Descrição</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {workProject.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500 mb-1">Projeto</p>
                <p className="text-sm font-medium text-gray-800">
                  {workProject.project?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Data</p>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-orange-600" />
                  <p className="text-sm font-medium text-gray-800">
                    {formatDate(workProject.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fotos e Documentos */}
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Camera className="w-5 h-5 text-orange-600" />
              Fotos ({workProject.documents?.length || 0})
            </h2>
          </div>

          {/* Botão de Adicionar Fotos */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={addingPhotos}
            className="w-full bg-gradient-to-br from-green-600 to-green-700 text-white p-3 rounded-lg shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 mb-4"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Adicionar Fotos/Documentos</span>
          </button>

          {/* Input escondido */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            multiple
            onChange={handleAddPhotos}
            className="hidden"
          />

          {addingPhotos && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2 mb-4">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-blue-700 font-medium">
                Adicionando fotos...
              </p>
            </div>
          )}

          {/* Lista de Documentos */}
          {workProject.documents && workProject.documents.length > 0 ? (
            <div className="space-y-3">
              {workProject.documents.map((doc, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg border border-gray-200 p-3 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-shrink-0">
                      {isImageFile(doc.name) ? (
                        <ImageIcon className="w-5 h-5 text-orange-600" />
                      ) : (
                        <FileText className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                    <p
                      className="text-sm font-medium text-gray-800 truncate flex-1"
                      title={doc.name}
                    >
                      {doc.name}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {isImageFile(doc.name) && (
                      <button
                        onClick={() => handleViewImage(doc.name)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Visualizar
                      </button>
                    )}
                    <button
                      onClick={() => handleDownloadDocument(doc.name)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Baixar
                    </button>
                    <button
                      onClick={() =>
                        setDeleteModal({ show: true, document: doc.name })
                      }
                      className="flex items-center justify-center px-3 py-2 text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Nenhum documento adicionado
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Confirmação de Delete */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Excluir Foto</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir esta foto? Esta ação não pode ser
              desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, document: null })}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteDocument(deleteModal.document)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Visualização de Imagem - Mobile Optimized */}
      {imageModal.show && (
        <div
          className="fixed inset-0 bg-black z-50 flex flex-col"
          onClick={() => {
            URL.revokeObjectURL(imageModal.url);
            setImageModal({ show: false, url: null, name: null });
          }}
        >
          {/* Header do Modal */}
          <div className="flex items-center justify-between p-4 bg-black bg-opacity-80">
            <p className="text-white text-sm font-medium truncate flex-1 mr-3">
              {imageModal.name}
            </p>
            <button
              onClick={() => {
                URL.revokeObjectURL(imageModal.url);
                setImageModal({ show: false, url: null, name: null });
              }}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg flex-shrink-0"
            >
              <X className="w-6 h-6 text-gray-800" />
            </button>
          </div>

          {/* Imagem - Ocupa toda a área disponível */}
          <div className="flex-1 flex items-center justify-center overflow-auto">
            <img
              src={imageModal.url}
              alt={imageModal.name}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkProjectViewPage;
