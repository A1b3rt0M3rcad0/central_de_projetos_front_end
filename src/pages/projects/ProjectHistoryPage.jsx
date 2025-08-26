import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BasePage from "../../components/layout/BasePage";
import ProjectHistoryContent from "../../features/contents/ProjectHistoryContent";
import projectApi from "../../services/api/project";
import Swal from "sweetalert2";

export default function ProjectHistoryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const projectID = location.state?.projectId;
  const projectName = location.state?.projectName;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

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
        Swal.fire("Erro", "Erro ao carregar o histórico do projeto", "error");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectID, navigate]);

  if (loading) {
    return (
      <BasePage pageTitle="Carregando Histórico...">
        <div className="text-center text-gray-600 mt-10">Carregando...</div>
      </BasePage>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <BasePage pageTitle={`Histórico - ${projectName || project.name}`}>
      <ProjectHistoryContent project={project} onBack={() => navigate(-1)} />
    </BasePage>
  );
}
