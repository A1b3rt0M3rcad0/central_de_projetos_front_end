import { useEffect, useState } from "react";
import BasePage from "../../components/layout/BasePage";
import HomeContent from "../../features/contents/HomeContent";
import { useNavigate } from "react-router-dom";
import projectApi from "../../services/api/project";
import empresaAPI from "../../services/api/empresa";
import fiscalAPI from "../../services/api/fiscal";
import bairroAPI from "../../services/api/bairro";
import LoadingContent from "../../features/contents/LoadingContent";
import userApi from "../../services/api/user";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Card Infos
        const bairroCount = (await bairroAPI.getCountBairros()).data.content
          .bairros;
        setTotalBairros(bairroCount);

        const projectCount = (await projectApi.getCountProjects()).data.content
          .projects;
        setTotalProjects(projectCount);

        const empresaCount = (await empresaAPI.getCountEmpresas()).data.content
          .empresas;
        setTotalEmpresas(empresaCount);

        const fiscalCount = (await fiscalAPI.getCountFiscal()).data.content
          .fiscals;
        setTotalFiscais(fiscalCount);

        // Número de projetos por Bairro
        const rawProjectByBairro = (await bairroAPI.getCountProjectsByBairro())
          .data.content.counts;
        const parsedProjectByBairro = Object.entries(rawProjectByBairro).map(
          ([nome, quantidade]) => ({ nome, quantidade })
        );
        setCountProjectsByBairro(parsedProjectByBairro);

        // Orçamento por bairro
        const rawOrcamentoByBairro = (await bairroAPI.getProjectVerbaByBairro())
          .data.content.verba;
        const parsedOrcamentoByBairro = Object.values(rawOrcamentoByBairro).map(
          (bairroObj) => {
            const [nome, orcamento] = Object.entries(bairroObj)[0];
            return { nome, orcamento };
          }
        );
        setOrcamentoProjectByBairro(parsedOrcamentoByBairro);
        // Count Project By Fiscal
        const rawCountProjectByFiscal = (
          await fiscalAPI.getCountProjectByFiscal()
        ).data.content;

        const parsedCountProjectByFiscal = Object.entries(
          rawCountProjectByFiscal
        ).map(([nome, projetos]) => ({
          nome,
          projetos,
        }));

        setCountProjectByFiscal(parsedCountProjectByFiscal);

        // Count Project By Empresa
        const rawCountProjectByEmpresa = (
          await empresaAPI.getCountProjectsbyEmpresas()
        ).data.content;

        const parsedCountProjectByEmpresa = Object.entries(
          rawCountProjectByEmpresa
        ).map(([nome, projetos]) => ({
          nome,
          projetos,
        }));

        setCountProjectByEmpresa(parsedCountProjectByEmpresa);

        // Count Project By Empresa
        const rawCountProjectByUser = (await userApi.getCountProjectsByUser())
          .data.content;

        const parsedCountProjectByUser = Object.entries(
          rawCountProjectByUser
        ).map(([nome, projetos]) => ({
          nome,
          projetos,
        }));

        setCountProjectByUser(parsedCountProjectByUser);

        // Count project by bairro and type
        const countProjectByBairroAndType = (
          await bairroAPI.getCountProjectByBairroAndType()
        ).data.content;
        setCountProjectByBairroAndType(countProjectByBairroAndType);

        // Count project by bairro and status
        const countProjectStatusByBairro = (
          await bairroAPI.getCountProjectStatusByBairro()
        ).data.content;
        setCountProjectStatusByBairro(countProjectStatusByBairro);
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
          countProjectByBairroAndType={countProjectByBairroAndType}
          countProjectStatusByBairro={countProjectStatusByBairro}
          onBack={() => navigate(-1)}
        />
      )}
    </BasePage>
  );
}
