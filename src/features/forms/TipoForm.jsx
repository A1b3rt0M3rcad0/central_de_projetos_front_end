import { useEffect, useState } from "react";
import BaseContent from "../../components/BaseContent";
import Swal from "sweetalert2";
import {
  Tag,
  CheckCircle,
  AlertCircle,
  Save,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

export default function TipoForm({ onSubmit, initial_date, onBack, onUpdate }) {
  const [tipoName, setTipoName] = useState("");
  const [title, setTitle] = useState("");
  const [oldTipoName, setOldTipoName] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    if (initial_date != undefined) {
      setTipoName(initial_date.name);
      setTitle("Editar Tipo");
      setOldTipoName(initial_date.name);
    } else {
      setTitle("Criar Tipo");
    }
  }, [initial_date]);

  const validateName = (name) => {
    if (!name || name.trim().length === 0) {
      setIsValid(false);
      setValidationMessage("Nome do tipo é obrigatório");
      return false;
    }
    if (name.trim().length < 3) {
      setIsValid(false);
      setValidationMessage("Nome deve ter pelo menos 3 caracteres");
      return false;
    }
    setIsValid(true);
    setValidationMessage("");
    return true;
  };

  const handleNameChange = (value) => {
    setTipoName(value);
    if (value.trim().length > 0) {
      validateName(value);
    } else {
      setIsValid(true);
      setValidationMessage("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateName(tipoName)) {
      return;
    }
    onSubmit(tipoName.trim());
    setTipoName("");
    setIsValid(true);
    setValidationMessage("");
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!validateName(tipoName)) {
      return;
    }
    if (tipoName.trim() !== oldTipoName) {
      onUpdate(tipoName.trim(), oldTipoName);
    } else {
      Swal.fire({
        icon: "info",
        title: "Sem alterações",
        text: "O nome não foi alterado.",
      });
    }
  };

  const handleReset = () => {
    setTipoName("");
    setIsValid(true);
    setValidationMessage("");
  };

  return (
    <BaseContent onBack={onBack} pageTitle={title}>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Tag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                <p className="text-gray-600">
                  {initial_date
                    ? "Atualize o nome do tipo de projeto"
                    : "Adicione um novo tipo de projeto ao sistema"}
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
              {/* Campo Nome */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nome do Tipo *
                </label>
                <div className="relative">
                  <input
                    id="tipoName"
                    type="text"
                    value={tipoName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${
                      isValid
                        ? "border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        : "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    }`}
                    placeholder="Ex: Infraestrutura, Educação, Saúde..."
                  />
                  {isValid && tipoName.trim().length > 0 && (
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
                  O tipo será usado para categorizar projetos no sistema
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
                  disabled={!tipoName.trim()}
                  className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
                    tipoName.trim()
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Save className="w-4 h-4" />
                  {initial_date ? "Atualizar Tipo" : "Criar Tipo"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </BaseContent>
  );
}
