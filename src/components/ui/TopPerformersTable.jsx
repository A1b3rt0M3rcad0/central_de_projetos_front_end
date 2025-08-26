import React from "react";

export default function TopPerformersTable({
  title,
  data,
  columns,
  limit = 3,
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow overflow-auto max-h-64">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="py-2 border-b">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data
            .sort((a, b) => b[columns[1].key] - a[columns[1].key])
            .slice(0, limit)
            .map((item, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column.key} className="py-1 border-b">
                    {item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
