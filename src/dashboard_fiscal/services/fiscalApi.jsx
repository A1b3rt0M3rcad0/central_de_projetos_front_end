import axios from "axios";
import { API_CONFIG } from "../../config/constants";

// Criar instância separada para API do fiscal
const fiscalApi = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true,
});

// Interceptor para adicionar token de autenticação do fiscal
fiscalApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("fiscal_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratamento de respostas
fiscalApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("fiscal_token");
      localStorage.removeItem("fiscal_info");
      window.location.href = "/fiscal/login";
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

// Serviços da API do Fiscal
export const fiscalApiService = {
  // Autenticação
  login: (email, password) =>
    fiscalApi.post("/mobile/fiscal/login", { email, password }),

  // Perfil do fiscal
  getMe: () => fiscalApi.get("/mobile/fiscal/me"),

  // Resumo/Dashboard
  getSummary: (startDate, endDate, limit = 5) =>
    fiscalApi.get("/mobile/fiscal/summary", {
      params: { start_date: startDate, end_date: endDate, limit },
    }),

  // Projetos
  getProjects: (pageSize = 10, page = 1) =>
    fiscalApi.get(`/mobile/fiscal/projects/pagination/${pageSize}/${page}`),

  // Work Projects
  getWorkProjects: (projectId, pageSize = 10, page = 1) =>
    fiscalApi.get(
      `/mobile/fiscal/work_projects/pagination/${projectId}/${pageSize}/${page}`
    ),

  getAllWorkProjects: (pageSize = 10, page = 1) =>
    fiscalApi.get(
      `/mobile/fiscal/work_projects/all/pagination/${pageSize}/${page}`
    ),

  getLatestWorkProjects: (pageSize = 10, page = 1, startDate, endDate) =>
    fiscalApi.get(
      `/mobile/fiscal/latest_work_projects/pagination/${pageSize}/${page}`,
      { params: { start_date: startDate, end_date: endDate } }
    ),

  getWorkProject: (workProjectId) =>
    fiscalApi.get(`/mobile/fiscal/work_project/${workProjectId}`),

  createWorkProject: (formData) =>
    fiscalApi.post("/mobile/fiscal/create_work_project", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deleteWorkProject: (workProjectId) =>
    fiscalApi.delete(`/mobile/fiscal/delete_work_project/${workProjectId}`),

  // Documentos
  addDocuments: (workProjectId, files) => {
    const formData = new FormData();
    formData.append("work_project_id", workProjectId);
    files.forEach((file) => {
      formData.append("files", file);
    });
    return fiscalApi.post("/mobile/fiscal/add_documents_to_work_project", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteDocument: (workProjectId, documentName) =>
    fiscalApi.delete("/mobile/fiscal/delete_document_from_work_project", {
      data: { work_project_id: workProjectId, document_name: documentName },
    }),

  getDocument: (workProjectId, documentName) =>
    fiscalApi.get(
      `/mobile/fiscal/work_project/${workProjectId}/document/${documentName}`,
      { responseType: "blob" }
    ),

  getThumbnail: (workProjectId) =>
    fiscalApi.get(`/mobile/fiscal/work_project/${workProjectId}/thumbnail`, {
      responseType: "blob",
    }),
};

export default fiscalApi;

