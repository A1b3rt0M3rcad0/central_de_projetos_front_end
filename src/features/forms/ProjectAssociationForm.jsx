// src/forms/ProjectAssociationForm.jsx

import { useEffect, useState } from "react";
import BaseContent from "../../components/BaseContent";
import Swal from "sweetalert2";

export default function ProjectAssociationForm({
  initial_data,
  onBack,
  onAssociate,
  onDissociate,
  listas,
}) {
  const [projectId, setProjectId] = useState(null);
  const [associations, setAssociations] = useState({
    types: [],
    users: [],
    bairros: [],
    empresas: [],
    fiscais: [],
  });

  const [selectedType, setSelectedType] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedBairro, setSelectedBairro] = useState("");
  const [selectedEmpresa, setSelectedEmpresa] = useState("");
  const [selectedFiscal, setSelectedFiscal] = useState("");

  useEffect(() => {
    if (initial_data) {
      setProjectId(initial_data.id);
      setAssociations(initial_data.associations);
    }
  }, [initial_data]);

  const getDisplayName = (list, value) => {
    const found = list.find((item) => item.id === value || item.cpf === value);
    return found ? found.name || found.cpf || found.id : value;
  };

  const handleAssociate = async (key, value, reset) => {
    if (!value || !projectId) return;
    if (associations[key].includes(value)) {
      return Swal.fire("Atenção", "Já associado", "info");
    }
    try {
      await onAssociate[key](value);
      setAssociations((prev) => ({
        ...prev,
        [key]: [...prev[key], value],
      }));
      reset("");
      Swal.fire("Sucesso", "Associado com sucesso", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Erro", "Falha ao associar", "error");
    }
  };

  const handleDissociate = async (key, value) => {
    try {
      await onDissociate[key](value);
      setAssociations((prev) => ({
        ...prev,
        [key]: prev[key].filter((v) => v !== value),
      }));
      Swal.fire("Removido", "Associação removida", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Erro", "Falha ao remover", "error");
    }
  };

  const renderAssociationBlock = (label, list, selected, setSelected, key) => (
    <div className="mb-6">
      <label className="block mb-2 text-gray-700 font-medium">{label}:</label>
      <div className="flex gap-2">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Selecione</option>
          {list
            .filter((item) => !associations[key].includes(item.id || item.cpf))
            .map((item) => (
              <option key={item.id || item.cpf} value={item.id || item.cpf}>
                {item.name || item.cpf || item.id}
              </option>
            ))}
        </select>
        <button
          type="button"
          onClick={() =>
            handleAssociate(
              key,
              selected,
              {
                types: setSelectedType,
                users: setSelectedUser,
                bairros: setSelectedBairro,
                empresas: setSelectedEmpresa,
                fiscais: setSelectedFiscal,
              }[key]
            )
          }
          className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700 transition"
        >
          Associar
        </button>
      </div>

      {associations[key]?.length > 0 && (
        <ul className="mt-2 space-y-1 text-sm text-gray-700">
          {associations[key].map((value) => (
            <li
              key={value}
              className="flex justify-between items-center bg-gray-100 px-3 py-1 rounded"
            >
              <span>{getDisplayName(list, value)}</span>
              <button
                type="button"
                onClick={() => handleDissociate(key, value)}
                className="text-red-600 font-semibold hover:underline"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <BaseContent onBack={onBack} pageTitle="Associar ao Projeto">
      <div className="flex justify-center items-center min-h-[70vh] bg-gray-50 p-8">
        <form className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            Gerenciar Associações
          </h2>

          {renderAssociationBlock(
            "Tipo de Projeto",
            listas.types,
            selectedType,
            setSelectedType,
            "types"
          )}
          {renderAssociationBlock(
            "Vereador",
            listas.users,
            selectedUser,
            setSelectedUser,
            "users"
          )}
          {renderAssociationBlock(
            "Bairro",
            listas.bairros,
            selectedBairro,
            setSelectedBairro,
            "bairros"
          )}
          {renderAssociationBlock(
            "Empresa",
            listas.empresas,
            selectedEmpresa,
            setSelectedEmpresa,
            "empresas"
          )}
          {renderAssociationBlock(
            "Fiscal",
            listas.fiscais,
            selectedFiscal,
            setSelectedFiscal,
            "fiscais"
          )}
        </form>
      </div>
    </BaseContent>
  );
}
