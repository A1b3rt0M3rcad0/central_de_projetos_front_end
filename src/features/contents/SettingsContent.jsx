import { useState, useEffect } from "react";
import BaseContent from "../../components/BaseContent";
import LoadingContent from "./LoadingContent";
import {
  User,
  Lock,
  Mail,
  Save,
  AlertCircle,
  CheckCircle,
  Settings as SettingsIcon,
  Filter,
  Eye,
  EyeOff,
} from "lucide-react";
import userApi from "../../services/api/user";
import systemConfigAPI from "../../services/api/systemConfig";
import statusAPI from "../../services/api/status";
import Swal from "sweetalert2";

export default function SettingsContent({ activeTab, onTabChange, onBack }) {
  // Configurações Pessoais
  const [userInfo, setUserInfo] = useState(null);
  const [personalData, setPersonalData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoadingPersonal, setIsLoadingPersonal] = useState(false);

  // Configurações do Sistema
  const [excludedStatus, setExcludedStatus] = useState([]);
  const [availableStatus, setAvailableStatus] = useState([]);
  const [isLoadingSystem, setIsLoadingSystem] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      try {
        await Promise.all([loadUserData(), loadSystemConfig()]);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoadingData(false);
      }
    };
    loadData();
  }, []);

  const loadUserData = async () => {
    try {
      console.log("🔄 Iniciando loadUserData...");
      const storedUserInfo = localStorage.getItem("user_info");

      if (!storedUserInfo) {
        console.warn("⚠️ Nenhum user_info no localStorage");
        setIsDataLoaded(true); // Libera a interface mesmo sem dados
        return;
      }

      const userInfoParsed = JSON.parse(storedUserInfo);
      console.log("👤 User info do localStorage:", userInfoParsed);
      setUserInfo(userInfoParsed);

      // Buscar dados completos do usuário do backend
      console.log(`📡 Buscando dados do usuário CPF: ${userInfoParsed.cpf}`);
      const response = await userApi.getUserByCpf(userInfoParsed.cpf);
      console.log("📦 Resposta da API:", response.data);

      const userData = response.data.content;

      // Preencher os campos com os dados atuais do usuário
      const newPersonalData = {
        name: userData.name || "",
        email: userData.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      };

      console.log("📝 Setando personalData:", newPersonalData);
      setPersonalData(newPersonalData);
      setIsDataLoaded(true);

      console.log("✅ Dados do usuário carregados com sucesso!");
    } catch (error) {
      console.error("❌ ERRO ao carregar dados do usuário:", error);
      console.error("Detalhes do erro:", error.response?.data || error.message);
      // Libera a interface mesmo com erro
      setIsDataLoaded(true);
    }
  };

  const loadSystemConfig = async () => {
    try {
      console.log("🔄 Iniciando loadSystemConfig...");

      // Buscar todos os status disponíveis
      console.log("📡 Buscando lista de status...");
      const statusResponse = await statusAPI.getStatusWithPagination(50, 1);
      console.log("📦 Resposta status API:", statusResponse.data);

      const allStatus = statusResponse.data.content.status || [];
      setAvailableStatus(allStatus);

      // Buscar configuração atual de excluded_status
      console.log("📡 Buscando excluded_status...");
      const excludedIds = await systemConfigAPI.getDashboardExcludedStatus();
      console.log("📋 Excluded status recebido:", excludedIds);

      setExcludedStatus(excludedIds);

      console.log("✅ Configurações do sistema carregadas:", {
        total_status: allStatus.length,
        excluded_status: excludedIds,
      });
    } catch (error) {
      console.error("❌ ERRO ao carregar configurações do sistema:", error);
      console.error("Detalhes do erro:", error.response?.data || error.message);
      // Seta valores padrão
      setExcludedStatus([]);
      setAvailableStatus([]);
    }
  };

  const handlePersonalSave = async () => {
    try {
      setIsLoadingPersonal(true);

      // Validações
      if (personalData.newPassword) {
        if (personalData.newPassword !== personalData.confirmPassword) {
          Swal.fire({
            icon: "error",
            title: "Erro",
            text: "As senhas não coincidem!",
          });
          return;
        }

        if (!personalData.currentPassword) {
          Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Digite a senha atual para alterar a senha!",
          });
          return;
        }
      }

      // Atualizar dados
      const updateData = {
        cpf: userInfo.cpf,
        name: personalData.name,
        email: personalData.email,
      };

      // Se estiver alterando senha, incluir no payload
      if (personalData.newPassword) {
        updateData.current_password = personalData.currentPassword;
        updateData.new_password = personalData.newPassword;
      }

      // Chamar API para atualizar dados pessoais
      const response = await userApi.patchUserPersonalData(updateData);

      Swal.fire({
        icon: "success",
        title: "Sucesso",
        text:
          response.data.message || "Configurações pessoais salvas com sucesso!",
      });

      // Limpar campos de senha
      setPersonalData({
        ...personalData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: error.response?.data?.message || "Erro ao salvar configurações",
      });
    } finally {
      setIsLoadingPersonal(false);
    }
  };

  const handleSystemSave = async () => {
    try {
      setIsLoadingSystem(true);

      // Atualizar configuração de excluded_status
      await systemConfigAPI.updateDashboardExcludedStatus(excludedStatus);

      Swal.fire({
        icon: "success",
        title: "Sucesso",
        text: "Configurações do sistema salvas com sucesso! O dashboard será atualizado automaticamente.",
        timer: 3000,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: error.response?.data?.message || "Erro ao salvar configurações",
      });
    } finally {
      setIsLoadingSystem(false);
    }
  };

  const toggleStatusExclusion = (statusId) => {
    setExcludedStatus((prev) =>
      prev.includes(statusId)
        ? prev.filter((id) => id !== statusId)
        : [...prev, statusId]
    );
  };

  if (isLoadingData) {
    return <LoadingContent pageTitle="Configurações" onBack={onBack} />;
  }

  return (
    <BaseContent pageTitle="Configurações" onBack={onBack}>
      <div className="space-y-6">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => onTabChange("personal")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                activeTab === "personal"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <User className="w-4 h-4" />
                <span>Configurações Pessoais</span>
              </div>
            </button>

            <button
              onClick={() => onTabChange("system")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                activeTab === "system"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <SettingsIcon className="w-4 h-4" />
                <span>Configurações do Sistema</span>
              </div>
            </button>
          </div>
        </div>

        {/* Configurações Pessoais */}
        {activeTab === "personal" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Informações Pessoais
                  </h3>
                  {isDataLoaded && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      <CheckCircle className="w-3 h-3" />
                      Dados Carregados do Servidor
                    </div>
                  )}
                </div>
                {userInfo && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Perfil:</strong> {userInfo.role} |{" "}
                      <strong>CPF:</strong> {userInfo.cpf}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <div className="space-y-4">
                  {/* Nome */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={personalData.name}
                        onChange={(e) =>
                          setPersonalData({
                            ...personalData,
                            name: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        placeholder={
                          isDataLoaded ? "Digite seu nome" : "Carregando..."
                        }
                        disabled={!isDataLoaded}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={personalData.email}
                        onChange={(e) =>
                          setPersonalData({
                            ...personalData,
                            email: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        placeholder={
                          isDataLoaded
                            ? "seu.email@exemplo.com"
                            : "Carregando..."
                        }
                        disabled={!isDataLoaded}
                      />
                    </div>
                  </div>

                  {/* CPF (Apenas visualização) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CPF
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={userInfo?.cpf || ""}
                        disabled
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Alteração de Senha */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Alterar Senha
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Senha Atual */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha Atual
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={personalData.currentPassword}
                        onChange={(e) =>
                          setPersonalData({
                            ...personalData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        placeholder="Digite a senha atual"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Nova Senha */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nova Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={personalData.newPassword}
                        onChange={(e) =>
                          setPersonalData({
                            ...personalData,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        placeholder="Digite a nova senha"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirmar Senha */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Nova Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={personalData.confirmPassword}
                        onChange={(e) =>
                          setPersonalData({
                            ...personalData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        placeholder="Confirme a nova senha"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Aviso de Segurança */}
                {personalData.newPassword && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium">Requisitos de senha:</p>
                      <ul className="mt-1 space-y-1 list-disc list-inside">
                        <li>Mínimo de 8 caracteres</li>
                        <li>Pelo menos uma letra maiúscula</li>
                        <li>Pelo menos uma letra minúscula</li>
                        <li>Pelo menos um número</li>
                        <li>Pelo menos um caractere especial</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Botão Salvar Personal */}
              <div className="flex justify-end">
                <button
                  onClick={handlePersonalSave}
                  disabled={isLoadingPersonal}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoadingPersonal ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Salvar Alterações</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Configurações do Sistema */}
        {activeTab === "system" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Filtro de Status no Dashboard
                  </h3>
                  {availableStatus.length > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      <CheckCircle className="w-3 h-3" />
                      {availableStatus.length} Status Disponíveis
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Selecione quais status <strong>NÃO</strong> devem ser
                  mostrados nas estatísticas do dashboard. Por exemplo, projetos
                  "Concluídos" ou "Cancelados" podem ser excluídos da contagem.
                </p>

                {/* Lista de Status */}
                <div className="space-y-3">
                  {availableStatus.map((status) => (
                    <div
                      key={status.id}
                      className={`p-4 border rounded-lg transition-all duration-200 cursor-pointer ${
                        excludedStatus.includes(status.id)
                          ? "bg-red-50 border-red-300"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      }`}
                      onClick={() => toggleStatusExclusion(status.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                              excludedStatus.includes(status.id)
                                ? "bg-red-600 border-red-600"
                                : "border-gray-300"
                            }`}
                          >
                            {excludedStatus.includes(status.id) && (
                              <CheckCircle className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {status.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              ID: {status.id}
                            </p>
                          </div>
                        </div>

                        {excludedStatus.includes(status.id) && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            <Filter className="w-3 h-3" />
                            Excluído do Dashboard
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Resumo */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Resumo da configuração:</p>
                      <p className="mt-1">
                        {excludedStatus.length === 0 ? (
                          <span>
                            Todos os status serão incluídos no dashboard.
                          </span>
                        ) : (
                          <span>
                            <strong>{excludedStatus.length}</strong> status{" "}
                            {excludedStatus.length > 1
                              ? "excluídos"
                              : "excluído"}{" "}
                            do dashboard. Apenas projetos com outros status
                            serão contabilizados.
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botão Salvar System */}
              <div className="flex justify-end">
                <button
                  onClick={handleSystemSave}
                  disabled={isLoadingSystem}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoadingSystem ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Salvar Configurações</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseContent>
  );
}
