import { useEffect, useState } from "react";
import BaseContent from "../components/BaseContent";
import Swal from "sweetalert2";

export default function UserForm({ onSubmit, initial_date, onBack, onUpdate }) {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userCpf, setUserCpf] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [title, setTitle] = useState("");

  // Valores antigos para comparação ao editar (email apenas)
  const [oldUserEmail, setOldUserEmail] = useState("");

  useEffect(() => {
    if (initial_date) {
      // Preenche email, cpf e título na edição
      setUserEmail(initial_date.email || "");
      setUserCpf(initial_date.cpf || "");
      setTitle("Editar Usuário");
      setOldUserEmail(initial_date.email || "");
    } else {
      setTitle("Criar Usuário");
      // Limpa tudo
      setUserName("");
      setUserEmail("");
      setUserCpf("");
      setUserRole("");
      setUserPassword("");
    }
  }, [initial_date]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userPassword) {
      Swal.fire("Erro!", "Senha é obrigatória para criação.", "error");
      return;
    }
    // Envia todos os dados para criação
    onSubmit({ userName, userEmail, userCpf, userRole, userPassword });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    // Valida se houve alteração em email ou se senha foi informada
    if (userEmail !== oldUserEmail || userPassword) {
      onUpdate(
        { userEmail, userPassword, userCpf }, // agora envia cpf junto
        { oldUserEmail }
      );
    } else {
      Swal.fire("Erro!", "Nenhum dado foi alterado.", "error");
    }
  };

  return (
    <BaseContent onBack={onBack} pageTitle={title}>
      <div className="flex justify-center items-center min-h-[70vh] bg-gray-50 p-8">
        <form
          onSubmit={initial_date ? handleUpdate : handleSubmit}
          className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg font-sans transition-transform duration-300"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
            {title}
          </h2>

          {/* Apenas em criação */}
          {!initial_date && (
            <>
              <label
                htmlFor="userName"
                className="block mb-2 text-gray-700 font-medium"
              >
                Nome:
              </label>
              <input
                id="userName"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-blue-500 transition mb-6"
              />

              <label
                htmlFor="userCpf"
                className="block mb-2 text-gray-700 font-medium"
              >
                CPF:
              </label>
              <input
                id="userCpf"
                type="text"
                value={userCpf}
                onChange={(e) => setUserCpf(e.target.value)}
                required
                maxLength={11}
                className="w-full px-4 py-3 border border-gray-300 rounded-md
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-blue-500 transition mb-6"
              />

              <label
                htmlFor="userRole"
                className="block mb-2 text-gray-700 font-medium"
              >
                Cargo:
              </label>
              <select
                id="userRole"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md
             focus:outline-none focus:ring-2 focus:ring-blue-500
             focus:border-blue-500 transition mb-6 bg-white"
              >
                <option value="" disabled>
                  Selecione um cargo
                </option>
                <option value="admin">Administrador</option>
                <option value="vereador">Vereador</option>
                <option value="assessor">Assessor</option>
                {/* Adicione outras opções conforme seu caso */}
              </select>
            </>
          )}

          {/* Email aparece sempre */}
          <label
            htmlFor="userEmail"
            className="block mb-2 text-gray-700 font-medium"
          >
            Email:
          </label>
          <input
            id="userEmail"
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md
                 focus:outline-none focus:ring-2 focus:ring-blue-500
                 focus:border-blue-500 transition mb-6"
          />

          {/* Password aparece sempre (na criação obrigatório, na edição opcional) */}
          <label
            htmlFor="userPassword"
            className="block mb-2 text-gray-700 font-medium"
          >
            Senha:
          </label>
          <input
            id="userPassword"
            type="password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            required={!initial_date} // obrigatório só para criar
            placeholder={initial_date ? "Deixe em branco para não alterar" : ""}
            className="w-full px-4 py-3 border border-gray-300 rounded-md
               focus:outline-none focus:ring-2 focus:ring-blue-500
               focus:border-blue-500 transition mb-6"
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
