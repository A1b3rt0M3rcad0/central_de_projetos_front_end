import api from "../api";

const fiscalAPI = {
  getAllFiscais: () => api.get("/fiscal/fiscal/all"),
};

export default fiscalAPI;
