import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function ProjectsByTypeChart({
  data,
  filterValue,
  onFilterChange,
  filterOptions,
  fullData,
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        🏗️ Número de Projetos por Tipo
      </h2>
      <div className="mb-4">
        <select
          value={filterValue}
          onChange={(e) => onFilterChange(e.target.value)}
          className="border rounded p-2"
        >
          {filterOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="tipo" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          {filterValue === "all"
            ? Array.from(
                new Set(
                  fullData.flatMap((p) =>
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
            : [<Bar key="quantidade" dataKey="quantidade" fill="#3b82f6" />]}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
