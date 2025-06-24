import api from "../api";

const bairroAPI = {
  getAllBairro: () => api.get("/bairro/bairro/all"),
  postBairro: (data) => api.post("/bairro", data),
  patchBairro: (data) => api.patch("/bairro/name", data),
  deleteBairro: (data) => api.delete("/bairro", { data }),
  getCountBairros: () => api.get("/bairro/count/all"),
  getCountProjectsByBairro: () => api.get("/project_bairro/project/count/"),
  getProjectVerbaByBairro: () => api.get("/project_bairro/project/verba/"),
};

export default bairroAPI;
