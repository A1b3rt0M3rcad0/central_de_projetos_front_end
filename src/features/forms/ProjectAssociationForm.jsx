// src/features/forms/ProjectAssociationForm.jsx

import { useEffect, useState } from "react";
import BaseContent from "../../components/BaseContent";
import Swal from "sweetalert2";
import {
  Users,
  Building,
  MapPin,
  User,
  Tag,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowLeft,
  Save,
  RefreshCw,
  Folder,
} from "lucide-react";

export default function ProjectAssociationForm({
  initial_data,
  onBack,
  onAssociate,
  onDissociate,
  listas,
}) {
  const [projectId, setProjectId] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [associations, setAssociations] = useState({
    types: [],
    users: [],
    bairros: [],
    empresas: [],
    fiscais: [],
    folders: [],
  });

  const [selectedType, setSelectedType] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedBairro, setSelectedBairro] = useState("");
  const [selectedEmpresa, setSelectedEmpresa] = useState("");
  const [selectedFiscal, setSelectedFiscal] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("types");

  useEffect(() => {
    if (initial_data) {
      setProjectId(initial_data.id);
      setProjectName(initial_data.name || "Projeto");
      setAssociations(
        initial_data.associations || {
          types: [],
          users: [],
          bairros: [],
          empresas: [],
          fiscais: [],
          folders: [],
        }
      );
    }
  }, [initial_data]);

  const getDisplayName = (list, value) => {
    const found = list.find((item) => item.id === value || item.cpf === value);
    return found ? found.name || found.cpf || found.id : value;
  };

  const handleAssociate = async (key, value, reset) => {
    if (!value || !projectId) return;
    if (associations[key].includes(value)) {
      return Swal.fire({
        icon: "info",
        title: "Já Associado",
        text: "Este item já está associado ao projeto.",
        confirmButtonColor: "#3B82F6",
      });
    }

    setLoading(true);
    try {
      await onAssociate[key](value);
      setAssociations((prev) => ({
        ...prev,
        [key]: [...prev[key], value],
      }));
      reset("");
      Swal.fire({
        icon: "success",
        title: "Associado com Sucesso!",
        text: "O item foi associado ao projeto.",
        confirmButtonColor: "#10B981",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Erro ao Associar",
        text: "Não foi possível associar o item. Tente novamente.",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDissociate = async (key, value) => {
    const itemName = getDisplayName(listas[key] || [], value);

    const result = await Swal.fire({
      icon: "warning",
      title: "Confirmar Remoção",
      text: `Deseja realmente remover "${itemName}" das associações?`,
      showCancelButton: true,
      confirmButtonText: "Sim, remover",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      await onDissociate[key](value);
      setAssociations((prev) => ({
        ...prev,
        [key]: prev[key].filter((v) => v !== value),
      }));
      Swal.fire({
        icon: "success",
        title: "Removido com Sucesso!",
        text: "A associação foi removida.",
        confirmButtonColor: "#10B981",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Erro ao Remover",
        text: "Não foi possível remover a associação. Tente novamente.",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTabConfig = () => [
    {
      key: "types",
      label: "Tipos",
      icon: <Tag className="w-4 h-4" />,
      color: "blue",
      selected: selectedType,
      setSelected: setSelectedType,
      list: listas.types || [],
    },
    {
      key: "users",
      label: "Vereadores",
      icon: <Users className="w-4 h-4" />,
      color: "purple",
      selected: selectedUser,
      setSelected: setSelectedUser,
      list: listas.users || [],
    },
    {
      key: "bairros",
      label: "Bairros",
      icon: <MapPin className="w-4 h-4" />,
      color: "green",
      selected: selectedBairro,
      setSelected: setSelectedBairro,
      list: listas.bairros || [],
    },
    {
      key: "empresas",
      label: "Empresas",
      icon: <Building className="w-4 h-4" />,
      color: "orange",
      selected: selectedEmpresa,
      setSelected: setSelectedEmpresa,
      list: listas.empresas || [],
    },
    {
      key: "fiscais",
      label: "Fiscais",
      icon: <User className="w-4 h-4" />,
      color: "indigo",
      selected: selectedFiscal,
      setSelected: setSelectedFiscal,
      list: listas.fiscais || [],
    },
    {
      key: "folders",
      label: "Pastas",
      icon: <Folder className="w-4 h-4" />,
      color: "teal",
      selected: selectedFolder,
      setSelected: setSelectedFolder,
      list: listas.folders || [],
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
      purple:
        "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
      green: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
      orange:
        "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
      indigo:
        "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
      teal: "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100",
    };
    return colors[color] || colors.blue;
  };

  const getIconColor = (color) => {
    const colors = {
      blue: "text-blue-600",
      purple: "text-purple-600",
      green: "text-green-600",
      orange: "text-orange-600",
      indigo: "text-indigo-600",
      teal: "text-teal-600",
    };
    return colors[color] || colors.blue;
  };

  const currentTab = getTabConfig().find((tab) => tab.key === activeTab);

  return (
    <BaseContent
      onBack={onBack}
      pageTitle="Gerenciar Associações"
      breadcrumbs={[
        { label: "Projetos", onClick: onBack },
        { label: projectName },
        { label: "Associações" },
      ]}
    >
      <div className="space-y-6">
        {/* Header com informações do projeto */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Tag className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {projectName}
              </h1>
              <p className="text-gray-600">ID: {projectId}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Info className="w-4 h-4" />
                <span>Gerenciar vínculos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de navegação */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {getTabConfig().map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? `${getColorClasses(tab.color)} border-b-2 border-current`
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div className={getIconColor(tab.color)}>{tab.icon}</div>
                {tab.label}
                {associations[tab.key]?.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full">
                    {associations[tab.key].length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Conteúdo da aba ativa */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Seletor de item */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`p-2 rounded-lg ${getColorClasses(
                      currentTab.color
                    )}`}
                  >
                    {currentTab.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Adicionar {currentTab.label}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Selecione um item para associar ao projeto
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <select
                    value={currentTab.selected}
                    onChange={(e) => currentTab.setSelected(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    disabled={loading}
                  >
                    <option value="">
                      Selecione um {currentTab.label.slice(0, -1)}...
                    </option>
                    {currentTab.list
                      .filter(
                        (item) =>
                          !associations[currentTab.key].includes(
                            item.id || item.cpf
                          )
                      )
                      .map((item) => (
                        <option
                          key={item.id || item.cpf}
                          value={item.id || item.cpf}
                        >
                          {item.name || item.cpf || item.id}
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    onClick={() =>
                      handleAssociate(
                        currentTab.key,
                        currentTab.selected,
                        currentTab.setSelected
                      )
                    }
                    disabled={!currentTab.selected || loading}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    Associar
                  </button>
                </div>
              </div>

              {/* Lista de associações */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${getColorClasses(
                      currentTab.color
                    )}`}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {currentTab.label} Associados
                  </h3>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    {associations[currentTab.key]?.length || 0} item(s)
                  </span>
                </div>

                {associations[currentTab.key]?.length > 0 ? (
                  <div className="grid gap-3">
                    {associations[currentTab.key].map((value) => (
                      <div
                        key={value}
                        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${getColorClasses(
                              currentTab.color
                            )}`}
                          >
                            {currentTab.icon}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {getDisplayName(currentTab.list, value)}
                            </p>
                            <p className="text-sm text-gray-500">ID: {value}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleDissociate(currentTab.key, value)
                          }
                          disabled={loading}
                          className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                        >
                          <X className="w-4 h-4" />
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <div
                      className={`p-4 rounded-full bg-white mx-auto w-fit mb-4 ${getColorClasses(
                        currentTab.color
                      )}`}
                    >
                      {currentTab.icon}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhum {currentTab.label.slice(0, -1)} associado
                    </h3>
                    <p className="text-gray-600">
                      Adicione {currentTab.label.toLowerCase()} usando o seletor
                      acima
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Resumo das associações */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resumo das Associações
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {getTabConfig().map((tab) => (
              <div
                key={tab.key}
                className="text-center p-4 bg-gray-50 rounded-xl"
              >
                <div
                  className={`p-2 rounded-lg mx-auto w-fit mb-2 ${getColorClasses(
                    tab.color
                  )}`}
                >
                  {tab.icon}
                </div>
                <p className="text-sm font-medium text-gray-900">{tab.label}</p>
                <p className="text-2xl font-bold text-gray-700">
                  {associations[tab.key]?.length || 0}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseContent>
  );
}
