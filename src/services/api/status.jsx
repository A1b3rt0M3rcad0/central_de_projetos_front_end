import api from "../../config/api";

const statusAPI = {
  getAllStatus: () => api.get("/status/status/all"),
  getStatusWithPagination: (pageSize, page) => 
    api.get(`/status/status/pagination/${pageSize}/${page}`),
  postStatus: (data) => api.post("/status", data),
  deleteStatus: (data) => api.delete("/status", { data }),
  patchStatus: (data) => api.patch("/status", data),
};

export default statusAPI;
