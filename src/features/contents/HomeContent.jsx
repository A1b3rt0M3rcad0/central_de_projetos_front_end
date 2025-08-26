import { useState, useMemo, useEffect } from "react";
import BaseContent from "../../components/BaseContent";
import {
  Hammer,
  MapPin,
  Building,
  NotebookPen,
  TrendingUp,
  Users,
  Calendar,
  Eye,
  BarChart3,
  Filter,
  RefreshCw,
} from "lucide-react";
import {
  StatCard,
  ProjectsByBairroChart,
  BudgetByBairroChart,
  StatusDistributionChart,
  ProjectsByTypeChart,
  TopPerformersTable,
  useNotification,
  NotificationContainer,
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Sistema de notificações
  const { notifications, removeNotification, showSuccess, showInfo } =
    useNotification();

  // Simular refresh dos dados
  const handleRefresh = () => {
    setIsRefreshing(true);
    showInfo("Atualizando dados", "Buscando informações mais recentes...");

    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
      showSuccess(
        "Dados atualizados",
        "Informações foram atualizadas com sucesso!"
      );
    }, 1000);
  };

  // Calcular métricas adicionais
  const metrics = useMemo(() => {
    const avgProjectsPerBairro =
      totalBairros > 0 ? (totalProjects / totalBairros).toFixed(1) : 0;
    const avgProjectsPerFiscal =
      totalFiscais > 0 ? (totalProjects / totalFiscais).toFixed(1) : 0;

    return {
      avgProjectsPerBairro,
      avgProjectsPerFiscal,
    };
  }, [totalProjects, totalBairros, totalFiscais]);

  const countProjectsByBairroSorted = useMemo(() => {
    if (!countProjectsByBairro) return [];
    return [...countProjectsByBairro]
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 8); // Reduzido para melhor visualização
  }, [countProjectsByBairro]);

  const orcamentoProjectByBairroSorted = useMemo(() => {
    if (!orcamentoProjectByBairro) return [];
    return [...orcamentoProjectByBairro]
      .sort((a, b) => b.orcamento - a.orcamento)
      .slice(0, 8); // Reduzido para melhor visualização
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
    <>
      <BaseContent pageTitle="Dashboard" onBack={onBack}>
        {/* Header com ações rápidas */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bem-vindo ao Sistema de Gestão
              </h1>
              <p className="text-gray-600 text-lg">
                Acompanhe o progresso dos projetos e métricas em tempo real
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                <span className="text-sm font-medium">Atualizar</span>
              </button>

              <div className="text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                Última atualização: {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        {/* Cards de métricas principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Hammer className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 opacity-80" />
            </div>
            <h3 className="text-sm font-medium opacity-90 mb-1">
              Total de Projetos
            </h3>
            <p className="text-3xl font-bold">
              {totalProjects.toLocaleString()}
            </p>
            <p className="text-sm opacity-80 mt-2">Ativos no sistema</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <MapPin className="w-6 h-6" />
              </div>
              <Users className="w-5 h-5 opacity-80" />
            </div>
            <h3 className="text-sm font-medium opacity-90 mb-1">
              Bairros Atendidos
            </h3>
            <p className="text-3xl font-bold">
              {totalBairros.toLocaleString()}
            </p>
            <p className="text-sm opacity-80 mt-2">
              {metrics.avgProjectsPerBairro} projetos/bairro
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Building className="w-6 h-6" />
              </div>
              <BarChart3 className="w-5 h-5 opacity-80" />
            </div>
            <h3 className="text-sm font-medium opacity-90 mb-1">
              Empresas Parceiras
            </h3>
            <p className="text-3xl font-bold">
              {totalEmpresas.toLocaleString()}
            </p>
            <p className="text-sm opacity-80 mt-2">Ativas no sistema</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl shadow-lg text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <NotebookPen className="w-6 h-6" />
              </div>
              <Calendar className="w-5 h-5 opacity-80" />
            </div>
            <h3 className="text-sm font-medium opacity-90 mb-1">
              Fiscais Ativos
            </h3>
            <p className="text-3xl font-bold">
              {totalFiscais.toLocaleString()}
            </p>
            <p className="text-sm opacity-80 mt-2">
              {metrics.avgProjectsPerFiscal} projetos/fiscal
            </p>
          </div>
        </div>

        {/* Seção de gráficos */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Análise de Dados
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Eye className="w-4 h-4" />
              <span>Visualizações interativas</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  📍 Projetos por Bairro
                </h3>
                <Filter className="w-4 h-4 text-gray-400" />
              </div>
              <ProjectsByBairroChart data={countProjectsByBairroSorted} />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  💰 Orçamento por Bairro
                </h3>
                <Filter className="w-4 h-4 text-gray-400" />
              </div>
              <BudgetByBairroChart data={orcamentoProjectByBairroSorted} />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  📊 Distribuição por Status
                </h3>
                <select
                  value={statusFilterBairro}
                  onChange={(e) => setStatusFilterBairro(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {bairroOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <StatusDistributionChart
                data={filteredStatusDistribution}
                filterValue={statusFilterBairro}
                onFilterChange={setStatusFilterBairro}
                filterOptions={bairroOptions}
              />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  🏗️ Projetos por Tipo
                </h3>
                <select
                  value={tipoFilterBairro}
                  onChange={(e) => setTipoFilterBairro(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {bairroOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <ProjectsByTypeChart
                data={filteredProjetosPorTipo}
                filterValue={tipoFilterBairro}
                onFilterChange={setTipoFilterBairro}
                filterOptions={bairroOptions}
                fullData={projetosPorTipoTransformado}
              />
            </div>
          </div>
        </div>

        {/* Tabelas de performance */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Performance e Análise
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Performance dos Fiscais
                </h3>
              </div>
              <TopPerformersTable
                title="👷 Fiscais e Projetos"
                data={countProjectByFiscal}
                columns={[
                  { key: "nome", label: "Fiscal" },
                  { key: "projetos", label: "Projetos" },
                ]}
                category="fiscais"
              />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-6 bg-green-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Performance das Empresas
                </h3>
              </div>
              <TopPerformersTable
                title="🏢 Empresas e Projetos"
                data={countProjectByEmpresa}
                columns={[
                  { key: "nome", label: "Empresa" },
                  { key: "projetos", label: "Projetos" },
                ]}
                category="empresas"
              />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Performance dos Vereadores
                </h3>
              </div>
              <TopPerformersTable
                title="🏛️ Vereadores e Projetos"
                data={countProjectByUser}
                columns={[
                  { key: "nome", label: "Vereador" },
                  { key: "projetos", label: "Projetos" },
                ]}
                category="vereadores"
              />
            </div>
          </div>
        </div>
      </BaseContent>

      {/* Sistema de notificações */}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </>
  );
}
