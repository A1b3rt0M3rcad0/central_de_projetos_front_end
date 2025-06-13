import api from "../api";

const userApi = {
  getWhoAmI: (token) => api.get(`/users/who_am_i/${token}`),
  getAllUser: () => api.get("users/users/all"),
  deleteUser: (data) => api.delete("/users", { data }),
  postUser: (data) => api.post("/users", data),
  patchUserEmail: (data) => api.patch("/users/email", data),
  patchUserPassword: (data) => api.patch("/users/password", data),
  getAllUserByRole: (role) => api.patch(`/users/users/all/${role}`),
};

export default userApi;
