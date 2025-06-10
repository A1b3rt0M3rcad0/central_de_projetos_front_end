import { useNavigate } from "react-router-dom";
import EmpresaForm from "../forms/EmpresaForm";
import BasePage from "../components/BasePage";
import empresaAPI from "../services/endpoints/empresa";
import Swal from "sweetalert2";

export default function ProjectFormPage({ initial_date }) {
  const navigate = useNavigate();
  async function onSubmit(empresa_name) {
    try {
      await empresaAPI.postEmpresa({ empresa_name }); // empresa_name já é string
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

  return (
    <BasePage pageTitle={""}>
      <EmpresaForm
        onBack={() => navigate(-1)}
        onSubmit={onSubmit}
        initial_date={initial_date}
      />
    </BasePage>
  );
}
