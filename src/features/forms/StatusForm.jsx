import { useEffect, useState } from "react";
import BaseContent from "../../components/BaseContent";
import Swal from "sweetalert2";
import {
  Activity,
  CheckCircle,
  AlertCircle,
  Save,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

export default function StatusForm({
  onSubmit,
  initial_date,
  onBack,
  onUpdate,
}) {
  const [statusDescription, setStatusDescription] = useState("");
  const [title, setTitle] = useState("");
  const [oldStatusDescription, setOldStatusDescription] = useState("");
  const [statusId, setStatusId] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    if (initial_date != undefined) {
      setStatusDescription(initial_date.description);
      setTitle("Editar Status");
      setOldStatusDescription(initial_date.description);
      setStatusId(initial_date.id);
    } else {
      setTitle("Criar Status");
    }
  }, [initial_date]);

  const validateDescription = (description) => {
    if (!description || description.trim().length === 0) {
      setIsValid(false);
      setValidationMessage("Descrição do status é obrigatória");
      return false;
    }
    if (description.trim().length < 3) {
      setIsValid(false);
      setValidationMessage("Descrição deve ter pelo menos 3 caracteres");
      return false;
    }
    setIsValid(true);
    setValidationMessage("");
    return true;
  };

  const handleDescriptionChange = (value) => {
    setStatusDescription(value);
    if (value.trim().length > 0) {
      validateDescription(value);
    } else {
      setIsValid(true);
      setValidationMessage("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateDescription(statusDescription)) {
      return;
    }
    onSubmit(statusDescription.trim());
    setStatusDescription("");
    setIsValid(true);
    setValidationMessage("");
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!validateDescription(statusDescription)) {
      return;
    }
    if (statusDescription.trim() !== oldStatusDescription) {
      onUpdate(statusId, statusDescription.trim());
    } else {
      Swal.fire({
        icon: "info",
        title: "Sem alterações",
        text: "A descrição não foi alterada.",
      });
    }
  };

  const handleReset = () => {
    setStatusDescription("");
    setIsValid(true);
    setValidationMessage("");
  };

  return (
    <BaseContent onBack={onBack} pageTitle={title}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                <p className="text-gray-600">
                  {initial_date
                    ? "Atualize a descrição do status de projeto"
                    : "Adicione um novo status de projeto ao sistema"}
                </p>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <form
            onSubmit={initial_date != undefined ? handleUpdate : handleSubmit}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
          >
            <div className="space-y-6">
              {/* Campo Descrição */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Descrição do Status *
                </label>
                <div className="relative">
                  <input
                    id="statusDescription"
                    type="text"
                    value={statusDescription}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${
                      isValid
                        ? "border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                        : "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    }`}
                    placeholder="Ex: Em Andamento, Concluído, Planejamento..."
                  />
                  {isValid && statusDescription.trim().length > 0 && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
                {!isValid && validationMessage && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {validationMessage}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  O status indica o estágio atual de execução do projeto
                </p>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-200">
                {!initial_date && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Limpar
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
                  disabled={!statusDescription.trim()}
                  className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
                    statusDescription.trim()
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Save className="w-4 h-4" />
                  {initial_date ? "Atualizar Status" : "Criar Status"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </BaseContent>
  );
}
