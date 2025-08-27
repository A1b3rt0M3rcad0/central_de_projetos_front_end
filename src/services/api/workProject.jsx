import api from "../../config/api";

const workProjectApi = {
  // Buscar última fiscalização de um projeto
  getLatestWorkProjectByProject: (project_id) =>
    api.get(`/work_project/project/${project_id}/latest`),

  // Buscar work projects de um projeto com paginação
  getWorkProjectsByProjectWithPagination: (project_id, page_size, page) =>
    api.get(
      `/work_project/project/${project_id}/pagination/${page_size}/${page}`
    ),

  // Buscar work project específico
  getWorkProject: (work_project_id) =>
    api.get(`/work_project/${work_project_id}`),

  // Visualizar documento de work project
  viewWorkProjectDocument: (work_project_id, document_name) =>
    api.get(`/work_project/${work_project_id}/document/${document_name}/view`, {
      responseType: "blob",
    }),

  // Baixar documento de work project
  downloadWorkProjectDocument: (work_project_id, document_name) =>
    api.get(
      `/work_project/${work_project_id}/document/${document_name}/download`,
      {
        responseType: "blob",
      }
    ),

  // Criar work project com documentos fiscais
  createWorkProjectWithFiscalDocuments: (formData) =>
    api.post("/work_project/create_with_fiscal_documents", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Adicionar documentos a um work project
  addDocumentsToWorkProject: (formData) =>
    api.post("/work_project/add_documents", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Deletar work project
  deleteWorkProject: (work_project_id) =>
    api.delete(`/work_project/${work_project_id}`),
};

export default workProjectApi;
