import { useNavigate, useLocation } from "react-router-dom";
import FiscalForm from "../../features/forms/FiscalForm";
import BasePage from "../../components/layout/BasePage";
import fiscalAPI from "../../services/api/fiscal";
import Swal from "sweetalert2";

export default function FiscalFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initial_data = location?.state?.initial_data;
  async function onSubmit(fiscal_name) {
    try {
      await fiscalAPI.postFiscal({ fiscal_name: fiscal_name });
      Swal.fire(
        "Criado com sucesso!",
        "O Fiscal foi criada com sucesso.",
        "success"
      );
    } catch (error) {
      const status = error.response.status;
      Swal.fire(
        "Erro!",
        `${status == 409 ? "Fiscal já existe" : "Erro ao criar fiscal"}`,
        "error"
      );
    }
  }

  async function onUpdate(fiscalName, oldFiscalName) {
    try {
      await fiscalAPI.patchFiscal({
        name: oldFiscalName,
        new_name: fiscalName,
      });
      Swal.fire(
        "Atualizado com sucesso!",
        "O Fiscal foi atualizado com sucesso.",
        "success"
      );
    } catch (error) {
      const status = error.response.status;
      Swal.fire(
        "Erro!",
        `${status == 409 ? "Fiscal já existe" : "Erro ao atualizar Fiscal"}`,
        "error"
      );
    }
  }

  return (
    <BasePage pageTitle={""}>
      <FiscalForm
        onBack={() => navigate(-1)}
        onSubmit={onSubmit}
        onUpdate={onUpdate}
        initial_date={initial_data}
      />
    </BasePage>
  );
}
