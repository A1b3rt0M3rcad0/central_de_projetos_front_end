import api from "../api";

const fiscalAPI = {
  getAllFiscais: () => api.get("/fiscal/fiscal/all"),
  postFiscal: (data) => api.post("/fiscal", data),
  patchFiscal: (data) => api.patch("/fiscal", data),
  deleteFiscal: (data) => api.delete("/fiscal", { data }),
};

export default fiscalAPI;
