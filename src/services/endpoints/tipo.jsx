import api from "../api";

const tipoAPI = {
  getAllTipos: () => api.get("/types/all"),
  deleteTipo: (data) => api.delete("/types", { data }),
  patchTipo: (data) => api.patch("/types", data),
};

export default tipoAPI;
