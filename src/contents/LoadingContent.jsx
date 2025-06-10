import BaseContent from "../components/BaseContent";

function LoadingContent({ onBack = () => {} }) {
  return (
    <BaseContent pageTitle="Carregando..." onBack={onBack}>
      {/* Esqueleto dos cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl shadow animate-pulse"
          >
            <div className="h-6 w-6 bg-gray-300 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded mb-1 w-2/3" />
            <div className="h-6 bg-gray-300 rounded w-1/2" />
          </div>
        ))}
      </div>

      {/* Esqueleto das tabelas */}
      {[1, 2, 3].map((section) => (
        <div
          key={section}
          className="bg-white p-6 rounded-2xl shadow mb-6 overflow-x-auto animate-pulse"
        >
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-100 rounded w-full" />
            ))}
          </div>
        </div>
      ))}

      {/* Esqueleto de últimas alterações */}
      <div className="bg-white p-6 rounded-2xl shadow animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-100 rounded w-full" />
          ))}
        </div>
      </div>
    </BaseContent>
  );
}

export default LoadingContent;
