import { useNavigate, useLocation } from "react-router-dom";
import StatusForm from "../forms/StatusForm";
import BasePage from "../components/BasePage";
import statusAPI from "../services/endpoints/status";
import Swal from "sweetalert2";

export default function StatusFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initial_date = location?.state?.initial_date;
  async function onSubmit(description) {
    try {
      await statusAPI.postStatus({ description });
      Swal.fire(
        "Criado com sucesso!",
        "O Status foi criada com sucesso.",
        "success"
      );
    } catch (error) {
      const status = error.response.status;
      Swal.fire(
        "Erro!",
        `${status == 409 ? "Status já existe" : "Erro ao criar status"}`,
        "error"
      );
    }
  }

  async function onUpdate(statusId, statusDescription) {
    try {
      await statusAPI.patchStatus({
        status_id: statusId,
        description: statusDescription,
      });
      Swal.fire(
        "Atualizado com sucesso!",
        "O status foi atualizado com sucesso.",
        "success"
      );
    } catch (error) {
      const status = error.response.status;
      Swal.fire(
        "Erro!",
        `${status == 409 ? "Status já existe" : "Erro ao atualizar status"}`,
        "error"
      );
    }
  }

  return (
    <BasePage pageTitle={""}>
      <StatusForm
        onBack={() => navigate(-1)}
        onSubmit={onSubmit}
        onUpdate={onUpdate}
        initial_date={initial_date}
      />
    </BasePage>
  );
}
