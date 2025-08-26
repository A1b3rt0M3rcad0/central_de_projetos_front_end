import React from "react";

export default function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow flex flex-col gap-2">
      {icon}
      <h3 className="text-sm text-gray-500 font-medium">{label}</h3>
      <p className="text-3xl font-semibold text-gray-800">{value}</p>
    </div>
  );
}
