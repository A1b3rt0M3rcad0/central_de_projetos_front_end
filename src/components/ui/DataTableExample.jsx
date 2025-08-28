import DataTable from "./DataTable";
import StatusBadge from "./StatusBadge";
import {
  Eye,
  Edit,
  Trash2,
  FileUp,
  UserRoundPen,
  TrendingUp,
  MapPin,
  Building,
  UserCheck,
  Users,
  Calendar,
  DollarSign,
  Tag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/dateUtils";

/**
 * Exemplo avançado do DataTable para Projetos
 * Demonstra todas as funcionalidades disponíveis
 */
export default function DataTableExample({
  projects,
  role,
  onEdit,
  onDelete,
  onSelect,
}) {
  const navigate = useNavigate();

  // Função para formatar moeda
  const formatCurrency = (value) => {
    if (typeof value !== "number") return "--";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Configuração das colunas
  const columns = [
    {
      key: "id",
      label: "ID",
      sortable: true,
      type: "number",
      className: "hidden md:table-cell",
    },
    {
      key: "name",
      label: "Nome do Projeto",
      sortable: true,
      type: "truncate",
      render: (value) => (
        <div className="max-w-[160px] truncate" title={value}>
          <span className="font-medium">{value || "--"}</span>
        </div>
      ),
    },
    {
      key: "bairro",
      label: "Bairro",
      sortable: true,
      type: "truncate",
      className: "hidden md:table-cell",
      accessor: (item) => item.bairro?.name,
      render: (value, item) => (
        <div
          className="flex items-center gap-2 max-w-[120px] truncate"
          title={value}
        >
          <MapPin className="w-3 h-3 text-red-500 flex-shrink-0" />
          <span className="truncate">{value || "--"}</span>
        </div>
      ),
    },
    {
      key: "empresa",
      label: "Empresa",
      sortable: true,
      type: "truncate",
      className: "hidden md:table-cell",
      accessor: (item) => item.empresa?.name,
      render: (value, item) => (
        <div
          className="flex items-center gap-2 max-w-[120px] truncate"
          title={value}
        >
          <Building className="w-3 h-3 text-blue-500 flex-shrink-0" />
          <span className="truncate">{value || "--"}</span>
        </div>
      ),
    },
    {
      key: "fiscal",
      label: "Fiscal",
      sortable: true,
      type: "truncate",
      className: "hidden md:table-cell",
      accessor: (item) => item.fiscal?.name,
      render: (value, item) => (
        <div
          className="flex items-center gap-2 max-w-[120px] truncate"
          title={value}
        >
          <UserCheck className="w-3 h-3 text-indigo-500 flex-shrink-0" />
          <span className="truncate">{value || "--"}</span>
        </div>
      ),
    },
    {
      key: "user",
      label: "Vereador",
      sortable: true,
      type: "truncate",
      className: "hidden md:table-cell",
      accessor: (item) => item.user?.name,
      render: (value, item) => (
        <div
          className="flex items-center gap-2 max-w-[120px] truncate"
          title={value}
        >
          <Users className="w-3 h-3 text-purple-500 flex-shrink-0" />
          <span className="truncate">{value || "--"}</span>
        </div>
      ),
    },
    {
      key: "verba_disponivel",
      label: "Orçamento",
      sortable: true,
      type: "currency",
      className: "hidden lg:table-cell",
    },
    {
      key: "andamento_do_projeto",
      label: "Situação",
      sortable: true,
      type: "truncate",
      className: "hidden md:table-cell",
      render: (value) => (
        <div className="max-w-[120px] truncate" title={value}>
          <span className="text-sm">{value || "--"}</span>
        </div>
      ),
    },
    {
      key: "types",
      label: "Tipo",
      sortable: true,
      type: "truncate",
      className: "hidden md:table-cell",
      accessor: (item) => item.types?.name,
      render: (value, item) => (
        <div
          className="flex items-center gap-2 max-w-[120px] truncate"
          title={value}
        >
          <Tag className="w-3 h-3 text-green-500 flex-shrink-0" />
          <span className="truncate">{value || "--"}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      type: "status",
      className: "hidden md:table-cell",
      accessor: (item) => item.status?.description,
      render: (value) => <StatusBadge status={value} size="md" />,
    },
    {
      key: "start_date",
      label: "Início",
      sortable: true,
      type: "date",
      className: "hidden lg:table-cell",
    },
  ];

  // Configuração da tabela
  const config = {
    title: "Projetos",
    createButtonText: "Criar Projeto",
    searchPlaceholder: "Buscar por nome, bairro, empresa...",
    emptyMessage: "Nenhum projeto encontrado.",
    showSearch: true,
    showPagination: true,
    showRefresh: true,
    showBulkActions: role?.toUpperCase() === "ADMIN",
    showExport: true,
    loading: false,
  };

  // Ações customizadas
  const actions = {
    bulk:
      role?.toUpperCase() === "ADMIN"
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
    row:
      role?.toUpperCase() === "ADMIN"
        ? [
            {
              label: "Upload Documento",
              icon: <FileUp className="w-4 h-4" />,
              className: "text-blue-600 hover:bg-blue-50",
              onClick: (project) => {
                navigate("/documentform", {
                  state: { initial_date: project },
                });
              },
            },
            {
              label: "Associar",
              icon: <UserRoundPen className="w-4 h-4" />,
              className: "text-green-600 hover:bg-green-50",
              onClick: (project) => {
                navigate("/projectassociationform", {
                  state: { initial_date: project },
                });
              },
            },
          ]
        : [],
    export: {
      onClick: () => {
        console.log("Exportar todos os projetos");
        // Implementar exportação completa
      },
    },
  };

  return (
    <DataTable
      data={projects}
      columns={columns}
      config={config}
      onCreate={() => navigate("/projectform")}
      onEdit={onEdit}
      onDelete={onDelete}
      onView={onSelect}
      onRefresh={() => window.location.reload()}
      actions={actions}
    />
  );
}
