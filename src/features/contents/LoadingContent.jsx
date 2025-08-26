import BaseContent from "../../components/BaseContent";
import {
  CardSkeleton,
  ChartSkeleton,
  LoadingSpinner,
} from "../../components/ui/LoadingSpinner";

function LoadingContent({ onBack = () => {} }) {
  return (
    <BaseContent pageTitle="Dashboard" onBack={onBack}>
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-80 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-96"></div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 bg-gray-200 rounded-xl w-32"></div>
            <div className="h-8 bg-gray-200 rounded-lg w-48"></div>
          </div>
        </div>
      </div>

      {/* Cards de métricas principais skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-gray-200 to-gray-300 p-6 rounded-2xl animate-pulse"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl"></div>
              <div className="w-5 h-5 bg-white/20 rounded"></div>
            </div>
            <div className="h-4 bg-white/20 rounded w-3/4 mb-1"></div>
            <div className="h-8 bg-white/20 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-white/20 rounded w-2/3"></div>
          </div>
        ))}
      </div>

      {/* Seção de gráficos skeleton */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, index) => (
            <ChartSkeleton key={index} />
          ))}
        </div>
      </div>

      {/* Tabelas de performance skeleton */}
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded w-64 mb-6 animate-pulse"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
            >
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="h-6 bg-gray-200 rounded w-32"></div>
              </div>

              <div className="divide-y divide-gray-100">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div>
                          <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="h-5 bg-gray-200 rounded w-8 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-12"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseContent>
  );
}

export default LoadingContent;
