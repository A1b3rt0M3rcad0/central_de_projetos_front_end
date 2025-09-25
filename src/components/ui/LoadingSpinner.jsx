import React from "react";

export function LoadingSpinner({
  size = "md",
  className = "",
  text = "Carregando...",
  subtle = false,
}) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <div
      className={`flex flex-col justify-center items-center gap-3 ${className}`}
    >
      <div className="relative">
        <div
          className={`${sizeClasses[size]} animate-spin rounded-full ${
            subtle ? "border-2" : "border-4"
          } border-gray-200 border-t-blue-600`}
        />
        <div
          className={`${
            sizeClasses[size]
          } absolute top-0 left-0 animate-spin rounded-full ${
            subtle ? "border-2" : "border-4"
          } border-transparent border-r-blue-400 ${
            subtle ? "" : "animate-pulse"
          }`}
          style={{ animationDelay: "0.1s" }}
        />
      </div>
      {text !== "" && text !== null && (
        <p
          className={`text-sm text-gray-600 font-medium ${
            subtle ? "opacity-60" : "animate-pulse"
          }`}
        >
          {text}
        </p>
      )}
    </div>
  );
}

// Default export para compatibilidade
export default LoadingSpinner;

// Barra de progresso sutil no topo da página
export function TopProgressBar({ active = true, className = "" }) {
  if (!active) return null;
  return (
    <div className={`fixed top-0 left-0 w-full h-0.5 z-50 ${className}`}>
      <div className="w-full h-full bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 animate-pulse" />
    </div>
  );
}

// Componente de loading para cards
export function CardSkeleton({ className = "" }) {
  return (
    <div
      className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse ${className}`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
}

// Componente de loading para gráficos
export function ChartSkeleton({ className = "" }) {
  return (
    <div
      className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-400 text-sm">Carregando gráfico...</div>
      </div>
    </div>
  );
}
