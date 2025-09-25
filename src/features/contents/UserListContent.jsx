import BaseContent from "../../components/BaseContent";
import DataTable from "../../components/ui/DataTable";
import {
  UserCheck,
  Mail,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Trash2,
  Pencil,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function UserListContent({
  users,
  onCreate,
  onEdit,
  onDelete,
  onBack,
  onPageChange,
  onNextPage,
  onPrevPage,
  loading,
  currentPage,
  totalPages,
  totalUsers,
}) {
  const [role, setRole] = useState();

  useEffect(() => {
    const userInfo = localStorage.getItem("user_info");
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        setRole(parsed.role);
      } catch {}
    }
  }, []);

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage <= 4) {
        for (let i = 2; i <= 5; i++) pages.push(i);
        pages.push("ellipsis", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push("ellipsis");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(
          "ellipsis",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "ellipsis",
          totalPages
        );
      }
    }
    return pages;
  };
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
    showPagination: false,
    showRefresh: true,
    showBulkActions: role?.toUpperCase() === "ADMIN",
    showExport: true,
    loading: loading,
  };

  // Ações customizadas
  const actions = {
    bulk:
      role?.toUpperCase() === "ADMIN"
        ? [
            {
              label: "Ativar Usuários",
              icon: <UserCheck className="w-4 h-4" />,
              onClick: (selectedItems) => {
                console.log("Ativar usuários:", selectedItems);
              },
            },
          ]
        : [],
    row: [
      {
        label: "Enviar Email",
        icon: <Mail className="w-4 h-4" />,
        className: "text-purple-600 hover:bg-purple-50",
        onClick: (user) => {
          console.log("Enviar email para:", user.email);
        },
      },
      ...(role?.toUpperCase() === "ADMIN"
        ? [
            {
              label: "Editar",
              icon: <Pencil className="w-4 h-4" />,
              className: "text-green-600 hover:bg-green-50",
              onClick: (user) => onEdit(user),
            },
            {
              label: "Excluir",
              icon: <Trash2 className="w-4 h-4" />,
              className: "text-red-600 hover:bg-red-50",
              onClick: (user) => onDelete(user),
            },
          ]
        : []),
    ],
    export: {
      onClick: () => {
        console.log("Exportar todos os usuários");
      },
    },
  };

  return (
    <BaseContent pageTitle="Usuários" onBack={onBack}>
      <div className="space-y-6">
        <div className="overflow-x-auto">
          <DataTable
            data={users}
            columns={columns}
            config={config}
            onCreate={onCreate}
            onRefresh={() => window.location.reload()}
            actions={actions}
          />
        </div>

        {totalPages > 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
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
                    Mostrando {""}
                    <span className="font-semibold text-gray-900">
                      {users.length}
                    </span>{" "}
                    de {""}
                    <span className="font-semibold text-gray-900">
                      {totalUsers}
                    </span>{" "}
                    usuários
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

            <div className="px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <button
                    onClick={onPrevPage}
                    disabled={currentPage <= 1 || loading}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </button>

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

                  <button
                    onClick={onNextPage}
                    disabled={currentPage >= totalPages || loading}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    Próxima
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

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
