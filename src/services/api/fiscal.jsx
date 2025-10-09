import api from "../../config/api";

const fiscalAPI = {
  getAllFiscais: () => api.get("/fiscal/fiscal/all"),
  getFiscaisWithPagination: (pageSize, page) =>
    api.get(`/fiscal/fiscal/pagination/${pageSize}/${page}`),
  getFiscaisWithPaginationAndFilter: (pageSize, page, search) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    return api.get(
      `/fiscal/fiscais/pagination-filter/${pageSize}/${page}?${params.toString()}`
    );
  },
  getProjectsByFiscal: (fiscalId) => api.get(`/project_fiscal/${fiscalId}`),
  getWorkProjectsByFiscal: (fiscalId, pageSize, page) =>
    api.post(`/work_project/fiscal/${fiscalId}/pagination/${pageSize}/${page}`),
  postFiscal: (data) => api.post("/fiscal", data),
  postFiscalComplete: (data) => api.post("/fiscal/insert-all", data),
  patchFiscal: (data) => api.patch("/fiscal", data),
  patchFiscalEmail: (data) => api.patch("/fiscal/update-email", data),
  patchFiscalPassword: (data) => api.patch("/fiscal/update-password", data),
  patchFiscalPhone: (data) => api.patch("/fiscal/update-phone", data),
  patchFiscalStatus: (fiscalId, isActive) =>
    api.patch(`/fiscal/${fiscalId}/status`, { is_active: isActive }),
  deleteFiscal: (data) => api.delete("/fiscal", { data }),
  getCountFiscal: () => api.get("/fiscal/fiscal/count/all"),
  getCountProjectByFiscal: () => api.get("/project_fiscal/project/count"),
};

export default fiscalAPI;
