import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BasePage from "../../components/layout/BasePage";
import BaseContent from "../../components/BaseContent";
import LoadingContent from "../../features/contents/LoadingContent";
import folderAPI from "../../services/api/folder";
import Swal from "sweetalert2";
import {
  Folder,
  ArrowLeft,
  FolderOpen,
  Calendar,
  DollarSign,
  Eye,
} from "lucide-react";
import { ROUTES } from "../../config/constants";
import { formatDate } from "../../utils/dateUtils";

export default function FolderViewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const folderData = location.state?.item;

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!folderData?.id) {
      Swal.fire("Erro", "Pasta não fornecida", "error");
      navigate(-1);
      return;
    }

    const fetchProjects = async () => {
      try {
        const response = await folderAPI.getProjectsByFolder(folderData.id);
        setProjects(response.data.content || []);
      } catch (error) {
        console.error("Erro ao carregar projetos:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [folderData, navigate]);

  const handleViewProject = (project) => {
    navigate(`/project/${project.id}`);
  };

  if (loading) {
    return (
      <BasePage pageTitle="">
        <LoadingContent pageTitle="Carregando..." />
      </BasePage>
    );
  }

  return (
    <BasePage pageTitle="">
      <BaseContent
        pageTitle={`Pasta: ${folderData.name || "N/A"}`}
        onBack={() => navigate(-1)}
        breadcrumbs={[
          { label: "Pastas", onClick: () => navigate(ROUTES.FOLDERS.LIST) },
          { label: folderData.name || "Detalhes" },
        ]}
      >
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-4">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Card da Pasta */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Folder className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {folderData.name || "N/A"}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {projects.length}{" "}
                    {projects.length === 1 ? "projeto" : "projetos"} nesta pasta
                  </p>
                </div>
              </div>
            </div>

            {/* Lista de Projetos */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <FolderOpen className="w-6 h-6 text-teal-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Projetos Relacionados
                </h2>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-12">
                  <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    Nenhum projeto encontrado nesta pasta
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="border border-gray-200 rounded-xl p-4 hover:border-teal-300 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {project.name || `Projeto #${project.id}`}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {project.andamento_do_projeto || "Sem descrição"}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>
                                Início: {formatDate(project.start_date)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <DollarSign className="w-4 h-4" />
                              <span>
                                Verba:{" "}
                                {project.verba_disponivel
                                  ? `R$ ${parseFloat(
                                      project.verba_disponivel
                                    ).toLocaleString("pt-BR")}`
                                  : "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleViewProject(project)}
                          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Ver Detalhes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botão Voltar */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para Lista
            </button>
          </div>
        </div>
      </BaseContent>
    </BasePage>
  );
}

