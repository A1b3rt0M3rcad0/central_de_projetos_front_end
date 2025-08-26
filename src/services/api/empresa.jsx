import api from "../../config/api";

const empresaAPI = {
  getAllEmpresas: () => api.get("/empresa/empresa/all"),
  deleteEmpresa: (data) => api.delete("/empresa", { data }),
  postEmpresa: (data) => api.post("/empresa", data),
  patchEmpresa: (data) => api.patch("/empresa", data),
  getCountEmpresas: () => api.get("/empresa/empresa/count/all"),
  getCountProjectsbyEmpresas: () =>
    api.get("/project_empresa/project/count/all"),
};

export default empresaAPI;
