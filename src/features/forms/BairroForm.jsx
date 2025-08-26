import { useEffect, useState } from "react";
import BaseContent from "../../components/BaseContent";
import Swal from "sweetalert2";

export default function BairroForm({
  onSubmit,
  initial_date,
  onBack,
  onUpdate,
}) {
  const [bairroName, setBairroName] = useState("");
  const [tittle, setTitle] = useState("");
  const [oldBairroName, setOldBairroName] = useState("");

  useEffect(() => {
    if (initial_date != undefined) {
      setBairroName(initial_date.name);
      setTitle("Editar Bairro");
      setOldBairroName(initial_date.name);
    } else {
      setTitle("Criar Bairro");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(bairroName);
    setBairroName("");
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (bairroName != oldBairroName) {
      onUpdate(bairroName, oldBairroName);
    } else {
      Swal.fire("Erro!", "Novo nome igual ao anterior", "error");
      setBairroName(oldBairroName);
    }
  };

  return (
    <BaseContent onBack={onBack} pageTitle={tittle}>
      <div className="flex justify-center items-center min-h-[70vh] bg-gray-50 p-8">
        <form
          onSubmit={initial_date != undefined ? handleUpdate : handleSubmit}
          className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg font-sans transition-transform duration-300"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
            {tittle}
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Insira o nome do bairro para continuar.
          </p>

          <label
            htmlFor="bairroName"
            className="block mb-2 text-gray-700 font-medium"
          >
            Nome do bairro:
          </label>
          <input
            id="bairroName"
            type="text"
            value={bairroName}
            onChange={(e) => setBairroName(e.target.value)}
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
