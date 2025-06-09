import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BasePage from "../components/BasePage";
import ProjectListContent from "../contents/ProjectListContent";
import projectApi from "../services/endpoints/project";
import { useEffect } from "react";

export default function ProjectListPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectApi.getAllProjectsWithDetails();
        console.log(response);
        const content = response.data.content;
        setProjects(content);
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
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
      project.name.toLowerCase().includes(search) ||
      project.bairro.toLowerCase().includes(search) ||
      project.empresa.toLowerCase().includes(search) ||
      project.status.toLowerCase().includes(search) ||
      project.andamento_do_projeto.toLowerCase().includes(search) ||
      project.user.toLowerCase().includes(search)
    );
  });

  // Ações
  const handleCreate = () => {
    navigate("/projectform"); // Ou abrir um modal se quiser
  };

  const handleSelect = (project) => {
    navigate(`/projectpage`); // Ou abrir um modal se quiser
  };

  const handleEdit = (project) => {
    navigate(`/projects/${project.id}`);
  };

  const handleDelete = (project) => {
    const confirm = window.confirm(
      `Deseja realmente excluir o projeto "${project.name}"?`
    );
    if (confirm) {
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
    }
  };

  const handleFilter = (value) => {
    setFilter(value);
  };

  return (
    <BasePage pageTitle="">
      <ProjectListContent
        projects={filteredProjects}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onFilter={handleFilter}
        onSelect={handleSelect}
        onBack={() => navigate(-1)}
      />
    </BasePage>
  );
}
