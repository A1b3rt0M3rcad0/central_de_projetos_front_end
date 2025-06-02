import BasePage from "../components/BasePage";
import ProjectContent from "../contents/ProjectContent";
import { useNavigate } from "react-router-dom";

export default function ProjectPage() {
  const navigate = useNavigate();

  // Dados mockados (depois você puxa de uma API ou contexto)
  const project = {
    id: 1,
    name: "Revitalização Urbana",
    verba_disponivel: 500000,
    andamento_do_projeto: "Em andamento",
    start_date: "2024-01-01",
    expected_completion_date: "2024-12-31",
    end_date: null,
    status: "Ativo",
    bairro: "Centro",
    empresa: "Construtora Alpha",
    tipo: "Infraestrutura",
    fiscal: "João de souza",
    documentos: [
      { id: 1, nome: "Memorial Descritivo.pdf", url: "#" },
      { id: 2, nome: "Orçamento.xlsx", url: "#" },
    ],
    historico: [
      {
        id: 1,
        data_name: "Status",
        description: "Projeto iniciado",
        updated_at: "2024-01-01",
      },
      {
        id: 2,
        data_name: "Verba",
        description: "Verba adicionada",
        updated_at: "2024-03-01",
      },
    ],
  };

  return (
    <BasePage pageTitle={`${project.name}`}>
      <ProjectContent project={project} onBack={() => navigate(-1)} />
    </BasePage>
  );
}
