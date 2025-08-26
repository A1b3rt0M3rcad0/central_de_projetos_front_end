import { useEffect, useState } from "react";
import BaseContent from "../../components/BaseContent";
import Swal from "sweetalert2";
import statusAPI from "../../services/api/status";
import { AlertCircle, CheckCircle, Save, ArrowLeft } from "lucide-react";

export default function ProjectForm({
  onSubmit,
  initial_date,
  onBack,
  loading,
}) {
  const [form, setForm] = useState({
    status_id: 0,
    name: "",
    verba_disponivel: 0,
    andamento_do_projeto: "",
    start_date: "",
    expected_completion_date: "",
    end_date: "",
  });

  const [oldData, setOldData] = useState(null);
  const [title, setTitle] = useState("Criar Projeto");
  const [statuses, setStatuses] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Busca os status do backend (id e descrição)
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await statusAPI.getAllStatus();
        if (response.data?.content) {
          setStatuses(response.data.content);
        }
      } catch {
        Swal.fire("Erro", "Falha ao buscar os status do projeto", "error");
      }
    };
    fetchStatuses();
  }, []);

  // Quando inicializar ou atualizar initial_date e statuses, preencher form
  useEffect(() => {
    if (initial_date && statuses.length > 0) {
      // Função para converter dd/mm/yyyy -> yyyy-mm-dd para input date
      const convertDateToISO = (dateStr) => {
        if (!dateStr) return "";
        const [dd, mm, yyyy] = dateStr.split("/");
        if (!dd || !mm || !yyyy) return "";
        return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
      };

      // Buscar status_id pelo texto do status
      const statusDescription =
        initial_date.status?.description || initial_date.status;
      const foundStatus = statuses.find(
        (s) =>
          s.description.toLowerCase() ===
          (typeof statusDescription === "string"
            ? statusDescription.toLowerCase()
            : "")
      );
      const status_id = foundStatus ? foundStatus.id : 0;

      // Atualizar título para editar
      setTitle("Editar Projeto");

      const newForm = {
        id: initial_date.id,
        status_id,
        name: initial_date.name || "",
        verba_disponivel: initial_date.verba_disponivel
          ? formatNumberToCurrency(initial_date.verba_disponivel)
          : "",
        andamento_do_projeto: initial_date.andamento_do_projeto || "",
        start_date: convertDateToISO(initial_date.start_date),
        expected_completion_date: convertDateToISO(
          initial_date.expected_completion_date
        ),
        end_date: convertDateToISO(initial_date.end_date),
      };

      setForm(newForm);
      setOldData(newForm);
    }
  }, [initial_date, statuses]);

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Nome do projeto é obrigatório";
        if (value.trim().length < 3)
          return "Nome deve ter pelo menos 3 caracteres";
        return "";
      case "status_id":
        if (!value || value === 0) return "Status é obrigatório";
        return "";
      case "verba_disponivel":
        const numericValue =
          typeof value === "string" ? parseCurrency(value) : value;
        if (numericValue < 0) return "Orçamento não pode ser negativo";
        return "";
      case "start_date":
        if (
          value &&
          form.expected_completion_date &&
          value > form.expected_completion_date
        ) {
          return "Data de início não pode ser posterior à previsão de conclusão";
        }
        return "";
      case "expected_completion_date":
        if (value && form.start_date && value < form.start_date) {
          return "Previsão de conclusão não pode ser anterior à data de início";
        }
        return "";
      case "end_date":
        if (value && form.start_date && value < form.start_date) {
          return "Data de conclusão não pode ser anterior à data de início";
        }
        return "";
      default:
        return "";
    }
  };

  const formatCurrency = (value) => {
    // Remove tudo que não é número
    const numericValue = value.replace(/\D/g, "");

    // Se não há valor, retorna string vazia
    if (!numericValue) return "";

    // Converte para número e formata como moeda brasileira
    const number = Number(numericValue) / 100; // Divide por 100 para considerar centavos
    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatNumberToCurrency = (value) => {
    // Para valores que já são números (não strings digitadas pelo usuário)
    if (typeof value === "number") {
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    // Para strings, usar a função original
    return formatCurrency(value);
  };

  const parseCurrency = (value) => {
    // Remove tudo que não é número
    const numericValue = value.replace(/\D/g, "");

    // Se não há valor, retorna 0
    if (!numericValue) return 0;

    // Converte para número (em centavos)
    return Number(numericValue) / 100;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue;

    if (name === "verba_disponivel") {
      // Formatar como moeda
      const formattedValue = formatCurrency(value);
      newValue = formattedValue;
    } else if (name === "status_id") {
      newValue = Number(value);
    } else {
      newValue = value;
    }

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Validar campo em tempo real
    if (touched[name]) {
      const error = validateField(
        name,
        name === "verba_disponivel" ? parseCurrency(value) : newValue
      );
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Formatar campo de moeda quando sair do campo
    if (name === "verba_disponivel" && value) {
      const formattedValue = formatCurrency(value);
      setForm((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    }

    const error = validateField(
      name,
      name === "verba_disponivel" ? parseCurrency(value) : value
    );
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Marcar todos os campos como tocados
    const allTouched = {};
    Object.keys(form).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validar todos os campos
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);

    // Se há erros, não submeter
    if (Object.keys(newErrors).length > 0) {
      return Swal.fire(
        "Erro",
        "Por favor, corrija os erros no formulário",
        "error"
      );
    }

    // Converter valor de moeda para número antes de enviar
    const formDataToSubmit = {
      ...form,
      verba_disponivel:
        typeof form.verba_disponivel === "string"
          ? parseCurrency(form.verba_disponivel)
          : form.verba_disponivel,
    };

    onSubmit(formDataToSubmit, oldData);
  };

  const renderField = (
    name,
    label,
    type = "text",
    required = false,
    options = null
  ) => {
    const hasError = touched[name] && errors[name];
    const isValid = touched[name] && !errors[name] && form[name];

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div className="relative">
          {type === "select" ? (
            <select
              name={name}
              value={form[name]}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                hasError
                  ? "border-red-300 bg-red-50"
                  : isValid
                  ? "border-green-300 bg-green-50"
                  : "border-gray-300 hover:border-gray-400"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <option value={0}>-- Selecione o status --</option>
              {options?.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.description}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                hasError
                  ? "border-red-300 bg-red-50"
                  : isValid
                  ? "border-green-300 bg-green-50"
                  : "border-gray-300 hover:border-gray-400"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              placeholder={name === "verba_disponivel" ? "R$ 0,00" : ""}
            />
          )}

          {/* Ícones de validação */}
          {hasError && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          )}
          {isValid && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          )}
        </div>

        {/* Mensagem de erro */}
        {hasError && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors[name]}
          </p>
        )}
      </div>
    );
  };

  return (
    <BaseContent
      onBack={onBack}
      pageTitle={`${title}: ${initial_date?.name ? initial_date.name : ""}`}
      breadcrumbs={[
        { label: "Projetos", onClick: () => navigate("/projectlistpage") },
        { label: initial_date?.id ? "Editar" : "Novo Projeto" },
      ]}
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <form
            className="bg-white rounded-2xl shadow-xl p-8 space-y-8"
            onSubmit={handleSubmit}
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-600">
                Preencha os campos obrigatórios marcados com{" "}
                <span className="text-red-500">*</span>
              </p>
            </div>

            {/* Informações Básicas */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Informações Básicas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderField("name", "Nome do Projeto", "text", true)}
                  {renderField("verba_disponivel", "Orçamento", "text")}
                </div>
              </div>

              {/* Status e Situação */}
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Status e Acompanhamento
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderField(
                    "status_id",
                    "Status do Projeto",
                    "select",
                    true,
                    statuses
                  )}
                  {renderField(
                    "andamento_do_projeto",
                    "Situação do Projeto",
                    "text"
                  )}
                </div>
              </div>

              {/* Datas */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Cronograma
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {renderField("start_date", "Data de Início", "date")}
                  {renderField(
                    "expected_completion_date",
                    "Previsão de Conclusão",
                    "date"
                  )}
                  {renderField("end_date", "Data de Conclusão", "date")}
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onBack}
                disabled={loading}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Salvar Projeto
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
