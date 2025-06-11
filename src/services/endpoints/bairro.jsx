import api from "../api";

const bairroAPI = {
  getAllBairro: () => api.get("/bairro/bairro/all"),
  postBairro: (data) => api.post("/bairro", data),
  patchBairro: (data) => api.patch("/bairro/name", data),
  deleteBairro: (data) => api.delete("/bairro", { data }),
};

export default bairroAPI;
