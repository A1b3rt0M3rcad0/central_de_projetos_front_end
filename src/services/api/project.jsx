import api from "../../config/api";

const projectApi = {
  getProjectById: (project_id) => api.get(`/project/${project_id}`),
  getHistoryProjectById: () => api.get(`/history_project/`),
  getProjectTypeByProjectId: (project_id) =>
    api.get(`/project_type/${project_id}`),
  getAllProjectsWithDetails: () => api.get("/project/all/details"),
  getProjectWithDetails: (project_id) =>
    api.get(`/project/detail/${project_id}`),
  deleteProject: (data) => api.delete("/project", { data }),
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
  deleteDocument: (data) => api.delete("/document", { data }),
  getAllPossiblyAssociationsFromProject: () =>
    api.get("/project/associations/all"),

  deleteUserProjectAssociation: (cpf, project_id) => {
    const data = { cpf: cpf, project_id: project_id };
    api.delete("/user_project", { data });
  },

  deleteProjectBairroAssociation: (bairro_id, project_id) => {
    const data = {
      bairro_id: bairro_id,
      project_id: project_id,
    };
    api.delete("/project_bairro", { data });
  },

  deleteProjectFiscalAssociation: (fiscal_id, project_id) => {
    const data = {
      project_id: project_id,
      fiscal_id: fiscal_id,
    };
    api.delete("/project_fiscal", { data });
  },
  deleteProjectTypeAssociation: (types_id, project_id) => {
    const data = {
      types_id: types_id,
      project_id: project_id,
    };
    api.delete("/project_type", { data });
  },
  deleteProjectEmpresaAssociation: (empresa_id, project_id) => {
    const data = {
      empresa_id: empresa_id,
      project_id: project_id,
    };
    api.delete("/project_empresa", { data });
  },
  postUserProjectAssociation: (cpf, project_id) =>
    api.post("/user_project", { cpf: cpf, project_id: project_id }),

  postProjectBairroAssociation: (bairro_id, project_id) =>
    api.post("/project_bairro", {
      bairro_id: bairro_id,
      project_id: project_id,
    }),

  postProjectFiscalAssociation: (fiscal_id, project_id) => {
    api.post("/project_fiscal", {
      project_id: project_id,
      fiscal_id: fiscal_id,
    });
  },
  postProjectTypeAssociation: (types_id, project_id) => {
    api.post("/project_type", {
      types_id: types_id,
      project_id: project_id,
    });
  },
  postProjectEmpresaAssociation: (empresa_id, project_id) => {
    api.post("/project_empresa", {
      empresa_id: empresa_id,
      project_id: project_id,
    });
  },
  getCountProjects: () => api.get("/project/count/all"),
  getProjectsWithPagination: (pageSize, page) =>
    api.get(`/project/pagination/${pageSize}/${page}`),
  getProjectsWithPaginationAndFilter: (pageSize, page, search) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    return api.get(
      `/project/pagination-filter/${pageSize}/${page}?${params.toString()}`
    );
  },
};

export default projectApi;
