import BaseContent from "../../components/BaseContent";
import DataTable from "../../components/ui/DataTable";
import {
  Tag,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Trash2,
  Pencil,
  Search,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { usePermissions } from "../../hooks/usePermissions";

export default function StatusListContent({
  status,
  onCreate,
  onView,
  onEdit,
  onDelete,
  onBack,
  onPageChange,
  onNextPage,
  onPrevPage,
  onSearch,
  loading,
  currentPage,
  totalPages,
  totalStatus,
  searchTerm,
}) {
  const [role, setRole] = useState();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || "");
  const [isSearching, setIsSearching] = useState(false);

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

  // Configuração das colunas
  const columns = [
    {
      key: "id",
      label: "ID",
      sortable: true,
      type: "number",
    },
    {
      key: "description",
      label: "Nome",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-blue-500" />
          <span className="font-medium">{value || "--"}</span>
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Criado em",
      sortable: true,
      type: "date",
    },
  ];

  // Configuração da tabela
  const config = {
    title: "Status",
    createButtonText: "Criar Status",
    searchPlaceholder: "Buscar por nome...",
    emptyMessage: "Nenhum status encontrado.",
    showSearch: false, // Desabilitado pois usamos busca global
    showPagination: false, // Desabilitamos a paginação do DataTable pois já temos a nossa própria
    showRefresh: true,
    showBulkActions: permissions.canEditStatus,
    showExport: true,
    loading: loading,
  };

  // Ações da tabela
  const actions = {
    bulk:
      permissions.canEditStatus
        ? [
            {
              label: "Exportar Selecionados",
              icon: <Eye className="w-4 h-4" />,
              onClick: (selectedItems) => {
                console.log("Exportar status:", selectedItems);
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
        onClick: (status) => {
          onView(status);
        },
      },
      ...(permissions.canEditStatus
        ? [
            {
              label: "Editar",
              icon: <Pencil className="w-4 h-4" />,
              className: "text-green-600 hover:bg-green-50",
              onClick: (status) => {
                onEdit(status);
              },
            },
            {
              label: "Excluir",
              icon: <Trash2 className="w-4 h-4" />,
              className: "text-red-600 hover:bg-red-50",
              onClick: (status) => {
                onDelete(status);
              },
            },
          ]
        : []),
    ],
    export: {
      onClick: () => {
        console.log("Exportar todos os status");
        // Implementar exportação completa
      },
    },
  };

  return (
    <BaseContent pageTitle="Status" onBack={onBack}>
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
                placeholder="Buscar por descrição do status... (pressione Enter)"
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
            data={status}
            columns={columns}
            config={config}
            onCreate={permissions.canCreateStatus ? onCreate : null}
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
                      {status.length}
                    </span>{" "}
                    de{" "}
                    <span className="font-semibold text-gray-900">
                      {totalStatus}
                    </span>{" "}
                    status
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
