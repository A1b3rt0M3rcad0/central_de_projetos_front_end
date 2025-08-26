import BaseContent from "../../components/BaseContent";
import DataTable from "../../components/ui/DataTable";
import { Tag } from "lucide-react";

export default function StatusListContent({
  status,
  onCreate,
  onEdit,
  onDelete,
  onFilter,
  onBack,
}) {
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
    showSearch: true,
    showPagination: true,
    showRefresh: true,
  };

  return (
    <BaseContent pageTitle="Status" onBack={onBack}>
      <DataTable
        data={status}
        columns={columns}
        config={config}
        onCreate={onCreate}
        onEdit={onEdit}
        onDelete={onDelete}
        onRefresh={() => window.location.reload()}
      />
    </BaseContent>
  );
}
