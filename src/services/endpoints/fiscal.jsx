import api from "../api";

const fiscalAPI = {
  getAllFiscais: () => api.get("/fiscal/fiscal/all"),
  postFiscal: (data) => api.post("/fiscal", data),
  patchFiscal: (data) => api.patch("/fiscal", data),
  deleteFiscal: (data) => api.delete("/fiscal", { data }),
  getCountFiscal: () => api.get("/fiscal/fiscal/count/all"),
};

export default fiscalAPI;
