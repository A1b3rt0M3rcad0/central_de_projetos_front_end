import { useEffect, useState } from "react";
import BaseContent from "../components/BaseContent";
import Swal from "sweetalert2";
import statusAPI from "../services/endpoints/status";

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
      const foundStatus = statuses.find(
        (s) => s.description.toLowerCase() === initial_date.status.toLowerCase()
      );
      const status_id = foundStatus ? foundStatus.id : 0;

      // Atualizar título para editar
      setTitle("Editar Projeto");

      const newForm = {
        id: initial_date.id,
        status_id,
        name: initial_date.name || "",
        verba_disponivel: initial_date.verba_disponivel || 0,
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "verba_disponivel" || name === "status_id"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      return Swal.fire("Erro", "Nome do projeto é obrigatório", "error");
    }

    if (!form.status_id || form.status_id === 0) {
      return Swal.fire("Erro", "Selecione um status válido", "error");
    }

    onSubmit(form, oldData);
  };

  return (
    <BaseContent onBack={onBack} pageTitle={title}>
      <div className="flex justify-center items-center min-h-[70vh] bg-gray-50 p-8">
        <form
          className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg font-sans transition-transform duration-300"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            {title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium">Nome:</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">
                Orçamento:
              </label>
              <input
                type="number"
                name="verba_disponivel"
                value={form.verba_disponivel}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-2 border rounded-md"
                min={0}
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Status:</label>
              <select
                name="status_id"
                value={form.status_id}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value={0}>-- Selecione o status --</option>
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.description}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium">
                Andamento do Projeto:
              </label>
              <input
                type="text"
                name="andamento_do_projeto"
                value={form.andamento_do_projeto}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">
                Data de Início:
              </label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">
                Previsão de Conclusão:
              </label>
              <input
                type="date"
                name="expected_completion_date"
                value={form.expected_completion_date}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">
                Data de Conclusão:
              </label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-8 w-full bg-blue-600 text-white font-semibold py-3 rounded-md transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </form>
      </div>
    </BaseContent>
  );
}
