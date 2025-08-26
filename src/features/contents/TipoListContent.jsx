import BaseContent from "../../components/BaseContent";
import DataTable from "../../components/ui/DataTable";
import { FolderOpen } from "lucide-react";

export default function TipoListContent({
  tipos,
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
      label: "Nome",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-green-500" />
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
    title: "Tipos de Projeto",
    createButtonText: "Criar Tipo",
    searchPlaceholder: "Buscar por nome...",
    emptyMessage: "Nenhum tipo encontrado.",
    showSearch: true,
    showPagination: true,
    showRefresh: true,
  };

  return (
    <BaseContent pageTitle="Tipos" onBack={onBack}>
      <DataTable
        data={tipos}
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
