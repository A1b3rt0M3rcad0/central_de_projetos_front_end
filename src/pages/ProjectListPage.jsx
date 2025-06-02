import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BasePage from "../components/BasePage";
import ProjectListContent from "../contents/ProjectListContent";

export default function ProjectListPage() {
  const navigate = useNavigate();

  // Dados mockados (futuramente virão da API)
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Revitalização Urbana",
      bairro: "Centro",
      empresa: "Construtora Alpha",
      status: "Ativo",
      andamento_do_projeto: "Em andamento",
      fiscal: "Jose Medeiros",
      user: "Joao Vila Nova",
    },
    {
      id: 2,
      name: "Pavimentação Rua A",
      bairro: "Vila Nova",
      empresa: "Construtora Beta",
      status: "Concluído",
      andamento_do_projeto: "Finalizado",
      fiscal: "Jose Medeiros",
      user: "Jose Farinha Lima",
    },
    {
      id: 3,
      name: "Construção de Escola",
      bairro: "Jardim América",
      empresa: "Construtora Gamma",
      status: "Ativo",
      andamento_do_projeto: "Em execução",
      fiscal: "Jose Galinho de Farofas",
      user: "Carlos Vila Pequena",
    },
  ]);

  const [filter, setFilter] = useState("");

  // Filtragem simples
  const filteredProjects = projects.filter((project) => {
    const search = filter.toLowerCase();
    return (
      project.name.toLowerCase().includes(search) ||
      project.bairro.toLowerCase().includes(search) ||
      project.empresa.toLowerCase().includes(search) ||
      project.status.toLowerCase().includes(search) ||
      project.andamento_do_projeto.toLowerCase().includes(search)
    );
  });

  // Ações
  const handleCreate = () => {
    navigate("/projects/new"); // Ou abrir um modal se quiser
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
    <BasePage pageTitle="Projetos">
      <ProjectListContent
        projects={filteredProjects}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onFilter={handleFilter}
        onSelect={handleSelect}
      />
    </BasePage>
  );
}
