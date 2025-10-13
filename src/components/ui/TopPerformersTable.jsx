import React, { useMemo, useState } from "react";
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  BarChart3,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Star,
  Zap,
} from "lucide-react";

export default function TopPerformersTable({
  title,
  data,
  columns,
  limit = 5,
  category = "default",
}) {
  const [showDetailedInsights, setShowDetailedInsights] = useState(false);

  const insights = useMemo(() => {
    if (!data || data.length === 0) return null;

    const totalProjects = data.reduce(
      (sum, item) => sum + item[columns[1].key],
      0
    );
    const avgProjects = totalProjects / data.length;
    const medianProjects =
      data[Math.floor(data.length / 2)]?.[columns[1].key] || 0;
    const maxProjects = Math.max(...data.map((item) => item[columns[1].key]));
    const minProjects = Math.min(...data.map((item) => item[columns[1].key]));

    // Calcular concentração (quanto o top 3 representa do total)
    const top3Projects = data
      .sort((a, b) => b[columns[1].key] - a[columns[1].key])
      .slice(0, 3)
      .reduce((sum, item) => sum + item[columns[1].key], 0);
    const concentration =
      totalProjects > 0 ? (top3Projects / totalProjects) * 100 : 0;

    // Categorizar por performance
    const performanceRanges = {
      high: data.filter((item) => item[columns[1].key] > avgProjects * 1.5)
        .length,
      medium: data.filter(
        (item) =>
          item[columns[1].key] <= avgProjects * 1.5 &&
          item[columns[1].key] > avgProjects * 0.7
      ).length,
      low: data.filter((item) => item[columns[1].key] <= avgProjects * 0.7)
        .length,
    };

    // Top performers
    const topPerformers = [...data]
      .sort((a, b) => b[columns[1].key] - a[columns[1].key])
      .slice(0, 3);

    // Bottom performers
    const bottomPerformers = [...data]
      .sort((a, b) => a[columns[1].key] - b[columns[1].key])
      .slice(0, 3);

    return {
      totalProjects,
      avgProjects,
      medianProjects,
      maxProjects,
      minProjects,
      concentration,
      performanceRanges,
      totalItems: data.length,
      topPerformers,
      bottomPerformers,
    };
  }, [data, columns]);

  const getPerformanceIcon = (index) => {
    switch (index) {
      case 0:
        return <Star className="w-4 h-4 text-yellow-500" />;
      case 1:
        return <Star className="w-4 h-4 text-gray-400" />;
      case 2:
        return <Star className="w-4 h-4 text-orange-500" />;
      default:
        return (
          <span className="w-4 h-4 text-sm font-bold text-gray-400 flex items-center justify-center">
            {index + 1}
          </span>
        );
    }
  };

  const getPerformanceColor = (index) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200";
      case 1:
        return "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200";
      case 2:
        return "bg-gradient-to-r from-orange-50 to-red-50 border-orange-200";
      default:
        return "bg-white border-gray-100";
    }
  };

  const getCategoryIcon = () => {
    switch (category) {
      case "fiscais":
        return <Users className="w-4 h-4 text-blue-600" />;
      case "empresas":
        return <Target className="w-4 h-4 text-green-600" />;
      case "vereadores":
        return <Star className="w-4 h-4 text-purple-600" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCategoryColor = () => {
    switch (category) {
      case "fiscais":
        return "from-blue-50 to-indigo-50 border-blue-100";
      case "empresas":
        return "from-green-50 to-emerald-50 border-green-100";
      case "vereadores":
        return "from-purple-50 to-pink-50 border-purple-100";
      default:
        return "from-gray-50 to-slate-50 border-gray-100";
    }
  };

  const performanceData = data
    .sort((a, b) => b[columns[1].key] - a[columns[1].key])
    .slice(0, limit);

  if (!insights || insights.totalProjects === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-sm">Nenhum dado disponível</p>
          <p className="text-xs text-gray-400">
            Verifique os filtros aplicados
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {/* Header com insights */}
      <div
        className={`mb-4 p-3 bg-gradient-to-r ${getCategoryColor()} rounded-lg border`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-gray-900">
              Análise de Performance
            </h4>
            <button
              onClick={() => setShowDetailedInsights(!showDetailedInsights)}
              className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
            >
              {showDetailedInsights ? (
                <>
                  <ChevronUp className="w-3 h-3" />
                  Menos
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" />
                  Mais
                </>
              )}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 bg-white/50 px-2 py-1 rounded-full">
              {insights.totalProjects} projetos
            </span>
            <span className="text-xs text-gray-600 bg-white/50 px-2 py-1 rounded-full">
              {insights.totalItems} {columns[0].label.toLowerCase()}s
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-600" />
            <span className="text-gray-700">Melhor:</span>
            <span className="font-semibold text-green-700">
              {insights.topPerformers[0]?.[columns[0].key]} (
              {insights.topPerformers[0]?.[columns[1].key]})
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Target className="w-3 h-3 text-blue-600" />
            <span className="text-gray-700">Média:</span>
            <span className="font-semibold text-blue-700">
              {insights.avgProjects.toFixed(1)} por{" "}
              {columns[0].label.toLowerCase()}
            </span>
          </div>
        </div>

        {/* Insights detalhados */}
        {showDetailedInsights && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="grid grid-cols-1 gap-3 text-xs">
              {/* Melhores performers */}
              <div>
                <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-600" />
                  Melhores Performances
                </h5>
                <div className="space-y-1">
                  {insights.topPerformers.map((item, index) => (
                    <div
                      key={item[columns[0].key]}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <span className="font-medium">
                          {item[columns[0].key]}
                        </span>
                      </div>
                      <span className="text-green-600 font-semibold min-w-[4rem] text-right">
                        {item[columns[1].key]} projetos
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Distribuição por performance */}
              <div>
                <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <BarChart3 className="w-3 h-3 text-blue-600" />
                  Distribuição por Performance
                </h5>
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Alta (&gt;150% média)</span>
                    </div>
                    <span className="font-semibold min-w-[3rem] text-right">
                      {insights.performanceRanges.high}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded"></div>
                      <span>Média (70-150% média)</span>
                    </div>
                    <span className="font-semibold min-w-[3rem] text-right">
                      {insights.performanceRanges.medium}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span>Baixa (&lt;70% média)</span>
                    </div>
                    <span className="font-semibold min-w-[3rem] text-right">
                      {insights.performanceRanges.low}
                    </span>
                  </div>
                </div>
              </div>

              {/* Alertas */}
              {insights.concentration > 70 && (
                <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-3 h-3 text-yellow-600 mt-0.5" />
                    <div>
                      <h6 className="font-medium text-yellow-800 text-xs">
                        Alta Concentração
                      </h6>
                      <p className="text-xs text-yellow-700">
                        Os 3 com melhor performance concentram{" "}
                        {insights.concentration.toFixed(0)}% dos projetos.
                        Considere distribuir melhor a carga de trabalho.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {insights.performanceRanges.low >
                insights.performanceRanges.high && (
                <div className="p-2 bg-red-50 border border-red-200 rounded">
                  <div className="flex items-start gap-2">
                    <Zap className="w-3 h-3 text-red-600 mt-0.5" />
                    <div>
                      <h6 className="font-medium text-red-800 text-xs">
                        Baixa Performance Geral
                      </h6>
                      <p className="text-xs text-red-700">
                        {insights.performanceRanges.low}{" "}
                        {columns[0].label.toLowerCase()}s com baixa performance.
                        Considere treinamento ou redistribuição.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Lista de performance */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {performanceData.map((item, index) => (
            <div
              key={index}
              className={`p-3 hover:bg-gray-50 transition-colors duration-200 ${getPerformanceColor(
                index
              )}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100">
                    {getPerformanceIcon(index)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 truncate max-w-32">
                      {item[columns[0].key]}
                    </p>
                    <p className="text-xs text-gray-500">{columns[0].label}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      {item[columns[1].key]}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {columns[1].label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Métricas resumidas */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-4">
          <span>Média: {insights?.avgProjects.toFixed(1)}</span>
          <span>Mediana: {insights?.medianProjects}</span>
          <span>Maior: {insights?.maxProjects}</span>
        </div>
        <span className="text-gray-400">Dados atualizados em tempo real</span>
      </div>
    </div>
  );
}
