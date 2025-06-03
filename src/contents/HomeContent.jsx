import BaseContent from "../components/BaseContent";
import {
  Banknote,
  HandCoins,
  NotebookPen,
  Building,
  MapPin,
  Hammer,
} from "lucide-react";

export default function HomeContent({
  totalProjects = 0,
  totalBairros = 0,
  totalEmpresas = 0,
  totalFiscais = 0,
  totalVerba = 0,
  custoMedio = 0,
  empresasMaisAtivas = [],
  bairrosMaisAtivos = [],
  fiscaisMaisAtivos = [],
  recentProjects = [],
  recentChanges = [],
  onBack = () => {},
}) {
  return (
    <BaseContent pageTitle="Início" onBack={onBack}>
      {/* Cards resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {[
          {
            icon: <Hammer className="text-blue-600" />,
            label: "Total de Projetos",
            value: totalProjects,
          },
          {
            icon: <MapPin className="text-blue-600" />,
            label: "Total de Bairros",
            value: totalBairros,
          },
          {
            icon: <Building className="text-blue-600" />,
            label: "Total de Empresas",
            value: totalEmpresas,
          },
          {
            icon: <NotebookPen className="text-blue-600" />,
            label: "Total de Fiscais",
            value: totalFiscais,
          },
          {
            icon: <HandCoins className="text-blue-600" />,
            label: "Verba Total Utilizada",
            value: `R$ ${Number(totalVerba).toLocaleString("pt-BR")}`,
          },
          {
            icon: <Banknote className="text-blue-600" />,
            label: "Custo Médio Por Projeto",
            value: `R$ ${Number(custoMedio).toLocaleString("pt-BR")}`,
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl shadow flex flex-col gap-2"
          >
            {item.icon}
            <h3 className="text-sm text-gray-500 font-medium">{item.label}</h3>
            <p className="text-3xl font-semibold text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Tabelas dinâmicas */}
      {[
        {
          title: "🏢 Empresas Mais Envolvidas",
          headers: ["Empresa", "Qtde Projetos"],
          data: empresasMaisAtivas,
          keys: ["nome", "quantidade"],
          emptyMessage: "Nenhuma empresa encontrada.",
        },
        {
          title: "📍 Bairros com Mais Projetos",
          headers: ["Bairro", "Qtde Projetos"],
          data: bairrosMaisAtivos,
          keys: ["nome", "quantidade"],
          emptyMessage: "Nenhum bairro encontrado.",
        },
        {
          title: "👷‍♂️ Fiscais Mais Envolvidos",
          headers: ["Fiscal", "Qtde Projetos"],
          data: fiscaisMaisAtivos,
          keys: ["nome", "quantidade"],
          emptyMessage: "Nenhum fiscal encontrado.",
        },
      ].map((section, idx) => (
        <div
          key={idx}
          className="bg-white p-6 rounded-2xl shadow mb-6 overflow-x-auto"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {section.title}
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                {section.headers.map((header, i) => (
                  <th
                    key={i}
                    className="text-left py-2 text-gray-600 font-medium"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.data.length > 0 ? (
                section.data.map((item, i) => (
                  <tr
                    key={i}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    {section.keys.map((key, j) => (
                      <td key={j} className="py-2 text-gray-700">
                        {item[key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={section.headers.length}
                    className="py-4 text-center text-gray-500"
                  >
                    {section.emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}

      {/* Últimos Projetos */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6 overflow-x-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          🆕 Últimos Projetos
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 text-gray-600 font-medium">Nome</th>
              <th className="text-left py-2 text-gray-600 font-medium">
                Bairro
              </th>
              <th className="text-left py-2 text-gray-600 font-medium">
                Empresa
              </th>
              <th className="text-left py-2 text-gray-600 font-medium">
                Criado em
              </th>
            </tr>
          </thead>
          <tbody>
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="py-2 text-gray-700">{project.name || "--"}</td>
                  <td className="py-2 text-gray-700">
                    {project.bairro || "--"}
                  </td>
                  <td className="py-2 text-gray-700">
                    {project.empresa || "--"}
                  </td>
                  <td className="py-2 text-gray-700">
                    {project.created_at
                      ? new Date(project.created_at).toLocaleDateString()
                      : "--"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-500">
                  Nenhum projeto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Últimas Alterações */}
      <div className="bg-white p-6 rounded-2xl shadow overflow-x-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          🔧 Últimas Alterações nos Projetos
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 text-gray-600 font-medium">
                Projeto
              </th>
              <th className="text-left py-2 text-gray-600 font-medium">
                Campo Alterado
              </th>
              <th className="text-left py-2 text-gray-600 font-medium">
                Nova Informação
              </th>
              <th className="text-left py-2 text-gray-600 font-medium">Data</th>
            </tr>
          </thead>
          <tbody>
            {recentChanges.length > 0 ? (
              recentChanges.map((change, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="py-2 text-gray-700">
                    {change.project_name || "--"}
                  </td>
                  <td className="py-2 text-gray-700">
                    {change.field_changed || "--"}
                  </td>
                  <td className="py-2 text-gray-700">
                    {change.new_value || "--"}
                  </td>
                  <td className="py-2 text-gray-700">
                    {change.changed_at
                      ? new Date(change.changed_at).toLocaleDateString()
                      : "--"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-500">
                  Nenhuma alteração registrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </BaseContent>
  );
}
