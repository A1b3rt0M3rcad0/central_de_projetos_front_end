import { useNavigate } from "react-router-dom";
import BaseContent from "../components/BaseContent";
import { Pencil, Trash2, Plus, Eye, FileUp, UserRoundPen } from "lucide-react";

export default function ProjectListContent({
  projects,
  onCreate,
  onEdit,
  onDelete,
  onFilter,
  onSelect,
  onBack,
}) {
  const navigate = useNavigate();
  return (
    <BaseContent pageTitle="Projetos" onBack={onBack}>
      {/* Filtro e botão de criar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Filtrar por nome, bairro, status..."
          onChange={(e) => onFilter(e.target.value)}
          className="w-full md:w-1/3 border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={onCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Criar Projeto
        </button>
      </div>

      {/* Tabela de projetos */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">ID</th>
              <th className="text-left py-2">Nome</th>
              <th className="text-left py-2">Bairro</th>
              <th className="text-left py-2">Empresa</th>
              <th className="text-left py-2">Fiscais</th>
              <th className="text-left py-2">Vereador</th>
              <th className="text-left py-2">Andamento</th>
              <th className="text-left py-2">Tipo</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((project) => (
                <tr key={project.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{project.id || "--"}</td>
                  <td className="py-2">{project.name || "--"}</td>
                  <td className="py-2">{project.bairro || "--"}</td>
                  <td className="py-2">{project.empresa || "--"}</td>
                  <td className="py-2">{project.fiscal || "--"}</td>
                  <td className="py-2">{project.user || "--"}</td>
                  <td className="py-2">
                    {project.andamento_do_projeto || "--"}
                  </td>
                  <td className="py-2">{project.types || "--"}</td>
                  {console.log(project)}
                  <td className="py-2">{project.status || "--"}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(project)}
                        className="p-1 rounded hover:bg-gray-200 cursor-pointer"
                      >
                        <Pencil className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() =>
                          navigate("/documentform", {
                            state: { initial_date: project },
                          })
                        }
                        className="p-1 rounded hover:bg-gray-200 cursor-pointer"
                      >
                        <FileUp className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() =>
                          navigate("/projectassociationform", {
                            state: { initial_date: project },
                          })
                        }
                        className="p-1 rounded hover:bg-gray-200 cursor-pointer"
                      >
                        <UserRoundPen className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => onDelete(project)}
                        className="p-1 rounded hover:bg-gray-200 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                      <button
                        onClick={() => onSelect(project)}
                        className="p-1 rounded hover:bg-gray-200 cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="py-4 text-center text-gray-500">
                  Nenhum projeto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </BaseContent>
  );
}
