import BasePage from "../components/BasePage";
import ProjectForm from "../forms/ProjectForm";
import { useNavigate } from "react-router-dom";

function CreateProjectPage() {
  const navigate = useNavigate();
  return (
    <BasePage>
      <ProjectForm onBack={() => navigate(-1)}></ProjectForm>
    </BasePage>
  );
}

export default CreateProjectPage;
