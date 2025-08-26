import BaseContent from "../../components/BaseContent";
import DataTable from "../../components/ui/DataTable";
import { UserCheck } from "lucide-react";

export default function FiscalListContent({
  fiscais,
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
      key: "name",
      label: "Nome do Fiscal",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-indigo-500" />
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
    title: "Fiscais",
    createButtonText: "Criar Fiscal",
    searchPlaceholder: "Buscar por nome do fiscal...",
    emptyMessage: "Nenhum fiscal encontrado.",
    showSearch: true,
    showPagination: true,
    showRefresh: true,
  };

  return (
    <BaseContent pageTitle="Fiscais" onBack={onBack}>
      <DataTable
        data={fiscais}
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
