import BaseContent from "../../components/BaseContent";
import DataTable from "../../components/ui/DataTable";
import { UserCheck, Mail, MessageSquare } from "lucide-react";

export default function FiscalListContent({
  fiscais,
  onCreate,
  onEdit,
  onDelete,
  onFilter,
  onBack,
}) {
  // Funções para as ações de email e mensagem
  const handleSendEmail = (fiscal) => {
    if (fiscal.email) {
      window.open(`mailto:${fiscal.email}`, "_blank");
    } else {
      alert("Este fiscal não possui email cadastrado.");
    }
  };

  const handleSendMessage = (fiscal) => {
    if (fiscal.phone) {
      // Remove caracteres não numéricos do telefone
      const cleanPhone = fiscal.phone.replace(/\D/g, "");
      // Adiciona código do país se não estiver presente
      const phoneWithCountry = cleanPhone.startsWith("55")
        ? cleanPhone
        : `55${cleanPhone}`;
      // Usa SMS em vez de WhatsApp para ser mais apropriado para fiscalização
      window.open(`sms:${phoneWithCountry}`, "_blank");
    } else {
      alert("Este fiscal não possui telefone cadastrado.");
    }
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
      key: "email",
      label: "Email",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          {value ? (
            <>
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{value}</span>
            </>
          ) : (
            <span className="text-sm text-gray-400 italic">Não informado</span>
          )}
        </div>
      ),
    },
    {
      key: "phone",
      label: "Telefone",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          {value ? (
            <>
              <MessageSquare className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{value}</span>
            </>
          ) : (
            <span className="text-sm text-gray-400 italic">Não informado</span>
          )}
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

  // Configuração das ações customizadas
  const customActions = {
    row: [
      {
        label: "Enviar Email",
        icon: <Mail className="w-4 h-4" />,
        onClick: handleSendEmail,
        className: "text-blue-600 hover:bg-blue-50",
      },
      {
        label: "Enviar SMS",
        icon: <MessageSquare className="w-4 h-4" />,
        onClick: handleSendMessage,
        className: "text-green-600 hover:bg-green-50",
      },
    ],
  };

  // Configuração da tabela
  const config = {
    title: "Fiscais",
    createButtonText: "Criar Fiscal",
    searchPlaceholder: "Buscar por nome, email ou telefone...",
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
        actions={customActions}
      />
    </BaseContent>
  );
}
