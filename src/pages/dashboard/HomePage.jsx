import { useEffect, useState } from "react";
import BasePage from "../../components/layout/BasePage";
import HomeContent from "../../features/contents/HomeContent";
import { useNavigate } from "react-router-dom";
import dashboardAPI from "../../services/api/dashboard";
import LoadingContent from "../../features/contents/LoadingContent";

// Página principal do dashboard com dados mockados
export default function DashboardPage() {
  const navigate = useNavigate();

  //  Card Infos
  const [loading, setLoading] = useState(true);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalBairros, setTotalBairros] = useState(0);
  const [totalEmpresas, setTotalEmpresas] = useState(0);
  const [totalFiscais, setTotalFiscais] = useState(0);

  // Charts
  const [countProjectsByBairro, setCountProjectsByBairro] = useState([]);
  const [orcamentoProjectByBairro, setOrcamentoProjectByBairro] = useState([]);
  const [countProjectByBairroAndType, setCountProjectByBairroAndType] =
    useState({});
  const [countProjectStatusByBairro, setCountProjectStatusByBairro] = useState(
    {}
  );

  // Tables
  const [countProjectByFiscal, setCountProjectByFiscal] = useState([]);
  const [countProjectByEmpresa, setCountProjectByEmpresa] = useState([]);
  const [countProjectByUser, setCountProjectByUser] = useState([]);

  // Novos dados adicionados
  const [countProjectByType, setCountProjectByType] = useState([]);
  const [countProjectByStatus, setCountProjectByStatus] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🚀 UMA ÚNICA REQUISIÇÃO para buscar todos os dados do dashboard
        const response = await dashboardAPI.getAllData();
        const data = response.data.content;

        // Card Infos
        setTotalProjects(data.counts?.projects || 0);
        setTotalBairros(data.counts?.bairros || 0);
        setTotalEmpresas(data.counts?.empresas || 0);
        setTotalFiscais(data.counts?.fiscais || 0);

        // Número de projetos por Bairro
        setCountProjectsByBairro(data.projects_by_bairro || []);

        // Orçamento por bairro
        setOrcamentoProjectByBairro(data.budget_by_bairro || []);

        // Count Project By Fiscal
        setCountProjectByFiscal(data.projects_by_fiscal || []);

        // Count Project By Empresa
        setCountProjectByEmpresa(data.projects_by_empresa || []);

        // Count Project By User (Vereador)
        setCountProjectByUser(data.projects_by_user || []);

        // Count project by type (simples)
        setCountProjectByType(data.projects_by_type || []);

        // Count project by status (simples)
        setCountProjectByStatus(data.projects_by_status || []);

        // Count project by bairro and type
        setCountProjectByBairroAndType(data.projects_by_bairro_and_type || {});

        // Count project by bairro and status
        setCountProjectStatusByBairro(data.projects_by_bairro_and_status || {});

        console.log(
          "✅ Dashboard carregado com sucesso em 1 requisição única!"
        );
        console.log(
          "📊 Status excluídos:",
          response.data.metadata?.excluded_status
        );
        console.log(
          "📈 Módulos carregados:",
          response.data.metadata?.total_modules
        );
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <BasePage pageTitle="">
      {loading ? (
        <LoadingContent pageTitle="Dashboard" />
      ) : (
        <HomeContent
          totalProjects={totalProjects}
          totalBairros={totalBairros}
          totalEmpresas={totalEmpresas}
          totalFiscais={totalFiscais}
          countProjectsByBairro={countProjectsByBairro}
          orcamentoProjectByBairro={orcamentoProjectByBairro}
          countProjectByFiscal={countProjectByFiscal}
          countProjectByEmpresa={countProjectByEmpresa}
          countProjectByUser={countProjectByUser}
          countProjectByType={countProjectByType}
          countProjectByStatus={countProjectByStatus}
          countProjectByBairroAndType={countProjectByBairroAndType}
          countProjectStatusByBairro={countProjectStatusByBairro}
          onBack={() => navigate(-1)}
        />
      )}
    </BasePage>
  );
}
