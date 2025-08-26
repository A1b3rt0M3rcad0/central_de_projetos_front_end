import BaseContent from "../../components/BaseContent";
import DataTable from "../../components/ui/DataTable";

export default function EmpresaListContent({
  companies,
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
      type: "truncate",
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
    title: "Empresas",
    createButtonText: "Criar Empresa",
    searchPlaceholder: "Buscar por nome...",
    emptyMessage: "Nenhuma empresa encontrada.",
    showSearch: true,
    showPagination: true,
    showRefresh: true,
  };

  return (
    <BaseContent pageTitle="Empresas" onBack={onBack}>
      <DataTable
        data={companies}
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
