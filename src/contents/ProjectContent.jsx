import BaseContent from "../components/BaseContent";
import { Download, FileText } from "lucide-react";

export default function ProjectContent({ onBack, project, downloadDocument }) {
  const handleDownloadDocument = (project_id, document_name) => {
    downloadDocument(project_id, document_name);
  };

  return (
    <BaseContent pageTitle={project.name} onBack={onBack}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações do Projeto */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-4">Informações do Projeto</h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Status:</strong> {project.status?.description || "--"}
            </p>
            <p>
              <strong>Situação:</strong> {project.andamento_do_projeto || "--"}
            </p>
            <p>
              <strong>Orçamento:</strong> R${" "}
              {project.verba_disponivel?.toLocaleString() || "--"}
            </p>
            <p>
              <strong>Data de início:</strong> {project.start_date || "--"}
            </p>
            <p>
              <strong>Previsão de término:</strong>{" "}
              {project.expected_completion_date || "--"}
            </p>
            <p>
              <strong>Data de término:</strong> {project.end_date || "--"}
            </p>
          </div>
        </div>

        {/* Vínculos */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-4">Vínculos</h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Bairro:</strong> {project.bairro?.name || "--"}
            </p>
            <p>
              <strong>Empresa:</strong> {project.empresa?.name || "--"}
            </p>
            <p>
              <strong>Tipo:</strong> {project.types?.name || "--"}
            </p>
            <p>
              <strong>Fiscal:</strong> {project.fiscal?.name || "--"}
            </p>
            <p>
              <strong>Vereador:</strong> {project.user?.name || "--"}
            </p>
          </div>
        </div>

        {/* Histórico */}
        <div className="bg-white p-6 rounded-2xl shadow md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Histórico de Alterações</h3>
            <button
              onClick={() =>
                alert("Exibir todos os detalhes do histórico de alterações")
              }
              className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              Mais detalhes
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Data</th>
                <th className="text-left py-2">Campo</th>
                <th className="text-left py-2">Descrição</th>
              </tr>
            </thead>
            <tbody>
              {project.history_project
                ?.slice(-5)
                .reverse()
                .map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-2">{item.updated_at}</td>
                    <td className="py-2">{item.data_name}</td>
                    <td className="py-2">{item.description}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Documentos */}
        <div className="bg-white p-6 rounded-2xl shadow md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Documentos</h3>
          {project.documents && project.documents.length > 0 ? (
            <div className="space-y-2">
              {project.documents.map((filename, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border rounded-lg p-3 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="text-sm">{filename}</span>
                  </div>
                  <button
                    onClick={() => handleDownloadDocument(project.id, filename)}
                    className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Baixar
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Nenhum documento disponível.
            </p>
          )}
        </div>
      </div>
    </BaseContent>
  );
}
