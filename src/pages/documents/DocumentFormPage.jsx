import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BasePage from "../../components/layout/BasePage";
import DocumentForm from "../../features/forms/DocumentForm";
import projectApi from "../../services/api/project";
import Swal from "sweetalert2";

function DocumentFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [initialData, setInitialData] = useState(null);

  const project_id = location.state?.initial_date?.id;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!project_id) {
          Swal.fire("Erro", "ID do projeto não foi encontrado", "error");
          navigate(-1);
          return;
        }

        const response = await projectApi.getProjectWithDetails(project_id);
        setInitialData(response.data.content); // pega só o conteúdo relevante
      } catch (err) {
        Swal.fire("Erro", "Falha ao buscar dados do projeto", "error");
        navigate(-1);
      }
    };

    fetchProject();
  }, [project_id]);

  return (
    <BasePage>
      {initialData && (
        <DocumentForm
          initial_date={initialData} // ← enviado corretamente ao form
          onBack={() => navigate(-1)}
          onSubmit={projectApi.postSaveDocument}
          onDelete={projectApi.deleteDocument}
        />
      )}
    </BasePage>
  );
}

export default DocumentFormPage;
