import { useState, useEffect } from "react";
import BaseContent from "../components/BaseContent";

function ProjectForm({
  initialData = {},
  onSubmit = () => {},
  onBack = () => {},
  statusOptions = [],
  bairroOptions = [],
  empresaOptions = [],
  tipoOptions = [],
  fiscalOptions = [],
  vereadorOptions = [], // <-- Lista de vereadores [{ cpf: '', nome: '' }]
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
    vereador_cpf: initialData.vereador_cpf || "",
    files: [],
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
      vereador_cpf: initialData.vereador_cpf || "",
      files: [],
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "files") {
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
        {/* Informações do Projeto */}
        <div>
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">
            Informações do Projeto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col">
              <label htmlFor="name" className="mb-2 font-semibold">
                Nome do Projeto
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Digite o nome do projeto"
                required
                className="border border-gray-300 rounded-xl px-4 py-3"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="verba_disponivel" className="mb-2 font-semibold">
                Verba Disponível (R$)
              </label>
              <input
                id="verba_disponivel"
                name="verba_disponivel"
                type="number"
                min="0"
                step="0.01"
                value={formData.verba_disponivel}
                onChange={handleChange}
                required
                placeholder="Ex: 10000.00"
                className="border border-gray-300 rounded-xl px-4 py-3"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="andamento_do_projeto"
                className="mb-2 font-semibold"
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
                className="border border-gray-300 rounded-xl px-4 py-3"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="tipo_id" className="mb-2 font-semibold">
                Tipo
              </label>
              <select
                id="tipo_id"
                name="tipo_id"
                value={formData.tipo_id || ""}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-xl px-4 py-3"
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

            <div className="flex flex-col">
              <label htmlFor="start_date" className="mb-2 font-semibold">
                Data de Início
              </label>
              <input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-xl px-4 py-3"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="expected_completion_date"
                className="mb-2 font-semibold"
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
                className="border border-gray-300 rounded-xl px-4 py-3"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="end_date" className="mb-2 font-semibold">
                Data de Conclusão
              </label>
              <input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date || ""}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl px-4 py-3"
              />
            </div>
          </div>
        </div>

        {/* Vínculos */}
        <div>
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Vínculos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                label: "Status",
                name: "status_id",
                options: statusOptions,
              },
              {
                label: "Bairro",
                name: "bairro_id",
                options: bairroOptions,
              },
              {
                label: "Empresa",
                name: "empresa_id",
                options: empresaOptions,
              },
              {
                label: "Fiscal",
                name: "fiscal_id",
                options: fiscalOptions,
              },
            ].map(({ label, name, options }) => (
              <div key={name} className="flex flex-col">
                <label htmlFor={name} className="mb-2 font-semibold">
                  {label}
                </label>
                <select
                  id={name}
                  name={name}
                  value={formData[name] || ""}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-xl px-4 py-3"
                >
                  <option value="" disabled>
                    Selecione {label.toLowerCase()}
                  </option>
                  {options.map(({ id, nome }) => (
                    <option key={id} value={id}>
                      {nome}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {/* Vereador */}
            <div className="flex flex-col">
              <label htmlFor="vereador_cpf" className="mb-2 font-semibold">
                Vereador
              </label>
              <select
                id="vereador_cpf"
                name="vereador_cpf"
                value={formData.vereador_cpf}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-xl px-4 py-3"
              >
                <option value="" disabled>
                  Selecione o vereador
                </option>
                {vereadorOptions.map(({ cpf, nome }) => (
                  <option key={cpf} value={cpf}>
                    {nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Documentos */}
        <div>
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Documentos</h2>
          <div className="flex flex-col">
            <label htmlFor="files" className="mb-2 font-semibold">
              Anexar Arquivos
            </label>
            <input
              id="files"
              name="files"
              type="file"
              multiple
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-3"
            />
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 rounded-xl border border-gray-400 text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            Voltar
          </button>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
          >
            {formData.id ? "Atualizar" : "Cadastrar"}
          </button>
        </div>
      </form>
    </BaseContent>
  );
}

export default ProjectForm;
