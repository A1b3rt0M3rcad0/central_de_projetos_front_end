import BaseContent from "../../components/BaseContent";
import StatusBadge from "../../components/ui/StatusBadge";
import EnhancedTooltip from "../../components/ui/EnhancedTooltip";
import {
  Download,
  FileText,
  Calendar,
  DollarSign,
  MapPin,
  Building,
  User,
  Users,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  PlayCircle,
  Target,
  Flag,
  Upload,
  UserRoundPen,
  Edit,
  MoreHorizontal,
  Eye,
  List,
  Network,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/constants";
import { useEffect, useState } from "react";
import { formatDate } from "../../utils/dateUtils";
import { workProjectApi } from "../../services";
import { usePermissions } from "../../hooks/usePermissions";

export default function ProjectContent({ onBack, project, downloadDocument }) {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [showActions, setShowActions] = useState(false);
  const [latestWorkProject, setLatestWorkProject] = useState(null);
  const [loadingWorkProject, setLoadingWorkProject] = useState(false);

  // Hook de permissões
  const permissions = usePermissions(userRole);

  useEffect(() => {
    const fetchUserRole = async () => {
      const userInfo = localStorage.getItem("user_info");
      if (userInfo) {
        const userInfoParsed = JSON.parse(userInfo);
        setUserRole(userInfoParsed.role);
      }
    };
    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchLatestWorkProject = async () => {
      if (!project?.id) return;

      setLoadingWorkProject(true);
      try {
        const response = await workProjectApi.getLatestWorkProjectByProject(
          project.id
        );
        if (response.data?.content) {
          setLatestWorkProject(response.data.content);
        }
      } catch (error) {
        console.log("Nenhuma fiscalização encontrada para este projeto");
        setLatestWorkProject(null);
      } finally {
        setLoadingWorkProject(false);
      }
    };

    fetchLatestWorkProject();
  }, [project?.id]);

  const handleDownloadDocument = (project_id, document_name) => {
    downloadDocument(project_id, document_name);
  };

  const handleViewHistory = () => {
    navigate(ROUTES.PROJECTS.HISTORY, {
      state: {
        projectId: project.id,
        projectName: project.name,
      },
    });
  };

  const handleUploadDocument = () => {
    navigate("/documentform", {
      state: { initial_date: project },
    });
  };

  const handleProjectAssociation = () => {
    navigate("/projectassociationform", {
      state: { initial_date: project },
    });
  };

  const handleEditProject = () => {
    navigate("/projectform", {
      state: { initial_date: project },
    });
  };

  const handleViewAllWorkProjects = () => {
    navigate(ROUTES.PROJECTS.WORK_PROJECTS, {
      state: {
        projectId: project.id,
        projectName: project.name,
      },
    });
  };

  const handleViewWorkProject = (workProjectId) => {
    navigate(ROUTES.PROJECTS.WORK_PROJECT_VIEW, {
      state: {
        workProjectId: workProjectId,
        projectName: project.name,
      },
    });
  };

  const handleViewEAP = () => {
    navigate(`/project/${project.id}/eap`, { state: { project } });
  };

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("aguardando"))
      return <AlertCircle className="w-4 h-4 text-orange-500" />;
    if (statusLower.includes("em andamento"))
      return <PlayCircle className="w-4 h-4 text-blue-500" />;
    if (statusLower.includes("concluído"))
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (statusLower.includes("cancelado"))
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    return <Target className="w-4 h-4 text-gray-500" />;
  };

  const formatCurrency = (value) => {
    if (typeof value !== "number") return "--";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <BaseContent
      pageTitle={project.name}
      onBack={onBack}
      breadcrumbs={[
        { label: "Projetos", onClick: () => navigate("/projectlistpage") },
        { label: "Detalhes" },
      ]}
    >
      <div className="space-y-6">
        {/* Header com Status */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {project.name}
                </h1>
                <p className="text-gray-600">ID: {project.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {getStatusIcon(project.status?.description)}
                <StatusBadge status={project.status?.description} size="lg" />
              </div>

              {/* Botão de Ações */}
              {permissions.canEditProject && (
                <div className="relative">
                  <button
                    onClick={() => setShowActions(!showActions)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                    Ações
                  </button>

                  {/* Dropdown de Ações */}
                  {showActions && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            handleEditProject();
                            setShowActions(false);
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                          Editar Projeto
                        </button>
                        <button
                          onClick={() => {
                            handleViewEAP();
                            setShowActions(false);
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                        >
                          <Network className="w-4 h-4 text-indigo-600" />
                          Gerenciar EAP
                        </button>
                        <button
                          onClick={() => {
                            handleUploadDocument();
                            setShowActions(false);
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Upload className="w-4 h-4 text-green-600" />
                          Upload Documento
                        </button>
                        <button
                          onClick={() => {
                            handleProjectAssociation();
                            setShowActions(false);
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <UserRoundPen className="w-4 h-4 text-purple-600" />
                          Associar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações do Projeto */}
          <div className="lg:col-span-2 space-y-6">
            {/* Orçamento e Cronograma */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Orçamento */}
              <div className="bg-white p-6 rounded-2xl shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Orçamento
                    </h3>
                  </div>
                  {permissions.canEditProject && (
                    <button
                      onClick={handleEditProject}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar orçamento"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Valor Disponível:</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatCurrency(project.verba_disponivel)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Situação:</span>
                    <div className="relative group">
                      <span className="text-sm text-gray-700 truncate max-w-[200px] block">
                        {project.andamento_do_projeto || "Não informado"}
                      </span>
                      {project.andamento_do_projeto &&
                        project.andamento_do_projeto.length > 30 && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                            {project.andamento_do_projeto}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cronograma */}
              <div className="bg-white p-6 rounded-2xl shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Cronograma
                    </h3>
                  </div>
                  {permissions.canEditProject && (
                    <button
                      onClick={handleEditProject}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar cronograma"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Início:</span>
                    <span className="text-sm font-medium">
                      {formatDate(project.start_date)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Previsão:</span>
                    <span className="text-sm font-medium">
                      {formatDate(project.expected_completion_date)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Conclusão:</span>
                    <span className="text-sm font-medium">
                      {formatDate(project.end_date)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Histórico */}
            <div className="bg-white p-6 rounded-2xl shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Histórico de Alterações
                  </h3>
                </div>
                <button
                  onClick={handleViewHistory}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
                  Ver Completo
                </button>
              </div>

              {project.history_project && project.history_project.length > 0 ? (
                <div className="space-y-3">
                  {project.history_project
                    .slice(-3)
                    .reverse()
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="p-1 bg-white rounded-full">
                          <Clock className="w-3 h-3 text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {item.data_name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {item.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.updated_at}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Nenhuma alteração registrada</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Vínculos */}
          <div className="space-y-6">
            {/* Vínculos */}
            <div className="bg-white p-6 rounded-2xl shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Users className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Vínculos
                  </h3>
                </div>
                {permissions.canEditProject && (
                  <button
                    onClick={handleProjectAssociation}
                    className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Gerenciar vínculos"
                  >
                    <UserRoundPen className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Bairros</p>
                    <EnhancedTooltip
                      type="location"
                      richContent={{
                        title: "Bairros Associados",
                        sections: [
                          {
                            label: "Localização",
                            items:
                              Array.isArray(project.bairro) &&
                              project.bairro.length > 0
                                ? project.bairro.map((b) => b.name)
                                : ["Nenhum bairro associado"],
                          },
                        ],
                        footer:
                          "Estes são os bairros onde o projeto será executado",
                      }}
                    >
                      <p className="text-sm font-medium truncate cursor-help">
                        {Array.isArray(project.bairro) &&
                        project.bairro.length > 0
                          ? project.bairro.length === 1
                            ? project.bairro[0].name
                            : `${project.bairro.length} bairros associados`
                          : "Não informado"}
                      </p>
                    </EnhancedTooltip>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Building className="w-4 h-4 text-gray-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Empresas</p>
                    <EnhancedTooltip
                      type="company"
                      richContent={{
                        title: "Empresas Executoras",
                        sections: [
                          {
                            label: "Contratadas",
                            items:
                              Array.isArray(project.empresa) &&
                              project.empresa.length > 0
                                ? project.empresa.map((e) => e.name)
                                : ["Nenhuma empresa contratada"],
                          },
                        ],
                        footer:
                          "Empresas responsáveis pela execução do projeto",
                      }}
                    >
                      <p className="text-sm font-medium truncate cursor-help">
                        {Array.isArray(project.empresa) &&
                        project.empresa.length > 0
                          ? project.empresa.length === 1
                            ? project.empresa[0].name
                            : `${project.empresa.length} empresas associadas`
                          : "Não informado"}
                      </p>
                    </EnhancedTooltip>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Flag className="w-4 h-4 text-gray-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Tipos</p>
                    <EnhancedTooltip
                      type="type"
                      richContent={{
                        title: "Tipos de Projeto",
                        sections: [
                          {
                            label: "Categorias",
                            items:
                              Array.isArray(project.types) &&
                              project.types.length > 0
                                ? project.types.map((t) => t.name)
                                : ["Nenhum tipo definido"],
                          },
                        ],
                        footer: "Categorias que classificam este projeto",
                      }}
                    >
                      <p className="text-sm font-medium truncate cursor-help">
                        {Array.isArray(project.types) &&
                        project.types.length > 0
                          ? project.types.length === 1
                            ? project.types[0].name
                            : `${project.types.length} tipos associados`
                          : "Não informado"}
                      </p>
                    </EnhancedTooltip>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Fiscais</p>
                    <EnhancedTooltip
                      type="user"
                      richContent={{
                        title: "Fiscais Responsáveis",
                        sections: [
                          {
                            label: "Supervisores",
                            items:
                              Array.isArray(project.fiscal) &&
                              project.fiscal.length > 0
                                ? project.fiscal.map((f) => f.name)
                                : ["Nenhum fiscal designado"],
                          },
                        ],
                        footer:
                          "Fiscais responsáveis pela supervisão do projeto",
                      }}
                    >
                      <p className="text-sm font-medium truncate cursor-help">
                        {Array.isArray(project.fiscal) &&
                        project.fiscal.length > 0
                          ? project.fiscal.length === 1
                            ? project.fiscal[0].name
                            : `${project.fiscal.length} fiscais associados`
                          : "Não informado"}
                      </p>
                    </EnhancedTooltip>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-gray-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Vereador</p>
                    <EnhancedTooltip
                      type="users"
                      richContent={{
                        title: "Vereador Responsável",
                        sections: [
                          {
                            label: "Representante",
                            items: project.user?.name
                              ? [project.user.name]
                              : ["Não informado"],
                          },
                          ...(project.user?.cpf
                            ? [
                                {
                                  label: "CPF",
                                  content: `***${project.user.cpf.slice(-5)}`,
                                },
                              ]
                            : []),
                        ],
                        footer: "Vereador responsável por este projeto",
                      }}
                    >
                      <p className="text-sm font-medium truncate cursor-help">
                        {project.user?.name || "Não informado"}
                      </p>
                    </EnhancedTooltip>
                  </div>
                </div>
              </div>
            </div>

            {/* Última Fiscalização - Visível para TODOS os roles (ADMIN, VEREADOR, ASSESSOR) */}
            <div className="bg-white p-6 rounded-2xl shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Eye className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Última Fiscalização
                  </h3>
                </div>
                {/* Botão Ver Todas - Todos podem visualizar fiscalizações */}
                <button
                  onClick={handleViewAllWorkProjects}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                >
                  <List className="w-4 h-4" />
                  Ver Todas
                </button>
              </div>

              {loadingWorkProject ? (
                <div className="text-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="text-gray-500 text-sm mt-2">Carregando...</p>
                </div>
              ) : latestWorkProject ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-green-900 mb-1">
                          {latestWorkProject.title}
                        </h4>
                        <p className="text-sm text-green-700 mb-2">
                          {latestWorkProject.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-green-600">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {latestWorkProject.fiscal?.name ||
                              "Fiscal não informado"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(latestWorkProject.created_at)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleViewWorkProject(latestWorkProject.id)
                        }
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-white border border-green-300 rounded-lg hover:bg-green-50 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Eye className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">
                    Nenhuma fiscalização encontrada
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    As fiscalizações aparecerão aqui quando forem criadas
                  </p>
                </div>
              )}
            </div>

            {/* Documentos */}
            <div className="bg-white p-6 rounded-2xl shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <FileText className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Documentos
                  </h3>
                </div>
                {permissions.canEditProject && (
                  <button
                    onClick={handleUploadDocument}
                    className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Upload documento"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                )}
              </div>

              {project.documents && project.documents.length > 0 ? (
                <div className="space-y-3">
                  {project.documents.map((filename, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <FileText className="w-4 h-4 text-gray-500 shrink-0" />
                        <div className="relative group flex-1 min-w-0">
                          <span className="text-sm truncate block">
                            {filename}
                          </span>
                          {filename.length > 30 && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                              {filename}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleDownloadDocument(project.id, filename)
                        }
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                        Baixar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">
                    Nenhum documento disponível
                  </p>
                  {permissions.canEditProject && (
                    <button
                      onClick={handleUploadDocument}
                      className="mt-3 flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 transition-all duration-200 mx-auto"
                    >
                      <Upload className="w-4 h-4" />
                      Fazer primeiro upload
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </BaseContent>
  );
}
