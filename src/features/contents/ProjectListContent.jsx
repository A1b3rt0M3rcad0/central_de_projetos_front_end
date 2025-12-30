import { useNavigate } from "react-router-dom";
import BaseContent from "../../components/BaseContent";
import DataTable from "../../components/ui/DataTable";
import StatusBadge from "../../components/ui/StatusBadge";
import {
  Pencil,
  Trash2,
  Eye,
  FileUp,
  UserRoundPen,
  MapPin,
  Building,
  UserCheck,
  Users,
  Tag,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
  Folder,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { usePermissions } from "../../hooks/usePermissions";

export default function ProjectListContent({
  projects,
  onCreate,
  onEdit,
  onDelete,
  onSelect,
  onBack,
  onPageChange,
  onNextPage,
  onPrevPage,
  onSearch,
  loading,
  currentPage,
  totalPages,
  totalProjects,
  searchTerm,
}) {
  const navigate = useNavigate();
  const [role, setRole] = useState();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || "");
  const [isSearching, setIsSearching] = useState(false);

  // Hook de permissões
  const permissions = usePermissions(role);

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = localStorage.getItem("user_info");
      const userInfoParsed = JSON.parse(userInfo);
      setRole(userInfoParsed.role);
    };
    fetchData();
  }, []);

  // Sincronizar estado local com prop
  useEffect(() => {
    setLocalSearchTerm(searchTerm || "");
  }, [searchTerm]);

  // Função para executar a busca
  const handleSearch = () => {
    if (localSearchTerm !== searchTerm) {
      setIsSearching(true);
      onSearch(localSearchTerm);
      // Reset do indicador após um tempo
      setTimeout(() => setIsSearching(false), 1000);
    }
  };

  // Handler para tecla Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Função para truncar texto longo
  const truncateText = (text, maxLength = 20) => {
    if (!text) return "--";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Função para gerar números de página com ellipsis
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      // Se temos poucas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Sempre mostrar primeira página
      pages.push(1);

      if (currentPage <= 4) {
        // Páginas iniciais
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Páginas finais
        pages.push("ellipsis");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Páginas do meio
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Configuração das colunas - Otimizada para evitar scrollbar lateral
  const columns = [
    {
      key: "id",
      label: "ID",
      sortable: true,
      type: "number",
      className: "hidden xl:table-cell w-12",
    },
    {
      key: "name",
      label: "Nome do Projeto",
      sortable: true,
      type: "truncate",
      className: "min-w-[180px] max-w-[250px]",
      render: (value) => (
        <div className="truncate" title={value}>
          <span className="font-medium text-sm">{truncateText(value, 25)}</span>
        </div>
      ),
    },
    {
      key: "bairro",
      label: "Bairro",
      sortable: true,
      type: "truncate",
      className: "hidden 2xl:table-cell w-24",
      accessor: (item) => item.bairro?.name,
      render: (value, item) => (
        <div className="flex items-center gap-1 truncate" title={value}>
          <MapPin className="w-3 h-3 text-red-500 flex-shrink-0" />
          <span className="truncate text-xs">{truncateText(value, 15)}</span>
        </div>
      ),
    },
    {
      key: "empresa",
      label: "Empresa",
      sortable: true,
      type: "truncate",
      className: "hidden 2xl:table-cell w-24",
      accessor: (item) => item.empresa?.name,
      render: (value, item) => (
        <div className="flex items-center gap-1 truncate" title={value}>
          <Building className="w-3 h-3 text-blue-500 flex-shrink-0" />
          <span className="truncate text-xs">{truncateText(value, 15)}</span>
        </div>
      ),
    },
    {
      key: "fiscal",
      label: "Fiscal",
      sortable: true,
      type: "truncate",
      className: "hidden 2xl:table-cell w-20",
      accessor: (item) => item.fiscal?.name,
      render: (value, item) => (
        <div className="flex items-center gap-1 truncate" title={value}>
          <UserCheck className="w-3 h-3 text-indigo-500 flex-shrink-0" />
          <span className="truncate text-xs">{truncateText(value, 12)}</span>
        </div>
      ),
    },
    {
      key: "user",
      label: "Vereador",
      sortable: true,
      type: "truncate",
      className: "hidden 2xl:table-cell w-20",
      accessor: (item) => item.user?.name,
      render: (value, item) => (
        <div className="flex items-center gap-1 truncate" title={value}>
          <Users className="w-3 h-3 text-purple-500 flex-shrink-0" />
          <span className="truncate text-xs">{truncateText(value, 12)}</span>
        </div>
      ),
    },
    {
      key: "andamento_do_projeto",
      label: "Situação",
      sortable: true,
      type: "truncate",
      className: "hidden lg:table-cell w-28",
      render: (value) => (
        <div className="truncate" title={value}>
          <span className="text-xs">{truncateText(value, 20)}</span>
        </div>
      ),
    },
    {
      key: "types",
      label: "Tipo",
      sortable: true,
      type: "truncate",
      className: "hidden xl:table-cell w-20",
      accessor: (item) => item.types?.name,
      render: (value, item) => (
        <div className="flex items-center gap-1 truncate" title={value}>
          <Tag className="w-3 h-3 text-green-500 flex-shrink-0" />
          <span className="truncate text-xs">{truncateText(value, 12)}</span>
        </div>
      ),
    },
    {
      key: "folder",
      label: "Pasta",
      sortable: true,
      type: "truncate",
      className: "hidden xl:table-cell w-24",
      accessor: (item) => item.folder?.name,
      render: (value, item) => (
        <div className="flex items-center gap-1 truncate" title={value || "--"}>
          <Folder className="w-3 h-3 text-teal-500 flex-shrink-0" />
          <span className="truncate text-xs">
            {value ? truncateText(value, 15) : "--"}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      type: "status",
      className: "hidden md:table-cell w-32",
      accessor: (item) => item.status?.description,
      render: (value) => <StatusBadge status={value} size="md" />,
    },
  ];

  // Configuração da tabela
  const config = {
    title: "Projetos",
    createButtonText: "Criar Projeto",
    searchPlaceholder: "Buscar por nome, bairro, empresa...",
    emptyMessage: "Nenhum projeto encontrado.",
    showSearch: false, // Desabilitado pois usamos busca global
    showPagination: false, // Desabilitamos a paginação do DataTable pois já temos a nossa própria
    showRefresh: true,
    showBulkActions: permissions.canBulkActions,
    showExport: true,
    loading: loading,
    // Configurações para evitar scrollbar lateral
    tableClassName: "min-w-full overflow-x-auto",
    containerClassName: "max-w-full",
  };

  // Ações simplificadas - apenas visualização e exclusão
  const actions = {
    bulk: permissions.canBulkActions
      ? [
            {
              label: "Ativar Projetos",
              icon: <TrendingUp className="w-4 h-4" />,
              onClick: (selectedItems) => {
                console.log("Ativar projetos:", selectedItems);
                // Implementar lógica de ativação
              },
            },
            {
              label: "Exportar Selecionados",
              icon: <FileUp className="w-4 h-4" />,
              onClick: (selectedItems) => {
                console.log("Exportar projetos:", selectedItems);
                // Implementar exportação
              },
            },
          ]
        : [],
    row: [
      {
        label: "Visualizar",
        icon: <Eye className="w-4 h-4" />,
        className: "text-blue-600 hover:bg-blue-50",
        onClick: (project) => {
          onSelect(project);
        },
      },
      ...(permissions.canDeleteProject
        ? [
            {
              label: "Excluir",
              icon: <Trash2 className="w-4 h-4" />,
              className: "text-red-600 hover:bg-red-50",
              onClick: (project) => {
                onDelete(project);
              },
            },
          ]
        : []),
    ],
    export: {
      onClick: () => {
        console.log("Exportar todos os projetos");
        // Implementar exportação completa
      },
    },
  };

  return (
    <BaseContent
      pageTitle="Projetos"
      onBack={onBack}
      breadcrumbs={[{ label: "Lista de Projetos" }]}
    >
      <div className="space-y-6">
        {/* Campo de busca personalizado */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nome do projeto ou situação... (pressione Enter)"
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              {isSearching && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            {localSearchTerm && (
              <button
                onClick={() => {
                  setLocalSearchTerm("");
                  onSearch("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* DataTable */}
        <div className="overflow-x-auto">
          <DataTable
            data={projects}
            columns={columns}
            config={config}
            onCreate={permissions.canCreateProject ? onCreate : null}
            onRefresh={() => window.location.reload()}
            actions={actions}
          />
        </div>

        {/* Paginação customizada - Design melhorado */}
        {totalPages > 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Informações da paginação */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">
                      Resultados
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Mostrando{" "}
                    <span className="font-semibold text-gray-900">
                      {projects.length}
                    </span>{" "}
                    de{" "}
                    <span className="font-semibold text-gray-900">
                      {totalProjects}
                    </span>{" "}
                    projetos
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Página</span>
                  <span className="font-semibold text-blue-600">
                    {currentPage}
                  </span>
                  <span>de</span>
                  <span className="font-semibold text-gray-900">
                    {totalPages}
                  </span>
                </div>
              </div>
            </div>

            {/* Controles de paginação */}
            <div className="px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Botões de navegação */}
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  {/* Botão Anterior */}
                  <button
                    onClick={onPrevPage}
                    disabled={currentPage <= 1 || loading}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </button>

                  {/* Números das páginas */}
                  <div className="flex items-center gap-1">
                    {generatePageNumbers().map((page, index) => (
                      <div key={index}>
                        {page === "ellipsis" ? (
                          <div className="flex items-center justify-center w-10 h-10 text-gray-400">
                            <MoreHorizontal className="w-4 h-4" />
                          </div>
                        ) : (
                          <button
                            onClick={() => onPageChange(page)}
                            disabled={loading}
                            className={`flex items-center justify-center w-10 h-10 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                              currentPage === page
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:text-blue-600"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {page}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Botão Próxima */}
                  <button
                    onClick={onNextPage}
                    disabled={currentPage >= totalPages || loading}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    Próxima
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Indicador de carregamento */}
                {loading && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    Carregando...
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseContent>
  );
}
