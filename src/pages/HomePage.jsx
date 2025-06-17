import BasePage from "../components/BasePage";
import HomeContent from "../contents/HomeContent";
import { useNavigate } from "react-router-dom";

// Página principal do dashboard com dados mockados
export default function DashboardPage() {
  const navigate = useNavigate();

  // 👷‍♀️ Dados de resumo
  const totalProjects = 12;
  const totalBairros = 5;
  const totalEmpresas = 4;
  const totalFiscais = 3;
  const custoMedio = 125000;
  const totalVerba = 2800000; // R$ 2.800.000,00

  // 📊 Top 10 mock com status para filtro
  const empresasMaisAtivas = [
    { nome: "Construtora ABC", quantidade: 5, status: "running" },
    { nome: "Construtora XYZ", quantidade: 4, status: "planning" },
    { nome: "Engenharia Rio", quantidade: 3, status: "done" },
  ];

  const bairrosMaisAtivos = [
    { nome: "Centro", quantidade: 4, status: "running" },
    { nome: "Bela Vista", quantidade: 3, status: "awaiting_funds" },
    { nome: "São João", quantidade: 2, status: "planning" },
    { nome: "Vila Nova", quantidade: 2, status: "running" },
    { nome: "Jardim das Flores", quantidade: 1, status: "done" },
  ];

  const fiscaisMaisAtivos = [
    { nome: "Carlos Silva", quantidade: 5, status: "running" },
    { nome: "Ana Souza", quantidade: 4, status: "planning" },
    { nome: "Marcos Lima", quantidade: 3, status: "awaiting_funds" },
  ];

  // 🕓 Timeline de projetos recentes
  const recentProjects = [
    {
      id: 1,
      name: "Praça Central",
      bairro: "Centro",
      empresa: "Construtora ABC",
      created_at: "2024-05-20",
      status: "running",
    },
    {
      id: 2,
      name: "Escola Nova Vida",
      bairro: "Bela Vista",
      empresa: "Construtora XYZ",
      created_at: "2024-05-18",
      status: "awaiting_funds",
    },
    {
      id: 3,
      name: "Ponte do Rio",
      bairro: "São João",
      empresa: "Engenharia Rio",
      created_at: "2024-05-15",
      status: "planning",
    },
  ];

  // 🔧 Histórico de alterações recentes
  const recentChanges = [
    {
      project_name: "Praça Central",
      field_changed: "Status",
      new_value: "Em Andamento",
      changed_at: "2024-05-21",
      status: "running",
    },
    {
      project_name: "Ponte do Rio",
      field_changed: "Andamento",
      new_value: "80% concluído",
      changed_at: "2024-05-20",
      status: "running",
    },
    {
      project_name: "Escola Nova Vida",
      field_changed: "Status",
      new_value: "Concluído",
      changed_at: "2024-05-19",
      status: "done",
    },
  ];

  return (
    <BasePage pageTitle="Dashboard">
      <HomeContent
        totalProjects={totalProjects}
        totalBairros={totalBairros}
        totalEmpresas={totalEmpresas}
        totalFiscais={totalFiscais}
        totalVerba={totalVerba}
        custoMedio={custoMedio}
        empresasMaisAtivas={empresasMaisAtivas}
        bairrosMaisAtivos={bairrosMaisAtivos}
        fiscaisMaisAtivos={fiscaisMaisAtivos}
        recentProjects={recentProjects}
        recentChanges={recentChanges}
        onBack={() => navigate(-1)}
      />
    </BasePage>
  );
}
