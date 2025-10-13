import { useState, useEffect } from "react";
import {
  Link2,
  X,
  Plus,
  Trash2,
  Info,
  Loader2,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import eapService from "../../services/api/eap";

// Componente de Notificação Toast
function NotificationToast({ message, type, onClose }) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5" />;
      case "error":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  return (
    <div
      className={`${getStyles()} border rounded-lg p-3 shadow-sm flex items-start gap-3`}
    >
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function DependencyModal({
  item,
  eapData,
  onClose,
  onReload,
  notification,
  setNotification,
}) {
  const [dependencies, setDependencies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPredecessor, setSelectedPredecessor] = useState("");
  const [dependencyType, setDependencyType] = useState("FS");
  const [lagDays, setLagDays] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

  // Carregar dependências do item
  useEffect(() => {
    loadDependencies();
  }, [item.id]);

  const loadDependencies = async () => {
    try {
      setLoading(true);
      const response = await eapService.getItemDependencies(item.id);
      const deps = response.content || response;
      setDependencies(deps);
    } catch (error) {
      console.error("Erro ao carregar dependências:", error);
      setDependencies({ predecessors: [], successors: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleAddDependency = async () => {
    if (!selectedPredecessor) {
      setNotification({
        message: "Selecione um item predecessor",
        type: "warning",
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    try {
      setActionLoading(true);

      await eapService.createDependency({
        successor_id: item.id,
        predecessor_id: parseInt(selectedPredecessor),
        dependency_type: dependencyType,
        lag_days: parseInt(lagDays),
      });

      setNotification({
        message: "Dependência adicionada com sucesso!",
        type: "success",
      });
      setTimeout(() => setNotification(null), 3000);

      // Recarregar dependências
      await loadDependencies();
      await onReload();

      // Resetar form
      setSelectedPredecessor("");
      setDependencyType("FS");
      setLagDays(0);
      setShowAddForm(false);
    } catch (error) {
      setNotification({
        message: error.response?.data?.error || "Erro ao adicionar dependência",
        type: "error",
      });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveDependency = async (dependencyId) => {
    try {
      setActionLoading(true);

      await eapService.deleteDependency(dependencyId);

      setNotification({
        message: "Dependência removida com sucesso!",
        type: "success",
      });
      setTimeout(() => setNotification(null), 3000);

      // Recarregar dependências
      await loadDependencies();
      await onReload();
    } catch (error) {
      setNotification({
        message: error.response?.data?.error || "Erro ao remover dependência",
        type: "error",
      });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setActionLoading(false);
    }
  };

  // Função para obter todos os itens disponíveis (achatar hierarquia)
  const getAllAvailableItems = () => {
    const allItems = [];

    const flattenItems = (items) => {
      items.forEach((itm) => {
        allItems.push(itm);
        if (itm.children) {
          flattenItems(itm.children);
        }
      });
    };

    if (eapData?.items) {
      flattenItems(eapData.items);
    }

    // Remover o item atual e seus descendentes
    const descendantIds = new Set();
    const getDescendants = (itm) => {
      if (itm.children) {
        itm.children.forEach((child) => {
          descendantIds.add(child.id);
          getDescendants(child);
        });
      }
    };
    getDescendants(item);

    // Filtrar: não pode ser o próprio item nem seus descendentes
    return allItems.filter(
      (itm) => itm.id !== item.id && !descendantIds.has(itm.id)
    );
  };

  const availableItems = getAllAvailableItems();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <Link2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Gerenciar Dependências
                </h2>
                <p className="text-purple-100 text-sm">
                  {item.code} - {item.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Notificação */}
        {notification && (
          <div className="p-4 border-b border-gray-200">
            <NotificationToast
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification(null)}
            />
          </div>
        )}

        {/* Conteúdo */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Carregando dependências...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Seção: Este item DEPENDE DE */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <span className="bg-blue-100 p-2 rounded-lg">⛓️</span>
                    Este item DEPENDE DE:
                  </h3>
                  {!showAddForm && (
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar
                    </button>
                  )}
                </div>

                {/* Lista de predecessores */}
                {dependencies?.predecessors &&
                dependencies.predecessors.length > 0 ? (
                  <div className="space-y-2">
                    {dependencies.predecessors.map((dep) => (
                      <div
                        key={dep.dependency_id}
                        className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-blue-700 font-semibold">
                              {dep.predecessor_code}
                            </span>
                            <span className="font-medium text-gray-900">
                              {dep.predecessor_name}
                            </span>
                          </div>
                          <div className="text-xs text-blue-600 mt-1">
                            Tipo: {dep.type_label}
                            {dep.lag_days !== 0 && (
                              <span className="ml-2">
                                • Lag: {dep.lag_days > 0 ? "+" : ""}
                                {dep.lag_days} dias
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleRemoveDependency(dep.dependency_id)
                          }
                          disabled={actionLoading}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                          title="Remover dependência"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <Info className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Este item ainda não depende de nenhum outro item
                    </p>
                  </div>
                )}

                {/* Formulário para adicionar dependência */}
                {showAddForm && (
                  <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-900 mb-3">
                      Adicionar Nova Dependência
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Item Predecessor (do qual depende)
                        </label>
                        <select
                          value={selectedPredecessor}
                          onChange={(e) =>
                            setSelectedPredecessor(e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                        >
                          <option value="">Selecione um item...</option>
                          {availableItems.map((itm) => (
                            <option key={itm.id} value={itm.id}>
                              {itm.code} - {itm.name}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          Selecione o item que deve ser concluído antes
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Dependência
                          </label>
                          <select
                            value={dependencyType}
                            onChange={(e) => setDependencyType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                          >
                            <option value="FS">Término → Início (FS)</option>
                            <option value="SS">Início → Início (SS)</option>
                            <option value="FF">Término → Término (FF)</option>
                            <option value="SF">Início → Término (SF)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Atraso (dias)
                          </label>
                          <input
                            type="number"
                            value={lagDays}
                            onChange={(e) => setLagDays(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                            placeholder="0"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Positivo = espera. Negativo = sobrepor
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddForm(false)}
                          className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                          disabled={actionLoading}
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={handleAddDependency}
                          disabled={actionLoading || !selectedPredecessor}
                          className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 text-sm font-medium inline-flex items-center justify-center gap-2"
                        >
                          {actionLoading && (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          )}
                          Adicionar Dependência
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Seção: Outros itens DEPENDEM DESTE */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <span className="bg-orange-100 p-2 rounded-lg">🔗</span>
                  Outros itens DEPENDEM deste:
                  <span className="text-xs text-gray-500">
                    ({dependencies?.successors?.length || 0} itens)
                  </span>
                </h3>

                {dependencies?.successors &&
                dependencies.successors.length > 0 ? (
                  <div className="space-y-2">
                    {dependencies.successors.map((dep) => (
                      <div
                        key={dep.dependency_id}
                        className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-lg p-3"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-orange-700 font-semibold">
                              {dep.successor_code}
                            </span>
                            <span className="font-medium text-gray-900">
                              {dep.successor_name}
                            </span>
                          </div>
                          <div className="text-xs text-orange-600 mt-1">
                            Tipo: {dep.type_label}
                            {dep.lag_days !== 0 && (
                              <span className="ml-2">
                                • Lag: {dep.lag_days > 0 ? "+" : ""}
                                {dep.lag_days} dias
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 italic">
                          (Somente leitura)
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <Info className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Nenhum item depende deste
                    </p>
                  </div>
                )}
              </div>

              {/* Info sobre dependências */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-2">Sobre Dependências:</p>
                    <ul className="space-y-1 text-xs">
                      <li>
                        • <strong>Término → Início (FS):</strong> Predecessor
                        termina antes de sucessor começar (mais comum)
                      </li>
                      <li>
                        • <strong>Início → Início (SS):</strong> Ambos começam
                        juntos
                      </li>
                      <li>
                        • <strong>Término → Término (FF):</strong> Ambos
                        terminam juntos
                      </li>
                      <li>
                        • <strong>Lag positivo:</strong> Dias de espera
                        adicional
                      </li>
                      <li>
                        • <strong>Lag negativo:</strong> Permite sobreposição de
                        dias
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
