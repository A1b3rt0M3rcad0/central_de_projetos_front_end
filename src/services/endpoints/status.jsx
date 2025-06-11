import api from "../api";

const statusAPI = {
  getAllStatus: () => api.get("/status/all"),
};

export default statusAPI;
