import BaseContent from "../../components/BaseContent";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function BairroListContent({
  bairros,
  onCreate,
  onEdit,
  onDelete,
  onFilter,
  onBack,
}) {
  return (
    <BaseContent pageTitle="Bairros" onBack={onBack}>
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
          Criar Bairro
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
            {bairros.length > 0 ? (
              bairros.map((bairro) => (
                <tr key={bairro.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{bairro.id}</td>
                  <td className="py-2">{bairro.name || "--"}</td>
                  <td className="py-2">
                    {bairro.created_at ? bairro.created_at : "--"}
                  </td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(bairro)}
                        className="p-1 rounded hover:bg-gray-200 cursor-pointer"
                      >
                        <Pencil className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => onDelete(bairro)}
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
                  Nenhum Bairro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </BaseContent>
  );
}
