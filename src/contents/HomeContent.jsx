import { useState, useMemo } from "react";
import BaseContent from "../components/BaseContent";
import {
  Banknote,
  HandCoins,
  NotebookPen,
  Building,
  MapPin,
  Hammer,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "planning", label: "Em Projeto" },
  { value: "running", label: "Em execução" },
  { value: "awaiting_funds", label: "Aguardando verba" },
  { value: "done", label: "Finalizado" },
  { value: "canceled", label: "Cancelado" },
];

export default function HomeContent({
  totalProjects = 0,
  totalBairros = 0,
  totalEmpresas = 0,
  totalFiscais = 0,
  totalVerba = 0,
  custoMedio = 0,
  empresasMaisAtivas = [],
  bairrosMaisAtivos = [],
  fiscaisMaisAtivos = [],
  recentProjects = [],
  recentChanges = [],
  onBack = () => {},
}) {
  const [filterStatus, setFilterStatus] = useState("all");

  const filterByStatus = (items) => {
    if (filterStatus === "all") return items;
    return items.filter((item) => item.status === filterStatus);
  };

  const topEmpresas = useMemo(
    () => filterByStatus(empresasMaisAtivas).slice(0, 10),
    [empresasMaisAtivas, filterStatus]
  );
  const topBairros = useMemo(
    () => filterByStatus(bairrosMaisAtivos).slice(0, 10),
    [bairrosMaisAtivos, filterStatus]
  );
  const topFiscais = useMemo(
    () => filterByStatus(fiscaisMaisAtivos).slice(0, 10),
    [fiscaisMaisAtivos, filterStatus]
  );

  const filteredProjects = useMemo(
    () => filterByStatus(recentProjects),
    [recentProjects, filterStatus]
  );
  const filteredChanges = useMemo(
    () => filterByStatus(recentChanges),
    [recentChanges, filterStatus]
  );

  return (
    <BaseContent pageTitle="Início" onBack={onBack}>
      {/* Filtro por Status */}
      <div className="mb-6 flex justify-end">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded p-2"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Cards resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {[
          {
            icon: <Hammer className="text-blue-600" />,
            label: "Total de Projetos",
            value: totalProjects,
          },
          {
            icon: <MapPin className="text-blue-600" />,
            label: "Total de Bairros",
            value: totalBairros,
          },
          {
            icon: <Building className="text-blue-600" />,
            label: "Total de Empresas",
            value: totalEmpresas,
          },
          {
            icon: <NotebookPen className="text-blue-600" />,
            label: "Total de Fiscais",
            value: totalFiscais,
          },
          {
            icon: <HandCoins className="text-blue-600" />,
            label: "Verba Total Utilizada",
            value: `R$ ${Number(totalVerba).toLocaleString("pt-BR")}`,
          },
          {
            icon: <Banknote className="text-blue-600" />,
            label: "Custo Médio Por Projeto",
            value: `R$ ${Number(custoMedio).toLocaleString("pt-BR")}`,
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl shadow flex flex-col gap-2"
          >
            {item.icon}
            <h3 className="text-sm text-gray-500 font-medium">{item.label}</h3>
            <p className="text-3xl font-semibold text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Gráficos Top 10 com cores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            🏢 Empresas Mais Envolvidas
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={topEmpresas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="nome" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            📍 Bairros com Mais Projetos
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={topBairros}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="nome" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            👷‍♂️ Fiscais Mais Ativos
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={topFiscais}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="nome" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Timeline Últimos Projetos */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          🆕 Últimos Projetos
        </h2>
        <ul className="space-y-4">
          {filteredProjects.slice(0, 10).map((project) => (
            <li key={project.id} className="flex flex-col">
              <span className="font-semibold text-gray-800">
                {project.name || "--"}
              </span>
              <span className="text-gray-600">
                {project.bairro} · {project.empresa}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(project.created_at).toLocaleDateString()}
              </span>
            </li>
          ))}
          {filteredProjects.length === 0 && (
            <li className="text-gray-500">Nenhum projeto encontrado.</li>
          )}
        </ul>
      </div>

      {/* Timeline Últimas Alterações */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          🔧 Últimas Alterações nos Projetos
        </h2>
        <ul className="space-y-4">
          {filteredChanges.slice(0, 10).map((change, idx) => (
            <li key={idx} className="flex flex-col">
              <span className="font-semibold text-gray-800">
                {change.project_name}
              </span>
              <span className="text-gray-600">
                Alterado: {change.field_changed} → {change.new_value}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(change.changed_at).toLocaleDateString()}
              </span>
            </li>
          ))}
          {filteredChanges.length === 0 && (
            <li className="text-gray-500">Nenhuma alteração registrada.</li>
          )}
        </ul>
      </div>
    </BaseContent>
  );
}
