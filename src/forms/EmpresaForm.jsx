import { useEffect, useState } from "react";
import BaseContent from "../components/BaseContent";

export default function EmpresaForm({ onSubmit, initial_date, onBack }) {
  const [empresaName, setEmpresaName] = useState("");
  const [tittle, setTitle] = useState("");

  useEffect(() => {
    if (initial_date?.id) {
      setEmpresaName(initial_date.name);
      setTitle("Editar Empresa");
    }
    setTitle("Criar Empresa");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(empresaName);
    setEmpresaName("");
  };

  return (
    <BaseContent onBack={onBack} pageTitle={tittle}>
      <div className="flex justify-center items-center min-h-[70vh] bg-gray-50 p-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg font-sans transition-transform duration-300"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
            Cadastrar empresa
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Insira o nome da empresa para continuar.
          </p>

          <label
            htmlFor="empresaName"
            className="block mb-2 text-gray-700 font-medium"
          >
            Nome da empresa:
          </label>
          <input
            id="empresaName"
            type="text"
            value={empresaName}
            onChange={(e) => setEmpresaName(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md
                 focus:outline-none focus:ring-2 focus:ring-blue-500
                 focus:border-blue-500 transition"
          />
          <button
            type="submit"
            className="mt-8 w-full bg-blue-600 text-white font-semibold py-3 rounded-md
                 hover:bg-blue-700 cursor-pointer transition"
          >
            Salvar
          </button>
        </form>
      </div>
    </BaseContent>
  );
}
