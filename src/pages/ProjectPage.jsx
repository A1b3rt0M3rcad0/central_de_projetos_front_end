import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BasePage from "../components/BasePage";
import ProjectContent from "../contents/ProjectContent";
import projectApi from "../services/endpoints/project";
import documentsApi from "../services/endpoints/documents";
import Swal from "sweetalert2";

export default function ProjectPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const projectID = location.state?.initial_date.id;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const DownloadDocument = async (project_id, document_name) => {
    try {
      const response = await documentsApi.getDocument(
        project_id,
        document_name,
        {
          responseType: "blob", // <- isso é essencial
        }
      );

      // Cria o blob do arquivo
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      // Cria um link temporário
      const link = document.createElement("a");
      link.href = url;
      link.download = document_name; // Nome sugerido para download
      document.body.appendChild(link);
      link.click();

      // Limpa depois
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erro ao baixar o documento:", error);
      alert("Erro ao baixar o documento.");
    }
  };

  useEffect(() => {
    if (!projectID) {
      Swal.fire("Erro", "ID do projeto não fornecido", "error");
      navigate(-1);
      return;
    }

    const fetchProject = async () => {
      try {
        const response = await projectApi.getProjectWithDetails(projectID);
        setProject(response.data.content);
      } catch (error) {
        Swal.fire("Erro", "Erro ao carregar o projeto", "error");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectID, navigate]);

  if (loading) {
    return (
      <BasePage pageTitle="Carregando Projeto...">
        <div className="text-center text-gray-600 mt-10">Carregando...</div>
      </BasePage>
    );
  }

  if (!project) {
    return null; // já lidou com erro no useEffect
  }

  return (
    <BasePage pageTitle={`Projeto: ${project.name}`}>
      <ProjectContent
        project={project}
        onBack={() => navigate(-1)}
        downloadDocument={DownloadDocument}
      />
    </BasePage>
  );
}
