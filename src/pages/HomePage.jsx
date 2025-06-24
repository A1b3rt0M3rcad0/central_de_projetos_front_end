import { useEffect, useState } from "react";
import BasePage from "../components/BasePage";
import HomeContent from "../contents/HomeContent";
import { useNavigate } from "react-router-dom";
import projectApi from "../services/endpoints/project";
import empresaAPI from "../services/endpoints/empresa";
import fiscalAPI from "../services/endpoints/fiscal";
import bairroAPI from "../services/endpoints/bairro";
import LoadingContent from "../contents/LoadingContent";

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
  const [countProjectsByBairro, setCountProjectsByBairro] = useState({});
  const [orcamentoProjectByBairro, setOrcamentoProjectByBairro] = useState({});

  useEffect(() => {
    const fetchData = async () => {
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
      // ------------------------------------------------------------------------

      // Número de projetos por Bairro
      const rawProjectByBairro = (await bairroAPI.getCountProjectsByBairro())
        .data.content.counts;
      const parsedProjectByBairro = Object.entries(rawProjectByBairro).map(
        ([nome, quantidade]) => ({
          nome,
          quantidade,
        })
      );
      setCountProjectsByBairro(parsedProjectByBairro);
      // ----------------------------------------------------------------------------

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
    };
    fetchData();
    setLoading(false);
  }, []);

  return (
    <BasePage pageTitle="">
      {loading ? (
        <LoadingContent />
      ) : (
        <HomeContent
          totalProjects={totalProjects}
          totalBairros={totalBairros}
          totalEmpresas={totalEmpresas}
          totalFiscais={totalFiscais}
          countProjectsByBairro={countProjectsByBairro}
          orcamentoProjectByBairro={orcamentoProjectByBairro}
          onBack={() => navigate(-1)}
        />
      )}
    </BasePage>
  );
}
