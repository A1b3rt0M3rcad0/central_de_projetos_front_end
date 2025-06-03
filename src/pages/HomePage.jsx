import BasePage from "../components/BasePage";
import HomeContent from "../contents/HomeContent";
import { useNavigate } from "react-router-dom";

// 🔸 Aqui você faz fetch real ou mock dos dados
export default function DashboardPage() {
  // 🔸 Mock de dados temporário
  const navigate = useNavigate();
  const totalProjects = 12;
  const totalBairros = 5;
  const totalEmpresas = 4;
  const totalFiscais = 3;
  const custoMedio = 125000;
  const totalVerba = 2800000; // 2.800.000,00

  // Usar "quantidade" no lugar de "total"
  const empresasMaisAtivas = [
    { nome: "Construtora ABC", quantidade: 5 },
    { nome: "Construtora XYZ", quantidade: 4 },
    { nome: "Engenharia Rio", quantidade: 3 },
  ];

  const bairrosMaisAtivos = [
    { nome: "Centro", quantidade: 4 },
    { nome: "Bela Vista", quantidade: 3 },
    { nome: "São João", quantidade: 2 },
    { nome: "Vila Nova", quantidade: 2 },
    { nome: "Jardim das Flores", quantidade: 1 },
  ];

  const fiscaisMaisAtivos = [
    { nome: "Carlos Silva", quantidade: 5 },
    { nome: "Ana Souza", quantidade: 4 },
    { nome: "Marcos Lima", quantidade: 3 },
  ];

  const recentProjects = [
    {
      id: 1,
      name: "Praça Central",
      bairro: "Centro",
      empresa: "Construtora ABC",
      created_at: "2024-05-20",
    },
    {
      id: 2,
      name: "Escola Nova Vida",
      bairro: "Bela Vista",
      empresa: "Construtora XYZ",
      created_at: "2024-05-18",
    },
    {
      id: 3,
      name: "Ponte do Rio",
      bairro: "São João",
      empresa: "Engenharia Rio",
      created_at: "2024-05-15",
    },
  ];

  const recentChanges = [
    {
      project_name: "Praça Central",
      field_changed: "Status",
      new_value: "Em Andamento",
      changed_at: "2024-05-21",
    },
    {
      project_name: "Ponte do Rio",
      field_changed: "Andamento",
      new_value: "80%",
      changed_at: "2024-05-20",
    },
    {
      project_name: "Escola Nova Vida",
      field_changed: "Status",
      new_value: "Concluído",
      changed_at: "2024-05-19",
    },
  ];

  return (
    <BasePage pageTitle={"Início"}>
      <HomeContent
        totalProjects={totalProjects}
        totalBairros={totalBairros}
        totalEmpresas={totalEmpresas}
        totalFiscais={totalFiscais}
        totalVerba={totalVerba}
        empresasMaisAtivas={empresasMaisAtivas}
        bairrosMaisAtivos={bairrosMaisAtivos}
        fiscaisMaisAtivos={fiscaisMaisAtivos}
        recentProjects={recentProjects}
        recentChanges={recentChanges}
        custoMedio={custoMedio}
        onBack={() => navigate(-1)}
      />
    </BasePage>
  );
}
