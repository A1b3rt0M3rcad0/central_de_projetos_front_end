import React from "react";

const StatusBadge = ({ status, size = "md", showIcon = true }) => {
  const getStatusConfig = (status) => {
    const statusLower = status?.toLowerCase() || "";

    if (statusLower.includes("aguardando")) {
      return {
        bg: "bg-gradient-to-r from-orange-50 to-amber-50",
        text: "text-orange-700",
        border: "border-orange-200",
        icon: "⏳",
        shadow: "shadow-orange-100",
      };
    }
    if (statusLower.includes("projeto")) {
      return {
        bg: "bg-gradient-to-r from-purple-50 to-indigo-50",
        text: "text-purple-700",
        border: "border-purple-200",
        icon: "📋",
        shadow: "shadow-purple-100",
      };
    }
    if (statusLower.includes("execução")) {
      return {
        bg: "bg-gradient-to-r from-blue-50 to-cyan-50",
        text: "text-blue-700",
        border: "border-blue-200",
        icon: "🚧",
        shadow: "shadow-blue-100",
      };
    }
    if (statusLower.includes("em andamento")) {
      return {
        bg: "bg-gradient-to-r from-blue-50 to-cyan-50",
        text: "text-blue-700",
        border: "border-blue-200",
        icon: "🔄",
        shadow: "shadow-blue-100",
      };
    }
    if (statusLower.includes("concluído")) {
      return {
        bg: "bg-gradient-to-r from-green-50 to-emerald-50",
        text: "text-green-700",
        border: "border-green-200",
        icon: "✅",
        shadow: "shadow-green-100",
      };
    }
    if (statusLower.includes("cancelado")) {
      return {
        bg: "bg-gradient-to-r from-red-50 to-rose-50",
        text: "text-red-700",
        border: "border-red-200",
        icon: "❌",
        shadow: "shadow-red-100",
      };
    }
    if (statusLower.includes("pausado")) {
      return {
        bg: "bg-gradient-to-r from-yellow-50 to-amber-50",
        text: "text-yellow-700",
        border: "border-yellow-200",
        icon: "⏸️",
        shadow: "shadow-yellow-100",
      };
    }
    return {
      bg: "bg-gradient-to-r from-gray-50 to-slate-50",
      text: "text-gray-700",
      border: "border-gray-200",
      icon: "❓",
      shadow: "shadow-gray-100",
    };
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case "sm":
        return {
          container: "px-2 py-1 gap-1",
          text: "text-xs",
          icon: "text-xs",
        };
      case "md":
        return {
          container: "px-3 py-1.5 gap-1.5",
          text: "text-xs",
          icon: "text-xs",
        };
      case "lg":
        return {
          container: "px-4 py-2 gap-2",
          text: "text-sm",
          icon: "text-sm",
        };
      default:
        return {
          container: "px-3 py-1.5 gap-1.5",
          text: "text-xs",
          icon: "text-xs",
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = getSizeClasses(size);

  return (
    <div
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.border} ${config.shadow} shadow-sm ${sizeClasses.container}`}
    >
      {showIcon && <span className={sizeClasses.icon}>{config.icon}</span>}
      <span
        className={`${sizeClasses.text} font-semibold ${config.text} tracking-wide`}
      >
        {status || "Não definido"}
      </span>
    </div>
  );
};

export default StatusBadge;
