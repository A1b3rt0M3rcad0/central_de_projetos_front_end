import { useNavigate, useLocation } from "react-router-dom";
import TipoForm from "../../features/forms/TipoForm";
import BasePage from "../../components/layout/BasePage";
import tipoAPI from "../../services/api/tipo";
import Swal from "sweetalert2";

export default function TipoFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initial_date = location?.state?.initial_date;
  async function onSubmit(name) {
    try {
      await tipoAPI.postTipo({ name });
      Swal.fire(
        "Criado com sucesso!",
        "O Tipo foi criada com sucesso.",
        "success"
      );
    } catch (error) {
      const status = error.response.status;
      Swal.fire(
        "Erro!",
        `${status == 409 ? "Tipo já existe" : "Erro ao criar tipo"}`,
        "error"
      );
    }
  }

  async function onUpdate(tipoName, oldTipoName) {
    try {
      await tipoAPI.patchTipo({
        name: oldTipoName,
        new_name: tipoName,
      });
      Swal.fire(
        "Atualizado com sucesso!",
        "O tipo foi atualizado com sucesso.",
        "success"
      );
    } catch (error) {
      const status = error.response.status;
      Swal.fire(
        "Erro!",
        `${status == 409 ? "Tipo já existe" : "Erro ao atualizar tipo"}`,
        "error"
      );
    }
  }

  return (
    <BasePage pageTitle={""}>
      <TipoForm
        onBack={() => navigate(-1)}
        onSubmit={onSubmit}
        onUpdate={onUpdate}
        initial_date={initial_date}
      />
    </BasePage>
  );
}
