import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BasePage from "../../components/layout/BasePage";
import BaseContent from "../../components/BaseContent";
import LoadingContent from "../../features/contents/LoadingContent";
import fiscalAPI from "../../services/api/fiscal";
import statusAPI from "../../services/api/status";
import Swal from "sweetalert2";
import {
  Shield,
  Mail,
  Phone,
  Filter,
  X,
  FileText,
  MapPin,
  Calendar,
  DollarSign,
  Eye,
  ChevronLeft,
  ChevronRight,
  Folder,
  ClipboardCheck,
} from "lucide-react";
import { ROUTES } from "../../config/constants";
import { formatDate, formatDateTime } from "../../utils/dateUtils";

export default function FiscalViewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const fiscalData = location.state?.item;

  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [paginatedProjects, setPaginatedProjects] = useState([]);
  const [workProjects, setWorkProjects] = useState([]);
  const [allStatus, setAllStatus] = useState([]);
  const [excludedStatus, setExcludedStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  // Paginação de projetos
  const [projectsPage, setProjectsPage] = useState(1);
  const projectsPageSize = 6;

  // Paginação de work projects
  const [workProjectsPage, setWorkProjectsPage] = useState(1);
  const [totalWorkProjects, setTotalWorkProjects] = useState(0);
  const workProjectsPageSize = 4;

  useEffect(() => {
    if (!fiscalData?.id) {
      Swal.fire("Erro", "Fiscal não fornecido", "error");
      navigate(-1);
      return;
    }

    const fetchData = async () => {
      try {
        // Buscar status sempre
        const statusResponse = await statusAPI.getAllStatus();
        setAllStatus(statusResponse.data.content || []);

        // Buscar projetos do fiscal (pode retornar 404 se não houver)
        try {
          const projectsResponse = await fiscalAPI.getProjectsByFiscal(
            fiscalData.id
          );
          const projectsData = projectsResponse.data.content || [];
          setAllProjects(projectsData);
          setFilteredProjects(projectsData);
        } catch (error) {
          // Se retornar 404, significa que não há projetos - não é erro
          if (error.response?.status === 404) {
            console.log("Fiscal não possui projetos associados");
            setAllProjects([]);
            setFilteredProjects([]);
          } else {
            throw error;
          }
        }

        // Buscar work projects (pode retornar 404 se não houver)
        fetchWorkProjects(1);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        Swal.fire("Erro", "Erro ao carregar dados do fiscal", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fiscalData, navigate]);

  const fetchWorkProjects = async (page) => {
    try {
      const response = await fiscalAPI.getWorkProjectsByFiscal(
        fiscalData.id,
        workProjectsPageSize,
        page
      );
      setWorkProjects(response.data.content || []);
      setTotalWorkProjects(response.data.total || 0);
      setWorkProjectsPage(page);
    } catch (error) {
      // Se retornar 404, significa que não há work projects - não é erro
      if (error.response?.status === 404) {
        console.log("Fiscal não possui fiscalizações");
        setWorkProjects([]);
        setTotalWorkProjects(0);
      } else {
        console.error("Erro ao carregar fiscalizações:", error);
        setWorkProjects([]);
        setTotalWorkProjects(0);
      }
    }
  };

  // Aplicar filtro e paginação
  useEffect(() => {
    let filtered = allProjects;
    if (excludedStatus.length > 0) {
      filtered = allProjects.filter(
        (project) => !excludedStatus.includes(project.status_id)
      );
    }
    setFilteredProjects(filtered);
    setProjectsPage(1); // Reset para primeira página ao filtrar
  }, [excludedStatus, allProjects]);

  // Paginar projetos filtrados
  useEffect(() => {
    const startIndex = (projectsPage - 1) * projectsPageSize;
    const endIndex = startIndex + projectsPageSize;
    setPaginatedProjects(filteredProjects.slice(startIndex, endIndex));
  }, [filteredProjects, projectsPage]);

  const toggleStatusFilter = (statusId) => {
    setExcludedStatus((prev) =>
      prev.includes(statusId)
        ? prev.filter((id) => id !== statusId)
        : [...prev, statusId]
    );
  };

  const handleViewProject = (project) => {
    navigate(ROUTES.PROJECTS.VIEW, {
      state: { initial_date: { id: project.id } },
    });
  };

  const handleViewWorkProject = (workProject) => {
    navigate(ROUTES.PROJECTS.WORK_PROJECT_VIEW, {
      state: {
        workProjectId: workProject.id,
        projectName:
          workProject.project?.name || `Projeto #${workProject.project_id}`,
      },
    });
  };

  if (loading) {
    return (
      <BasePage pageTitle="">
        <LoadingContent pageTitle="Carregando..." />
      </BasePage>
    );
  }

  const totalProjectsPages = Math.ceil(
    filteredProjects.length / projectsPageSize
  );
  const totalWorkProjectsPages = Math.ceil(
    totalWorkProjects / workProjectsPageSize
  );

  return (
    <BasePage pageTitle="">
      <BaseContent
        pageTitle={fiscalData.name || "Fiscal"}
        onBack={() => navigate(-1)}
        breadcrumbs={[
          { label: "Fiscais", onClick: () => navigate(ROUTES.FISCAIS.LIST) },
          { label: fiscalData.name || "Detalhes" },
        ]}
      >
        <div className="space-y-6">
          {/* Header com informações do fiscal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Card Principal */}
            <div className="lg:col-span-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-3">{fiscalData.name}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {fiscalData.email && (
                      <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                        <Mail className="w-4 h-4" />
                        <span>{fiscalData.email}</span>
                      </div>
                    )}
                    {fiscalData.phone && (
                      <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                        <Phone className="w-4 h-4" />
                        <span>{fiscalData.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Folder className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {allProjects.length}
                    </div>
                    <div className="text-xs text-gray-600">
                      {allProjects.length === 1 ? "Projeto" : "Projetos"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <ClipboardCheck className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-600">
                      {totalWorkProjects}
                    </div>
                    <div className="text-xs text-gray-600">
                      {totalWorkProjects === 1
                        ? "Fiscalização"
                        : "Fiscalizações"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filtro de Status Compacto */}
          {allStatus.length > 0 && (
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">
                    Filtrar Projetos
                  </h3>
                  <span className="text-xs text-gray-500">
                    (clique para ocultar)
                  </span>
                </div>
                {excludedStatus.length > 0 && (
                  <button
                    onClick={() => setExcludedStatus([])}
                    className="flex items-center gap-1 px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <X className="w-3 h-3" />
                    Limpar
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {allStatus.map((status) => {
                  const isExcluded = excludedStatus.includes(status.id);
                  return (
                    <button
                      key={status.id}
                      onClick={() => toggleStatusFilter(status.id)}
                      className={`px-3 py-1 text-xs rounded-lg border transition-all ${
                        isExcluded
                          ? "bg-red-50 border-red-300 text-red-600 line-through opacity-60"
                          : "bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                      }`}
                    >
                      {status.description}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Projetos em Grid */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Folder className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Projetos Fiscalizados
                </h2>
                <span className="text-sm text-gray-500">
                  ({filteredProjects.length})
                </span>
              </div>
            </div>

            {paginatedProjects.length === 0 ? (
              <div className="text-center py-8">
                <Folder className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">
                  {excludedStatus.length > 0
                    ? "Nenhum projeto após aplicar filtros"
                    : "Nenhum projeto encontrado"}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedProjects.map((project) => (
                    <div
                      key={project.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => handleViewProject(project)}
                    >
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                        {project.name || `Projeto #${project.id}`}
                      </h3>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                        {project.andamento_do_projeto || "Sem descrição"}
                      </p>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-3 h-3" />
                          {formatDate(project.start_date)}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <DollarSign className="w-3 h-3" />
                          {project.verba_disponivel
                            ? `R$ ${parseFloat(
                                project.verba_disponivel
                              ).toLocaleString("pt-BR")}`
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Paginação de Projetos */}
                {totalProjectsPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t">
                    <button
                      onClick={() => setProjectsPage((p) => Math.max(1, p - 1))}
                      disabled={projectsPage === 1}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-600">
                      {projectsPage} de {totalProjectsPages}
                    </span>
                    <button
                      onClick={() =>
                        setProjectsPage((p) =>
                          Math.min(totalProjectsPages, p + 1)
                        )
                      }
                      disabled={projectsPage >= totalProjectsPages}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Últimas Fiscalizações em Grid */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Últimas Fiscalizações
                </h2>
                <span className="text-sm text-gray-500">
                  ({totalWorkProjects})
                </span>
              </div>
            </div>

            {workProjects.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Nenhuma fiscalização encontrada</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {workProjects.map((wp) => (
                    <div
                      key={wp.id}
                      className="border-l-4 border-indigo-500 bg-gradient-to-r from-indigo-50/50 to-white rounded-lg p-4 hover:shadow-md hover:border-indigo-600 transition-all cursor-pointer"
                      onClick={() => handleViewWorkProject(wp)}
                    >
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">
                          {wp.title || "Fiscalização"}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {wp.description || "Sem descrição"}
                        </p>

                        {/* Data e Projeto em Grid */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-white border border-indigo-200 rounded-lg p-2">
                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                              <Calendar className="w-3 h-3" />
                              Data
                            </div>
                            <div className="text-xs font-semibold text-indigo-700">
                              {formatDate(wp.created_at)}
                            </div>
                          </div>
                          {wp.project && (
                            <div className="bg-white border border-blue-200 rounded-lg p-2">
                              <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                <MapPin className="w-3 h-3" />
                                Projeto
                              </div>
                              <div className="text-xs font-semibold text-blue-700 line-clamp-1">
                                {wp.project.name || `#${wp.project_id}`}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Documentos */}
                        <div className="flex items-center gap-1 text-xs text-gray-600 pt-2 border-t">
                          {wp.additional_documents &&
                          wp.additional_documents.length > 0 ? (
                            <>
                              <FileText className="w-3 h-3" />
                              {wp.additional_documents.length} documento(s)
                            </>
                          ) : (
                            <>
                              <FileText className="w-3 h-3 text-gray-400" />
                              Sem documentos
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Paginação de Work Projects */}
                {totalWorkProjectsPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t">
                    <button
                      onClick={() => fetchWorkProjects(workProjectsPage - 1)}
                      disabled={workProjectsPage === 1}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-600">
                      {workProjectsPage} de {totalWorkProjectsPages}
                    </span>
                    <button
                      onClick={() => fetchWorkProjects(workProjectsPage + 1)}
                      disabled={workProjectsPage >= totalWorkProjectsPages}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </BaseContent>
    </BasePage>
  );
}
