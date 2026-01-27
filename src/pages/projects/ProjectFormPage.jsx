import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import BasePage from "../../components/layout/BasePage";
import ProjectForm from "../../features/forms/ProjectForm";
import projectApi from "../../services/api/project";

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

// Função para normalizar valores monetários (string formatada ou número) para número
function normalizeCurrencyValue(value) {
  // Se for null, undefined ou vazio, retorna 0
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  // Se já for número, retorna direto
  if (typeof value === "number") {
    return isNaN(value) ? 0 : value;
  }

  // Se for string formatada (ex: "R$ 1.000,00" ou "R$ 1000,00")
  if (typeof value === "string") {
    // Remove caracteres não numéricos, mantendo apenas dígitos, vírgula e ponto
    let cleaned = value.replace(/[^\d,.-]/g, "");
    
    // Se não há vírgula nem ponto, é um número inteiro
    if (!cleaned.includes(",") && !cleaned.includes(".")) {
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }
    
    // Se tem vírgula, assume formato brasileiro (1.000,00)
    if (cleaned.includes(",")) {
      // Remove pontos (separadores de milhar) e substitui vírgula por ponto
      cleaned = cleaned.replace(/\./g, "").replace(",", ".");
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }
    
    // Se tem apenas ponto, pode ser formato americano (1000.00) ou milhar brasileiro (1.000)
    // Se tem mais de um ponto ou ponto seguido de 2 dígitos, assume decimal
    const parts = cleaned.split(".");
    if (parts.length === 2 && parts[1].length <= 2) {
      // Formato decimal (ex: 1000.50)
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    } else {
      // Formato milhar (ex: 1.000), remove pontos
      cleaned = cleaned.replace(/\./g, "");
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }
  }

  // Fallback: tenta converter para número
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
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

      // Para valores monetários (float), normaliza e compara com margem de erro
      if (field === "verba_disponivel") {
        const newFloat = normalizeCurrencyValue(newValue);
        const oldFloat = normalizeCurrencyValue(oldValue);
        
        // Se algum valor for inválido (NaN), considera como alterado para forçar atualização
        if (isNaN(newFloat) || isNaN(oldFloat)) {
          return true;
        }
        
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
