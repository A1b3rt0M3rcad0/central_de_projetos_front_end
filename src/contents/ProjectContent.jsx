import BaseContent from "../components/BaseContent";
import { Download, FileText } from "lucide-react";

export default function ProjectContent({ onBack, project }) {
  return (
    <BaseContent pageTitle={project.name} onBack={onBack}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações do Projeto */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-4">Informações do Projeto</h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Status:</strong> {project.status || "--"}
            </p>
            <p>
              <strong>Andamento:</strong> {project.andamento_do_projeto || "--"}
            </p>
            <p>
              <strong>Verba disponível:</strong> R${" "}
              {project.verba_disponivel.toLocaleString() || "--"}
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
              <strong>Bairro:</strong> {project.bairro}
            </p>
            <p>
              <strong>Empresa:</strong> {project.empresa}
            </p>
            <p>
              <strong>Tipo:</strong> {project.tipo}
            </p>
            <p>
              <strong>Fiscal:</strong> {project.fiscal}
            </p>
          </div>
        </div>

        {/* Histórico */}
        <div className="bg-white p-6 rounded-2xl shadow md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Histórico de Alterações</h3>
            <button
              onClick={() => {
                alert("Exibir todos os detalhes do histórico de alterações");
                // Aqui você pode abrir um modal, navegar para uma página ou fazer outra ação.
              }}
              className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 cursor-pointer"
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
              {project.historico.map((item) => (
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
          {project.documentos.length > 0 ? (
            <div className="space-y-2">
              {project.documentos.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between border rounded-lg p-3 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="text-sm">{doc.nome}</span>
                  </div>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <Download className="w-4 h-4" />
                    Baixar
                  </a>
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
