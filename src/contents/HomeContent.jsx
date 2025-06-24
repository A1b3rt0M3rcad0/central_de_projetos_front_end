import { useState, useMemo } from "react";
import BaseContent from "../components/BaseContent";
import { Hammer, MapPin, Building, NotebookPen } from "lucide-react";
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

const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "planning", label: "Em Projeto" },
  { value: "running", label: "Em execução" },
  { value: "awaiting_funds", label: "Aguardando verba" },
  { value: "done", label: "Finalizado" },
  { value: "canceled", label: "Cancelado" },
];

const bairroOptions = [
  { value: "all", label: "Todos os Bairros" },
  { value: "Centro", label: "Centro" },
  { value: "Jardim", label: "Jardim" },
  { value: "Vila Nova", label: "Vila Nova" },
  { value: "São José", label: "São José" },
];

// Mock data para demonstração orçamento por bairro
const mockBairros = [
  { nome: "Centro", orcamento: 1200000 },
  { nome: "Jardim", orcamento: 850000 },
  { nome: "Vila Nova", orcamento: 600000 },
  { nome: "São José", orcamento: 920000 },
];

const mockStatusDistribution = [
  { name: "Em Projeto", value: 12, status: "planning" },
  { name: "Em execução", value: 8, status: "running" },
  { name: "Aguardando verba", value: 4, status: "awaiting_funds" },
  { name: "Finalizado", value: 20, status: "done" },
  { name: "Cancelado", value: 1, status: "canceled" },
];

