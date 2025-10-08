import { useEffect, useState } from "react";
import BaseContent from "../../components/BaseContent";
import Swal from "sweetalert2";
import { useFiscalForm } from "../../hooks/useFiscalForm";
import PasswordStrengthMeter from "../../components/ui/PasswordStrengthMeter";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  CheckCircle,
  AlertCircle,
  Save,
  ArrowLeft,
  RefreshCw,
  Loader2,
  Shield,
} from "lucide-react";

export default function FiscalForm({
  onSubmit,
  initial_date,
  onBack,
  onUpdate,
}) {
  const { formData, validation, handleInputChange, isFormValid, resetForm } =
    useFiscalForm(initial_date);

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [oldFiscalName, setOldFiscalName] = useState("");

  useEffect(() => {
    if (initial_date) {
      setTitle("Editar Fiscal");
      setOldFiscalName(initial_date.name || "");
    } else {
      setTitle("Criar Novo Fiscal");
    }
  }, [initial_date]);

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    } else {
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // No modo edição, senha é opcional
    const isEditMode = !!initial_date;
    const isPasswordRequired = !isEditMode;

    if (isPasswordRequired && !isFormValid()) {
      Swal.fire({
        icon: "error",
        title: "Formulário Inválido",
        text: "Por favor, corrija os erros antes de continuar.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        // Modo edição
        await onUpdate(
          {
            fiscalName: formData.fiscalName,
            fiscalEmail: formData.fiscalEmail,
            fiscalPassword: formData.fiscalPassword,
            fiscalPhone: formData.fiscalPhone,
          },
          oldFiscalName
        );
      } else {
        // Modo criação
        await onSubmit({
          name: formData.fiscalName,
          email: formData.fiscalEmail,
          password: formData.fiscalPassword,
          phone: formData.fiscalPhone.replace(/\D/g, ""),
        });
        resetForm();
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseContent onBack={onBack} pageTitle={title}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                <p className="text-gray-600">
                  {initial_date
                    ? "Atualize as informações do fiscal"
                    : "Preencha os dados para criar um novo fiscal"}
                </p>
              </div>
            </div>
          </div>

          {/* Formulário */}
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
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.fiscalName}
                      onChange={(e) =>
                        handleInputChange("fiscalName", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${
                        validation.fiscalName.isValid
                          ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          : "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      }`}
                      placeholder="Digite o nome completo"
                    />
                    {validation.fiscalName.isValid && formData.fiscalName && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                  {!validation.fiscalName.isValid && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {validation.fiscalName.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.fiscalEmail}
                      onChange={(e) =>
                        handleInputChange("fiscalEmail", e.target.value)
                      }
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all duration-200 ${
                        validation.fiscalEmail.isValid
                          ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          : "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      }`}
                      placeholder="fiscal@exemplo.com"
                    />
                    {validation.fiscalEmail.isValid && formData.fiscalEmail && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                  {!validation.fiscalEmail.isValid && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {validation.fiscalEmail.message}
                    </p>
                  )}
                </div>

                {/* Telefone */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Telefone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.fiscalPhone}
                      onChange={(e) =>
                        handleInputChange(
                          "fiscalPhone",
                          formatPhone(e.target.value)
                        )
                      }
                      maxLength={15}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all duration-200 ${
                        validation.fiscalPhone.isValid
                          ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          : "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      }`}
                      placeholder="(00) 00000-0000"
                    />
                    {validation.fiscalPhone.isValid && formData.fiscalPhone && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                  {!validation.fiscalPhone.isValid && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {validation.fiscalPhone.message}
                    </p>
                  )}
                </div>

                {/* Senha */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {initial_date
                      ? "Nova Senha (deixe em branco para não alterar)"
                      : "Senha *"}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.fiscalPassword}
                      onChange={(e) =>
                        handleInputChange("fiscalPassword", e.target.value)
                      }
                      className={`w-full pl-10 pr-12 py-3 border rounded-xl transition-all duration-200 ${
                        validation.fiscalPassword.isValid
                          ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          : "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      }`}
                      placeholder="Digite a senha"
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
                  {!validation.fiscalPassword.isValid && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {validation.fiscalPassword.message}
                    </p>
                  )}
                  {formData.fiscalPassword && (
                    <PasswordStrengthMeter
                      strength={validation.fiscalPassword.strength}
                      message={validation.fiscalPassword.message}
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
                disabled={isSubmitting}
                className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
                  !isSubmitting
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
                    {initial_date ? "Atualizar Fiscal" : "Criar Fiscal"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </BaseContent>
  );
}
