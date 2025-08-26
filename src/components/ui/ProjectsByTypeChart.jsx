import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
  BarChart3,
} from "lucide-react";

const COLORS = [
  "#3b82f6", // Azul
  "#10b981", // Verde
  "#f59e0b", // Amarelo
  "#ef4444", // Vermelho
  "#8b5cf6", // Roxo
  "#06b6d4", // Ciano
  "#84cc16", // Verde lima
  "#f97316", // Laranja
  "#ec4899", // Rosa
  "#6366f1", // Índigo
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum, entry) => sum + entry.value, 0);

    return (
      <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-200">
        <div className="border-b border-gray-100 pb-2 mb-2">
          <p className="font-bold text-gray-900 text-sm">{label}</p>
          <p className="text-xs text-gray-500">Tipo de Projeto</p>
        </div>

        <div className="space-y-2">
          {payload
            .filter((entry) => entry.value > 0)
            .sort((a, b) => b.value - a.value)
            .map((entry, index) => {
              const percentage = ((entry.value / total) * 100).toFixed(1);
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {entry.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900">
                      {entry.value}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({percentage}%)
                    </span>
                  </div>
                </div>
              );
            })}

          <div className="border-t border-gray-100 pt-2 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900">Total</span>
              <span className="text-sm font-bold text-blue-600">{total}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }) => {
  const activeEntries = payload.filter((entry) => entry.value > 0);

  return (
    <div className="mt-4">
      <div className="text-xs font-medium text-gray-600 mb-2">
        Distribuição por Bairro ({activeEntries.length} bairros)
      </div>
      <div className="flex flex-wrap gap-2">
        {activeEntries.map((entry, index) => (
          <div
            key={index}
            className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs font-medium text-gray-700">
              {entry.value}
            </span>
            <span className="text-xs text-gray-500">
              {entry.payload?.name || entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ProjectsByTypeChart({
  data,
  filterValue,
  onFilterChange,
  filterOptions,
  fullData,
}) {
  const [showDetailedInsights, setShowDetailedInsights] = useState(false);

  // Calcular métricas para insights
  const insights = useMemo(() => {
    if (!data || data.length === 0) return null;

    const totalProjects = data.reduce((sum, item) => {
      if (filterValue === "all") {
        return (
          sum +
          Object.entries(item)
            .filter(([key]) => key !== "tipo")
            .reduce((itemSum, [, value]) => itemSum + (value || 0), 0)
        );
      } else {
        return sum + (item.quantidade || 0);
      }
    }, 0);

    const typeDistribution = data
      .map((item) => {
        const typeName = item.tipo;
        let count = 0;

        if (filterValue === "all") {
          count = Object.entries(item)
            .filter(([key]) => key !== "tipo")
            .reduce((sum, [, value]) => sum + (value || 0), 0);
        } else {
          count = item.quantidade || 0;
        }

        return {
          name: typeName,
          value: count,
          percentage:
            totalProjects > 0 ? ((count / totalProjects) * 100).toFixed(1) : 0,
        };
      })
      .filter((item) => item.value > 0);

    const topType = typeDistribution.sort((a, b) => b.value - a.value)[0];
    const bottomType = typeDistribution.sort((a, b) => a.value - b.value)[0];

    // Calcular distribuição por bairro
    const bairroDistribution = [];
    if (filterValue === "all" && fullData) {
      const bairroTotals = {};

      fullData.forEach((item) => {
        Object.entries(item).forEach(([key, value]) => {
          if (key !== "tipo" && value > 0) {
            bairroTotals[key] = (bairroTotals[key] || 0) + value;
          }
        });
      });

      Object.entries(bairroTotals)
        .sort(([, a], [, b]) => b - a)
        .forEach(([bairro, total]) => {
          bairroDistribution.push({
            name: bairro,
            value: total,
            percentage:
              totalProjects > 0
                ? ((total / totalProjects) * 100).toFixed(1)
                : 0,
          });
        });
    }

    return {
      totalProjects,
      typeDistribution,
      bairroDistribution,
      topType,
      bottomType,
      typeCount: typeDistribution.length,
    };
  }, [data, filterValue, fullData]);

  // Preparar dados para visualização
  const chartData = useMemo(() => {
    if (filterValue === "all") {
      return data
        .map((item) => {
          const chartItem = { tipo: item.tipo };
          Object.entries(item).forEach(([key, value]) => {
            if (key !== "tipo" && value > 0) {
              chartItem[key] = value;
            }
          });
          return chartItem;
        })
        .filter((item) => {
          const hasData = Object.keys(item).some(
            (key) => key !== "tipo" && item[key] > 0
          );
          return hasData;
        });
    } else {
      return data.filter((item) => item.quantidade > 0);
    }
  }, [data, filterValue]);

  // Obter bairros únicos para legendas
  const uniqueBairros = useMemo(() => {
    if (filterValue === "all" && fullData) {
      return Array.from(
        new Set(
          fullData.flatMap((p) =>
            Object.keys(p).filter((k) => k !== "tipo" && p[k] > 0)
          )
        )
      );
    }
    return [];
  }, [fullData, filterValue]);

  if (!insights || insights.totalProjects === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-sm">Nenhum dado disponível</p>
          <p className="text-xs text-gray-400">
            Selecione outro filtro ou período
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {/* Header com insights */}
      <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-blue-900">
              Insights Rápidos
            </h4>
            <button
              onClick={() => setShowDetailedInsights(!showDetailedInsights)}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
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
          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
            {insights.totalProjects} total
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-600" />
            <span className="text-gray-700">Principal:</span>
            <span className="font-semibold text-green-700">
              {insights.topType?.name} ({insights.topType?.percentage}%)
            </span>
          </div>

          {insights.bottomType && insights.bottomType.value > 0 && (
            <div className="flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-red-600" />
              <span className="text-gray-700">Menor:</span>
              <span className="font-semibold text-red-700">
                {insights.bottomType.name} ({insights.bottomType.percentage}%)
              </span>
            </div>
          )}
        </div>

        {/* Insights detalhados */}
        {showDetailedInsights && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="grid grid-cols-1 gap-3 text-xs">
              {/* Distribuição por tipo */}
              <div>
                <h5 className="font-semibold text-blue-900 mb-2">
                  Distribuição por Tipo
                </h5>
                <div className="space-y-1">
                  {insights.typeDistribution.slice(0, 3).map((type, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-700">{type.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${type.percentage}%` }}
                          />
                        </div>
                        <span className="font-semibold text-gray-900">
                          {type.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top bairros */}
              {insights.bairroDistribution &&
                insights.bairroDistribution.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-blue-900 mb-2">
                      Top Bairros
                    </h5>
                    <div className="space-y-1">
                      {insights.bairroDistribution
                        .slice(0, 3)
                        .map((bairro, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <span className="text-gray-700">{bairro.name}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-green-500 rounded-full"
                                  style={{ width: `${bairro.percentage}%` }}
                                />
                              </div>
                              <span className="font-semibold text-gray-900">
                                {bairro.value}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>

      {/* Gráfico Principal */}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="tipo"
            tick={{ fontSize: 11, fill: "#6b7280", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip />} />

          {filterValue === "all"
            ? uniqueBairros.map((bairro, idx) => (
                <Bar
                  key={bairro}
                  dataKey={bairro}
                  stackId="a"
                  fill={COLORS[idx % COLORS.length]}
                  radius={[0, 0, 2, 2]}
                  stroke="#ffffff"
                  strokeWidth={1}
                />
              ))
            : [
                <Bar
                  key="quantidade"
                  dataKey="quantidade"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  stroke="#ffffff"
                  strokeWidth={1}
                />,
              ]}
        </BarChart>
      </ResponsiveContainer>

      {/* Legenda melhorada */}
      {filterValue === "all" && uniqueBairros.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-xs font-medium text-gray-700 mb-2">
            Distribuição por Bairro ({uniqueBairros.length} bairros)
          </div>
          <div className="flex flex-wrap gap-2">
            {uniqueBairros.map((bairro, index) => {
              const totalForBairro = chartData.reduce((sum, item) => {
                return sum + (item[bairro] || 0);
              }, 0);

              return (
                <div
                  key={bairro}
                  className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-xs font-medium text-gray-700">
                    {totalForBairro}
                  </span>
                  <span className="text-xs text-gray-500 max-w-20 truncate">
                    {bairro}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Métricas de performance */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div className="bg-white p-2 rounded-lg border border-gray-200">
          <div className="text-gray-500">Tipos Ativos</div>
          <div className="font-bold text-gray-900">{insights.typeCount}</div>
        </div>
        <div className="bg-white p-2 rounded-lg border border-gray-200">
          <div className="text-gray-500">Média por Tipo</div>
          <div className="font-bold text-gray-900">
            {insights.typeCount > 0
              ? Math.round(insights.totalProjects / insights.typeCount)
              : 0}
          </div>
        </div>
      </div>
    </div>
  );
}
