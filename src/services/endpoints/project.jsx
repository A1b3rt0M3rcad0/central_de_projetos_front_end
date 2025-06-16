import api from "../api";

const projectApi = {
  getProjectById: (project_id) => api.get(`/project/${project_id}`),
  getHistoryProjectById: () => api.get(`/history_project/`),
  getProjectTypeByProjectId: (project_id) =>
    api.get(`/project_type/${project_id}`),
  getAllProjectsWithDetails: () => api.get("project/projects/all/details"),
  getProjectWithDetails: (project_id) =>
    api.get(`project/project_detail/${project_id}`),
  deleteProject: (data) => api.delete("/project/", { data }),
  postProject: (data) => api.post("/project", data),
  patchName: (data) => api.patch("/project/name", data),
  patchAndamentoDoProjeto: (data) =>
    api.patch("/project/andamento_do_projeto", data),
  patchEndDate: (data) => api.patch("/project/end_date", data),
  patchExpectedCompletionDate: (data) =>
    api.patch("/project/projet_expected_completion_date", data),
  patchStartDate: (data) => api.patch("/project/start_date", data),
  patchVerba: (data) => api.patch("/project/verba", data),
  patchStatus: (data) => api.patch("/project/status", data),
  postSaveDocument: (formData) =>
    api.post("/document/save", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export default projectApi;
