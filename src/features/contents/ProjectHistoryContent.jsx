import BaseContent from "../../components/BaseContent";
import {
  Clock,
  ArrowLeft,
  Calendar,
  User,
  FileText,
  TrendingUp,
} from "lucide-react";
import { formatDate } from "../../utils/dateUtils";

export default function ProjectHistoryContent({ project, onBack }) {
  // Função para converter data brasileira (dd/mm/yyyy) para Date
  const parseBrazilianDate = (dateString) => {
    if (!dateString) return new Date(0);
    const parts = dateString.split("/");
    if (parts.length !== 3) return new Date(0);
    // Formato: dd/mm/yyyy -> Date(yyyy, mm-1, dd)
    return new Date(parts[2], parts[1] - 1, parts[0]);
  };

  const getFieldDisplayName = (fieldName) => {
    const fieldMap = {
      name: "Nome do Projeto",
      status_id: "Status",
      verba_disponivel: "Orçamento",
      andamento_do_projeto: "Situação do Projeto",
      start_date: "Data de Início",
      expected_completion_date: "Previsão de Conclusão",
      end_date: "Data de Conclusão",
      bairro_id: "Bairro",
      empresa_id: "Empresa",
      fiscal_id: "Fiscal",
      user_id: "Vereador",
      types_id: "Tipo de Projeto",
    };
    return fieldMap[fieldName] || fieldName;
  };

  const getChangeTypeIcon = (description) => {
    if (description.includes("criado") || description.includes("adicionado")) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    }
    if (
      description.includes("atualizado") ||
      description.includes("modificado")
    ) {
      return <FileText className="w-4 h-4 text-blue-600" />;
    }
    return <Clock className="w-4 h-4 text-gray-600" />;
  };

  const getChangeTypeColor = (description) => {
    if (description.includes("criado") || description.includes("adicionado")) {
      return "bg-green-50 border-green-200";
    }
    if (
      description.includes("atualizado") ||
      description.includes("modificado")
    ) {
      return "bg-blue-50 border-blue-200";
    }
    return "bg-gray-50 border-gray-200";
  };

  return (
    <BaseContent
      pageTitle="Histórico de Alterações"
      onBack={onBack}
      breadcrumbs={[
        { label: "Projetos", onClick: () => navigate("/projectlistpage") },
        { label: "Detalhes", onClick: () => navigate(-1) },
        { label: "Histórico" },
      ]}
    >
      <div className="space-y-6">
        {/* Informações do Projeto */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Informações do Projeto
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Nome:</strong> {project.name}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Status:</strong> {project.status?.description || "--"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Orçamento:</strong>{" "}
                {typeof project.verba_disponivel === "number" ? (
                  <span>
                    R${" "}
                    {new Intl.NumberFormat("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(project.verba_disponivel)}
                  </span>
                ) : (
                  "--"
                )}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Bairro(s):</strong>{" "}
                {Array.isArray(project.bairro) && project.bairro.length > 0
                  ? project.bairro.map((b) => b.name).join(", ")
                  : project.bairro?.name || "--"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Tipo(s):</strong>{" "}
                {Array.isArray(project.types) && project.types.length > 0
                  ? project.types.map((t) => t.name).join(", ")
                  : project.types?.name || "--"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Fiscal(is):</strong>{" "}
                {Array.isArray(project.fiscal) && project.fiscal.length > 0
                  ? project.fiscal.map((f) => f.name).join(", ")
                  : project.fiscal?.name || "--"}
              </p>
            </div>
          </div>
        </div>

        {/* Estatísticas do Histórico */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Resumo do Histórico
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {project.history_project?.length || 0}
              </div>
              <div className="text-sm text-blue-600">Total de Alterações</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {project.history_project?.filter((h) =>
                  h.description.includes("criado")
                ).length || 0}
              </div>
              <div className="text-sm text-green-600">Criações</div>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {project.history_project?.filter((h) =>
                  h.description.includes("atualizado")
                ).length || 0}
              </div>
              <div className="text-sm text-orange-600">Atualizações</div>
            </div>
          </div>
        </div>

        {/* Lista de Alterações */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Histórico Completo de Alterações
            </h2>
          </div>

          {project.history_project && project.history_project.length > 0 ? (
            <div className="space-y-4">
              {[...project.history_project]
                .sort((a, b) => {
                  const dateA = parseBrazilianDate(
                    a.updated_at || a.created_at
                  );
                  const dateB = parseBrazilianDate(
                    b.updated_at || b.created_at
                  );
                  return dateB - dateA; // Mais recente primeiro
                })
                .map((item, index) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border ${getChangeTypeColor(
                      item.description
                    )}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getChangeTypeIcon(item.description)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-gray-900">
                            {getFieldDisplayName(item.data_name)}
                          </h3>
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                            {item.data_name}
                          </span>
                        </div>

                        <p className="text-sm text-gray-700 mb-2">
                          {item.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(item.updated_at)}
                          </div>

                          {item.user && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {item.user}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                Nenhuma alteração registrada para este projeto.
              </p>
            </div>
          )}
        </div>

        {/* Botão Voltar */}
        <div className="flex justify-center">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Projeto
          </button>
        </div>
      </div>
    </BaseContent>
  );
}
