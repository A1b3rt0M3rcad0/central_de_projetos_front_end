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

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            📍 Número de Projetos por Bairro
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={countProjectsByBairroSorted}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="nome"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            💰 Orçamento Total por Bairro
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={orcamentoProjectByBairroSorted}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                dataKey="nome"
                type="category"
                width={150}
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
              <Bar dataKey="orcamento" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            📊 Distribuição de Projetos por Status
          </h2>

          <div className="flex gap-4 mb-4 flex-wrap">
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
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{ fontSize: "12px" }}
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            🏗️ Número de Projetos por Tipo
          </h2>
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
            <BarChart data={filteredProjetosPorTipo}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tipo" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              {tipoFilterBairro === "all"
                ? Array.from(
                    new Set(
                      projetosPorTipoTransformado.flatMap((p) =>
                        Object.keys(p).filter((k) => k !== "tipo")
                      )
                    )
                  ).map((bairro, idx) => (
                    <Bar
                      key={bairro}
                      dataKey={bairro}
                      stackId="a"
                      fill={COLORS[idx % COLORS.length]}
                    />
                  ))
                : [
                    <Bar
                      key="quantidade"
                      dataKey="quantidade"
                      fill="#3b82f6"
                    />,
                  ]}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
              {countProjectByFiscal
                .sort((a, b) => b.projetos - a.projetos)
                .slice(0, 3)
                .map((fiscal) => (
                  <tr key={fiscal.nome}>
                    <td className="py-1 border-b">{fiscal.nome}</td>
                    <td className="py-1 border-b">{fiscal.projetos}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

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
              {countProjectByEmpresa
                .sort((a, b) => b.projetos - a.projetos)
                .slice(0, 3)
                .map((empresa) => (
                  <tr key={empresa.nome}>
                    <td className="py-1 border-b">{empresa.nome}</td>
                    <td className="py-1 border-b">{empresa.projetos}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

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
              {countProjectByUser
                .sort((a, b) => b.projetos - a.projetos)
                .slice(0, 3)
                .map((vereador) => (
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
