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
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import { formatDate } from "../../utils/dateUtils";

export default function WorkProjectListPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId, projectName } = location.state || {};

  const [workProjects, setWorkProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!projectId) {
      navigate("/projectlistpage");
      return;
    }

    fetchWorkProjects();
  }, [projectId, currentPage, searchTerm]);

  const fetchWorkProjects = async () => {
    setLoading(true);
    try {
      const response =
        await workProjectApi.getWorkProjectsByProjectWithPagination(
          projectId,
          pageSize,
          currentPage
        );

      if (response.data?.content) {
        setWorkProjects(response.data.content);
        setTotalPages(Math.ceil(response.data.total / pageSize));
        setTotalItems(response.data.total);
      }
    } catch (error) {
      console.error("Erro ao buscar fiscalizações:", error);
      setWorkProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewWorkProject = (workProjectId) => {
    navigate(ROUTES.PROJECTS.WORK_PROJECT_VIEW, {
      state: {
        workProjectId: workProjectId,
        projectName: projectName,
      },
    });
  };

  const handleDownloadDocument = async (workProjectId, documentName) => {
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

  const filteredWorkProjects = workProjects.filter(
    (workProject) =>
      workProject.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workProject.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      workProject.fiscal?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (!projectId) {
    return null;
  }

  return (
    <BasePage pageTitle={`Fiscalizações - ${projectName}`}>
      <BaseContent
        pageTitle={`Fiscalizações - ${projectName}`}
        onBack={() => navigate(-1)}
        breadcrumbs={[
          { label: "Projetos", onClick: () => navigate("/projectlistpage") },
          { label: projectName, onClick: () => navigate(-1) },
          { label: "Fiscalizações" },
        ]}
      >
        <div className="space-y-6">
          {/* Header com estatísticas */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Fiscalizações do Projeto
                </h1>
                <p className="text-gray-600 mt-1">
                  {projectName} • {totalItems} fiscalização
                  {totalItems !== 1 ? "ões" : ""} encontrada
                  {totalItems !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por título, descrição ou fiscal..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Lista de Fiscalizações */}
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <LoadingSpinner size="lg" />
                <p className="text-gray-500 mt-4">
                  Carregando fiscalizações...
                </p>
              </div>
            ) : filteredWorkProjects.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fiscalização
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fiscal
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Documentos
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredWorkProjects.map((workProject) => (
                        <tr
                          key={workProject.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {workProject.title}
                              </h4>
                              <p className="text-sm text-gray-500 truncate max-w-xs">
                                {workProject.description}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-900">
                                {workProject.fiscal?.name || "Não informado"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-900">
                                {formatDate(workProject.created_at)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-900">
                                {workProject.additional_documents?.length || 0}{" "}
                                documento
                                {(workProject.additional_documents?.length ||
                                  0) !== 1
                                  ? "s"
                                  : ""}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() =>
                                  handleViewWorkProject(workProject.id)
                                }
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-colors"
                              >
                                <Eye className="w-3 h-3" />
                                Ver
                              </button>
                              {workProject.additional_documents?.length > 0 && (
                                <button
                                  onClick={() =>
                                    handleDownloadDocument(
                                      workProject.id,
                                      workProject.additional_documents[0]
                                    )
                                  }
                                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 transition-colors"
                                >
                                  <Download className="w-3 h-3" />
                                  Baixar
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Mostrando {(currentPage - 1) * pageSize + 1} a{" "}
                        {Math.min(currentPage * pageSize, totalItems)} de{" "}
                        {totalItems} fiscalizações
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Anterior
                        </button>
                        <span className="px-3 py-1.5 text-sm font-medium text-gray-900">
                          {currentPage} de {totalPages}
                        </span>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Próxima
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-12 text-center">
                <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma fiscalização encontrada
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "Nenhuma fiscalização corresponde aos critérios de busca."
                    : "Este projeto ainda não possui fiscalizações registradas."}
                </p>
              </div>
            )}
          </div>
        </div>
      </BaseContent>
    </BasePage>
  );
}
