import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  MapPin,
  BarChart3,
  AlertTriangle,
  Target,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Cores para diferentes faixas de orçamento
const BUDGET_COLORS = {
  high: "#dc2626", // Vermelho para alto orçamento
  medium: "#f59e0b", // Laranja para médio
  low: "#10b981", // Verde para baixo
  veryLow: "#6b7280", // Cinza para muito baixo
};

// Função para formatar números com K, M e B
const formatCurrency = (value) => {
  if (value >= 1000000000) {
    // Bilhões
    const billions = value / 1000000000;
    return `${billions.toFixed(billions % 1 === 0 ? 0 : 1)}B`;
  } else if (value >= 1000000) {
    // Milhões
    const millions = value / 1000000;
    return `${millions.toFixed(millions % 1 === 0 ? 0 : 1)}M`;
  } else if (value >= 1000) {
    // Milhares
    const thousands = value / 1000;
    return `${thousands.toFixed(thousands % 1 === 0 ? 0 : 1)}k`;
  }
  return value.toFixed(0);
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const budget = data.orcamento;
    const percentage = data.percentage;
    const rank = data.rank;

    return (
      <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-200">
        <div className="border-b border-gray-100 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-600" />
            <p className="font-bold text-gray-900 text-sm">{label}</p>
          </div>
          <p className="text-xs text-gray-500">Bairro</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-700">Orçamento</span>
            <span className="text-lg font-bold text-green-600 min-w-[4rem] text-right">
              R$ {formatCurrency(budget)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-700">Participação</span>
            <span className="text-sm font-semibold text-gray-900 min-w-[3rem] text-right">
              {percentage.toFixed(1)}%
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-700">Ranking</span>
            <span className="text-sm font-semibold text-purple-600 min-w-[3rem] text-right">
              #{rank}
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function BudgetByBairroChart({ data }) {
  const [showDetailedInsights, setShowDetailedInsights] = useState(false);

  const insights = useMemo(() => {
    if (!data || data.length === 0) return null;

    const totalBudget = data.reduce((sum, item) => sum + item.orcamento, 0);
    const avgBudget = totalBudget / data.length;
    
    // Calcular mediana corretamente (ordenar os dados primeiro)
    const sortedData = [...data].sort((a, b) => a.orcamento - b.orcamento);
    const mid = Math.floor(sortedData.length / 2);
    const medianBudget = sortedData.length % 2 === 0
      ? (sortedData[mid - 1].orcamento + sortedData[mid].orcamento) / 2
      : sortedData[mid].orcamento;
    
    const maxBudget = Math.max(...data.map((item) => item.orcamento));
    const minBudget = Math.min(...data.map((item) => item.orcamento));

    // Calcular concentração (quanto o top 3 representa do total)
    const top3Budget = data
      .slice(0, 3)
      .reduce((sum, item) => sum + item.orcamento, 0);
    const concentration = (top3Budget / totalBudget) * 100;

    // Categorizar bairros por faixa de orçamento
    const budgetRanges = {
      high: data.filter((item) => item.orcamento > avgBudget * 1.5).length,
      medium: data.filter(
        (item) =>
          item.orcamento <= avgBudget * 1.5 && item.orcamento > avgBudget * 0.7
      ).length,
      low: data.filter((item) => item.orcamento <= avgBudget * 0.7).length,
    };

    // Top 3 bairros
    const topBairros = [...data]
      .sort((a, b) => b.orcamento - a.orcamento)
      .slice(0, 3);

    return {
      totalBudget,
      avgBudget,
      medianBudget,
      maxBudget,
      minBudget,
      concentration,
      budgetRanges,
      totalBairros: data.length,
      topBairros,
    };
  }, [data]);

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const totalBudget = data.reduce((sum, item) => sum + item.orcamento, 0);

    return data.map((item, index) => {
      const percentage = (item.orcamento / totalBudget) * 100;
      const rank = index + 1;

      // Determinar cor baseada no ranking
      let color;
      if (rank <= 3) color = BUDGET_COLORS.high;
      else if (rank <= 6) color = BUDGET_COLORS.medium;
      else if (rank <= 8) color = BUDGET_COLORS.low;
      else color = BUDGET_COLORS.veryLow;

      return {
        ...item,
        percentage,
        rank,
        color,
      };
    });
  }, [data]);

  if (!insights || insights.totalBudget === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">💰</div>
          <p className="text-sm">Nenhum orçamento encontrado</p>
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
      <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-green-900">
              Análise de Orçamento
            </h4>
            <button
              onClick={() => setShowDetailedInsights(!showDetailedInsights)}
              className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 transition-colors"
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
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
              R$ {formatCurrency(insights.totalBudget)} total
            </span>
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
              {insights.totalBairros} bairros
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-600" />
            <span className="text-gray-700">Top:</span>
            <span className="font-semibold text-green-700">
              {insights.topBairros[0]?.nome} (R${" "}
              {formatCurrency(insights.topBairros[0]?.orcamento || 0)})
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Target className="w-3 h-3 text-blue-600" />
            <span className="text-gray-700">Média:</span>
            <span className="font-semibold text-blue-700">
              R$ {formatCurrency(insights.avgBudget)} por bairro
            </span>
          </div>
        </div>

        {/* Insights detalhados */}
        {showDetailedInsights && (
          <div className="mt-3 pt-3 border-t border-green-200">
            <div className="grid grid-cols-1 gap-3 text-xs">
              {/* Top 3 bairros */}
              <div>
                <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  Top 3 - Maior Orçamento
                </h5>
                <div className="space-y-1">
                  {insights.topBairros.map((item, index) => (
                    <div
                      key={item.nome}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <span className="font-medium">{item.nome}</span>
                      </div>
                      <span className="text-green-600 font-semibold min-w-[4rem] text-right">
                        R$ {formatCurrency(item.orcamento)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Distribuição por faixas */}
              <div>
                <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <BarChart3 className="w-3 h-3 text-blue-600" />
                  Distribuição por Faixas
                </h5>
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span>Alto (&gt;150% média)</span>
                    </div>
                    <span className="font-semibold min-w-[3rem] text-right">
                      {insights.budgetRanges.high}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded"></div>
                      <span>Médio (70-150% média)</span>
                    </div>
                    <span className="font-semibold min-w-[3rem] text-right">
                      {insights.budgetRanges.medium}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Baixo (&lt;70% média)</span>
                    </div>
                    <span className="font-semibold min-w-[3rem] text-right">
                      {insights.budgetRanges.low}
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
                        Top 3 concentram {insights.concentration.toFixed(0)}% do
                        orçamento. Considere redistribuir recursos.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Gráfico */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `R$ ${formatCurrency(value)}`}
            />
            <YAxis
              dataKey="nome"
              type="category"
              width={120}
              tick={{ fontSize: 11, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="orcamento" radius={[0, 4, 4, 0]} barSize={25}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Métricas resumidas */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-4">
          <span>Média: R$ {formatCurrency(insights?.avgBudget || 0)}</span>
          <span>Mediana: R$ {formatCurrency(insights?.medianBudget || 0)}</span>
          <span>Maior: R$ {formatCurrency(insights?.maxBudget || 0)}</span>
        </div>
        <span className="text-gray-400">Dados atualizados em tempo real</span>
      </div>

      {/* Ranking dos bairros */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-xs font-medium text-gray-700 mb-2">
          Ranking Completo ({chartData.length} bairros)
        </div>
        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
          {chartData.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    index === 0
                      ? "bg-yellow-500"
                      : index === 1
                      ? "bg-gray-400"
                      : index === 2
                      ? "bg-orange-500"
                      : "bg-gray-300"
                  }`}
                />
                <span className="text-xs text-gray-700 truncate max-w-16">
                  {item.nome}
                </span>
              </div>
              <span className="text-xs font-semibold text-gray-900">
                R$ {formatCurrency(item.orcamento)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
