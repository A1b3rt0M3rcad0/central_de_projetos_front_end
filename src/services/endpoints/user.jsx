import api from "../api";

const userApi = {
  getWhoAmI: (token) => api.get(`/users/who_am_i/${token}`),
  getAllUser: () => api.get("users/users/all"),
  deleteUser: (data) => api.delete("/users", { data }),
};

export default userApi;
