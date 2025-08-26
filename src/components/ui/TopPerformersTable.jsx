import React from "react";
import { Trophy, Medal, Award } from "lucide-react";

export default function TopPerformersTable({
  title,
  data,
  columns,
  limit = 5,
}) {
  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 1:
        return <Medal className="w-4 h-4 text-gray-400" />;
      case 2:
        return <Award className="w-4 h-4 text-orange-500" />;
      default:
        return (
          <span className="w-4 h-4 text-sm font-bold text-gray-400">
            {index + 1}
          </span>
        );
    }
  };

  const getRankColor = (index) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200";
      case 1:
        return "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200";
      case 2:
        return "bg-gradient-to-r from-orange-50 to-red-50 border-orange-200";
      default:
        return "bg-white border-gray-100";
    }
  };

  const sortedData = data
    .sort((a, b) => b[columns[1].key] - a[columns[1].key])
    .slice(0, limit);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>

      <div className="divide-y divide-gray-100">
        {sortedData.map((item, index) => (
          <div
            key={index}
            className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${getRankColor(
              index
            )}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm">
                  {getRankIcon(index)}
                </div>
                <div>
                  <p className="font-medium text-gray-900 truncate max-w-32">
                    {item[columns[0].key]}
                  </p>
                  <p className="text-xs text-gray-500">{columns[0].label}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    {item[columns[1].key]}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {columns[1].label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <p>Nenhum dado disponível</p>
        </div>
      )}
    </div>
  );
}
