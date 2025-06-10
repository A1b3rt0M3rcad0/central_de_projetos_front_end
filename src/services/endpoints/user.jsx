import api from "../api";

const userApi = {
  getWhoAmI: (token) => api.get(`/users/who_am_i/${token}`),
};

export default userApi;
