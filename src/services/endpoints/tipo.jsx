import api from "../api";

const tipoAPI = {
  getAllTipos: () => api.get("/types/all"),
};

export default tipoAPI;
