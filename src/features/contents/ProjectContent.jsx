import BaseContent from "../../components/BaseContent";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/constants";
import { useEffect, useState } from "react";

export default function ProjectContent({ onBack, project, downloadDocument }) {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [showActions, setShowActions] = useState(false);

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

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("aguardando"))
      return "bg-orange-50 text-orange-700 border-orange-200";
    if (statusLower.includes("em andamento"))
      return "bg-blue-50 text-blue-700 border-blue-200";
    if (statusLower.includes("concluído"))
      return "bg-green-50 text-green-700 border-green-200";
    if (statusLower.includes("cancelado"))
      return "bg-red-50 text-red-700 border-red-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
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

  const formatDate = (dateString) => {
    if (!dateString) return "--";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("pt-BR");
    } catch {
      return dateString;
    }
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
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    project.status?.description
                  )}`}
                >
                  {project.status?.description || "Status não definido"}
                </span>
              </div>

              {/* Botão de Ações */}
              {userRole?.toUpperCase() === "ADMIN" && (
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
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
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
                  {userRole?.toUpperCase() === "ADMIN" && (
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
                  {userRole?.toUpperCase() === "ADMIN" && (
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
                {userRole?.toUpperCase() === "ADMIN" && (
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
                    <p className="text-xs text-gray-500">Bairro</p>
                    <div className="relative group">
                      <p className="text-sm font-medium truncate">
                        {project.bairro?.name || "Não informado"}
                      </p>
                      {project.bairro?.name &&
                        project.bairro.name.length > 25 && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                            {project.bairro.name}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Building className="w-4 h-4 text-gray-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Empresa</p>
                    <div className="relative group">
                      <p className="text-sm font-medium truncate">
                        {project.empresa?.name || "Não informado"}
                      </p>
                      {project.empresa?.name &&
                        project.empresa.name.length > 25 && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                            {project.empresa.name}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Flag className="w-4 h-4 text-gray-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Tipo</p>
                    <div className="relative group">
                      <p className="text-sm font-medium truncate">
                        {project.types?.name || "Não informado"}
                      </p>
                      {project.types?.name &&
                        project.types.name.length > 25 && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                            {project.types.name}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Fiscal</p>
                    <div className="relative group">
                      <p className="text-sm font-medium truncate">
                        {project.fiscal?.name || "Não informado"}
                      </p>
                      {project.fiscal?.name &&
                        project.fiscal.name.length > 25 && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                            {project.fiscal.name}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-gray-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Vereador</p>
                    <div className="relative group">
                      <p className="text-sm font-medium truncate">
                        {project.user?.name || "Não informado"}
                      </p>
                      {project.user?.name && project.user.name.length > 25 && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                          {project.user.name}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
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
                {userRole?.toUpperCase() === "ADMIN" && (
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
                  {userRole?.toUpperCase() === "ADMIN" && (
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
