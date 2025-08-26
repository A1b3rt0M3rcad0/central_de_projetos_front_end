import BaseContent from "../../components/BaseContent";
import { Pencil, Trash2, Plus, Eye } from "lucide-react";

export default function FiscalListContent({
  fiscais,
  onCreate,
  onEdit,
  onDelete,
  onFilter,
  onBack,
}) {
  return (
    <BaseContent pageTitle="Fiscais" onBack={onBack}>
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
          Criar Fiscal
        </button>
      </div>

      {/* Tabela de empresas */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">ID</th>
              <th className="text-left py-2">Nome</th>
              <th className="text-left py-2">Criado em</th>
              <th className="text-left py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {fiscais.length > 0 ? (
              fiscais.map((fiscal) => (
                <tr key={fiscal.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{fiscal.id}</td>
                  <td className="py-2">{fiscal.name || "--"}</td>
                  <td className="py-2">
                    {fiscal.created_at ? fiscal.created_at : "--"}
                  </td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(fiscal)}
                        className="p-1 rounded hover:bg-gray-200 cursor-pointer"
                      >
                        <Pencil className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => onDelete(fiscal)}
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
                  Nenhum Fiscal encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </BaseContent>
  );
}
