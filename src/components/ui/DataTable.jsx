import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
} from "lucide-react";

/**
 * Componente DataTable - Lista de dados reutilizável
 *
 * @param {Object} props
 * @param {Array} props.data - Array de dados para exibir
 * @param {Array} props.columns - Configuração das colunas
 * @param {Object} props.config - Configurações da tabela
 * @param {Function} props.onCreate - Função para criar novo item
 * @param {Function} props.onEdit - Função para editar item
 * @param {Function} props.onDelete - Função para deletar item
 * @param {Function} props.onView - Função para visualizar item
 * @param {Function} props.onRefresh - Função para atualizar dados
 * @param {Object} props.pagination - Configuração de paginação
 * @param {Object} props.filters - Configuração de filtros
 * @param {Object} props.actions - Ações customizadas
 */
export default function DataTable({
  data = [],
  columns = [],
  config = {},
  onCreate,
  onEdit,
  onDelete,
  onView,
  onRefresh,
  pagination = {},
  filters = {},
  actions = {},
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedItems, setSelectedItems] = useState([]);

  // Configurações padrão
  const defaultConfig = {
    title: "Lista de Dados",
    createButtonText: "Criar Novo",
    searchPlaceholder: "Buscar...",
    showSearch: true,
    showFilters: true,
    showPagination: true,
    showBulkActions: false,
    showRefresh: true,
    showExport: false,
    loading: false,
    emptyMessage: "Nenhum dado encontrado.",
    ...config,
  };

  // Filtragem dos dados
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        columns.some((column) => {
          const value = column.accessor
            ? column.accessor(item)
            : item[column.key];
          return value
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        })
      );
    }

    // Filtros customizados
    if (filters.custom) {
      filtered = filters.custom(filtered);
    }

    return filtered;
  }, [data, searchTerm, columns, filters]);

  // Ordenação
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = sortConfig.accessor
        ? sortConfig.accessor(a)
        : a[sortConfig.key];
      const bValue = sortConfig.accessor
        ? sortConfig.accessor(b)
        : b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginação
  const paginatedData = useMemo(() => {
    if (!defaultConfig.showPagination) return sortedData;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, itemsPerPage, defaultConfig.showPagination]);

  // Total de páginas
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Handlers
  const handleSort = (key, accessor) => {
    setSortConfig((prev) => ({
      key,
      accessor,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(paginatedData.map((item) => item.id || item.cpf));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  // Renderização de células
  const renderCell = (item, column) => {
    const value = column.accessor ? column.accessor(item) : item[column.key];

    if (column.render) {
      return column.render(value, item);
    }

    if (column.type === "date") {
      return new Date(value).toLocaleDateString("pt-BR");
    }

    if (column.type === "currency") {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);
    }

    if (column.type === "status") {
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            column.statusColors?.[value] || "bg-gray-100 text-gray-800"
          }`}
        >
          {value}
        </span>
      );
    }

    if (column.type === "truncate") {
      return (
        <div className="max-w-[200px] truncate" title={value}>
          {value || "--"}
        </div>
      );
    }

    return value || "--";
  };

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900">
            {defaultConfig.title}
          </h2>
          {defaultConfig.loading && (
            <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Ações em lote */}
          {defaultConfig.showBulkActions && selectedItems.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-700">
                {selectedItems.length} item(s) selecionado(s)
              </span>
              {actions.bulk && (
                <div className="flex gap-1">
                  {actions.bulk.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => action.onClick(selectedItems)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      title={action.label}
                    >
                      {action.icon}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex items-center gap-2">
            {defaultConfig.showRefresh && onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Atualizar"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            )}

            {defaultConfig.showExport && (
              <button
                onClick={actions.export?.onClick}
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Exportar"
              >
                <Download className="w-5 h-5" />
              </button>
            )}

            {onCreate && (
              <button
                onClick={onCreate}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {defaultConfig.createButtonText}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filtros e busca */}
      {(defaultConfig.showSearch || defaultConfig.showFilters) && (
        <div className="flex flex-col lg:flex-row gap-4">
          {defaultConfig.showSearch && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={defaultConfig.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>
          )}

          {defaultConfig.showFilters && filters.custom && (
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          )}
        </div>
      )}

      {/* Tabela */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto max-w-full">
          <table className={`w-full ${defaultConfig.tableClassName || ""}`}>
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {/* Checkbox para seleção em lote */}
                {defaultConfig.showBulkActions && (
                  <th className="px-2 py-2 text-left w-10">
                    <input
                      type="checkbox"
                      checked={
                        selectedItems.length === paginatedData.length &&
                        paginatedData.length > 0
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                )}

                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                    } ${column.className || ""}`}
                    onClick={() =>
                      column.sortable && handleSort(column.key, column.accessor)
                    }
                  >
                    <div className="flex items-center gap-1">
                      {column.label}
                      {column.sortable && sortConfig.key === column.key && (
                        <span className="text-blue-600">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}

                {/* Coluna de ações */}
                {(onEdit || onDelete || onView || actions.row) && (
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                    Ações
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr
                    key={item.id || item.cpf || index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Checkbox para seleção individual */}
                    {defaultConfig.showBulkActions && (
                      <td className="px-2 py-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id || item.cpf)}
                          onChange={(e) =>
                            handleSelectItem(
                              item.id || item.cpf,
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    )}

                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-2 py-3 text-sm text-gray-900 ${
                          column.className || ""
                        }`}
                      >
                        {renderCell(item, column)}
                      </td>
                    ))}

                    {/* Ações da linha */}
                    {(onEdit || onDelete || onView || actions.row) && (
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-1">
                          {onView && (
                            <button
                              onClick={() => onView(item)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Visualizar"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}

                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}

                          {onDelete && (
                            <button
                              onClick={() => onDelete(item)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Ações customizadas */}
                          {actions.row?.map((action, actionIndex) => (
                            <button
                              key={actionIndex}
                              onClick={() => action.onClick(item)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                action.className ||
                                "text-gray-600 hover:bg-gray-100"
                              }`}
                              title={action.label}
                            >
                              {action.icon}
                            </button>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={
                      columns.length +
                      (defaultConfig.showBulkActions ? 1 : 0) +
                      (onEdit || onDelete || onView || actions.row ? 1 : 0)
                    }
                    className="px-6 py-12 text-center"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Search className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500">
                        {defaultConfig.emptyMessage}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {defaultConfig.showPagination && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">
                  Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                  {Math.min(currentPage * itemsPerPage, sortedData.length)} de{" "}
                  {sortedData.length} resultados
                </span>

                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value={10}>10 por página</option>
                  <option value={25}>25 por página</option>
                  <option value={50}>50 por página</option>
                  <option value={100}>100 por página</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-white"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
