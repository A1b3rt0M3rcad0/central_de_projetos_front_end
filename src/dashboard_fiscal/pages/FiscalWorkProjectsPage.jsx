import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Camera,
  Calendar,
  ChevronRight,
  Search,
  Plus,
  Trash2,
  AlertCircle,
  X,
} from "lucide-react";
import { fiscalApiService } from "../services/fiscalApi";

function FiscalWorkProjectsPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [workProjects, setWorkProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadWorkProjects();
  }, [page, projectId]);

  const loadWorkProjects = async () => {
    try {
      setLoading(true);
      console.log("🔍 Buscando fiscalizações do projeto:", projectId);
      const response = await fiscalApiService.getWorkProjects(
        projectId,
        10,
        page
      );
      console.log("✅ Resposta recebida:", response.data);

      // A resposta vem em data.content (array de work_projects)
      const workProjects = response.data.content || [];
      const total = response.data.total || 0;
      const totalPages = Math.ceil(total / 10) || 1;

      setWorkProjects(workProjects);
      setTotalPages(totalPages);
      setHasMore(page < totalPages);

      // Pegar nome do projeto do primeiro work_project
      if (workProjects.length > 0 && workProjects[0].project) {
        setProjectName(workProjects[0].project.name || "");
      }
    } catch (error) {
      console.error("❌ Erro ao carregar fiscalizações:", error);
      console.error("Detalhes do erro:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      await fiscalApiService.deleteWorkProject(id);
      setDeleteModal({ show: false, id: null });
      loadWorkProjects(); // Recarregar lista
    } catch (error) {
      console.error("Erro ao deletar fiscalização:", error);
      alert("Erro ao deletar fiscalização. Tente novamente.");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const filteredWorkProjects = workProjects.filter(
    (wp) =>
      wp.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wp.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && page === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Carregando fiscalizações...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white sticky top-0 z-50 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate("/fiscal/projects")}
              className="p-2 hover:bg-orange-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="font-bold text-lg">Fiscalizações</h1>
              <p className="text-xs text-orange-100 line-clamp-1">
                {projectName || "Projeto"}
              </p>
            </div>
          </div>

          {/* Busca Melhorada */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <div className="relative flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-200" />
                <input
                  type="text"
                  placeholder="Buscar por título, descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-lg text-gray-800 placeholder-gray-400 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Fiscalizações */}
      <div className="px-4 py-6">
        {filteredWorkProjects.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-md border border-gray-100">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium mb-2">
              {searchTerm
                ? "Nenhuma fiscalização encontrada"
                : "Nenhuma fiscalização criada"}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {searchTerm
                ? "Tente buscar com outros termos"
                : "Comece criando sua primeira fiscalização"}
            </p>
            {!searchTerm && (
              <button
                onClick={() =>
                  navigate(`/fiscal/project/${projectId}/create-work-project`)
                }
                className="bg-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold inline-flex items-center gap-2 hover:bg-orange-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nova Fiscalização
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {filteredWorkProjects.map((workProject) => (
                <div
                  key={workProject.id}
                  className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
                >
                  <div
                    onClick={() =>
                      navigate(`/fiscal/work-project/${workProject.id}`)
                    }
                    className="cursor-pointer active:scale-98 transition-transform"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1 text-base line-clamp-2">
                          {workProject.title}
                        </h3>
                        {workProject.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {workProject.description}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0 ml-2" />
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-orange-600" />
                        <span>{formatDate(workProject.created_at)}</span>
                      </div>
                      {(workProject.photo_name ? 1 : 0) +
                        (workProject.additional_documents?.length || 0) >
                        0 && (
                        <div className="flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-blue-600" />
                          <span>
                            {(workProject.photo_name ? 1 : 0) +
                              (workProject.additional_documents?.length ||
                                0)}{" "}
                            fotos
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Botão de deletar */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() =>
                        setDeleteModal({ show: true, id: workProject.id })
                      }
                      className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors font-medium text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir Fiscalização
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    page === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
                  }`}
                >
                  Anterior
                </button>
                <span className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasMore}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    !hasMore
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
                  }`}
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Botão Flutuante para Nova Fiscalização */}
      <button
        onClick={() =>
          navigate(`/fiscal/project/${projectId}/create-work-project`)
        }
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-700 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform hover:shadow-xl z-40"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Modal de Confirmação de Delete */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">
                  Excluir Fiscalização
                </h3>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir esta fiscalização? Esta ação não
              pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, id: null })}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteModal.id)}
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
    </div>
  );
}

export default FiscalWorkProjectsPage;
