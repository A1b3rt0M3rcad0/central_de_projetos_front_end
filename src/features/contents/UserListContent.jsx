import BaseContent from "../../components/BaseContent";
import DataTable from "../../components/ui/DataTable";
import { UserCheck, Mail } from "lucide-react";

export default function UserListContent({
  users,
  onCreate,
  onEdit,
  onDelete,
  onFilter,
  onBack,
}) {
  // Função para formatar CPF
  const formatCPF = (cpf) => {
    const numbersOnly = cpf.replace(/\D/g, "");
    if (numbersOnly.length !== 11) return cpf;
    return numbersOnly.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  // Configuração das colunas
  const columns = [
    {
      key: "cpf",
      label: "CPF",
      sortable: true,
      render: (value) => formatCPF(value),
    },
    {
      key: "name",
      label: "Nome",
      sortable: true,
      type: "truncate",
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="truncate max-w-[200px]" title={value}>
            {value}
          </span>
        </div>
      ),
    },
    {
      key: "role",
      label: "Cargo",
      sortable: true,
      type: "status",
      statusColors: {
        admin: "bg-red-100 text-red-800",
        user: "bg-blue-100 text-blue-800",
        fiscal: "bg-green-100 text-green-800",
        vereador: "bg-purple-100 text-purple-800",
      },
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
    title: "Usuários",
    createButtonText: "Criar Usuário",
    searchPlaceholder: "Buscar por nome, email ou CPF...",
    emptyMessage: "Nenhum usuário encontrado.",
    showSearch: true,
    showPagination: true,
    showRefresh: true,
    showBulkActions: true,
  };

  // Ações customizadas
  const actions = {
    bulk: [
      {
        label: "Ativar Usuários",
        icon: <UserCheck className="w-4 h-4" />,
        onClick: (selectedItems) => {
          console.log("Ativar usuários:", selectedItems);
          // Implementar lógica de ativação
        },
      },
    ],
    row: [
      {
        label: "Enviar Email",
        icon: <Mail className="w-4 h-4" />,
        className: "text-purple-600 hover:bg-purple-50",
        onClick: (user) => {
          console.log("Enviar email para:", user.email);
          // Implementar envio de email
        },
      },
    ],
  };

  return (
    <BaseContent pageTitle="Usuários" onBack={onBack}>
      <DataTable
        data={users}
        columns={columns}
        config={config}
        onCreate={onCreate}
        onEdit={onEdit}
        onDelete={onDelete}
        onRefresh={() => window.location.reload()}
        actions={actions}
      />
    </BaseContent>
  );
}
