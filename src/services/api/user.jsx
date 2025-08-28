import api from "../../config/api";

const userApi = {
  // Endpoints existentes
  getWhoAmI: (token) => api.get(`/users/who_am_i/${token}`),
  getAllUser: () => api.get("users/users/all"),
  deleteUser: (data) => api.delete("/users", { data }),
  postUser: (data) => api.post("/users", data),
  patchUserEmail: (data) => api.patch("/users/email", data),
  patchUserPassword: (data) => api.patch("/users/password", data),
  getAllUserByRole: (role) => api.patch(`/users/users/all/${role}`),
  getCountProjectsByUser: () => api.get("/user_project/project/count/all"),

  // Endpoints para funcionalidades do formulário
  getUserByCpf: (cpf) => api.get(`/users/${cpf}`),
  validateCpfExists: (cpf) =>
    api
      .get(`/users/${cpf}`)
      .then(() => true)
      .catch(() => false),
  validateEmailExists: (email) =>
    api
      .get(`/users/validate-email/${email}`)
      .then(() => true)
      .catch(() => false),
  getUsersByRole: (role) => api.get(`/users/users/all/${role}`),
  getUsersSuggestions: (query) => api.get(`/users/suggestions?q=${query}`),
  getUserActivity: (cpf) => api.get(`/users/${cpf}/activity`),
  updateUserName: (data) => api.patch("/users/name", data),
  getUserStats: (cpf) => api.get(`/users/${cpf}/stats`),
};

export default userApi;
