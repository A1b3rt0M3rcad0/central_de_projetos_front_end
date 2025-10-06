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
  postFiscal: (data) => api.post("/fiscal", data),
  patchFiscal: (data) => api.patch("/fiscal", data),
  deleteFiscal: (data) => api.delete("/fiscal", { data }),
  getCountFiscal: () => api.get("/fiscal/fiscal/count/all"),
  getCountProjectByFiscal: () => api.get("/project_fiscal/project/count"),
};

export default fiscalAPI;
