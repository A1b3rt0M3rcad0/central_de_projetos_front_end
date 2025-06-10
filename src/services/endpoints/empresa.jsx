import api from "../api";

const empresaAPI = {
  getAllEmpresas: () => api.get("/empresa/empresa/all"),
  deleteEmpresa: (data) => api.delete("/empresa", { data }),
  postEmpresa: (data) => api.post("/empresa", data),
};

export default empresaAPI;
