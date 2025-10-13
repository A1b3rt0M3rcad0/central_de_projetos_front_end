import { useEffect, useRef, useState } from "react";
import { gantt } from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import {
  Calendar,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye,
  Filter,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { eapAPI } from "../services";

export default function GanttChart({ eapId, projectId, readonly = false }) {
  const ganttContainer = useRef(null);
  const fullscreenRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState("day");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    overdue: 0,
  });

  useEffect(() => {
    if (!ganttContainer.current) return;

    // Configurações do Gantt
    configureGantt();

    // Inicializar
    gantt.init(ganttContainer.current);

    // Carregar dados
    loadGanttData();

    return () => {
      gantt.clearAll();
    };
  }, [eapId, filterStatus]);

  // Detectar mudanças no modo fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const configureGantt = () => {
    // Configurações básicas
    gantt.config.date_format = "%Y-%m-%d";
    gantt.config.xml_date = "%Y-%m-%d";
    gantt.config.readonly = readonly;
    gantt.config.auto_scheduling = false;
    gantt.config.auto_scheduling_strict = false;
    gantt.config.work_time = true;
    gantt.config.skip_off_time = false;

    // Configurações de scroll e altura
    gantt.config.autosize = "xy"; // Ajusta automaticamente largura e altura
    gantt.config.row_height = 38; // Altura de cada linha
    gantt.config.scale_height = 60; // Altura do cabeçalho de escala
    gantt.config.min_column_width = 70; // Largura mínima das colunas de tempo

    // Configurações de links (dependências)
    gantt.config.show_links = true; // Mostra setas de dependências
    gantt.config.highlight_critical_path = true; // Destaca caminho crítico

    // Idioma PT-BR
    gantt.config.duration_unit = "day";
    gantt.locale = {
      date: {
        month_full: [
          "Janeiro",
          "Fevereiro",
          "Março",
          "Abril",
          "Maio",
          "Junho",
          "Julho",
          "Agosto",
          "Setembro",
          "Outubro",
          "Novembro",
          "Dezembro",
        ],
        month_short: [
          "Jan",
          "Fev",
          "Mar",
          "Abr",
          "Mai",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Out",
          "Nov",
          "Dez",
        ],
        day_full: [
          "Domingo",
          "Segunda",
          "Terça",
          "Quarta",
          "Quinta",
          "Sexta",
          "Sábado",
        ],
        day_short: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      },
    };

    // Configurar colunas da grid
    gantt.config.columns = [
      {
        name: "text",
        label: "Tarefa",
        width: 250,
        tree: true,
        template: function (task) {
          const icons = {
            fase: "📋",
            entrega: "📦",
            atividade: "✅",
            tarefa: "📝",
          };
          return `<span style="font-weight: ${
            task.type === "fase" ? "bold" : "normal"
          }">
                    ${icons[task.item_type] || "•"} ${task.text}
                  </span>`;
        },
      },
      {
        name: "start_date",
        label: "Início",
        width: 90,
        align: "center",
        template: function (task) {
          return gantt.date.date_to_str("%d/%m/%Y")(task.start_date);
        },
      },
      {
        name: "duration",
        label: "Duração",
        width: 70,
        align: "center",
        template: function (task) {
          return task.duration + " dias";
        },
      },
      {
        name: "responsible",
        label: "Responsável",
        width: 140,
        template: function (task) {
          return `<span class="text-sm">${task.responsible || "-"}</span>`;
        },
      },
      {
        name: "progress",
        label: "Progresso",
        width: 90,
        align: "center",
        template: function (task) {
          // Usar calculated_progress se disponível, senão usa o progress normal
          const percent =
            task.calculated_progress !== undefined
              ? task.calculated_progress
              : Math.round(task.progress * 100);
          const color =
            percent === 100 ? "#10b981" : percent >= 50 ? "#3b82f6" : "#f59e0b";
          return `<div class="flex items-center justify-center relative">
                    <div class="w-16 h-4 bg-gray-200 rounded-full overflow-hidden relative">
                      <div class="h-full rounded-full" style="width: ${percent}%; background-color: ${color}"></div>
                      <div class="absolute inset-0 flex items-center justify-center">
                        <span class="text-xs font-bold text-gray-700" style="color: ${
                          percent > 30 ? "white" : "black"
                        }">${percent}%</span>
                      </div>
                    </div>
                  </div>`;
        },
      },
      {
        name: "budget",
        label: "Orçamento",
        width: 110,
        align: "right",
        template: function (task) {
          return task.budget
            ? `R$ ${parseFloat(task.budget).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}`
            : "-";
        },
      },
      {
        name: "status",
        label: "Status",
        width: 100,
        align: "center",
        template: function (task) {
          const statusMap = {
            nao_iniciado: { label: "Não Iniciado", color: "bg-gray-500" },
            em_andamento: { label: "Em Andamento", color: "bg-blue-500" },
            concluido: { label: "Concluído", color: "bg-green-500" },
            pausado: { label: "Pausado", color: "bg-yellow-500" },
            cancelado: { label: "Cancelado", color: "bg-red-500" },
            bloqueado: { label: "Bloqueado", color: "bg-purple-500" },
          };
          const status = statusMap[task.status] || {
            label: task.status,
            color: "bg-gray-500",
          };
          return `<span class="px-2 py-1 rounded-full text-xs text-white ${status.color}">${status.label}</span>`;
        },
      },
    ];

    // Templates de cores das barras
    gantt.templates.task_class = function (start, end, task) {
      const classes = [];

      // Cor baseada no tipo
      if (task.item_type === "fase") classes.push("gantt-task-fase");
      if (task.item_type === "entrega") classes.push("gantt-task-entrega");
      if (task.item_type === "atividade") classes.push("gantt-task-atividade");
      if (task.item_type === "tarefa") classes.push("gantt-task-tarefa");

      // Destacar atrasadas
      if (task.end_date < new Date() && task.progress < 1) {
        classes.push("gantt-task-overdue");
      }

      // Destacar críticas
      if (task.critical) {
        classes.push("gantt-task-critical");
      }

      return classes.join(" ");
    };

    // Template da barra de progresso - vazio (sem porcentagem)
    gantt.templates.progress_text = function (start, end, task) {
      return "";
    };

    // Template do texto da tarefa na barra - vazio para não duplicar
    gantt.templates.task_text = function (start, end, task) {
      return "";
    };

    // Tooltip customizado
    gantt.templates.tooltip_text = function (start, end, task) {
      const statusMap = {
        nao_iniciado: "Não Iniciado",
        em_andamento: "Em Andamento",
        concluido: "Concluído",
        pausado: "Pausado",
        cancelado: "Cancelado",
        bloqueado: "Bloqueado",
      };

      return `<div style="padding: 10px; min-width: 250px;">
        <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px;">${
          task.text
        }</div>
        <div style="font-size: 12px;">
          <div style="margin: 4px 0;"><b>Tipo:</b> ${
            task.item_type || "-"
          }</div>
          <div style="margin: 4px 0;"><b>Responsável:</b> ${
            task.responsible || "-"
          }</div>
          <div style="margin: 4px 0;"><b>Status:</b> ${
            statusMap[task.status] || task.status
          }</div>
          <div style="margin: 4px 0;"><b>Progresso:</b> ${Math.round(
            task.progress * 100
          )}%</div>
          <div style="margin: 4px 0;"><b>Duração:</b> ${
            task.duration
          } dias</div>
          <div style="margin: 4px 0;"><b>Início:</b> ${gantt.date.date_to_str(
            "%d/%m/%Y"
          )(start)}</div>
          <div style="margin: 4px 0;"><b>Fim:</b> ${gantt.date.date_to_str(
            "%d/%m/%Y"
          )(end)}</div>
          ${
            task.budget
              ? `<div style="margin: 4px 0;"><b>Orçamento:</b> R$ ${parseFloat(
                  task.budget
                ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>`
              : ""
          }
          ${
            task.description
              ? `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #ddd;">${task.description}</div>`
              : ""
          }
        </div>
      </div>`;
    };

    // Template de tooltip para links (setas de dependência)
    gantt.templates.link_description = function (link) {
      const typeLabels = {
        0: "Término → Início (FS)",
        1: "Início → Início (SS)",
        2: "Término → Término (FF)",
        3: "Início → Término (SF)",
      };
      return `<b>Dependência:</b> ${typeLabels[link.type] || "Desconhecida"}`;
    };

    // Linha "Hoje"
    gantt.plugins({
      marker: true,
      tooltip: true,
      critical_path: true,
    });

    const dateToStr = gantt.date.date_to_str(gantt.config.task_date);
    const today = new Date();
    gantt.addMarker({
      start_date: today,
      css: "today-thick",
      text: "",
      title: "Hoje: " + dateToStr(today),
    });

    // Eventos de mudança (se não for readonly)
    if (!readonly) {
      gantt.attachEvent("onAfterTaskUpdate", function (id, item) {
        handleTaskUpdate(id, item);
      });

      gantt.attachEvent("onAfterTaskDrag", function (id, mode, task) {
        handleTaskUpdate(id, task);
      });
    }
  };

  const loadGanttData = async () => {
    try {
      setLoading(true);

      // Buscar dados otimizados do Gantt (já vem formatado do backend)
      const ganttResponse = await eapAPI.getGanttData(projectId);

      console.log("📊 Gantt Response:", ganttResponse);

      // Extrair dados
      const ganttData =
        ganttResponse?.content || ganttResponse?.data || ganttResponse;

      if (!ganttData || !ganttData.tasks) {
        console.error("❌ Dados do Gantt inválidos:", ganttData);
        setLoading(false);
        return;
      }

      // Preparar dados para o Gantt Chart
      const chartData = {
        data: ganttData.tasks,
        links: ganttData.links || [],
      };

      console.log("✅ Dados do Gantt carregados:", chartData);
      console.log("📊 Estatísticas:", ganttData.statistics);

      // Atualizar estatísticas com dados do backend
      if (ganttData.statistics) {
        setStats({
          totalTasks: ganttData.statistics.total_tasks || 0,
          completed: ganttData.statistics.completed || 0,
          inProgress: ganttData.statistics.in_progress || 0,
          notStarted: ganttData.statistics.not_started || 0,
          overdue: ganttData.statistics.overdue || 0,
        });
      }

      // Aplicar filtro de status
      const filteredData = applyStatusFilter(chartData, filterStatus);
      gantt.parse(filteredData);

      setLoading(false);
    } catch (error) {
      console.error("❌ Erro ao carregar dados do Gantt:", error);
      setLoading(false);
    }
  };

  const applyStatusFilter = (chartData, status) => {
    if (status === "all") {
      return chartData; // Sem filtro, retorna tudo
    }

    // Função auxiliar para verificar se uma tarefa corresponde ao filtro
    const matchesFilter = (task) => {
      if (status === "atrasado") {
        // Tarefas atrasadas: data de fim passou e progresso < 100%
        const endDate = new Date(task.start_date);
        endDate.setDate(endDate.getDate() + task.duration);
        return endDate < new Date() && task.progress < 1;
      }
      // Filtra por status específico
      return task.status === status;
    };

    // IDs das tarefas que correspondem ao filtro
    const matchingIds = new Set();
    chartData.data.forEach((task) => {
      if (matchesFilter(task)) {
        matchingIds.add(task.id);
      }
    });

    // Se não encontrou nenhuma tarefa, retorna vazio
    if (matchingIds.size === 0) {
      console.log(`⚠️ Nenhuma tarefa encontrada com status: ${status}`);
      return {
        data: [],
        links: [],
      };
    }

    // Incluir também todos os ancestrais (pais) das tarefas filtradas
    // para manter a hierarquia da árvore
    const tasksToShow = new Set(matchingIds);

    chartData.data.forEach((task) => {
      if (matchingIds.has(task.id)) {
        // Adicionar todos os pais desta tarefa
        let currentParent = task.parent;
        while (currentParent && currentParent !== 0) {
          tasksToShow.add(currentParent);
          // Buscar o pai do pai
          const parentTask = chartData.data.find((t) => t.id === currentParent);
          currentParent = parentTask ? parentTask.parent : null;
        }
      }
    });

    const filteredTasks = chartData.data.filter((task) =>
      tasksToShow.has(task.id)
    );

    console.log(
      `✅ Filtro "${status}" aplicado: ${matchingIds.size} tarefas encontradas, ${filteredTasks.length} itens exibidos (com hierarquia)`
    );

    return {
      data: filteredTasks,
      links: chartData.links || [],
    };
  };

  const calculateStats = (tasks) => {
    const stats = {
      totalTasks: tasks.length,
      completed: tasks.filter((t) => t.status === "concluido").length,
      inProgress: tasks.filter((t) => t.status === "em_andamento").length,
      notStarted: tasks.filter((t) => t.status === "nao_iniciado").length,
      overdue: tasks.filter((t) => {
        const endDate = new Date(t.start_date);
        endDate.setDate(endDate.getDate() + t.duration);
        return endDate < new Date() && t.progress < 1;
      }).length,
    };
    setStats(stats);
  };

  const handleTaskUpdate = async (id, task) => {
    try {
      // Atualizar no backend
      await fetch(`/api/eap/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_date: task.start_date,
          end_date: task.end_date,
          progress: Math.round(task.progress * 100),
          duration: task.duration,
        }),
      });
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };

  const handleZoom = (level) => {
    setZoomLevel(level);
    switch (level) {
      case "hour":
        gantt.config.scale_unit = "day";
        gantt.config.date_scale = "%d %M";
        gantt.config.scale_height = 60;
        gantt.config.subscales = [{ unit: "hour", step: 1, date: "%H:%i" }];
        break;
      case "day":
        gantt.config.scale_unit = "week";
        gantt.config.date_scale = "Semana #%W";
        gantt.config.scale_height = 60;
        gantt.config.subscales = [{ unit: "day", step: 1, date: "%d %M" }];
        break;
      case "week":
        gantt.config.scale_unit = "month";
        gantt.config.date_scale = "%F %Y";
        gantt.config.scale_height = 60;
        gantt.config.subscales = [{ unit: "week", step: 1, date: "Sem #%W" }];
        break;
      case "month":
        gantt.config.scale_unit = "year";
        gantt.config.date_scale = "%Y";
        gantt.config.scale_height = 60;
        gantt.config.subscales = [{ unit: "month", step: 1, date: "%M" }];
        break;
    }
    gantt.render();
  };

  const handleRefresh = () => {
    loadGanttData();
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        // Entrar em tela cheia
        await fullscreenRef.current?.requestFullscreen();
      } else {
        // Sair da tela cheia
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Erro ao alternar tela cheia:", error);
    }
  };

  return (
    <div
      ref={fullscreenRef}
      className={`w-full h-full flex flex-col bg-white rounded-lg shadow-lg ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      {/* Header com Controles */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Cronograma Gantt
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Visualização hierárquica do projeto
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              title={isFullscreen ? "Sair da tela cheia" : "Ver em tela cheia"}
            >
              <Maximize2 className="w-4 h-4" />
              <span className="text-sm font-medium">
                {isFullscreen ? "Sair" : "Tela Cheia"}
              </span>
            </button>
            <button
              onClick={handleRefresh}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              title="Atualizar dados"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-medium">Atualizar</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-3">
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Total de Tarefas</div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalTasks}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 shadow-sm border border-green-200">
            <div className="text-xs text-green-600 mb-1">Concluídas</div>
            <div className="text-2xl font-bold text-green-700">
              {stats.completed}
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 shadow-sm border border-blue-200">
            <div className="text-xs text-blue-600 mb-1">Em Andamento</div>
            <div className="text-2xl font-bold text-blue-700">
              {stats.inProgress}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 shadow-sm border border-gray-200">
            <div className="text-xs text-gray-600 mb-1">Não Iniciadas</div>
            <div className="text-2xl font-bold text-gray-700">
              {stats.notStarted}
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-3 shadow-sm border border-red-200">
            <div className="text-xs text-red-600 mb-1">Atrasadas</div>
            <div className="text-2xl font-bold text-red-700">
              {stats.overdue}
            </div>
          </div>
        </div>

        {/* Controles de Zoom e Filtros */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Visualização:
            </span>
            <div className="flex bg-white rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => handleZoom("day")}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  zoomLevel === "day"
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Dia
              </button>
              <button
                onClick={() => handleZoom("week")}
                className={`px-3 py-1.5 text-sm font-medium transition-colors border-l border-gray-300 ${
                  zoomLevel === "week"
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => handleZoom("month")}
                className={`px-3 py-1.5 text-sm font-medium transition-colors border-l border-gray-300 ${
                  zoomLevel === "month"
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Mês
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Filtrar Status:
            </span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="nao_iniciado">Não Iniciados</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluido">Concluídos</option>
              <option value="pausado">Pausados</option>
              <option value="atrasado">Atrasados</option>
            </select>

            {/* Indicador de filtro ativo */}
            {filterStatus !== "all" && (
              <button
                onClick={() => setFilterStatus("all")}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors flex items-center gap-1"
                title="Limpar filtro"
              >
                <Filter className="w-3 h-3" />
                Filtro ativo
                <span className="ml-1 text-blue-900">×</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Gantt Chart Container */}
      <div className="flex-1 relative overflow-auto">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">
                Carregando cronograma...
              </p>
            </div>
          </div>
        )}

        {/* Mensagem quando filtro não encontra resultados */}
        {!loading && stats.totalTasks > 0 && filterStatus !== "all" && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-blue-100 border border-blue-300 rounded-lg px-4 py-2 shadow-lg">
              <p className="text-sm text-blue-800 font-medium">
                🔍 Mostrando apenas:{" "}
                <span className="font-bold">
                  {filterStatus === "atrasado"
                    ? "Atrasados"
                    : filterStatus.replace("_", " ")}
                </span>
              </p>
            </div>
          </div>
        )}

        <div
          ref={ganttContainer}
          className="w-full h-full"
          style={{
            minHeight: isFullscreen ? "calc(100vh - 300px)" : "600px",
            height: isFullscreen ? "calc(100vh - 300px)" : "auto",
          }}
        />
      </div>

      {/* Legenda */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-700">Legenda:</span>
            <div className="flex items-center gap-1">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: "#3b82f6" }}
              ></div>
              <span className="text-gray-600">Fase</span>
            </div>
            <div className="flex items-center gap-1">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: "#10b981" }}
              ></div>
              <span className="text-gray-600">Entrega</span>
            </div>
            <div className="flex items-center gap-1">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: "#8b5cf6" }}
              ></div>
              <span className="text-gray-600">Atividade</span>
            </div>
            <div className="flex items-center gap-1">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: "#f59e0b" }}
              ></div>
              <span className="text-gray-600">Tarefa</span>
            </div>
            <div className="flex items-center gap-1">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: "#ef4444" }}
              ></div>
              <span className="text-gray-600">Atrasada</span>
            </div>
          </div>

          <div className="text-gray-500">
            {readonly
              ? "👁️ Modo visualização"
              : "✏️ Modo edição - Arraste para alterar"}
          </div>
        </div>
      </div>
    </div>
  );
}
