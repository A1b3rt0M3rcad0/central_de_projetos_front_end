import BaseContent from "../../components/BaseContent";
import DataTable from "../../components/ui/DataTable";
import { MapPin } from "lucide-react";

export default function BairroListContent({
  bairros,
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
      label: "Nome do Bairro",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-red-500" />
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
    title: "Bairros",
    createButtonText: "Criar Bairro",
    searchPlaceholder: "Buscar por nome do bairro...",
    emptyMessage: "Nenhum bairro encontrado.",
    showSearch: true,
    showPagination: true,
    showRefresh: true,
  };

  return (
    <BaseContent pageTitle="Bairros" onBack={onBack}>
      <DataTable
        data={bairros}
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
