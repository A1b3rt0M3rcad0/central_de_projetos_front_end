import { useNavigate, useLocation } from "react-router-dom";
import BairroForm from "../forms/BairroForm";
import BasePage from "../components/BasePage";
import bairroAPI from "../services/endpoints/bairro";
import Swal from "sweetalert2";

export default function BairroFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initial_date = location?.state?.initial_date;
  async function onSubmit(bairro_name) {
    try {
      await bairroAPI.postBairro({ bairro_name });
      Swal.fire(
        "Criado com sucesso!",
        "O Bairro foi criada com sucesso.",
        "success"
      );
    } catch (error) {
      const status = error.response.status;
      Swal.fire(
        "Erro!",
        `${status == 409 ? "Bairro já existe" : "Erro ao criar bairro"}`,
        "error"
      );
    }
  }

  async function onUpdate(bairroName, oldBairroName) {
    try {
      await bairroAPI.patchBairro({
        name: oldBairroName,
        new_name: bairroName,
      });
      Swal.fire(
        "Atualizado com sucesso!",
        "O bairro foi atualizado com sucesso.",
        "success"
      );
    } catch (error) {
      const status = error.response.status;
      Swal.fire(
        "Erro!",
        `${status == 409 ? "Bairro já existe" : "Erro ao atualizar empresa"}`,
        "error"
      );
    }
  }

  return (
    <BasePage pageTitle={""}>
      <BairroForm
        onBack={() => navigate(-1)}
        onSubmit={onSubmit}
        onUpdate={onUpdate}
        initial_date={initial_date}
      />
    </BasePage>
  );
}
