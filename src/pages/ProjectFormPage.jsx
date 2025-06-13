import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import BasePage from "../components/BasePage";
import ProjectForm from "../forms/ProjectForm";
import projectApi from "../services/endpoints/project";

export default function ProjectFormPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const initial_date = location.state?.initial_date;
  console.log(initial_date);

  async function onSubmit(data, oldData) {
    if (!oldData) {
      // Criação
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
      return;
    }

    // Edição com patchs separados
    const patchMap = {
      name: projectApi.patchName,
      andamento_do_projeto: projectApi.patchAndamentoDoProjeto,
      end_date: projectApi.patchEndDate,
      expected_completion_date: projectApi.patchExpectedCompletionDate,
      start_date: projectApi.patchStartDate,
      verba_disponivel: projectApi.patchVerba,
      status_id: projectApi.patchStatus, // se existir
    };

    const changedFields = Object.entries(patchMap).filter(
      ([field]) => data[field] !== oldData[field]
    );

    if (changedFields.length === 0) {
      return Swal.fire("Info", "Nenhuma alteração detectada.", "info");
    }

    setLoading(true);
    try {
      await Promise.all(
        changedFields.map(([field, patchFn]) =>
          patchFn(oldData.id, data[field])
        )
      );
      await Swal.fire("Sucesso", "Projeto atualizado com sucesso!", "success");
      navigate(-1);
    } catch (error) {
      await Swal.fire("Erro", "Falha ao atualizar o projeto.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <BasePage pageTitle="">
      <ProjectForm
        onSubmit={onSubmit}
        onBack={() => navigate(-1)}
        loading={loading}
        initial_date={initial_date}
      />
    </BasePage>
  );
}
