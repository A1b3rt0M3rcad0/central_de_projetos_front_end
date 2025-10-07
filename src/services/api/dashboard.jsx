import api from "../../config/api";

const dashboardAPI = {
  /**
   * Busca dados do dashboard de forma otimizada (1 requisição única)
   *
   * @param {string} modules - Módulos separados por vírgula (ex: "counts,projects_by_bairro")
   * @param {string} excludedStatus - IDs de status a excluir separados por vírgula (ex: "13,14")
   * @returns {Promise} Dados completos do dashboard
   */
  getDashboardData: (modules = null, excludedStatus = null) => {
    const params = new URLSearchParams();
    if (modules) params.append("modules", modules);
    if (excludedStatus) params.append("excluded_status", excludedStatus);

    const queryString = params.toString();
    return api.get(`/dashboard/data${queryString ? `?${queryString}` : ""}`);
  },

  /**
   * Busca apenas as contagens (otimizado)
   */
  getCounts: (excludedStatus = null) => {
    return dashboardAPI.getDashboardData("counts", excludedStatus);
  },

  /**
   * Busca todos os dados do dashboard (comportamento padrão)
   */
  getAllData: (excludedStatus = null) => {
    return dashboardAPI.getDashboardData(null, excludedStatus);
  },
};

export default dashboardAPI;
