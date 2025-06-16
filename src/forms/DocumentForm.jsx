import { useEffect, useState } from "react";
import BaseContent from "../components/BaseContent";
import Swal from "sweetalert2";

export default function DocumentForm({
  onSubmit,
  onDelete,
  initial_date, // ← dados reais: { id, documents }
  onBack,
}) {
  const [documents, setDocuments] = useState([]);
  const [newFile, setNewFile] = useState(null);
  const [title, setTitle] = useState("Upload de Documentos");
  const [projectId, setProjectId] = useState(null);

  useEffect(() => {
    if (initial_date && initial_date.id) {
      setProjectId(initial_date.id);
      setTitle("Gerenciar Documentos");

      if (initial_date.documents) {
        const formattedDocs = initial_date.documents.map((docName) => ({
          name: docName,
        }));
        setDocuments(formattedDocs);
      }
    }
  }, [initial_date]);

  const handleFileChange = (e) => {
    setNewFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!newFile) {
      return Swal.fire("Erro", "Selecione um arquivo para enviar", "error");
    }

    if (!projectId) {
      return Swal.fire("Erro", "ID do projeto não encontrado", "error");
    }

    try {
      const formData = new FormData();
      formData.append("file", newFile);
      formData.append("project_id", projectId);

      const response = await onSubmit(formData);
      console.log(response);
      if (response && response.status) {
        setDocuments((prev) => [...prev, { name: response.data.name }]);
        // Mostrar mensagem de sucesso
        Swal.fire("Sucesso", "Documento enviado com sucesso!", "success");
        setNewFile(null);
      } else {
        throw new Error("Erro no upload");
      }
    } catch (err) {
      Swal.fire("Erro", `Não foi possível enviar o documento ${err}`, "error");
    }
  };

  const handleDelete = async (file) => {
    if (!projectId) {
      return Swal.fire("Erro", "ID do projeto não encontrado", "error");
    }

    try {
      const confirmed = await Swal.fire({
        title: "Excluir?",
        text: `Tem certeza que deseja excluir "${file.name}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar",
      });

      if (!confirmed.isConfirmed) return;

      const response = await onDelete({
        project_id: projectId,
        file: file.name,
      });

      if (response && response.success) {
        setDocuments((prev) => prev.filter((doc) => doc.name !== file.name));
      } else {
        throw new Error("Erro ao excluir");
      }
    } catch (err) {
      Swal.fire("Erro", "Não foi possível excluir o documento", "error");
    }
  };

  return (
    <BaseContent onBack={onBack} pageTitle={title}>
      <div className="flex justify-center items-center min-h-[70vh] bg-gray-50 p-8">
        <form
          onSubmit={handleUpload}
          className="w-full max-w-xl p-8 bg-white rounded-lg shadow-lg font-sans"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            {title}
          </h2>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Selecionar Documento:
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-gray-700 border-1 rounded p-1"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Enviar Documento
          </button>

          {documents.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Documentos Enviados
              </h3>
              <ul className="space-y-3">
                {documents.map((doc, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded"
                  >
                    <span className="truncate">{doc.name}</span>
                    <button
                      type="button"
                      onClick={() => handleDelete(doc)}
                      className="text-red-500 hover:text-red-700 font-semibold"
                    >
                      Excluir
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </div>
    </BaseContent>
  );
}
