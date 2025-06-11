import api from "../api";

const bairroAPI = {
  getAllBairro: () => api.get("/bairro/bairro/all"),
};

export default bairroAPI;
