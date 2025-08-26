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
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  MapPin,
  ChevronDown,
  ChevronUp,
  Target,
  Users,
  Award,
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
    const value = payload[0].value;
    const percentage = payload[0].payload.percentage || 0;

    return (
      <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-200">
        <div className="border-b border-gray-100 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <p className="font-bold text-gray-900 text-sm">{label}</p>
          </div>
          <p className="text-xs text-gray-500">Bairro</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Projetos</span>
            <span className="text-lg font-bold text-blue-600">{value}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Participação</span>
            <span className="text-sm font-semibold text-gray-900">
              {percentage}%
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function ProjectsByBairroChart({ data }) {
  const [showDetailedInsights, setShowDetailedInsights] = useState(false);

  // Calcular insights e métricas
  const insights = useMemo(() => {
    if (!data || data.length === 0) return null;

    const totalProjects = data.reduce((sum, item) => sum + item.quantidade, 0);

    // Adicionar porcentagens aos dados
    const enrichedData = data.map((item) => ({
      ...item,
      percentage:
        totalProjects > 0
          ? ((item.quantidade / totalProjects) * 100).toFixed(1)
          : 0,
    }));

    // Ordenar por quantidade
    const sortedData = [...enrichedData].sort(
      (a, b) => b.quantidade - a.quantidade
    );

    const topBairros = sortedData.slice(0, 3);
    const bottomBairros = sortedData.slice(-3).reverse();

    const averageProjects = totalProjects / data.length;
    const medianProjects =
      sortedData[Math.floor(sortedData.length / 2)]?.quantidade || 0;

    // Calcular distribuição por faixas
    const distribution = {
      high: sortedData.filter((item) => item.quantidade > averageProjects * 1.5)
        .length,
      medium: sortedData.filter(
        (item) =>
          item.quantidade <= averageProjects * 1.5 &&
          item.quantidade >= averageProjects * 0.5
      ).length,
      low: sortedData.filter((item) => item.quantidade < averageProjects * 0.5)
        .length,
    };

    return {
      totalProjects,
      totalBairros: data.length,
      averageProjects: averageProjects.toFixed(1),
      medianProjects,
      topBairros,
      bottomBairros,
      distribution,
      sortedData,
    };
  }, [data]);

  // Preparar dados para o gráfico
  const chartData = useMemo(() => {
    if (!insights) return [];

    return insights.sortedData.map((item, index) => ({
      ...item,
      color: COLORS[index % COLORS.length],
      rank: index + 1,
    }));
  }, [insights]);

  if (!insights || insights.totalProjects === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📍</div>
          <p className="text-sm">Nenhum projeto encontrado</p>
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
      <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-blue-900">
              Análise por Bairro
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
          <div className="flex items-center gap-2">
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              {insights.totalProjects} projetos
            </span>
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              {insights.totalBairros} bairros
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-600" />
            <span className="text-gray-700">Top:</span>
            <span className="font-semibold text-green-700">
              {insights.topBairros[0]?.nome} (
              {insights.topBairros[0]?.quantidade})
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Target className="w-3 h-3 text-blue-600" />
            <span className="text-gray-700">Média:</span>
            <span className="font-semibold text-blue-700">
              {insights.averageProjects} por bairro
            </span>
          </div>
        </div>

        {/* Insights detalhados */}
        {showDetailedInsights && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="grid grid-cols-1 gap-3 text-xs">
              {/* Top 3 bairros */}
              <div>
                <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Top 3 Bairros
                </h5>
                <div className="space-y-1">
                  {insights.topBairros.map((bairro, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            index === 0
                              ? "bg-yellow-500"
                              : index === 1
                              ? "bg-gray-400"
                              : "bg-orange-500"
                          }`}
                        />
                        <span className="text-gray-700">{bairro.nome}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${bairro.percentage}%` }}
                          />
                        </div>
                        <span className="font-semibold text-gray-900">
                          {bairro.quantidade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Distribuição por performance */}
              <div>
                <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Distribuição por Performance
                </h5>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-lg font-bold text-green-700">
                      {insights.distribution.high}
                    </div>
                    <div className="text-xs text-green-600">Alto</div>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-lg font-bold text-yellow-700">
                      {insights.distribution.medium}
                    </div>
                    <div className="text-xs text-yellow-600">Médio</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-lg font-bold text-red-700">
                      {insights.distribution.low}
                    </div>
                    <div className="text-xs text-red-600">Baixo</div>
                  </div>
                </div>
              </div>
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
            dataKey="nome"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={80}
            tick={{ fontSize: 10, fill: "#6b7280", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="quantidade"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            barSize={25}
            stroke="#ffffff"
            strokeWidth={1}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Métricas de performance */}
      <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
        <div className="bg-white p-2 rounded-lg border border-gray-200">
          <div className="text-gray-500">Média</div>
          <div className="font-bold text-gray-900">
            {insights.averageProjects}
          </div>
        </div>
        <div className="bg-white p-2 rounded-lg border border-gray-200">
          <div className="text-gray-500">Mediana</div>
          <div className="font-bold text-gray-900">
            {insights.medianProjects}
          </div>
        </div>
        <div className="bg-white p-2 rounded-lg border border-gray-200">
          <div className="text-gray-500">Maior</div>
          <div className="font-bold text-gray-900">
            {insights.topBairros[0]?.quantidade || 0}
          </div>
        </div>
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
                {item.quantidade}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
