import api from "../../config/api";

const systemConfigAPI = {
  /**
   * Busca todas as configurações ativas do sistema
   */
  getAllConfigs: () => api.get("/dashboard/config"),

  /**
   * Busca uma configuração específica
   * @param {string} configKey - Chave da configuração
   */
  getConfig: (configKey) => {
    const params = new URLSearchParams();
    params.append("config_key", configKey);
    return api.get(`/dashboard/config?${params.toString()}`);
  },

  /**
   * Atualiza uma configuração do sistema
   * @param {string} configKey - Chave da configuração
   * @param {string} configValue - Novo valor (string, JSON, etc)
   */
  updateConfig: (configKey, configValue) => {
    return api.patch("/dashboard/config", {
      config_key: configKey,
      config_value: configValue,
    });
  },

  /**
   * Busca especificamente o excluded_status do dashboard
   */
  getDashboardExcludedStatus: async () => {
    const response = await systemConfigAPI.getConfig(
      "dashboard.excluded_status"
    );
    const config = response.data.content.configs[0];
    return config ? config.parsed_value : [];
  },

  /**
   * Atualiza o excluded_status do dashboard
   * @param {Array<number>} statusIds - Array de IDs de status a excluir
   */
  updateDashboardExcludedStatus: (statusIds) => {
    return systemConfigAPI.updateConfig(
      "dashboard.excluded_status",
      JSON.stringify(statusIds)
    );
  },
};

export default systemConfigAPI;
