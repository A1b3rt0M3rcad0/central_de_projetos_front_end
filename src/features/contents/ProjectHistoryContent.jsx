import BaseContent from "../../components/BaseContent";
import {
  Clock,
  ArrowLeft,
  Calendar,
  User,
  FileText,
  TrendingUp,
} from "lucide-react";

export default function ProjectHistoryContent({ project, onBack }) {
  const formatDate = (dateString) => {
    if (!dateString) return "--";

    try {
      // Se já é uma string formatada, retornar como está
      if (typeof dateString === "string" && dateString.includes("/")) {
        return dateString;
      }

      // Tentar criar objeto Date
      const date = new Date(dateString);

      // Verificar se a data é válida
      if (isNaN(date.getTime())) {
        return dateString; // Retornar string original se não conseguir parsear
      }

      // Formatar para pt-BR
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Erro ao formatar data:", dateString, error);
      return dateString; // Retornar string original em caso de erro
    }
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
                <strong>Bairro:</strong> {project.bairro?.name || "--"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Tipo:</strong> {project.types?.name || "--"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Fiscal:</strong> {project.fiscal?.name || "--"}
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
              {project.history_project
                .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
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
