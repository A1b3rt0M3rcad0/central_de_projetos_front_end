import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import BasePage from "../../components/layout/BasePage";
import BaseContent from "../../components/BaseContent";
import eapService from "../../services/api/eap";
import { useAuth } from "../../hooks/useAuth";
import {
  Network,
  Plus,
  Download,
  TrendingUp,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  BarChart3,
  FileText,
  Layers,
  Loader2,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  Clock,
  User,
  X,
} from "lucide-react";

export default function EAPPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const project = location.state?.project;
  const { user } = useAuth();

  const [eapData, setEapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCreateEAPModal, setShowCreateEAPModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [parentItem, setParentItem] = useState(null);
  const [expandedItems, setExpandedItems] = useState([]);

  // Carregar dados da EAP do projeto
  useEffect(() => {
    loadProjectEAP();
  }, [id]);

  const loadProjectEAP = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eapService.getProjectEAP(id);

      if (response.eap) {
        setEapData(response.eap);
        // Expandir automaticamente os primeiros níveis
        if (response.eap.items && response.eap.items.length > 0) {
          const firstLevelIds = response.eap.items
            .filter((item) => !item.parent_id)
            .map((item) => item.id);
          setExpandedItems(firstLevelIds);
        }
      } else {
        setEapData(null);
      }
    } catch (err) {
      console.error("Erro ao carregar EAP:", err);
      if (err.response?.status === 404) {
        setEapData(null);
      } else {
        setError("Erro ao carregar EAP do projeto");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEAP = async (eapData) => {
    try {
      if (!user?.cpf) {
        alert("Erro: Usuário não autenticado");
        return;
      }

      const newEAP = await eapService.createEAP({
        name: eapData.name,
        description: eapData.description,
        project_id: parseInt(id),
        created_by: user.cpf,
        template_source_id: eapData.template_source_id || null,
        is_template: false,
      });

      setEapData(newEAP.eap);
      setShowCreateEAPModal(false);
      await loadProjectEAP();
    } catch (err) {
      console.error("Erro ao criar EAP:", err);
      alert("Erro ao criar EAP: " + (err.response?.data?.error || err.message));
    }
  };

  const handleAddItem = (parent = null) => {
    setParentItem(parent);
    setSelectedItem(null);
    setShowItemModal(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setParentItem(null);
    setShowItemModal(true);
  };

  const handleSaveItem = async (itemData) => {
    try {
      // Se o item tem ID, é uma atualização, senão é criação
      if (itemData.id) {
        // Atualizar item existente
        await eapService.updateItem(itemData.id, itemData);
      } else {
        // Criar novo item
        await eapService.createItem({
          ...itemData,
          eap_id: eapData.id,
        });
      }

      await loadProjectEAP();
      setShowItemModal(false);
      setSelectedItem(null);
      setParentItem(null);
    } catch (err) {
      console.error("Erro ao salvar item:", err);
      alert(
        "Erro ao salvar item: " + (err.response?.data?.error || err.message)
      );
    }
  };

  // Calcula o progresso real de um item baseado nos filhos
  const calculateItemProgress = (item) => {
    // Se não tem filhos, usa o progresso próprio
    if (!item.children || item.children.length === 0) {
      return item.progress || 0;
    }

    // Se tem filhos, calcula a média do progresso dos filhos
    const childrenProgress = item.children.map((child) =>
      calculateItemProgress(child)
    );
    const avgChildrenProgress =
      childrenProgress.reduce((sum, p) => sum + p, 0) / childrenProgress.length;
    return Math.round(avgChildrenProgress);
  };

  const calculateStats = () => {
    if (!eapData || !eapData.items) {
      return {
        totalBudget: 0,
        totalItems: 0,
        completedItems: 0,
        inProgressItems: 0,
        notStartedItems: 0,
        avgProgress: 0,
        fases: 0,
        entregas: 0,
        atividades: 0,
        tarefas: 0,
      };
    }

    const allItems = [];
    const flattenItems = (items) => {
      items.forEach((item) => {
        allItems.push(item);
        if (item.children) flattenItems(item.children);
      });
    };
    flattenItems(eapData.items);

    const totalBudget = allItems.reduce(
      (sum, item) => sum + parseFloat(item.budget || 0),
      0
    );
    const totalItems = allItems.length;
    const completedItems = allItems.filter(
      (item) => item.status === "concluido"
    ).length;
    const inProgressItems = allItems.filter(
      (item) => item.status === "em_andamento"
    ).length;
    const notStartedItems = allItems.filter(
      (item) => item.status === "nao_iniciado"
    ).length;

    // Progresso geral baseado apenas nos itens de alto nível (raiz)
    const rootItems = eapData.items || [];
    const avgProgress =
      rootItems.length > 0
        ? rootItems.reduce(
            (sum, item) => sum + calculateItemProgress(item),
            0
          ) / rootItems.length
        : 0;

    const fases = allItems.filter((item) => item.type === "fase").length;
    const entregas = allItems.filter((item) => item.type === "entrega").length;
    const atividades = allItems.filter(
      (item) => item.type === "atividade"
    ).length;
    const tarefas = allItems.filter((item) => item.type === "tarefa").length;

    return {
      totalBudget,
      totalItems,
      completedItems,
      inProgressItems,
      notStartedItems,
      avgProgress: Math.round(avgProgress),
      fases,
      entregas,
      atividades,
      tarefas,
    };
  };

  const stats = calculateStats();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const toggleExpand = (itemId) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Loading
  if (loading) {
    return (
      <BasePage pageTitle="">
        <BaseContent
          pageTitle={`📑 EAP - ${project?.name || "Carregando..."}`}
          onBack={() =>
            navigate("/projectpage", { state: { initial_date: project } })
          }
        >
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Carregando EAP do projeto...</p>
            </div>
          </div>
        </BaseContent>
      </BasePage>
    );
  }

  // Sem EAP
  if (!eapData) {
    return (
      <BasePage pageTitle="">
        <BaseContent
          pageTitle={`📑 EAP - ${project?.name || ""}`}
          onBack={() =>
            navigate("/projectpage", { state: { initial_date: project } })
          }
        >
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-center max-w-md">
              <div className="bg-indigo-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Network className="w-12 h-12 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Este projeto ainda não possui uma EAP
              </h2>
              <p className="text-gray-600 mb-6">
                Crie uma Estrutura Analítica do Projeto para organizar as fases,
                entregas e atividades de forma hierárquica.
              </p>
              <button
                onClick={() => setShowCreateEAPModal(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Criar EAP
              </button>
            </div>
          </div>

          {showCreateEAPModal && (
            <CreateEAPModal
              projectName={project?.name}
              onClose={() => setShowCreateEAPModal(false)}
              onSave={handleCreateEAP}
            />
          )}
        </BaseContent>
      </BasePage>
    );
  }

  return (
    <BasePage pageTitle="">
      <BaseContent
        pageTitle={
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>{eapData.name || project?.name}</span>
          </div>
        }
        onBack={() =>
          navigate("/projectpage", { state: { initial_date: project } })
        }
        breadcrumbs={[
          { label: "Projetos", onClick: () => navigate("/projectlistpage") },
          {
            label: project?.name || "Projeto",
            onClick: () =>
              navigate("/projectpage", { state: { initial_date: project } }),
          },
          { label: "EAP" },
        ]}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <Network className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    {eapData.name || "Estrutura Analítica do Projeto"}
                  </h1>
                  <p className="text-indigo-100 mt-1">
                    {eapData.description ||
                      "Visualização e gerenciamento hierárquico"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowItemModal(true)}
                  className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Nova Fase
                </button>
                <button className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors font-medium">
                  <Download className="w-5 h-5" />
                  Exportar
                </button>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Progresso Geral"
              value={`${stats.avgProgress}%`}
              icon={<TrendingUp className="w-5 h-5" />}
              color="blue"
              subtitle={`${stats.completedItems} de ${stats.totalItems} itens concluídos`}
              progress={stats.avgProgress}
            />

            <BudgetCard
              totalBudget={stats.totalBudget}
              projectBudget={eapData?.project_budget}
              formatCurrency={formatCurrency}
            />

            <StatCard
              title="Estrutura"
              value={stats.fases}
              icon={<Layers className="w-5 h-5" />}
              color="purple"
              subtitle={`${stats.entregas} entregas • ${stats.atividades} atividades`}
              label="Fases"
            />

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">Status</h3>
                <div className="p-2 bg-amber-100 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <div className="space-y-2">
                <StatusRow
                  icon={CheckCircle}
                  color="green"
                  label="Concluídos"
                  value={stats.completedItems}
                />
                <StatusRow
                  icon={AlertCircle}
                  color="blue"
                  label="Em andamento"
                  value={stats.inProgressItems}
                />
                <StatusRow
                  icon={Calendar}
                  color="gray"
                  label="Não iniciados"
                  value={stats.notStartedItems}
                />
              </div>
            </div>
          </div>

          {/* Árvore do EAP */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Estrutura Hierárquica
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandedItems([])}
                    className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Colapsar Tudo
                  </button>
                  <button
                    onClick={() => {
                      const allIds = [];
                      const collectIds = (items) => {
                        items.forEach((item) => {
                          allIds.push(item.id);
                          if (item.children) collectIds(item.children);
                        });
                      };
                      collectIds(eapData.items || []);
                      setExpandedItems(allIds);
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Expandir Tudo
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {eapData.items && eapData.items.length > 0 ? (
                <div className="space-y-2">
                  {eapData.items
                    .filter((item) => !item.parent_id)
                    .map((item) => (
                      <EAPTreeItem
                        key={item.id}
                        item={item}
                        level={0}
                        isExpanded={expandedItems.includes(item.id)}
                        onToggle={() => toggleExpand(item.id)}
                        onEdit={() => handleEditItem(item)}
                        onDelete={() => alert(`Deletar ${item.name}`)}
                        onAddChild={() => handleAddItem(item)}
                        handleEditItem={handleEditItem}
                        handleAddItem={handleAddItem}
                        expandedItems={expandedItems}
                        toggleExpand={toggleExpand}
                        formatCurrency={formatCurrency}
                        formatDate={formatDate}
                      />
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Nenhum item adicionado ainda
                  </p>
                  <button
                    onClick={() => setShowItemModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Primeira Fase
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Legenda */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Legenda</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <LegendItem
                emoji="📋"
                title="Fase"
                description="Agrupamento principal"
                color="blue"
              />
              <LegendItem
                emoji="📦"
                title="Entrega"
                description="Resultado esperado"
                color="green"
              />
              <LegendItem
                emoji="✅"
                title="Atividade"
                description="Tarefa executável"
                color="purple"
              />
              <LegendItem
                emoji="📝"
                title="Tarefa"
                description="Menor unidade"
                color="amber"
              />
            </div>
          </div>
        </div>

        {/* Modals */}
        {showItemModal && (
          <EAPItemModal
            item={selectedItem}
            parentItem={parentItem}
            onClose={() => {
              setShowItemModal(false);
              setSelectedItem(null);
              setParentItem(null);
            }}
            onSave={handleSaveItem}
          />
        )}

        {showCreateEAPModal && (
          <CreateEAPModal
            projectName={project?.name}
            onClose={() => setShowCreateEAPModal(false)}
            onSave={handleCreateEAP}
          />
        )}
      </BaseContent>
    </BasePage>
  );
}

// Componente de Card de Orçamento
function BudgetCard({ totalBudget, projectBudget, formatCurrency }) {
  const hasProjectBudget =
    projectBudget !== null && projectBudget !== undefined;
  const isOverBudget = hasProjectBudget && totalBudget > projectBudget;
  const percentage = hasProjectBudget ? (totalBudget / projectBudget) * 100 : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">Orçamento</h3>
        <div
          className={`p-2 rounded-lg ${
            isOverBudget ? "bg-red-100" : "bg-green-100"
          }`}
        >
          <DollarSign
            className={`w-5 h-5 ${
              isOverBudget ? "text-red-600" : "text-green-600"
            }`}
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-3xl font-bold text-gray-900">
          {formatCurrency(totalBudget)}
        </div>
        {hasProjectBudget ? (
          <>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  isOverBudget ? "bg-red-500" : "bg-green-500"
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <p className="text-sm">
              <span className="text-gray-600">
                de {formatCurrency(projectBudget)}
              </span>
              {isOverBudget && (
                <span className="text-red-600 font-semibold ml-1">
                  (+{formatCurrency(totalBudget - projectBudget)})
                </span>
              )}
              {!isOverBudget && (
                <span className="text-green-600 font-semibold ml-1">
                  (resta {formatCurrency(projectBudget - totalBudget)})
                </span>
              )}
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-600">Distribuído no EAP</p>
        )}
      </div>
    </div>
  );
}

// Componente de Card de Estatística
function StatCard({ title, value, icon, color, subtitle, progress, label }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    amber: "bg-amber-100 text-amber-600",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold text-gray-900">{value}</div>
          {label && <span className="text-sm text-gray-600">{label}</span>}
        </div>
        {progress !== undefined && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
}

// Componente de Linha de Status
function StatusRow({ icon: Icon, color, label, value }) {
  const colorClasses = {
    green: "text-green-600",
    blue: "text-blue-600",
    gray: "text-gray-400",
  };

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600 flex items-center gap-2">
        <Icon className={`w-4 h-4 ${colorClasses[color]}`} />
        {label}
      </span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

// Componente de Item da Legenda
function LegendItem({ emoji, title, description, color }) {
  const colorClasses = {
    blue: "bg-blue-100",
    green: "bg-green-100",
    purple: "bg-purple-100",
    amber: "bg-amber-100",
  };

  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 ${colorClasses[color]} rounded-lg flex items-center justify-center text-2xl`}
      >
        {emoji}
      </div>
      <div>
        <div className="font-medium text-gray-900">{title}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
    </div>
  );
}

// Componente de Item da Árvore EAP
function EAPTreeItem({
  item,
  level,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  onAddChild,
  handleEditItem,
  handleAddItem,
  expandedItems,
  toggleExpand,
  formatCurrency,
  formatDate,
}) {
  const hasChildren = item.children && item.children.length > 0;

  // Calcula o progresso real do item
  const calculateProgress = (currentItem) => {
    if (!currentItem.children || currentItem.children.length === 0) {
      return currentItem.progress || 0;
    }
    const childrenProgress = currentItem.children.map((child) =>
      calculateProgress(child)
    );
    return Math.round(
      childrenProgress.reduce((sum, p) => sum + p, 0) / childrenProgress.length
    );
  };

  const actualProgress = calculateProgress(item);

  const typeConfig = {
    fase: { emoji: "📋", color: "bg-blue-50 border-blue-200 text-blue-700" },
    entrega: {
      emoji: "📦",
      color: "bg-green-50 border-green-200 text-green-700",
    },
    atividade: {
      emoji: "✅",
      color: "bg-purple-50 border-purple-200 text-purple-700",
    },
    tarefa: {
      emoji: "📝",
      color: "bg-amber-50 border-amber-200 text-amber-700",
    },
  };

  const statusConfig = {
    nao_iniciado: { label: "Não Iniciado", color: "bg-gray-100 text-gray-700" },
    em_andamento: { label: "Em Andamento", color: "bg-blue-100 text-blue-700" },
    concluido: { label: "Concluído", color: "bg-green-100 text-green-700" },
    pausado: { label: "Pausado", color: "bg-yellow-100 text-yellow-700" },
    cancelado: { label: "Cancelado", color: "bg-red-100 text-red-700" },
    bloqueado: { label: "Bloqueado", color: "bg-purple-100 text-purple-700" },
  };

  const config = typeConfig[item.type] || typeConfig.fase;
  const statusInfo = statusConfig[item.status] || statusConfig.nao_iniciado;

  return (
    <div className="space-y-2">
      <div
        className={`border rounded-xl p-4 hover:shadow-md transition-all ${config.color}`}
        style={{ marginLeft: `${level * 24}px` }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            {hasChildren && (
              <button
                onClick={onToggle}
                className="mt-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
            )}

            <div className="text-2xl mt-1">{config.emoji}</div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-sm font-semibold">
                  {item.code}
                </span>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {item.name}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                >
                  {statusInfo.label}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-3">{item.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="truncate">{item.responsible}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>
                    {formatDate(item.start_date)} - {formatDate(item.end_date)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold">
                    {formatCurrency(item.budget)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${actualProgress}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    {actualProgress}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onAddChild}
              className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
              title="Adicionar filho"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={onEdit}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
              title="Excluir"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="space-y-2">
          {item.children.map((child) => (
            <EAPTreeItem
              key={child.id}
              item={child}
              level={level + 1}
              isExpanded={expandedItems.includes(child.id)}
              onToggle={() => toggleExpand(child.id)}
              onEdit={() => handleEditItem(child)}
              onDelete={() => alert(`Deletar ${child.name}`)}
              onAddChild={() => handleAddItem(child)}
              handleEditItem={handleEditItem}
              handleAddItem={handleAddItem}
              expandedItems={expandedItems}
              toggleExpand={toggleExpand}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Modal para criar EAP
function CreateEAPModal({ projectName, onClose, onSave }) {
  const [name, setName] = useState(`EAP - ${projectName}`);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({ name, description });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Criar Nova EAP</h2>
          <p className="text-gray-600 mt-1">
            Defina a estrutura analítica do projeto
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da EAP
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Criar EAP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal para criar/editar Item
function EAPItemModal({ item, parentItem, onClose, onSave }) {
  const isEditing = !!item && item.id;
  const isAddingChild = !!parentItem;

  // Calcular código e tipo automaticamente baseado no pai
  const getDefaultCode = () => {
    if (item) return item.code;
    if (parentItem) {
      // Conta quantos filhos o pai já tem
      const childrenCount = (parentItem.children?.length || 0) + 1;
      return `${parentItem.code}.${childrenCount}`;
    }
    return "1";
  };

  const getDefaultType = () => {
    if (item) return item.type;
    if (parentItem) {
      const typeHierarchy = {
        fase: "entrega",
        entrega: "atividade",
        atividade: "tarefa",
        tarefa: "tarefa",
      };
      return typeHierarchy[parentItem.type] || "fase";
    }
    return "fase";
  };

  const [formData, setFormData] = useState({
    id: item?.id || null,
    code: getDefaultCode(),
    name: item?.name || "",
    description: item?.description || "",
    type: getDefaultType(),
    parent_id: parentItem?.id || item?.parent_id || null,
    responsible: item?.responsible || "",
    start_date: item?.start_date
      ? new Date(item.start_date).toISOString().slice(0, 10)
      : "",
    end_date: item?.end_date
      ? new Date(item.end_date).toISOString().slice(0, 10)
      : "",
    budget: item?.budget !== undefined ? item?.budget : "0",
    status: item?.status || "nao_iniciado",
    progress: item?.progress !== undefined ? item?.progress : 0,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debug - verificar quais campos estão vazios
    console.log("FormData ao submeter:", formData);

    // Validação básica
    if (!formData.start_date || !formData.end_date) {
      alert("Por favor, preencha as datas de início e término");
      return;
    }

    setLoading(true);
    try {
      const dataToSave = {
        ...formData,
        budget: parseFloat(formData.budget) || 0,
        progress: parseInt(formData.progress) || 0,
        start_date: new Date(formData.start_date + "T00:00:00").toISOString(),
        end_date: new Date(formData.end_date + "T23:59:59").toISOString(),
      };

      console.log("Dados a serem salvos:", dataToSave);
      await onSave(dataToSave);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 md:p-6 border-b border-gray-200 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                {isEditing
                  ? "Editar Item"
                  : isAddingChild
                  ? `Adicionar em: ${parentItem.name}`
                  : "Nova Fase"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {isEditing
                  ? `Editando: ${item.code} - ${item.name}`
                  : isAddingChild
                  ? `Pai: ${parentItem.code} - ${parentItem.name}`
                  : "Adicione uma nova fase raiz"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6">
          <div className="space-y-4">
            {/* Linha 1: Código e Tipo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ex: 1.1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="fase">📋 Fase</option>
                  <option value="entrega">📦 Entrega</option>
                  <option value="atividade">✅ Atividade</option>
                  <option value="tarefa">📝 Tarefa</option>
                </select>
              </div>
            </div>

            {/* Linha 2: Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Nome do item"
                required
              />
            </div>

            {/* Linha 3: Descrição e Responsável */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={2}
                  placeholder="Descreva o item"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsável <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="responsible"
                  value={formData.responsible}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nome do responsável"
                  required
                />
              </div>
            </div>

            {/* Linha 4: Datas, Orçamento e Status */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Início <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Término <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Orçamento (R$) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="nao_iniciado">Não Iniciado</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="concluido">Concluído</option>
                  <option value="pausado">Pausado</option>
                  <option value="cancelado">Cancelado</option>
                  <option value="bloqueado">Bloqueado</option>
                </select>
              </div>
            </div>

            {/* Linha 5: Progresso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Progresso (%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  value={formData.progress}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      progress: parseInt(e.target.value),
                    }))
                  }
                  className="flex-1"
                  min="0"
                  max="100"
                />
                <input
                  type="number"
                  name="progress"
                  value={formData.progress}
                  onChange={handleChange}
                  className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-center font-semibold"
                  min="0"
                  max="100"
                />
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${formData.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2 text-sm font-medium"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditing ? "Salvar" : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
