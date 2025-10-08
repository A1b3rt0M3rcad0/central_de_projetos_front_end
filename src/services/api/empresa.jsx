import api from "../../config/api";

const empresaAPI = {
  getAllEmpresas: () => api.get("/empresa/empresa/all"),
  getEmpresasWithPagination: (pageSize, page) =>
    api.get(`/empresa/empresa/pagination/${pageSize}/${page}`),
  getEmpresasWithPaginationAndFilter: (pageSize, page, search) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    return api.get(
      `/empresa/empresa/pagination-filter/${pageSize}/${page}?${params.toString()}`
    );
  },
  getProjectsByEmpresa: (empresaId) =>
    api.get(`/project_empresa/${empresaId}`),
  deleteEmpresa: (data) => api.delete("/empresa", { data }),
  postEmpresa: (data) => api.post("/empresa", data),
  patchEmpresa: (data) => api.patch("/empresa", data),
  getCountEmpresas: () => api.get("/empresa/empresa/count/all"),
  getCountProjectsbyEmpresas: () =>
    api.get("/project_empresa/project/count/all"),
};

export default empresaAPI;
