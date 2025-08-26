import { useState, useMemo } from "react";
import BaseContent from "../../components/BaseContent";
import { Hammer, MapPin, Building, NotebookPen } from "lucide-react";
import {
  StatCard,
  ProjectsByBairroChart,
  BudgetByBairroChart,
  StatusDistributionChart,
  ProjectsByTypeChart,
  TopPerformersTable,
} from "../../components";

export default function HomeContent({
  totalProjects,
  totalBairros,
  totalEmpresas,
  totalFiscais,
  countProjectsByBairro,
  orcamentoProjectByBairro,
  countProjectByFiscal,
  countProjectByEmpresa,
  countProjectByUser,
  countProjectByBairroAndType,
  countProjectStatusByBairro,
  onBack = () => {},
}) {
  const [statusFilterBairro, setStatusFilterBairro] = useState("all");
  const [tipoFilterBairro, setTipoFilterBairro] = useState("all");

  const countProjectsByBairroSorted = useMemo(() => {
    if (!countProjectsByBairro) return [];
    return [...countProjectsByBairro]
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10); // pega os 10 maiores
  }, [countProjectsByBairro]);

  const orcamentoProjectByBairroSorted = useMemo(() => {
    if (!orcamentoProjectByBairro) return [];
    return [...orcamentoProjectByBairro]
      .sort((a, b) => b.orcamento - a.orcamento)
      .slice(0, 10); // pega os 10 maiores
  }, [orcamentoProjectByBairro]);

  const filteredStatusDistribution = useMemo(() => {
    const data = countProjectStatusByBairro?.status;
    if (!data) return [];

    const statusMap = {};

    Object.values(data).forEach((bairroObj) => {
      Object.entries(bairroObj).forEach(([bairroName, statusCounts]) => {
        if (statusFilterBairro === "all" || bairroName === statusFilterBairro) {
          Object.entries(statusCounts).forEach(([status, count]) => {
            if (!statusMap[status]) statusMap[status] = 0;
            statusMap[status] += count;
          });
        }
      });
    });

    return Object.entries(statusMap).map(([name, value]) => ({ name, value }));
  }, [countProjectStatusByBairro, statusFilterBairro]);

  const bairroOptions = useMemo(() => {
    if (!countProjectStatusByBairro?.bairros)
      return [{ value: "all", label: "Todos os Bairros" }];

    return [
      { value: "all", label: "Todos os Bairros" },
      ...countProjectStatusByBairro.bairros.map((bairro) => ({
        value: bairro.name,
        label: bairro.name,
      })),
    ];
  }, [countProjectStatusByBairro]);

  const projetosPorTipoTransformado = useMemo(() => {
    const data = countProjectByBairroAndType;
    if (!data?.types || !data?.types_count_by_bairro) return [];

    const tiposPorLinha = {};
    data.types.forEach((t) => {
      tiposPorLinha[t.name] = {};
    });

    const tiposBairro = data.types_count_by_bairro;
    Object.values(tiposBairro).forEach((bairroData) => {
      Object.entries(bairroData).forEach(([bairro, tiposNoBairro]) => {
        Object.entries(tiposNoBairro).forEach(([tipo, qtd]) => {
          if (!tiposPorLinha[tipo]) tiposPorLinha[tipo] = {};
          tiposPorLinha[tipo][bairro] = qtd;
        });
      });
    });

    const todosBairros = new Set();
    Object.values(tiposBairro).forEach((bairroData) => {
      Object.keys(bairroData).forEach((bairro) => todosBairros.add(bairro));
    });

    return Object.entries(tiposPorLinha).map(([tipo, bairros]) => {
      const linha = { tipo };
      todosBairros.forEach((bairro) => {
        linha[bairro] = bairros[bairro] || 0;
      });
      return linha;
    });
  }, [countProjectByBairroAndType]);

  const filteredProjetosPorTipo = useMemo(() => {
    if (tipoFilterBairro === "all") return projetosPorTipoTransformado;
    return projetosPorTipoTransformado.map((item) => ({
      tipo: item.tipo,
      quantidade: item[tipoFilterBairro] || 0,
    }));
  }, [projetosPorTipoTransformado, tipoFilterBairro]);
  return (
    <BaseContent pageTitle="Início" onBack={onBack}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<Hammer className="text-blue-600" />}
          label="Total de Projetos"
          value={totalProjects}
        />
        <StatCard
          icon={<MapPin className="text-blue-600" />}
          label="Total de Bairros"
          value={totalBairros}
        />
        <StatCard
          icon={<Building className="text-blue-600" />}
          label="Total de Empresas"
          value={totalEmpresas}
        />
        <StatCard
          icon={<NotebookPen className="text-blue-600" />}
          label="Total de Fiscais"
          value={totalFiscais}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ProjectsByBairroChart data={countProjectsByBairroSorted} />
        <BudgetByBairroChart data={orcamentoProjectByBairroSorted} />
        <StatusDistributionChart
          data={filteredStatusDistribution}
          filterValue={statusFilterBairro}
          onFilterChange={setStatusFilterBairro}
          filterOptions={bairroOptions}
        />
        <ProjectsByTypeChart
          data={filteredProjetosPorTipo}
          filterValue={tipoFilterBairro}
          onFilterChange={setTipoFilterBairro}
          filterOptions={bairroOptions}
          fullData={projetosPorTipoTransformado}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <TopPerformersTable
          title="👷 Fiscais e Projetos Associados"
          data={countProjectByFiscal}
          columns={[
            { key: "nome", label: "Fiscal" },
            { key: "projetos", label: "Projetos" },
          ]}
        />
        <TopPerformersTable
          title="🏢 Empresas e Projetos Associados"
          data={countProjectByEmpresa}
          columns={[
            { key: "nome", label: "Empresa" },
            { key: "projetos", label: "Projetos" },
          ]}
        />
        <TopPerformersTable
          title="🏛️ Vereadores e Projetos Associados"
          data={countProjectByUser}
          columns={[
            { key: "nome", label: "Vereador" },
            { key: "projetos", label: "Projetos" },
          ]}
        />
      </div>
    </BaseContent>
  );
}
