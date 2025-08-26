import { useEffect, useState, useRef } from "react";
import BaseContent from "../../components/BaseContent";
import Swal from "sweetalert2";
import {
  Upload,
  FileText,
  Trash2,
  Download,
  CheckCircle,
  XCircle,
  File,
  FolderOpen,
  Clock,
  Info,
  ArrowUp,
  AlertTriangle,
} from "lucide-react";
import { formatDate } from "../../utils/dateUtils";

export default function DocumentForm({
  onSubmit,
  onDelete,
  initial_date,
  onBack,
}) {
  const [documents, setDocuments] = useState([]);
  const [newFile, setNewFile] = useState(null);
  const [title, setTitle] = useState("Upload de Documentos");
  const [projectId, setProjectId] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initial_date && initial_date.id) {
      setProjectId(initial_date.id);
      setProjectName(initial_date.name || "Projeto");
      setTitle("Gerenciar Documentos");

      if (initial_date.documents) {
        const formattedDocs = initial_date.documents.map((docName) => ({
          name: docName,
          id: Math.random().toString(36).substr(2, 9),
          uploadedAt: new Date().toISOString(),
          size: Math.floor(Math.random() * 1000000) + 10000, // Simulado
        }));
        setDocuments(formattedDocs);
      }
    }
  }, [initial_date]);

  // Função para obter ícone baseado no tipo de arquivo
  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    const iconMap = {
      pdf: <FileText className="w-5 h-5 text-red-500" />,
      doc: <FileText className="w-5 h-5 text-blue-500" />,
      docx: <FileText className="w-5 h-5 text-blue-500" />,
      xls: <FileText className="w-5 h-5 text-green-500" />,
      xlsx: <FileText className="w-5 h-5 text-green-500" />,
      ppt: <FileText className="w-5 h-5 text-orange-500" />,
      pptx: <FileText className="w-5 h-5 text-orange-500" />,
      jpg: <FileText className="w-5 h-5 text-purple-500" />,
      jpeg: <FileText className="w-5 h-5 text-purple-500" />,
      png: <FileText className="w-5 h-5 text-purple-500" />,
      gif: <FileText className="w-5 h-5 text-purple-500" />,
      mp4: <FileText className="w-5 h-5 text-red-400" />,
      avi: <FileText className="w-5 h-5 text-red-400" />,
      mp3: <FileText className="w-5 h-5 text-green-400" />,
      wav: <FileText className="w-5 h-5 text-green-400" />,
      zip: <FileText className="w-5 h-5 text-yellow-500" />,
      rar: <FileText className="w-5 h-5 text-yellow-500" />,
      txt: <FileText className="w-5 h-5 text-gray-500" />,
      json: <FileText className="w-5 h-5 text-gray-600" />,
      xml: <FileText className="w-5 h-5 text-gray-600" />,
    };

    return iconMap[extension] || <File className="w-5 h-5 text-gray-400" />;
  };

  // Função para formatar tamanho do arquivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setNewFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!newFile) {
      return Swal.fire({
        icon: "warning",
        title: "Nenhum arquivo selecionado",
        text: "Por favor, selecione um arquivo para enviar",
        confirmButtonColor: "#3B82F6",
      });
    }

    if (!projectId) {
      return Swal.fire({
        icon: "error",
        title: "Erro",
        text: "ID do projeto não encontrado",
        confirmButtonColor: "#EF4444",
      });
    }

    // Validação de tamanho do arquivo (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (newFile.size > maxSize) {
      return Swal.fire({
        icon: "error",
        title: "Arquivo muito grande",
        text: "O arquivo deve ter no máximo 10MB",
        confirmButtonColor: "#EF4444",
      });
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simular progresso de upload
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const formData = new FormData();
      formData.append("file", newFile);
      formData.append("project_id", projectId);

      const response = await onSubmit(formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response && response.status) {
        const newDoc = {
          name: response.data.name || newFile.name,
          id: Math.random().toString(36).substr(2, 9),
          uploadedAt: new Date().toISOString(),
          size: newFile.size,
        };

        setDocuments((prev) => [...prev, newDoc]);

        Swal.fire({
          icon: "success",
          title: "Documento enviado!",
          text: "O arquivo foi enviado com sucesso",
          confirmButtonColor: "#10B981",
          timer: 2000,
          showConfirmButton: false,
        });

        setNewFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        throw new Error("Erro no upload");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Erro no upload",
        text: `Não foi possível enviar o documento: ${err.message}`,
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (file) => {
    if (!projectId) {
      return Swal.fire({
        icon: "error",
        title: "Erro",
        text: "ID do projeto não encontrado",
        confirmButtonColor: "#EF4444",
      });
    }

    try {
      const result = await Swal.fire({
        title: "Excluir documento?",
        text: `Tem certeza que deseja excluir "${file.name}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#EF4444",
        cancelButtonColor: "#6B7280",
        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      });

      if (!result.isConfirmed) return;

      const response = await onDelete({
        project_id: projectId,
        document_name: file.name,
      });

      if (response && response.status) {
        setDocuments((prev) => prev.filter((doc) => doc.name !== file.name));
        Swal.fire({
          icon: "success",
          title: "Documento excluído!",
          text: "O arquivo foi removido com sucesso",
          confirmButtonColor: "#10B981",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error("Erro ao excluir");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Erro ao excluir",
        text: "Não foi possível excluir o documento",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  const handleDownload = (file) => {
    // Implementar download do arquivo
    console.log("Download:", file.name);
  };

  return (
    <BaseContent
      onBack={onBack}
      pageTitle={title}
      breadcrumbs={[
        { label: "Projetos", href: "/projectlistpage" },
        { label: projectName, href: `/project/${projectId}` },
        { label: "Documentos" },
      ]}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Informações do Projeto */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FolderOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {projectName}
              </h2>
              <p className="text-gray-600 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Gerenciamento de documentos do projeto
              </p>
            </div>
          </div>
        </div>

        {/* Área de Upload */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              Enviar Novo Documento
            </h3>
            <p className="text-gray-600 mt-1">
              Arraste e solte arquivos aqui ou clique para selecionar
            </p>
          </div>

          <div className="p-6">
            <form onSubmit={handleUpload}>
              {/* Área de Drag & Drop */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  dragActive
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mp3,.wav,.zip,.rar,.txt,.json,.xml"
                />

                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    {newFile ? (
                      <CheckCircle className="w-8 h-8 text-blue-600" />
                    ) : (
                      <Upload className="w-8 h-8 text-blue-600" />
                    )}
                  </div>

                  <div>
                    {newFile ? (
                      <div className="space-y-2">
                        <p className="text-lg font-medium text-gray-900">
                          {newFile.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(newFile.size)}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-lg font-medium text-gray-900">
                          Selecione um arquivo
                        </p>
                        <p className="text-sm text-gray-500">
                          ou arraste e solte aqui
                        </p>
                      </div>
                    )}
                  </div>

                  {newFile && (
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setNewFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Remover
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              {isUploading && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Enviando arquivo...</span>
                    <span className="text-blue-600 font-medium">
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Botão de Upload */}
              <button
                type="submit"
                disabled={!newFile || isUploading}
                className={`w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  newFile && !isUploading
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <ArrowUp className="w-4 h-4" />
                    Enviar Documento
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Lista de Documentos */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  Documentos ({documents.length})
                </h3>
                {documents.length > 0 && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    {documents.length} arquivo
                    {documents.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            {documents.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum documento enviado
                </h4>
                <p className="text-gray-500">
                  Envie o primeiro documento para este projeto
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <div
                    key={doc.id || index}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex-shrink-0">{getFileIcon(doc.name)}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {doc.name}
                        </h4>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(doc.uploadedAt)}
                        </span>
                        <span>{formatFileSize(doc.size)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDownload(doc)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-900 mb-1">
                Informações Importantes
              </h4>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>
                  • Formatos aceitos: PDF, DOC, XLS, PPT, imagens, vídeos,
                  áudios e arquivos compactados
                </li>
                <li>• Tamanho máximo por arquivo: 10MB</li>
                <li>• Os documentos são organizados por data de upload</li>
                <li>
                  • Você pode baixar ou excluir documentos a qualquer momento
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </BaseContent>
  );
}
