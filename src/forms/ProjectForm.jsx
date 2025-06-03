import { useState, useEffect } from "react";
import BaseContent from "../components/BaseContent";

export default function ProjectForm({
  initialData = {},
  onSubmit = () => {},
  onBack = () => {},
  statusOptions = [],
  bairroOptions = [],
  empresaOptions = [],
  tipoOptions = [],
  fiscalOptions = [],
}) {
  const [formData, setFormData] = useState({
    id: initialData.id || null,
    name: initialData.name || "",
    verba_disponivel: initialData.verba_disponivel || 0,
    andamento_do_projeto: initialData.andamento_do_projeto || "",
    start_date: initialData.start_date || "",
    expected_completion_date: initialData.expected_completion_date || "",
    end_date: initialData.end_date || "",
    status_id: initialData.status?.id || null,
    bairro_id: initialData.bairro?.id || null,
    empresa_id: initialData.empresa?.id || null,
    tipo_id: initialData.tipo?.id || null,
    fiscal_id: initialData.fiscal?.id || null,
    files: [], // <== aqui
  });

  useEffect(() => {
    setFormData({
      id: initialData.id || null,
      name: initialData.name || "",
      verba_disponivel: initialData.verba_disponivel || 0,
      andamento_do_projeto: initialData.andamento_do_projeto || "",
      start_date: initialData.start_date || "",
      expected_completion_date: initialData.expected_completion_date || "",
      end_date: initialData.end_date || "",
      status_id: initialData.status?.id || null,
      bairro_id: initialData.bairro?.id || null,
      empresa_id: initialData.empresa?.id || null,
      tipo_id: initialData.tipo?.id || null,
      fiscal_id: initialData.fiscal?.id || null,
      files: [], // resetar files quando inicializar dados
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "files") {
      // Para arquivos, armazenamos o array FileList como array normal
      setFormData((prev) => ({ ...prev, files: Array.from(files) }));
      return;
    }

    const val = [
      "status_id",
      "bairro_id",
      "empresa_id",
      "tipo_id",
      "fiscal_id",
    ].includes(name)
      ? Number(value)
      : value;

    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <BaseContent
      pageTitle={formData.id ? "Editar Projeto" : "Cadastrar Projeto"}
      onBack={onBack}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl shadow-lg max-w-5xl mx-auto space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Nome do Projeto */}
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="mb-2 text-gray-800 font-semibold text-lg"
            >
              Nome do Projeto
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Digite o nome do projeto"
              required
              className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Tipo */}
          <div className="flex flex-col">
            <label
              htmlFor="tipo_id"
              className="mb-2 text-gray-800 font-semibold text-lg"
            >
              Tipo
            </label>
            <select
              id="tipo_id"
              name="tipo_id"
              value={formData.tipo_id || ""}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="" disabled>
                Selecione o tipo
              </option>
              {tipoOptions.map(({ id, nome }) => (
                <option key={id} value={id}>
                  {nome}
                </option>
              ))}
            </select>
          </div>

          {/* Bairro */}
          <div className="flex flex-col">
            <label
              htmlFor="bairro_id"
              className="mb-2 text-gray-800 font-semibold text-lg"
            >
              Bairro
            </label>
            <select
              id="bairro_id"
              name="bairro_id"
              value={formData.bairro_id || ""}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="" disabled>
                Selecione o bairro
              </option>
              {bairroOptions.map(({ id, nome }) => (
                <option key={id} value={id}>
                  {nome}
                </option>
              ))}
            </select>
          </div>

          {/* Empresa */}
          <div className="flex flex-col">
            <label
              htmlFor="empresa_id"
              className="mb-2 text-gray-800 font-semibold text-lg"
            >
              Empresa
            </label>
            <select
              id="empresa_id"
              name="empresa_id"
              value={formData.empresa_id || ""}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="" disabled>
                Selecione a empresa
              </option>
              {empresaOptions.map(({ id, nome }) => (
                <option key={id} value={id}>
                  {nome}
                </option>
              ))}
            </select>
          </div>

          {/* Fiscal */}
          <div className="flex flex-col">
            <label
              htmlFor="fiscal_id"
              className="mb-2 text-gray-800 font-semibold text-lg"
            >
              Fiscal
            </label>
            <select
              id="fiscal_id"
              name="fiscal_id"
              value={formData.fiscal_id || ""}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="" disabled>
                Selecione o fiscal
              </option>
              {fiscalOptions.map(({ id, nome }) => (
                <option key={id} value={id}>
                  {nome}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label
              htmlFor="status_id"
              className="mb-2 text-gray-800 font-semibold text-lg"
            >
              Status
            </label>
            <select
              id="status_id"
              name="status_id"
              value={formData.status_id || ""}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="" disabled>
                Selecione o status
              </option>
              {statusOptions.map(({ id, nome }) => (
                <option key={id} value={id}>
                  {nome}
                </option>
              ))}
            </select>
          </div>

          {/* Verba Disponível */}
          <div className="flex flex-col">
            <label
              htmlFor="verba_disponivel"
              className="mb-2 text-gray-800 font-semibold text-lg"
            >
              Verba Disponível (R$)
            </label>
            <input
              id="verba_disponivel"
              name="verba_disponivel"
              type="number"
              value={formData.verba_disponivel}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="Ex: 10000.00"
              required
              className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Andamento do Projeto */}
          <div className="flex flex-col">
            <label
              htmlFor="andamento_do_projeto"
              className="mb-2 text-gray-800 font-semibold text-lg"
            >
              Andamento do Projeto
            </label>
            <input
              id="andamento_do_projeto"
              name="andamento_do_projeto"
              value={formData.andamento_do_projeto}
              onChange={handleChange}
              placeholder="Ex: Em andamento"
              required
              className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Data de Início */}
          <div className="flex flex-col">
            <label
              htmlFor="start_date"
              className="mb-2 text-gray-800 font-semibold text-lg"
            >
              Data de Início
            </label>
            <input
              id="start_date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Data Prevista de Conclusão */}
          <div className="flex flex-col">
            <label
              htmlFor="expected_completion_date"
              className="mb-2 text-gray-800 font-semibold text-lg"
            >
              Data Prevista de Conclusão
            </label>
            <input
              id="expected_completion_date"
              name="expected_completion_date"
              type="date"
              value={formData.expected_completion_date}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Data de Conclusão */}
          <div className="flex flex-col">
            <label
              htmlFor="end_date"
              className="mb-2 text-gray-800 font-semibold text-lg"
            >
              Data de Conclusão
            </label>
            <input
              id="end_date"
              name="end_date"
              type="date"
              value={formData.end_date || ""}
              onChange={handleChange}
              placeholder="Se concluído"
              className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Upload de Múltiplos Arquivos */}
          <div className="flex flex-col">
            <label
              htmlFor="files"
              className="mb-2 text-gray-800 font-semibold text-lg"
            >
              Anexar arquivos (vários)
            </label>
            <input
              id="files"
              name="files"
              type="file"
              multiple
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {formData.files.length > 0 && (
              <ul className="mt-2 text-sm text-gray-700">
                {formData.files.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-xl transition"
          >
            Voltar
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl transition"
          >
            {formData.id ? "Salvar" : "Cadastrar"}
          </button>
        </div>
      </form>
    </BaseContent>
  );
}
