import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BasePage from "../../components/layout/BasePage";
import BaseContent from "../../components/BaseContent";
import GanttChart from "../../components/GanttChart";
import {
  ArrowLeft,
  Calendar,
  Layers,
  Table,
  Info,
  AlertCircle,
  CheckCircle,
  PlayCircle,
  Target,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { projectAPI, eapAPI } from "../../services";

export default function ProjectGanttPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [eap, setEap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("gantt"); // 'gantt', 'list'
  const [expandedItems, setExpandedItems] = useState(new Set());

  useEffect(() => {
    loadProjectAndEAP();
  }, [projectId]);

  const loadProjectAndEAP = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar dados otimizados do Gantt (projeto + EAP em 1 requisição)
      const ganttResponse = await eapAPI.getGanttData(projectId);

      console.log("📊 Gantt Data Response:", ganttResponse);

      // Extrair dados
      const ganttData =
        ganttResponse?.content || ganttResponse?.data || ganttResponse;

      if (ganttData && ganttData.project && ganttData.eap) {
        setProject(ganttData.project);
        setEap(ganttData.eap);
        console.log("✅ Dados do Gantt carregados:", ganttData);
      } else {
        console.warn("⚠️ Estrutura inesperada:", ganttResponse);
        setError("Projeto não possui EAP criada");
      }

      setLoading(false);
    } catch (err) {
      console.error("❌ Erro ao carregar dados do Gantt:", err);

      // Se der erro, pode ser que não tenha EAP
      if (err.response?.status === 404) {
        setError("Projeto não possui EAP criada");
      } else {
        setError("Erro ao carregar dados do projeto");
      }

      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(`/project/${projectId}`);
  };

  const handleCreateEAP = () => {
    navigate(`/project/${projectId}/eap`);
  };

  const toggleExpand = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const renderListItem = (item, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);

    const typeColors = {
      fase: "bg-blue-100 text-blue-700",
      entrega: "bg-green-100 text-green-700",
      atividade: "bg-purple-100 text-purple-700",
      tarefa: "bg-yellow-100 text-yellow-700",
    };

    const statusIcons = {
      concluido: <CheckCircle className="w-4 h-4 text-green-600" />,
      em_andamento: <PlayCircle className="w-4 h-4 text-blue-600" />,
      nao_iniciado: <Target className="w-4 h-4 text-gray-400" />,
      pausado: <AlertCircle className="w-4 h-4 text-yellow-600" />,
      cancelado: <AlertCircle className="w-4 h-4 text-red-600" />,
      bloqueado: <AlertCircle className="w-4 h-4 text-purple-600" />,
    };

    const statusLabels = {
      concluido: "Concluído",
      em_andamento: "Em Andamento",
      nao_iniciado: "Não Iniciado",
      pausado: "Pausado",
      cancelado: "Cancelado",
      bloqueado: "Bloqueado",
    };

    return (
      <div key={item.id}>
        <div
          className={`flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 ${
            level > 0 ? "bg-gray-50/50" : ""
          }`}
          style={{ paddingLeft: `${level * 2 + 1}rem` }}
        >
          {/* Expand/Collapse */}
          <div className="w-6 flex-shrink-0">
            {hasChildren && (
              <button
                onClick={() => toggleExpand(item.id)}
                className="hover:bg-gray-200 rounded p-1"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                )}
              </button>
            )}
          </div>

          {/* Nome e Tipo */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  typeColors[item.type]
                }`}
              >
                {item.type}
              </span>
              <span className="font-medium text-gray-900">{item.name}</span>
            </div>
            {item.description && (
              <p className="text-xs text-gray-500 mt-1 truncate">
                {item.description}
              </p>
            )}
          </div>

          {/* Responsável */}
          <div className="w-32 flex-shrink-0 text-sm text-gray-600 truncate">
            {item.responsible || "-"}
          </div>

          {/* Datas */}
          <div className="w-40 flex-shrink-0 text-sm text-gray-600">
            {new Date(item.start_date).toLocaleDateString("pt-BR")} -{" "}
            {new Date(item.end_date).toLocaleDateString("pt-BR")}
          </div>

          {/* Orçamento */}
          <div className="w-28 flex-shrink-0 text-sm font-medium text-gray-900 text-right">
            R${" "}
            {parseFloat(item.budget).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </div>

          {/* Progresso */}
          <div className="w-24 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    (item.calculated_progress || item.progress) === 100
                      ? "bg-green-500"
                      : (item.calculated_progress || item.progress) >= 50
                      ? "bg-blue-500"
                      : "bg-yellow-500"
                  }`}
                  style={{
                    width: `${item.calculated_progress || item.progress}%`,
                  }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600 w-10 text-right">
                {item.calculated_progress || item.progress}%
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="w-32 flex-shrink-0 flex items-center gap-2">
            {statusIcons[item.status]}
            <span className="text-xs text-gray-600">
              {statusLabels[item.status]}
            </span>
          </div>
        </div>

        {/* Renderizar filhos se expandido */}
        {hasChildren && isExpanded && (
          <div>
            {item.children.map((child) => renderListItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <BasePage pageTitle="Cronograma">
        <BaseContent
          pageTitle="Cronograma do Projeto"
          onBack={handleGoBack}
          breadcrumbs={[
            { label: "Projetos", onClick: () => navigate("/projectlistpage") },
            {
              label: "Detalhes",
              onClick: () => navigate(`/project/${projectId}`),
            },
            { label: "Cronograma" },
          ]}
        >
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">
                Carregando cronograma...
              </p>
            </div>
          </div>
        </BaseContent>
      </BasePage>
    );
  }

  if (error || !eap) {
    return (
      <BasePage pageTitle="Cronograma">
        <BaseContent
          pageTitle="Cronograma do Projeto"
          onBack={handleGoBack}
          breadcrumbs={[
            { label: "Projetos", onClick: () => navigate("/projectlistpage") },
            {
              label: "Detalhes",
              onClick: () => navigate(`/project/${projectId}`),
            },
            { label: "Cronograma" },
          ]}
        >
          <div className="flex items-center justify-center h-96">
            <div className="text-center max-w-2xl px-6">
              <div className="bg-yellow-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Estrutura Analítica do Projeto (EAP) não encontrada
              </h3>
              <p className="text-gray-600 mb-4">
                A EAP é a estrutura que organiza todas as atividades e entregas
                do projeto em uma hierarquia. Ela é essencial para gerar o
                cronograma Gantt, pois define as tarefas, suas durações e
                dependências.
              </p>
              <p className="text-gray-700 font-medium mb-6">
                Para visualizar o cronograma Gantt, você precisa primeiro criar
                a EAP deste projeto.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleGoBack}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </button>
                <button
                  onClick={handleCreateEAP}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  Criar EAP
                </button>
              </div>
            </div>
          </div>
        </BaseContent>
      </BasePage>
    );
  }

  return (
    <BasePage pageTitle="Cronograma">
      <BaseContent
        pageTitle={`Cronograma: ${project?.name || "Projeto"}`}
        onBack={handleGoBack}
        breadcrumbs={[
          { label: "Projetos", onClick: () => navigate("/projectlistpage") },
          {
            label: project?.name || "Detalhes",
            onClick: () => navigate(`/project/${projectId}`),
          },
          { label: "Cronograma" },
        ]}
      >
        {/* Project Info Card */}
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {project?.name}
                </h2>
                {project?.status && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === "Concluído" ||
                      project.status?.includes("Concluí")
                        ? "bg-green-100 text-green-700"
                        : project.status === "Em Execução" ||
                          project.status?.includes("Execução")
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {project.status}
                  </span>
                )}
              </div>

              {project?.andamento_do_projeto &&
                project.andamento_do_projeto !== "None" && (
                  <p className="text-gray-600 text-sm mb-3">
                    {project.andamento_do_projeto}
                  </p>
                )}

              <div className="grid grid-cols-4 gap-4 mt-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">EAP</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {eap?.name || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    Data de Início
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {project?.start_date &&
                    project.start_date !== "None" &&
                    project.start_date !== null
                      ? new Date(project.start_date).toLocaleDateString("pt-BR")
                      : "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    Previsão de Conclusão
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {project?.expected_completion_date &&
                    project.expected_completion_date !== "None" &&
                    project.expected_completion_date !== null
                      ? new Date(
                          project.expected_completion_date
                        ).toLocaleDateString("pt-BR")
                      : "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Orçamento</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {project?.verba_disponivel && project.verba_disponivel > 0
                      ? `R$ ${parseFloat(
                          project.verba_disponivel
                        ).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}`
                      : "-"}
                  </div>
                </div>
              </div>
            </div>

            {/* View Switcher */}
            <div className="ml-6 flex gap-2">
              <button
                onClick={() => setActiveView("gantt")}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  activeView === "gantt"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
                title="Visualização Gantt"
              >
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Gantt</span>
              </button>

              <button
                onClick={() => setActiveView("list")}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  activeView === "list"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
                title="Visualização em Lista"
              >
                <Table className="w-4 h-4" />
                <span className="text-sm font-medium">Lista</span>
              </button>
            </div>
          </div>
        </div>

        {/* Info Alert */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">
              Visualização do Cronograma
            </h4>
            <p className="text-sm text-blue-700">
              O cronograma Gantt é gerado automaticamente a partir da EAP. Todas
              as alterações feitas aqui são sincronizadas com a estrutura
              analítica do projeto.
              {!project?.isAdmin && " Você está em modo visualização."}
            </p>
          </div>
        </div>

        {/* Gantt Chart */}
        {activeView === "gantt" && (
          <div className="h-[calc(100vh-400px)] min-h-[600px]">
            <GanttChart
              eapId={eap.id}
              projectId={projectId}
              readonly={!project?.isAdmin}
            />
          </div>
        )}

        {/* Lista View */}
        {activeView === "list" && eap && eap.items && (
          <div className="bg-white rounded-lg shadow">
            {/* Header da Lista */}
            <div className="grid grid-cols-12 gap-3 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase">
              <div className="col-span-4">Tarefa</div>
              <div className="col-span-2">Responsável</div>
              <div className="col-span-2">Período</div>
              <div className="col-span-1 text-right">Orçamento</div>
              <div className="col-span-2">Progresso</div>
              <div className="col-span-1">Status</div>
            </div>

            {/* Lista Hierárquica */}
            <div className="divide-y divide-gray-100">
              {eap.items.map((item) => renderListItem(item, 0))}
            </div>

            {/* Footer com totais */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-700">
                  Total: {eap.items.length} item(ns) raiz
                </span>
                <span className="font-semibold text-gray-900">
                  Orçamento Total: R${" "}
                  {parseFloat(eap.total_budget || 0).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>
        )}
      </BaseContent>
    </BasePage>
  );
}
