import BasePage from "../components/BasePage";
import ProjectForm from "../forms/ProjectForm";
import { useNavigate } from "react-router-dom";

function CreateProjectPage() {
  return (
    <BasePage>
      <ProjectForm></ProjectForm>
    </BasePage>
  );
}

export default CreateProjectPage;
