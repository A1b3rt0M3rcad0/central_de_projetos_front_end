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
  DollarSign,
  Layers,
  Loader2,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  User,
  X,
  AlertTriangle,
  Info,
  TreePine,
  Calendar,
  FileText,
  BarChart3,
} from "lucide-react";

/**
 * EAP - ESTRUTURA ANALÍTICA DO PROJETO (Versão Acadêmica)
 * 
 * Esta página foca EXCLUSIVAMENTE na decomposição do escopo do projeto.
 * Seguindo padrões PMBoK, a EAP aqui é uma ferramenta de PLANEJAMENTO.
 * 
 * O QUE MOSTRA:
 * ✅ Hierarquia (Fase → Entrega → Atividade → Tarefa)
 * ✅ Códigos WBS
 * ✅ Descrições e responsáveis
 * ✅ Orçamento PLANEJADO
 * ✅ Prazos PLANEJADOS
 * 
 * O QUE NÃO MOSTRA (pertence ao Gantt/Acompanhamento):
 * ❌ Progresso de execução
 * ❌ Status atual
 * ❌ Valor executado
 * ❌ Atrasos
 * 
 * Para acompanhamento de execução, use:
 * - Gantt: Visualização cronológica
 * - Acompanhamento: Visão executiva de progresso
 */

