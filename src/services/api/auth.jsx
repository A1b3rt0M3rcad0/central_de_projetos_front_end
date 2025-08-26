import api from "../../config/api";

const authApi = {
  login: (cpf, password) => api.post("/auth/login", { cpf, password }),
};

export default authApi;