const mockProjetosPorTipo = [
  { tipo: "Construção", Centro: 5, Jardim: 2, "Vila Nova": 3, "São José": 4 },
  { tipo: "Reforma", Centro: 3, Jardim: 1, "Vila Nova": 2, "São José": 1 },
  { tipo: "Manutenção", Centro: 7, Jardim: 3, "Vila Nova": 1, "São José": 7 },
  { tipo: "Ampliação", Centro: 2, Jardim: 3, "Vila Nova": 1, "São José": 0 },
  { tipo: "Demolição", Centro: 1, Jardim: 0, "Vila Nova": 0, "São José": 0 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const mockFiscais = [
  { nome: "João Silva", projetos: 12 },
  { nome: "Maria Oliveira", projetos: 9 },
  { nome: "Carlos Santos", projetos: 7 },
];

const mockEmpresas = [
  { nome: "Construtora Alpha", projetos: 18 },
  { nome: "Empreiteira Beta", projetos: 10 },
  { nome: "Construções Gama", projetos: 9 },
];

const mockVereadores = [
  { nome: "Vereador A", projetos: 14 },
  { nome: "Vereador B", projetos: 11 },
  { nome: "Vereador C", projetos: 6 },
];

export default function HomeContent({
  totalProjects,
  totalBairros,
  totalEmpresas,
  totalFiscais,
  countProjectsByBairro,
  orcamentoProjectByBairro,
  onBack = () => {},
}) {
  // Estado local dos filtros por gráfico
  const [statusFilterStatus, setStatusFilterStatus] = useState("all");
  const [statusFilterBairro, setStatusFilterBairro] = useState("all");

  const [tipoFilterBairro, setTipoFilterBairro] = useState("all");

  // Filtra distribuição de status por bairro e status (exemplo simples)
  const filteredStatusDistribution = useMemo(() => {
    let filtered = [...mockStatusDistribution];

    if (statusFilterStatus !== "all") {
      filtered = filtered.filter((s) => s.status === statusFilterStatus);
    }

    if (statusFilterBairro !== "all") {
      // Simula ajuste de valores por bairro
      filtered = filtered.map((s) => ({
        ...s,
        value: Math.floor(s.value * 0.8),
      }));
    }

    return filtered;
  }, [statusFilterStatus, statusFilterBairro]);

  // Filtra projetos por tipo por bairro
  const filteredProjetosPorTipo = useMemo(() => {
    if (tipoFilterBairro === "all") return mockProjetosPorTipo;
    return mockProjetosPorTipo.map((item) => ({
      tipo: item.tipo,
      quantidade: item[tipoFilterBairro] || 0,
    }));
  }, [tipoFilterBairro]);

  return (
    <BaseContent pageTitle="Início" onBack={onBack}>
      {/* Cards resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl shadow flex flex-col gap-2"
          >
            {item.icon}
            <h3 className="text-sm text-gray-500 font-medium">{item.label}</h3>
            <p className="text-3xl font-semibold text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Gráficos - 2 por linha */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Projetos por Bairro - barra vertical - sem filtro */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            📍 Número de Projetos por Bairro
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={countProjectsByBairro}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Orçamento total por bairro - barra horizontal - sem filtro */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            💰 Orçamento Total por Bairro
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={orcamentoProjectByBairro}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="nome" type="category" width={120} />
              <Tooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
              <Bar dataKey="orcamento" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuição projetos por status - pizza com filtros */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            📊 Distribuição de Projetos por Status
          </h2>

          {/* Filtros status e bairro */}
          <div className="flex gap-4 mb-4 flex-wrap">
            <select
              value={statusFilterStatus}
              onChange={(e) => setStatusFilterStatus(e.target.value)}
              className="border rounded p-2"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <select
              value={statusFilterBairro}
              onChange={(e) => setStatusFilterBairro(e.target.value)}
              className="border rounded p-2"
            >
              {bairroOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={filteredStatusDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {filteredStatusDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Projetos por tipo - barra empilhada com filtro bairro */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            🏗️ Número de Projetos por Tipo
          </h2>

          {/* Filtro bairro */}
          <div className="mb-4">
            <select
              value={tipoFilterBairro}
              onChange={(e) => setTipoFilterBairro(e.target.value)}
              className="border rounded p-2"
            >
              {bairroOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredProjetosPorTipo} stackOffset="expand">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tipo" />
              <YAxis tickFormatter={(val) => `${(val * 100).toFixed(0)}%`} />
              <Tooltip
                formatter={(value) => `${Math.round(value * 100)}%`}
                cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
              />
              <Legend />
              {/* Como aqui o dado já é só quantidade, use uma cor padrão */}
              <Bar dataKey="quantidade" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resumos em tabelas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Fiscais */}
        <div className="bg-white p-6 rounded-2xl shadow overflow-auto max-h-64">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            👷 Fiscais e Projetos Associados
          </h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="py-2 border-b">Fiscal</th>
                <th className="py-2 border-b">Projetos</th>
              </tr>
            </thead>
            <tbody>
              {mockFiscais.map((fiscal) => (
                <tr key={fiscal.nome}>
                  <td className="py-1 border-b">{fiscal.nome}</td>
                  <td className="py-1 border-b">{fiscal.projetos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empresas */}
        <div className="bg-white p-6 rounded-2xl shadow overflow-auto max-h-64">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            🏢 Empresas e Projetos Associados
          </h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="py-2 border-b">Empresa</th>
                <th className="py-2 border-b">Projetos</th>
              </tr>
            </thead>
            <tbody>
              {mockEmpresas.map((empresa) => (
                <tr key={empresa.nome}>
                  <td className="py-1 border-b">{empresa.nome}</td>
                  <td className="py-1 border-b">{empresa.projetos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vereadores */}
        <div className="bg-white p-6 rounded-2xl shadow overflow-auto max-h-64">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            🏛️ Vereadores e Projetos Associados
          </h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="py-2 border-b">Vereador</th>
                <th className="py-2 border-b">Projetos</th>
              </tr>
            </thead>
            <tbody>
              {mockVereadores.map((vereador) => (
                <tr key={vereador.nome}>
                  <td className="py-1 border-b">{vereador.nome}</td>
                  <td className="py-1 border-b">{vereador.projetos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BaseContent>
  );
}
