import api from "../api";

const statusAPI = {
  getAllStatus: () => api.get("/status/all"),
  postStatus: (data) => api.post("/status", data),
  deleteStatus: (data) => api.delete("/status", { data }),
  patchStatus: (data) => api.patch("/status", data),
};

export default statusAPI;
