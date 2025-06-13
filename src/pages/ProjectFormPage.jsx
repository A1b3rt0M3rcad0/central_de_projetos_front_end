import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import BasePage from "../components/BasePage";
import ProjectForm from "../forms/ProjectForm";
import projectApi from "../services/endpoints/project";

export default function ProjectFormPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function onSubmit(data) {
    setLoading(true);
    try {
      await projectApi.postProject(data);
      await Swal.fire("Sucesso", "Projeto criado com sucesso!", "success");
      navigate(-1);
    } catch (error) {
      await Swal.fire(
        "Erro",
        "Falha ao criar projeto. Tente novamente.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <BasePage pageTitle="Criar Projeto">
      <ProjectForm
        onSubmit={onSubmit}
        onBack={() => navigate(-1)}
        loading={loading}
      />
    </BasePage>
  );
}
