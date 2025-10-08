import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  Image as ImageIcon,
  X,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { fiscalApiService } from "../services/fiscalApi";

function CreateWorkProjectPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles) => {
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);

    // Criar previews
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, { file, url: reader.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Por favor, insira um título");
      return;
    }

    if (!description.trim()) {
      setError("Por favor, insira uma descrição");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("project_id", projectId);
      formData.append("title", title);
      formData.append("description", description);

      files.forEach((file) => {
        formData.append("files", file);
      });

      await fiscalApiService.createWorkProject(formData);

      setSuccess(true);
      setTimeout(() => {
        navigate(`/fiscal/project/${projectId}/work-projects`);
      }, 1500);
    } catch (err) {
      console.error("Erro ao criar fiscalização:", err);
      const errorMessage =
        err.response?.data?.errors?.[0]?.detail ||
        "Erro ao criar fiscalização. Tente novamente.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center shadow-xl max-w-sm w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Fiscalização Criada!
          </h2>
          <p className="text-gray-600">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white sticky top-0 z-50 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/fiscal/project/${projectId}/work-projects`)}
              className="p-2 hover:bg-orange-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="font-bold text-lg">Nova Fiscalização</h1>
              <p className="text-xs text-orange-100">
                Registre a fiscalização da obra
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {/* Título */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-orange-600" />
            Título da Fiscalização
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Vistoria de estrutura - Fase 1"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-base"
            required
          />
        </div>

        {/* Descrição */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-orange-600" />
            Descrição/Observações
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva detalhes da fiscalização, observações, problemas encontrados, etc."
            rows={5}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all resize-none text-base"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Seja o mais detalhado possível
          </p>
        </div>

        {/* Fotos */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Camera className="w-4 h-4 text-orange-600" />
            Fotos e Documentos
          </label>

          {/* Botões de Adicionar Fotos */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-4 rounded-xl shadow-lg active:scale-95 transition-transform flex flex-col items-center gap-2"
            >
              <Camera className="w-8 h-8" />
              <span className="font-semibold text-sm">Tirar Foto</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-br from-green-600 to-green-700 text-white p-4 rounded-xl shadow-lg active:scale-95 transition-transform flex flex-col items-center gap-2"
            >
              <ImageIcon className="w-8 h-8" />
              <span className="font-semibold text-sm">Da Galeria</span>
            </button>
          </div>

          {/* Inputs escondidos */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Grid de Previews */}
          {previews.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {previews.map((preview, index) => (
                <div
                  key={index}
                  className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200"
                >
                  <img
                    src={preview.url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 truncate">
                    {preview.file.name}
                  </div>
                </div>
              ))}
            </div>
          )}

          {previews.length === 0 && (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Nenhuma foto adicionada ainda
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Fotos são opcionais, mas recomendadas
              </p>
            </div>
          )}
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Botão de Enviar */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 px-4 rounded-xl font-bold text-white text-base transition-all ${
            loading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-lg hover:shadow-xl active:scale-98"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Criando Fiscalização...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Criar Fiscalização
            </div>
          )}
        </button>
      </form>
    </div>
  );
}

export default CreateWorkProjectPage;

