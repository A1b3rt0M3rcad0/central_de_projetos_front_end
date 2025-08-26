import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function StatusDistributionChart({
  data,
  filterValue,
  onFilterChange,
  filterOptions,
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        📊 Distribuição de Projetos por Status
      </h2>

      <div className="flex gap-4 mb-4 flex-wrap">
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
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
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
  );
}
