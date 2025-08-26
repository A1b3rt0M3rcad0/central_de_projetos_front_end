import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Target,
  AlertTriangle,
  Circle,
} from "lucide-react";

// Cores padrão para status principais e fallback para outros
const COLORS = {
  // Status principais (prioridade alta)
  "Aguardando Verba": "#f59e0b", // Amarelo
  Execução: "#ef4444", // Vermelho
  "Em Projeto": "#3b82f6", // Azul
  Finalizado: "#10b981", // Verde

  // Status secundários comuns
  "Em Andamento": "#06b6d4", // Ciano
  Concluído: "#84cc16", // Verde lima
  Cancelado: "#6b7280", // Cinza
  Pendente: "#8b5cf6", // Roxo
  Suspenso: "#f97316", // Laranja
  "Em Análise": "#ec4899", // Rosa
  Aprovado: "#6366f1", // Índigo
  Rejeitado: "#dc2626", // Vermelho escuro
};

// Ícones padrão para status principais e fallback para outros
const STATUS_ICONS = {
  // Status principais
  "Aguardando Verba": AlertTriangle,
  Execução: TrendingUp,
  "Em Projeto": Clock,
  Finalizado: CheckCircle,

  // Status secundários comuns
  "Em Andamento": TrendingUp,
  Concluído: CheckCircle,
  Cancelado: XCircle,
  Pendente: AlertCircle,
  Suspenso: AlertTriangle,
  "Em Análise": Clock,
  Aprovado: CheckCircle,
  Rejeitado: XCircle,
};

// Prioridade dos status (quanto menor o número, maior a prioridade)
const STATUS_PRIORITY = {
  // Status principais (alta prioridade)
  Execução: 1,
  "Em Andamento": 2,
  "Em Projeto": 3,
  "Aguardando Verba": 4,

  // Status secundários (média prioridade)
  Pendente: 5,
  "Em Análise": 6,
  Aprovado: 7,
  Suspenso: 8,

  // Status finais (baixa prioridade)
  Finalizado: 9,
  Concluído: 10,
  Cancelado: 11,
  Rejeitado: 12,
};

