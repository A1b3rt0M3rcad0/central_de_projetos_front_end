import { useNavigate, useLocation } from "react-router-dom";
import FiscalForm from "../../features/forms/FiscalForm";
import BasePage from "../../components/layout/BasePage";
import fiscalAPI from "../../services/api/fiscal";
import Swal from "sweetalert2";

export default function FiscalFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initial_data = location?.state?.initial_data;

  async function onSubmit(fiscalData) {
    try {
      await fiscalAPI.postFiscalComplete(fiscalData);
      Swal.fire({
        icon: "success",
        title: "Criado com sucesso!",
        text: "O Fiscal foi criado com sucesso.",
        confirmButtonText: "OK",
      }).then(() => {
        navigate(-1);
      });
    } catch (error) {
      const status = error?.response?.status;
      const errorMessage =
        status === 409
          ? "Fiscal já existe"
          : error?.response?.data?.detail || "Erro ao criar fiscal";

      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: errorMessage,
        confirmButtonText: "OK",
      });
    }
  }

  async function onUpdate(fiscalData, oldFiscalName) {
    try {
      const promises = [];

      // Atualizar nome se mudou
      if (fiscalData.fiscalName !== oldFiscalName) {
        promises.push(
          fiscalAPI.patchFiscal({
            name: oldFiscalName,
            new_name: fiscalData.fiscalName,
          })
        );
      }

      // Atualizar email se fornecido
      if (fiscalData.fiscalEmail) {
        promises.push(
          fiscalAPI.patchFiscalEmail({
            name:
              fiscalData.fiscalName !== oldFiscalName
                ? fiscalData.fiscalName
                : oldFiscalName,
            email: fiscalData.fiscalEmail,
          })
        );
      }

      // Atualizar senha se fornecida
      if (fiscalData.fiscalPassword) {
        promises.push(
          fiscalAPI.patchFiscalPassword({
            name:
              fiscalData.fiscalName !== oldFiscalName
                ? fiscalData.fiscalName
                : oldFiscalName,
            password: fiscalData.fiscalPassword,
          })
        );
      }

      // Atualizar telefone se fornecido
      if (fiscalData.fiscalPhone) {
        promises.push(
          fiscalAPI.patchFiscalPhone({
            name:
              fiscalData.fiscalName !== oldFiscalName
                ? fiscalData.fiscalName
                : oldFiscalName,
            phone: fiscalData.fiscalPhone.replace(/\D/g, ""),
          })
        );
      }

      // Executar todas as atualizações em paralelo
      await Promise.all(promises);

      Swal.fire({
        icon: "success",
        title: "Atualizado com sucesso!",
        text: "O Fiscal foi atualizado com sucesso.",
        confirmButtonText: "OK",
      }).then(() => {
        navigate(-1);
      });
    } catch (error) {
      const status = error?.response?.status;
      const errorMessage =
        status === 409
          ? "Fiscal já existe"
          : error?.response?.data?.detail || "Erro ao atualizar Fiscal";

      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: errorMessage,
        confirmButtonText: "OK",
      });
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
