import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FolderOpen,
  MapPin,
  Building2,
  ChevronRight,
  Search,
  Loader,
  Plus,
} from "lucide-react";
import { fiscalApiService } from "../services/fiscalApi";

function FiscalProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    loadProjects();
  }, [page]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      console.log("🔍 Buscando projetos do fiscal...");
      const response = await fiscalApiService.getProjects(10, page);
      console.log("✅ Resposta recebida:", response.data);

      // A resposta vem em data.content (array de projetos)
      const projects = response.data.content || [];
      const totalPages = response.data.total_pages || 1;

      setProjects(projects);
      setTotalPages(totalPages);
      setHasMore(page < totalPages);
    } catch (error) {
      console.error("❌ Erro ao carregar projetos:", error);
      console.error("Detalhes do erro:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.andamento_do_projeto
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      project.bairro_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.status_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && page === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando projetos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white sticky top-0 z-50 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate("/fiscal/dashboard")}
              className="p-2 hover:bg-orange-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="font-bold text-lg">Meus Projetos</h1>
              <p className="text-xs text-orange-100">
                Projetos que você fiscaliza
              </p>
            </div>
          </div>

          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar projeto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
        </div>
      </div>

      {/* Lista de Projetos */}
      <div className="px-4 py-6">
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-md border border-gray-100">
            <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium mb-2">
              {searchTerm
                ? "Nenhum projeto encontrado"
                : "Nenhum projeto vinculado"}
            </p>
            <p className="text-sm text-gray-500">
              {searchTerm
                ? "Tente buscar com outros termos"
                : "Você ainda não está vinculado a nenhum projeto"}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() =>
                    navigate(`/fiscal/project/${project.id}/work-projects`)
                  }
                  className="bg-white rounded-xl p-4 shadow-md border border-gray-100 active:scale-98 transition-transform cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-base line-clamp-1 mb-2">
                        {project.name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {project.status_name && (
                          <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full whitespace-nowrap flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            {project.status_name}
                          </span>
                        )}
                      </div>

                      {project.andamento_do_projeto && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {project.andamento_do_projeto}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0 ml-2" />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
                    {project.bairro_name && (
                      <div className="flex items-center gap-1.5 bg-orange-50 px-2.5 py-1.5 rounded-lg">
                        <MapPin className="w-3.5 h-3.5 text-orange-600" />
                        <span className="font-medium text-orange-700">
                          {project.bairro_name}
                        </span>
                      </div>
                    )}
                    {project.empresa_name && (
                      <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1.5 rounded-lg">
                        <Building2 className="w-3.5 h-3.5 text-blue-600" />
                        <span className="font-medium text-blue-700">
                          {project.empresa_name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                    <div className="bg-gray-50 px-3 py-2 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">
                        Fiscalizações
                      </p>
                      <p className="text-lg font-bold text-gray-800">
                        {project.work_project_count || 0}
                      </p>
                    </div>
                    <div className="bg-gray-50 px-3 py-2 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">
                        Última Fiscalização
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {project.last_fiscalizacao_date || "Nenhuma"}
                      </p>
                    </div>
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
    </div>
  );
}

export default FiscalProjectsPage;
