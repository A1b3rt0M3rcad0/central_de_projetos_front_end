import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BasePage from "../../components/layout/BasePage";
import ProjectListContent from "../../features/contents/ProjectListContent";
import projectApi from "../../services/api/project";
import { useEffect } from "react";
import Swal from "sweetalert2";
import LoadingContent from "../../features/contents/LoadingContent";

export default function ProjectListPage() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectApi.getAllProjectsWithDetails();
        const content = response.data.content;
        setProjects(content);
      } catch (error) {
        if (!(error.response && error.response.status === 404)) {
          Swal.fire({
            icon: "error",
            title: "Erro ao buscar projetos",
            text: error.message || "Ocorreu um erro inesperado.",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const [filter, setFilter] = useState("");

  const filteredProjects = projects.filter((project) => {
    const search = filter.toLowerCase();
    return (
      (project.name || "").toLowerCase().includes(search) ||
      (project.bairro || "").toLowerCase().includes(search) ||
      (project.empresa || "").toLowerCase().includes(search) ||
      (project.status || "").toLowerCase().includes(search) ||
      (project.andamento_do_projeto || "").toLowerCase().includes(search) ||
      (project.user || "").toLowerCase().includes(search)
    );
  });

  // Ações
  const handleCreate = () => {
    navigate("/projectform"); // Ou abrir um modal se quiser
  };

  const handleSelect = (project) => {
    navigate(`/projectpage`, { state: { initial_date: project } }); // Ou abrir um modal se quiser
  };

  const handleEdit = (project) => {
    navigate("/projectform", { state: { initial_date: project } });
  };

  const handleDelete = async (project) => {
    const result = await Swal.fire({
      title: "Confirmar exclusão",
      text: `Deseja realmente excluir o projeto "${project.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await projectApi.deleteProject({ project_id: project.id });
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      Swal.fire("Excluído!", "O projeto foi removido com sucesso.", "success");
    } catch (error) {
      Swal.fire("Erro!", "Erro ao deletar projeto.", "error");
    }
  };

  const handleFilter = (value) => {
    setFilter(value);
  };

  return (
    <BasePage pageTitle="">
      {loading ? (
        <LoadingContent />
      ) : (
        <ProjectListContent
          projects={filteredProjects}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onFilter={handleFilter}
          onSelect={handleSelect}
          onBack={() => navigate(-1)}
        />
      )}
    </BasePage>
  );
}