// Cores de fallback para status não mapeados
const FALLBACK_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#ec4899",
  "#6366f1",
  "#dc2626",
  "#059669",
  "#d97706",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
  "#65a30d",
  "#ea580c",
  "#db2777",
  "#4f46e5",
  "#b91c1c",
  "#047857",
  "#92400e",
  "#991b1b",
  "#581c87",
  "#0e7490",
  "#3f6212",
  "#9a3412",
  "#be185d",
  "#3730a3",
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const percentage = ((data.value / data.payload.total) * 100).toFixed(1);
    const IconComponent = STATUS_ICONS[data.name] || Circle;

    return (
      <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-200">
        <div className="border-b border-gray-100 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <IconComponent className="w-4 h-4" style={{ color: data.color }} />
            <p className="font-bold text-gray-900 text-sm">{data.name}</p>
          </div>
          <p className="text-xs text-gray-500">Status do Projeto</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Projetos</span>
            <span className="text-lg font-bold text-gray-900">
              {data.value}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Participação</span>
            <span className="text-sm font-semibold text-gray-900">
              {percentage}%
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${percentage}%`,
                backgroundColor: data.color,
              }}
            />
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
        Status dos Projetos ({activeEntries.length} status)
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
            <span className="text-xs text-gray-500">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function StatusDistributionChart({
  data,
  filterValue,
  onFilterChange,
  filterOptions,
}) {
  const [showDetailedInsights, setShowDetailedInsights] = useState(false);
  const [viewMode, setViewMode] = useState("pie"); // "pie" or "bar"

  // Calcular insights e métricas
  const insights = useMemo(() => {
    if (!data || data.length === 0) return null;

    const totalProjects = data.reduce((sum, item) => sum + item.value, 0);

    // Função para obter cor para qualquer status
    const getColorForStatus = (statusName) => {
      return (
        COLORS[statusName] ||
        FALLBACK_COLORS[statusName.length % FALLBACK_COLORS.length]
      );
    };

    // Adicionar informações aos dados
    const enrichedData = data.map((item) => ({
      ...item,
      percentage:
        totalProjects > 0 ? ((item.value / totalProjects) * 100).toFixed(1) : 0,
      color: getColorForStatus(item.name),
      priority: STATUS_PRIORITY[item.name] || 999,
    }));

    // Ordenar por prioridade e quantidade
    const sortedData = enrichedData.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return b.value - a.value;
    });

    // Calcular métricas de performance (mais flexível)
    const activeProjects = sortedData
      .filter((item) =>
        ["Execução", "Em Andamento", "Em Projeto", "Em Análise"].includes(
          item.name
        )
      )
      .reduce((sum, item) => sum + item.value, 0);

    const completedProjects = sortedData
      .filter((item) =>
        ["Finalizado", "Concluído", "Aprovado"].includes(item.name)
      )
      .reduce((sum, item) => sum + item.value, 0);

    const blockedProjects = sortedData
      .filter((item) =>
        ["Aguardando Verba", "Pendente", "Suspenso"].includes(item.name)
      )
      .reduce((sum, item) => sum + item.value, 0);

    const cancelledProjects = sortedData
      .filter((item) => ["Cancelado", "Rejeitado"].includes(item.name))
      .reduce((sum, item) => sum + item.value, 0);

    const completionRate =
      totalProjects > 0
        ? ((completedProjects / totalProjects) * 100).toFixed(1)
        : 0;
    const activeRate =
      totalProjects > 0
        ? ((activeProjects / totalProjects) * 100).toFixed(1)
        : 0;
    const blockedRate =
      totalProjects > 0
        ? ((blockedProjects / totalProjects) * 100).toFixed(1)
        : 0;
    const cancelledRate =
      totalProjects > 0
        ? ((cancelledProjects / totalProjects) * 100).toFixed(1)
        : 0;

    // Identificar status críticos dinamicamente
    const criticalStatuses = sortedData.filter((item) =>
      [
        "Aguardando Verba",
        "Cancelado",
        "Pendente",
        "Suspenso",
        "Rejeitado",
      ].includes(item.name)
    );

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      blockedProjects,
      cancelledProjects,
      completionRate,
      activeRate,
      blockedRate,
      cancelledRate,
      sortedData,
      topStatus: sortedData[0],
      criticalStatuses,
      statusCount: sortedData.length,
    };
  }, [data]);

  if (!insights || insights.totalProjects === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📊</div>
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
      <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-purple-900">
              Análise de Status
            </h4>
            <button
              onClick={() => setShowDetailedInsights(!showDetailedInsights)}
              className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 transition-colors"
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
            <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
              {insights.totalProjects} total
            </span>
            <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
              {insights.statusCount} status
            </span>
            <button
              onClick={() => setViewMode(viewMode === "pie" ? "bar" : "pie")}
              className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 transition-colors"
            >
              <BarChart3 className="w-3 h-3" />
              {viewMode === "pie" ? "Barras" : "Pizza"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-600" />
            <span className="text-gray-700">Ativos:</span>
            <span className="font-semibold text-green-700">
              {insights.activeRate}%
            </span>
          </div>

          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-blue-600" />
            <span className="text-gray-700">Concluídos:</span>
            <span className="font-semibold text-blue-700">
              {insights.completionRate}%
            </span>
          </div>

          <div className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-orange-600" />
            <span className="text-gray-700">Bloqueados:</span>
            <span className="font-semibold text-orange-700">
              {insights.blockedRate}%
            </span>
          </div>

          <div className="flex items-center gap-1">
            <XCircle className="w-3 h-3 text-red-600" />
            <span className="text-gray-700">Cancelados:</span>
            <span className="font-semibold text-red-700">
              {insights.cancelledRate}%
            </span>
          </div>
        </div>

        {/* Insights detalhados */}
        {showDetailedInsights && (
          <div className="mt-3 pt-3 border-t border-purple-200">
            <div className="grid grid-cols-1 gap-3 text-xs">
              {/* Status críticos */}
              {insights.criticalStatuses.length > 0 && (
                <div>
                  <h5 className="font-semibold text-purple-900 mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Status Críticos ({insights.criticalStatuses.length})
                  </h5>
                  <div className="space-y-1">
                    {insights.criticalStatuses
                      .slice(0, 3)
                      .map((status, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            {STATUS_ICONS[status.name] &&
                              React.createElement(STATUS_ICONS[status.name], {
                                className: "w-3 h-3",
                                style: { color: status.color },
                              })}
                            <span className="text-gray-700">{status.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${status.percentage}%`,
                                  backgroundColor: status.color,
                                }}
                              />
                            </div>
                            <span className="font-semibold text-gray-900">
                              {status.value}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Performance geral */}
              <div>
                <h5 className="font-semibold text-purple-900 mb-2 flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  Performance Geral
                </h5>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  <div className="text-center p-2 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-lg font-bold text-green-700">
                      {insights.activeProjects}
                    </div>
                    <div className="text-xs text-green-600">Ativos</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-lg font-bold text-blue-700">
                      {insights.completedProjects}
                    </div>
                    <div className="text-xs text-blue-600">Concluídos</div>
                  </div>
                  <div className="text-center p-2 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-lg font-bold text-orange-700">
                      {insights.blockedProjects}
                    </div>
                    <div className="text-xs text-orange-600">Bloqueados</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-lg font-bold text-red-700">
                      {insights.cancelledProjects}
                    </div>
                    <div className="text-xs text-red-600">Cancelados</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Gráfico Principal */}
      <ResponsiveContainer width="100%" height={250}>
        {viewMode === "pie" ? (
          <PieChart>
            <Pie
              data={insights.sortedData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={40}
              paddingAngle={2}
            >
              {insights.sortedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        ) : (
          <BarChart
            data={insights.sortedData}
            margin={{ top: 10, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              interval={0}
              height={60}
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
              dataKey="value"
              radius={[4, 4, 0, 0]}
              stroke="#ffffff"
              strokeWidth={1}
            >
              {insights.sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>

      {/* Legenda melhorada */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-xs font-medium text-gray-700 mb-2">
          Status dos Projetos ({insights.sortedData.length} status)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
          {insights.sortedData.map((status, index) => {
            const IconComponent = STATUS_ICONS[status.name] || Circle;
            return (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <IconComponent
                    className="w-3 h-3"
                    style={{ color: status.color }}
                  />
                  <span className="text-xs text-gray-700 truncate max-w-20">
                    {status.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-gray-900">
                    {status.value}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({status.percentage}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alertas e recomendações */}
      {insights.blockedProjects > 0 && (
        <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <h5 className="text-sm font-semibold text-orange-900">
              Atenção Necessária
            </h5>
          </div>
          <p className="text-xs text-orange-800">
            {insights.blockedProjects} projetos estão bloqueados ou aguardando
            verba. Considere revisar a alocação de recursos.
          </p>
        </div>
      )}

      {insights.cancelledProjects > 0 && (
        <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-red-600" />
            <h5 className="text-sm font-semibold text-red-900">
              Projetos Cancelados
            </h5>
          </div>
          <p className="text-xs text-red-800">
            {insights.cancelledProjects} projetos foram cancelados ou
            rejeitados. Analise os motivos para evitar recorrências.
          </p>
        </div>
      )}
    </div>
  );
}
