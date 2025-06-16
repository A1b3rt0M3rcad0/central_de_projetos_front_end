import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import BasePage from "../components/BasePage";
import ProjectForm from "../forms/ProjectForm";
import projectApi from "../services/endpoints/project";

// Função para normalizar data do formato dd/mm/yyyy para yyyy-mm-dd (pode manter caso precise)
function normalizeDate(dateStr) {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split("/");
  if (!day || !month || !year) return null;
  return `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(
    2,
    "0"
  )}`;
}

export default function ProjectFormPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const initial_date = location.state?.initial_date;

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
      status_id: projectApi.patchStatus,
    };

    const changedFields = Object.entries(patchMap).filter(([field]) => {
      const newValue = data[field];
      const oldValue = oldData[field];

      // Para campos de data (já em ISO), compara direto
      if (
        ["end_date", "expected_completion_date", "start_date"].includes(field)
      ) {
        return newValue !== oldValue;
      }

      // Para valores monetários (float), compara com margem de erro
      if (field === "verba_disponivel") {
        const newFloat = parseFloat(newValue);
        const oldFloat = parseFloat(oldValue);
        return Math.abs(newFloat - oldFloat) > 0.0001;
      }

      // Comparação padrão
      return newValue !== oldValue;
    });

    if (changedFields.length === 0) {
      return Swal.fire("Info", "Nenhuma alteração detectada.", "info");
    }

    setLoading(true);
    try {
      await Promise.all(
        changedFields.map(([field, patchFn]) =>
          patchFn({ project_id: oldData.id, [field]: data[field] })
        )
      );
      await Swal.fire("Sucesso", "Projeto atualizado com sucesso!", "success");
      navigate(-1);
    } catch (error) {
      await Swal.fire(
        "Erro",
        `Falha ao atualizar o projeto. ${error}`,
        "error"
      );
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
