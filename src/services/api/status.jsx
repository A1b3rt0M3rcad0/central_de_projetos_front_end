import api from "../../config/api";

const statusAPI = {
  getAllStatus: () => api.get("/status/all"),
  getStatusWithPagination: (pageSize, page) =>
    api.get(`/status/pagination/${pageSize}/${page}`),
  getStatusWithPaginationAndFilter: (pageSize, page, search) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    return api.get(
      `/status/pagination-filter/${pageSize}/${page}?${params.toString()}`
    );
  },
  getProjectsByStatus: (statusId) => api.get(`/status/projects/${statusId}`),
  postStatus: (data) => api.post("/status", data),
  deleteStatus: (data) => api.delete("/status", { data }),
  patchStatus: (data) => api.patch("/status", data),
};

export default statusAPI;
