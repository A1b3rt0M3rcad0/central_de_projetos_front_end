import api from "../api";

const authApi = {
  login: (cpf, password) => api.post("/auth/login", { cpf, password }),
};

export default authApi;
