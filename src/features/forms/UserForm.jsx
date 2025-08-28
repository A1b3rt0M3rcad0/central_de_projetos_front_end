import { useEffect, useState } from "react";
import BaseContent from "../../components/BaseContent";
import Swal from "sweetalert2";
import { useUserForm } from "../../hooks/useUserForm";
import PasswordStrengthMeter from "../../components/ui/PasswordStrengthMeter";
import SuggestionsDropdown from "../../components/ui/SuggestionsDropdown";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  AlertCircle,
  Info,
  Calendar,
  Building,
  Phone,
  MapPin,
  Save,
  ArrowLeft,
  RefreshCw,
  Loader2,
  TrendingUp,
  Users,
  FileText,
} from "lucide-react";

export default function UserForm({ onSubmit, initial_date, onBack, onUpdate }) {
  const {
    formData,
    validation,
    suggestions,
    isLoading,
    userStats,
    handleInputChange,
    isFormValid,
    resetForm,
    loadUserData,
  } = useUserForm(initial_date);

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [oldUserEmail, setOldUserEmail] = useState("");
  const [showSuggestions, setShowSuggestions] = useState({
    names: false,
  });

  // Roles disponíveis com ícones e descrições
  const roles = [
    {
      value: "admin",
      label: "Administrador",
      icon: Shield,
      description: "Acesso completo ao sistema",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      value: "vereador",
      label: "Vereador",
      icon: Building,
      description: "Gestão de projetos legislativos",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      value: "assessor",
      label: "Assessor",
      icon: User,
      description: "Suporte administrativo",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  useEffect(() => {
    if (initial_date) {
      setTitle("Editar Usuário");
      setOldUserEmail(initial_date.email || "");
    } else {
      setTitle("Criar Novo Usuário");
    }
  }, [initial_date]);

  // Máscaras de formatação
  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      Swal.fire({
        icon: "error",
        title: "Formulário Inválido",
        text: "Por favor, corrija os erros antes de continuar.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (initial_date) {
        // Modo edição
        if (formData.userEmail !== oldUserEmail || formData.userPassword) {
          await onUpdate(
            {
              userEmail: formData.userEmail,
              userPassword: formData.userPassword,
              userCpf: formData.userCpf,
            },
            { oldUserEmail }
          );
        } else {
          Swal.fire("Aviso!", "Nenhum dado foi alterado.", "warning");
        }
      } else {
        // Modo criação
        await onSubmit({
          userName: formData.userName,
          userEmail: formData.userEmail,
          userCpf: formData.userCpf,
          userRole: formData.userRole,
          userPassword: formData.userPassword,
        });
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuggestionSelect = (suggestion, field) => {
    handleInputChange(
      field,
      suggestion.name || suggestion.email || suggestion.department
    );
    setShowSuggestions((prev) => ({ ...prev, [field]: false }));
  };

  const handleFieldFocus = (field) => {
    if (suggestions[field] && suggestions[field].length > 0) {
      setShowSuggestions((prev) => ({ ...prev, [field]: true }));
    }
  };

  const handleFieldBlur = (field) => {
    // Delay para permitir clique nas sugestões
    setTimeout(() => {
      setShowSuggestions((prev) => ({ ...prev, [field]: false }));
    }, 200);
  };

  return (
    <BaseContent onBack={onBack} pageTitle={title}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                <p className="text-gray-600">
                  {initial_date
                    ? "Atualize as informações do usuário"
                    : "Preencha os dados para criar um novo usuário"}
                </p>
              </div>
            </div>

            {/* Estatísticas do usuário (apenas na edição) */}
            {initial_date && userStats && (
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Estatísticas do Usuário
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {userStats.totalProjects || 0}
                      </div>
                      <div className="text-sm text-gray-600">Projetos</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {userStats.activeProjects || 0}
                      </div>
                      <div className="text-sm text-gray-600">Ativos</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {userStats.daysActive || 0}
                      </div>
                      <div className="text-sm text-gray-600">Dias ativo</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                <span className="text-gray-600">
                  Carregando dados do usuário...
                </span>
              </div>
            </div>
          )}

          {/* Formulário */}
          {!isLoading && (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informações Básicas */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Informações Básicas
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nome */}
                  {!initial_date && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Nome Completo *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.userName}
                          onChange={(e) =>
                            handleInputChange("userName", e.target.value)
                          }
                          onFocus={() => handleFieldFocus("names")}
                          onBlur={() => handleFieldBlur("names")}
                          className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${
                            validation.userName.isValid
                              ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                              : "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          }`}
                          placeholder="Digite o nome completo"
                        />
                        {validation.userName.isValid && formData.userName && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                        )}
                        <SuggestionsDropdown
                          suggestions={suggestions.names}
                          visible={showSuggestions.names}
                          onSelect={(suggestion) =>
                            handleSuggestionSelect(suggestion, "userName")
                          }
                          type="names"
                        />
                      </div>
                      {!validation.userName.isValid && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {validation.userName.message}
                        </p>
                      )}
                    </div>
                  )}

                  {/* CPF */}
                  {!initial_date && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        CPF *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.userCpf}
                          onChange={(e) =>
                            handleInputChange(
                              "userCpf",
                              formatCPF(e.target.value)
                            )
                          }
                          maxLength={14}
                          className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${
                            validation.userCpf.isValid
                              ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                              : "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          }`}
                          placeholder="000.000.000-00"
                        />
                        {validation.userCpf.isChecking && (
                          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 animate-spin" />
                        )}
                        {validation.userCpf.isValid &&
                          formData.userCpf &&
                          !validation.userCpf.isChecking && (
                            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                          )}
                      </div>
                      {!validation.userCpf.isValid && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {validation.userCpf.message}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.userEmail}
                        onChange={(e) =>
                          handleInputChange("userEmail", e.target.value)
                        }
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all duration-200 ${
                          validation.userEmail.isValid
                            ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            : "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        }`}
                        placeholder="usuario@exemplo.com"
                      />
                      {validation.userEmail.isChecking && (
                        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 animate-spin" />
                      )}
                      {validation.userEmail.isValid &&
                        formData.userEmail &&
                        !validation.userEmail.isChecking && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                        )}
                    </div>
                    {!validation.userEmail.isValid && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {validation.userEmail.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Cargo e Senha */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Acesso e Permissões
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Cargo */}
                  {!initial_date && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Cargo *
                      </label>
                      <div className="grid grid-cols-1 gap-3">
                        {roles.map((role) => {
                          const Icon = role.icon;
                          return (
                            <label
                              key={role.value}
                              className={`relative cursor-pointer p-4 border rounded-xl transition-all duration-200 ${
                                formData.userRole === role.value
                                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/20"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <input
                                type="radio"
                                name="userRole"
                                value={role.value}
                                checked={formData.userRole === role.value}
                                onChange={(e) =>
                                  handleInputChange("userRole", e.target.value)
                                }
                                className="sr-only"
                              />
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 ${role.bgColor} rounded-lg flex items-center justify-center`}
                                >
                                  <Icon className={`w-5 h-5 ${role.color}`} />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">
                                    {role.label}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {role.description}
                                  </div>
                                </div>
                                {formData.userRole === role.value && (
                                  <CheckCircle className="w-5 h-5 text-blue-500" />
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                      {!validation.userRole.isValid && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {validation.userRole.message}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Senha */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {initial_date ? "Nova Senha" : "Senha"}{" "}
                      {!initial_date && "*"}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.userPassword}
                        onChange={(e) =>
                          handleInputChange("userPassword", e.target.value)
                        }
                        className={`w-full pl-10 pr-12 py-3 border rounded-xl transition-all duration-200 ${
                          validation.userPassword.isValid
                            ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            : "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        }`}
                        placeholder={
                          initial_date
                            ? "Deixe em branco para não alterar"
                            : "Digite a senha"
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {!validation.userPassword.isValid && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {validation.userPassword.message}
                      </p>
                    )}
                    {formData.userPassword && (
                      <PasswordStrengthMeter
                        strength={validation.userPassword.strength}
                        message={validation.userPassword.message}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                {!initial_date && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Limpar Formulário
                  </button>
                )}

                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </button>

                <button
                  type="submit"
                  disabled={!isFormValid() || isSubmitting}
                  className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isFormValid() && !isSubmitting
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {initial_date ? "Atualizar Usuário" : "Criar Usuário"}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </BaseContent>
  );
}
