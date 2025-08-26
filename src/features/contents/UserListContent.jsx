import BaseContent from "../../components/BaseContent";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function UserListContent({
  users,
  onCreate,
  onEdit,
  onDelete,
  onFilter,
  onBack,
}) {
  function formatCPF(cpf) {
    // Remove tudo que não for número
    const numbersOnly = cpf.replace(/\D/g, "");

    // Aplica a máscara se tiver 11 dígitos
    if (numbersOnly.length !== 11) return cpf; // Retorna original se inválido

    return numbersOnly.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  return (
    <BaseContent pageTitle="Usuários" onBack={onBack}>
      {/* Filtro e botão de criar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Filtrar por nome..."
          onChange={(e) => onFilter(e.target.value)}
          className="w-full md:w-1/3 border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={onCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Criar Usuário
        </button>
      </div>

      {/* Tabela de usuários */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">CPF</th>
              <th className="text-left py-2">Nome</th>
              <th className="text-left py-2">Email</th>
              <th className="text-left py-2">Cargo</th>
              <th className="text-left py-2">Criado em</th>
              <th className="text-left py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.cpf} className="border-b hover:bg-gray-50">
                  <td className="py-2">{formatCPF(user.cpf) || "--"}</td>
                  <td className="py-2">{user?.name || "--"}</td>
                  <td className="py-2">{user.email}</td>
                  <td className="py-2">{user.role || "--"}</td>
                  <td className="py-2">
                    {user.created_at ? user.created_at : "--"}
                  </td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(user)}
                        className="p-1 rounded hover:bg-gray-200 cursor-pointer"
                      >
                        <Pencil className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => onDelete(user)}
                        className="p-1 rounded hover:bg-gray-200 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  Nenhum Usuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </BaseContent>
  );
}