export default function EAPStructurePage() {
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
  const [showEditEAPModal, setShowEditEAPModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [parentItem, setParentItem] = useState(null);
  const [expandedItems, setExpandedItems] = useState([]);
  const [notification, setNotification] = useState(null);
  const [deleteConfirmData, setDeleteConfirmData] = useState(null);

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

  const formatCurrency = (value) => {
    if (!value && value !== 0) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  // Função para alternar expansão de itens
  const toggleExpand = (itemId) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Função para verificar se item tem filhos
  const hasChildren = (item) => {
    if (!eapData?.items) return false;
    return eapData.items.some((i) => i.parent_id === item.id);
  };

  // Função para obter filhos de um item
  const getChildren = (parentId) => {
    if (!eapData?.items) return [];
    return eapData.items.filter((item) => item.parent_id === parentId);
  };

  // Função para calcular orçamento total de um item (incluindo filhos)
  const calculateTotalBudget = (item) => {
    const children = getChildren(item.id);
    if (children.length === 0) {
      return item.budget || 0;
    }
    return children.reduce((sum, child) => sum + calculateTotalBudget(child), 0);
  };

  // Função para renderizar item da estrutura
  const renderStructureItem = (item, level = 0) => {
    const children = getChildren(item.id);
    const isExpanded = expandedItems.includes(item.id);
    const itemHasChildren = children.length > 0;
    const totalBudget = calculateTotalBudget(item);

    // Cores por tipo
    const typeColors = {
      FASE: "bg-blue-50 border-blue-200 text-blue-700",
      ENTREGA: "bg-green-50 border-green-200 text-green-700",
      ATIVIDADE: "bg-amber-50 border-amber-200 text-amber-700",
      TAREFA: "bg-gray-50 border-gray-200 text-gray-700",
    };

    const typeIcons = {
      FASE: <Layers className="w-4 h-4" />,
      ENTREGA: <FileText className="w-4 h-4" />,
      ATIVIDADE: <BarChart3 className="w-4 h-4" />,
      TAREFA: <TreePine className="w-4 h-4" />,
    };

    return (
      <div key={item.id} className="relative">
        {/* Linha do Item */}
        <div
          className={`border rounded-lg p-4 mb-2 transition-all hover:shadow-md ${
            typeColors[item.item_type] || "bg-white border-gray-200"
          }`}
          style={{ marginLeft: `${level * 32}px` }}
        >
          <div className="flex items-start justify-between gap-4">
            {/* Esquerda: Expansão + Info */}
            <div className="flex items-start gap-3 flex-1">
              {/* Botão de expansão */}
              {itemHasChildren ? (
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="p-1 hover:bg-white/50 rounded transition-colors mt-0.5"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </button>
              ) : (
                <div className="w-7" />
              )}

              {/* Ícone do tipo */}
              <div className="mt-0.5">{typeIcons[item.item_type]}</div>

              {/* Informações principais */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <code className="text-xs font-mono bg-white/70 px-2 py-0.5 rounded">
                    {item.wbs_code}
                  </code>
                  <span className="text-xs font-medium uppercase tracking-wide opacity-70">
                    {item.item_type}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>

                {/* Metadados */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span>{item.responsible_name || "-"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatDate(item.start_date)} → {formatDate(item.end_date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(totalBudget)}
                    </span>
                    {itemHasChildren && (
                      <span className="text-xs text-gray-500">(total com filhos)</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Direita: Ações */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedItem(item);
                  setShowItemModal(true);
                }}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                title="Editar item"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setDeleteConfirmData({
                    type: "item",
                    id: item.id,
                    name: item.name,
                  });
                  setShowDeleteConfirmModal(true);
                }}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                title="Excluir item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setParentItem(item);
                  setSelectedItem(null);
                  setShowItemModal(true);
                }}
                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                title="Adicionar sub-item"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filhos (recursivo) */}
        {isExpanded && children.length > 0 && (
          <div className="ml-4">
            {children.map((child) => renderStructureItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Calcular estatísticas da estrutura
  const calculateStructureStats = () => {
    if (!eapData?.items) return { total: 0, fases: 0, entregas: 0, atividades: 0, tarefas: 0, totalBudget: 0 };

    const stats = {
      total: eapData.items.length,
      fases: eapData.items.filter((i) => i.item_type === "FASE").length,
      entregas: eapData.items.filter((i) => i.item_type === "ENTREGA").length,
      atividades: eapData.items.filter((i) => i.item_type === "ATIVIDADE").length,
      tarefas: eapData.items.filter((i) => i.item_type === "TAREFA").length,
      totalBudget: 0,
    };

    // Calcula orçamento total (apenas itens raiz)
    const rootItems = eapData.items.filter((i) => !i.parent_id);
    stats.totalBudget = rootItems.reduce((sum, item) => sum + calculateTotalBudget(item), 0);

    return stats;
  };

  const stats = calculateStructureStats();

  if (loading) {
    return (
      <BasePage>
        <BaseContent>
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        </BaseContent>
      </BasePage>
    );
  }

  return (
    <BasePage>
      <BaseContent>
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Network className="w-8 h-8 text-blue-600" />
                Estrutura Analítica do Projeto (EAP)
              </h1>
              <p className="text-gray-600 mt-1">
                Decomposição hierárquica do escopo do projeto
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/projetos/${id}/gantt`)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Ver Cronograma
              </button>
              <button
                onClick={() => navigate(`/projetos/${id}/acompanhamento`)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Ver Acompanhamento
              </button>
            </div>
          </div>

          {/* Info Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-900 mb-1">
                📋 EAP - Ferramenta de Planejamento
              </h4>
              <p className="text-sm text-blue-700">
                Esta página mostra a <strong>estrutura planejada</strong> do projeto (escopo, orçamentos, prazos).
                Para acompanhar o <strong>progresso e status de execução</strong>, acesse o Cronograma Gantt ou Acompanhamento.
              </p>
            </div>
          </div>
        </div>

        {/* Estatísticas da Estrutura */}
        {eapData && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total de Itens</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-700">{stats.fases}</div>
              <div className="text-sm text-blue-600">Fases</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-700">{stats.entregas}</div>
              <div className="text-sm text-green-600">Entregas</div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-amber-700">{stats.atividades}</div>
              <div className="text-sm text-amber-600">Atividades</div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-700">{stats.tarefas}</div>
              <div className="text-sm text-gray-600">Tarefas</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="text-xl font-bold text-purple-700">{formatCurrency(stats.totalBudget)}</div>
              <div className="text-sm text-purple-600">Orçamento Total</div>
            </div>
          </div>
        )}

        {/* Conteúdo Principal */}
        {!eapData ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Network className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma EAP criada para este projeto
            </h3>
            <p className="text-gray-600 mb-6">
              Crie a estrutura analítica para organizar o escopo do projeto
            </p>
            <button
              onClick={() => setShowCreateEAPModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Criar EAP
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {/* Header da EAP */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{eapData.name}</h2>
                <p className="text-gray-600">{eapData.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowEditEAPModal(true)}
                  className="px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Editar EAP
                </button>
                <button
                  onClick={() => {
                    setParentItem(null);
                    setSelectedItem(null);
                    setShowItemModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Item Raiz
                </button>
              </div>
            </div>

            {/* Estrutura Hierárquica */}
            <div className="space-y-2">
              {eapData.items
                .filter((item) => !item.parent_id)
                .map((item) => renderStructureItem(item))}
            </div>

            {eapData.items.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <TreePine className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum item na estrutura. Adicione itens para começar.</p>
              </div>
            )}
          </div>
        )}
      </BaseContent>
    </BasePage>
  );
}

