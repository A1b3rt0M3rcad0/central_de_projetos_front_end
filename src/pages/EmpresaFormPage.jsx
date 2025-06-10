import { useNavigate, useLocation } from "react-router-dom";
import EmpresaForm from "../forms/EmpresaForm";
import BasePage from "../components/BasePage";
import empresaAPI from "../services/endpoints/empresa";
import Swal from "sweetalert2";

export default function ProjectFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initial_date = location?.state?.initial_date;
  async function onSubmit(empresa_name) {
    try {
      await empresaAPI.postEmpresa({ empresa_name });
      Swal.fire(
        "Criado com sucesso!",
        "A empresa foi criada com sucesso.",
        "success"
      );
    } catch (error) {
      const status = error.response.status;
      Swal.fire(
        "Erro!",
        `${status == 409 ? "Empresa já existe" : "Erro ao criar empresa"}`,
        "error"
      );
    }
  }

  async function onUpdate(empresaName, oldEmpresaName) {
    try {
      await empresaAPI.patchEmpresa({
        name: oldEmpresaName,
        new_name: empresaName,
      });
      Swal.fire(
        "Atualizado com sucesso!",
        "A empresa foi atualizada com sucesso.",
        "success"
      );
    } catch (error) {
      const status = error.response.status;
      Swal.fire(
        "Erro!",
        `${status == 409 ? "Empresa já existe" : "Erro ao atualizar empresa"}`,
        "error"
      );
    }
  }

  return (
    <BasePage pageTitle={""}>
      <EmpresaForm
        onBack={() => navigate(-1)}
        onSubmit={onSubmit}
        onUpdate={onUpdate}
        initial_date={initial_date}
      />
    </BasePage>
  );
}
