import { useNavigate, useLocation } from "react-router-dom";
import FolderForm from "../../features/forms/FolderForm";
import BasePage from "../../components/layout/BasePage";
import folderAPI from "../../services/api/folder";
import Swal from "sweetalert2";

export default function FolderFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initial_date = location?.state?.initial_date;
  
  async function onSubmit(data) {
    try {
      await folderAPI.postFolder(data);
      Swal.fire(
        "Criado com sucesso!",
        "A pasta foi criada com sucesso.",
        "success"
      ).then(() => {
        navigate(-1);
      });
    } catch (error) {
      const status = error.response?.status;
      Swal.fire(
        "Erro!",
        `${status == 409 ? "Pasta já existe" : "Erro ao criar pasta"}`,
        "error"
      );
    }
  }

  async function onUpdate(data) {
    try {
      await folderAPI.patchFolder(data);
      Swal.fire(
        "Atualizado com sucesso!",
        "A pasta foi atualizada com sucesso.",
        "success"
      ).then(() => {
        navigate(-1);
      });
    } catch (error) {
      const status = error.response?.status;
      Swal.fire(
        "Erro!",
        `${status == 409 ? "Pasta já existe" : "Erro ao atualizar pasta"}`,
        "error"
      );
    }
  }

  return (
    <BasePage pageTitle={""}>
      <FolderForm
        onBack={() => navigate(-1)}
        onSubmit={onSubmit}
        onUpdate={onUpdate}
        initial_date={initial_date}
      />
    </BasePage>
  );
}

