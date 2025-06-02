import api from "../api";

const projectApi = {
  getProjectById: (project_id) => api.get(`/project/${project_id}`),
  getHistoryProjectById: () => api.get(`/history_project/`),
  getProjectTypeByProjectId: (project_id) =>
    api.get(`/project_type/${project_id}`),
};

export default projectApi;
