import api from "../../config/api";

const tipoAPI = {
  getAllTipos: () => api.get("/types/all"),
  getTiposWithPagination: (pageSize, page) =>
    api.get(`/types/types/pagination/${pageSize}/${page}`),
  getTiposWithPaginationAndFilter: (pageSize, page, search) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    return api.get(
      `/types/types/pagination-filter/${pageSize}/${page}?${params.toString()}`
    );
  },
  deleteTipo: (data) => api.delete("/types", { data }),
  patchTipo: (data) => api.patch("/types", data),
  postTipo: (data) => api.post("/types", data),
};

export default tipoAPI;
