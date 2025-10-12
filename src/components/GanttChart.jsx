import { useEffect, useRef, useState } from "react";
import { gantt } from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import {
  Calendar,
  Download,
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
  const [loading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState("day");
  const [filterStatus, setFilterStatus] = useState("all");
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

  const configureGantt = () => {
    // Configurações básicas
    gantt.config.date_format = "%Y-%m-%d";
    gantt.config.xml_date = "%Y-%m-%d";
    gantt.config.readonly = readonly;
    gantt.config.auto_scheduling = false;
    gantt.config.auto_scheduling_strict = false;
    gantt.config.work_time = true;
    gantt.config.skip_off_time = false;

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

      gantt.parse(chartData);

      setLoading(false);
    } catch (error) {
      console.error("❌ Erro ao carregar dados do Gantt:", error);
      setLoading(false);
    }
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

  const exportToPDF = () => {
    gantt.exportToPDF({
      name: `gantt_projeto_${projectId}.pdf`,
      header: `<h3>Cronograma do Projeto - EAP ${eapId}</h3>`,
      footer: `<div style="text-align: center;">Gerado em ${new Date().toLocaleDateString(
        "pt-BR"
      )}</div>`,
    });
  };

  const handleRefresh = () => {
    loadGanttData();
  };

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-lg shadow-lg">
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
              onClick={handleRefresh}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              title="Atualizar dados"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-medium">Atualizar</span>
            </button>

            <button
              onClick={exportToPDF}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              title="Exportar para PDF"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Exportar PDF</span>
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
          </div>
        </div>
      </div>

      {/* Gantt Chart Container */}
      <div className="flex-1 relative overflow-hidden">
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

        <div
          ref={ganttContainer}
          className="w-full h-full"
          style={{ minHeight: "600px" }}
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
