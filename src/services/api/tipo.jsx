import api from "../../config/api";

const tipoAPI = {
  getAllTipos: () => api.get("/types/all"),
  deleteTipo: (data) => api.delete("/types", { data }),
  patchTipo: (data) => api.patch("/types", data),
  postTipo: (data) => api.post("/types", data),
};

export default tipoAPI;
