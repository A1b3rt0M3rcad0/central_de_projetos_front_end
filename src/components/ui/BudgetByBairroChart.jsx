import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function BudgetByBairroChart({ data }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        💰 Orçamento Total por Bairro
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart layout="vertical" data={data}>
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
  );
}
