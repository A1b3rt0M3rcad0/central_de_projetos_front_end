import api from "../../config/api";

const bairroAPI = {
  getAllBairro: () => api.get("/bairro/all"),
  getBairrosWithPagination: (pageSize, page) =>
    api.get(`/bairro/pagination/${pageSize}/${page}`),
  getBairrosWithPaginationAndFilter: (pageSize, page, search) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    return api.get(
      `/bairro/pagination-filter/${pageSize}/${page}?${params.toString()}`
    );
  },
  getProjectsByBairro: (bairroId) => api.get(`/project_bairro/${bairroId}`),
  postBairro: (data) => api.post("/bairro", data),
  patchBairro: (data) => api.patch("/bairro/name", data),
  deleteBairro: (data) => api.delete("/bairro", { data }),
  getCountBairros: () => api.get("/bairro/count/all"),
  getCountProjectsByBairro: () => api.get("/project_bairro/project/count"),
  getProjectVerbaByBairro: () => api.get("/project_bairro/project/verba"),
  getCountProjectByBairroAndType: () =>
    api.get("/project_type/project/types/count"),
  getCountProjectStatusByBairro: () =>
    api.get("/project_bairro/project/status"),
};

export default bairroAPI;
