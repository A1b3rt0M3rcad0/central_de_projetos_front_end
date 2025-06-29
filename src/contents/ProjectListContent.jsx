import { useNavigate } from "react-router-dom";
import BaseContent from "../components/BaseContent";
import { Pencil, Trash2, Plus, Eye, FileUp, UserRoundPen } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

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
  const [role, setRole] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = localStorage.getItem("user_info");
      const userInfoParsed = JSON.parse(userInfo);
      setRole(userInfoParsed.role);
    };
    fetchData();
  }, []);

  // Calcular total de páginas
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  // Projetos da página atual
  const currentProjects = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return projects.slice(start, start + itemsPerPage);
  }, [projects, currentPage]);

  // Funções para mudar página
  function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

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
              <th className="text-left py-2 hidden md:table-cell">ID</th>
              <th className="text-left py-2">Nome</th>
              <th className="text-left py-2 hidden md:table-cell">Bairro</th>
              <th className="text-left py-2 hidden md:table-cell">Empresa</th>
              <th className="text-left py-2 hidden md:table-cell">Fiscal</th>
              <th className="text-left py-2 hidden md:table-cell">Vereador</th>
              <th className="text-left py-2 hidden md:table-cell">Situação</th>
              <th className="text-left py-2 hidden md:table-cell">Tipo</th>
              <th className="text-left py-2 hidden md:table-cell">Status</th>
              <th className="text-left py-2">Ações</th>
            </tr>
          </thead>

          <tbody>
            {currentProjects.length > 0 ? (
              currentProjects.map((project) => (
                <tr key={project.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 hidden md:table-cell">
                    {project.id || "--"}
                  </td>

                  <td className="py-2 max-w-[160px] truncate whitespace-nowrap overflow-hidden">
                    {project.name || "--"}
                  </td>

                  <td className="py-2 hidden md:table-cell max-w-[120px] truncate whitespace-nowrap overflow-hidden">
                    {project.bairro || "--"}
                  </td>

                  <td className="py-2 hidden md:table-cell max-w-[120px] truncate whitespace-nowrap overflow-hidden">
                    {project.empresa || "--"}
                  </td>

                  <td className="py-2 hidden md:table-cell max-w-[120px] truncate whitespace-nowrap overflow-hidden">
                    {project.fiscal || "--"}
                  </td>

                  <td className="py-2 hidden md:table-cell max-w-[120px] truncate whitespace-nowrap overflow-hidden">
                    {project.user || "--"}
                  </td>

                  <td className="py-2 hidden md:table-cell max-w-[120px] truncate whitespace-nowrap overflow-hidden">
                    {project.andamento_do_projeto || "--"}
                  </td>

                  <td className="py-2 hidden md:table-cell max-w-[120px] truncate whitespace-nowrap overflow-hidden">
                    {project.types || "--"}
                  </td>

                  <td className="py-2 hidden md:table-cell max-w-[120px] truncate whitespace-nowrap overflow-hidden">
                    {project.status || "--"}
                  </td>

                  <td className="py-2">
                    <div className="flex gap-2 flex-wrap">
                      {role && role.toUpperCase() === "ADMIN" && (
                        <>
                          <button
                            onClick={() => onEdit(project)}
                            className="p-1 rounded hover:bg-gray-200"
                          >
                            <Pencil className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() =>
                              navigate("/documentform", {
                                state: { initial_date: project },
                              })
                            }
                            className="p-1 rounded hover:bg-gray-200"
                          >
                            <FileUp className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() =>
                              navigate("/projectassociationform", {
                                state: { initial_date: project },
                              })
                            }
                            className="p-1 rounded hover:bg-gray-200"
                          >
                            <UserRoundPen className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => onDelete(project)}
                            className="p-1 rounded hover:bg-gray-200"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => onSelect(project)}
                        className="p-1 rounded hover:bg-gray-200"
                      >
                        <Eye className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="py-4 text-center text-gray-500">
                  Nenhum projeto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Controles de paginação */}
        <div className="mt-4 flex justify-center items-center gap-3">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Anterior
          </button>

          <span>
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      </div>
    </BaseContent>
  );
}
