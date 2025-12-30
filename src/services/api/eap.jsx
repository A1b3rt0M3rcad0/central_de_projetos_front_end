import api from "../api";

/**
 * Serviço para gerenciamento de EAP (Estrutura Analítica do Projeto)
 */
const eapService = {
  /**
   * Busca a EAP de um projeto específico
   * @param {number} projectId - ID do projeto
   * @returns {Promise} - Dados da EAP do projeto
   */
  async getProjectEAP(projectId) {
    try {
      const response = await api.get(`/eap/project/${projectId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar EAP do projeto:", error);
      throw error;
    }
  },

  /**
   * Busca uma EAP específica por ID
   * @param {number} eapId - ID da EAP
   * @returns {Promise} - Dados da EAP
   */
  async getEAP(eapId) {
    try {
      const response = await api.get(`/eap/`, {
        params: { eap_id: eapId },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar EAP:", error);
      throw error;
    }
  },

  /**
   * Busca todos os templates de EAP disponíveis
   * @returns {Promise} - Lista de templates
   */
  async getTemplates() {
    try {
      const response = await api.get("/eap/templates");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar templates de EAP:", error);
      throw error;
    }
  },

  /**
   * Cria uma nova EAP para um projeto
   * @param {Object} eapData - Dados da EAP
   * @param {string} eapData.name - Nome da EAP
   * @param {string} eapData.description - Descrição da EAP
   * @param {number} eapData.project_id - ID do projeto
   * @param {string} eapData.created_by - CPF do usuário criador
   * @param {number} [eapData.template_source_id] - ID do template (opcional)
   * @param {boolean} [eapData.is_template] - Se é um template (opcional)
   * @returns {Promise} - EAP criada
   */
  async createEAP(eapData) {
    try {
      const response = await api.post("/eap", eapData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar EAP:", error);
      throw error;
    }
  },

  /**
   * Atualiza uma EAP existente
   * @param {number} eapId - ID da EAP
   * @param {Object} updates - Dados a serem atualizados
   * @param {string} [updates.name] - Novo nome
   * @param {string} [updates.description] - Nova descrição
   * @returns {Promise} - EAP atualizada
   */
  async updateEAP(eapId, updates) {
    try {
      const response = await api.put(`/eap/${eapId}`, updates);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar EAP:", error);
      throw error;
    }
  },

  /**
   * Cria um novo item na EAP
   * @param {Object} itemData - Dados do item
   * @param {number} itemData.eap_id - ID da EAP
   * @param {string} itemData.code - Código hierárquico (ex: "1.1.1")
   * @param {string} itemData.name - Nome do item
   * @param {string} itemData.description - Descrição do item
   * @param {string} itemData.type - Tipo (fase, entrega, atividade, tarefa)
   * @param {number} [itemData.parent_id] - ID do item pai (opcional)
   * @param {string} itemData.responsible - Responsável pelo item
   * @param {string} itemData.start_date - Data de início (ISO format)
   * @param {string} itemData.end_date - Data de fim (ISO format)
   * @param {number} itemData.budget - Orçamento do item
   * @param {string} [itemData.status] - Status (opcional, padrão: nao_iniciado)
   * @param {number} [itemData.progress] - Progresso (opcional, padrão: 0)
   * @returns {Promise} - Item criado
   */
  async createItem(itemData) {
    try {
      const response = await api.post("/eap/items", itemData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar item da EAP:", error);
      throw error;
    }
  },

  /**
   * Atualiza um item da EAP existente
   * @param {number} itemId - ID do item
   * @param {Object} updates - Dados a serem atualizados
   * @returns {Promise} - Item atualizado
   */
  async updateItem(itemId, updates) {
    try {
      const response = await api.put(`/eap/items/${itemId}`, updates);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar item da EAP:", error);
      throw error;
    }
  },

  /**
   * Exclui uma EAP
   * @param {number} eapId - ID da EAP
   * @returns {Promise} - Confirmação da exclusão
   */
  async deleteEAP(eapId) {
    try {
      const response = await api.delete(`/eap/${eapId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao excluir EAP:", error);
      throw error;
    }
  },

  /**
   * Exclui um item da EAP
   * @param {number} itemId - ID do item
   * @returns {Promise} - Confirmação da exclusão
   */
  async deleteItem(itemId) {
    try {
      const response = await api.delete(`/eap/items/${itemId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao excluir item da EAP:", error);
      throw error;
    }
  },

  /**
   * Busca dados otimizados para Gantt Chart de um projeto
   * @param {number} projectId - ID do projeto
   * @returns {Promise} - Dados formatados para Gantt (projeto, EAP, tasks, links, estatísticas)
   */
  async getGanttData(projectId) {
    try {
      const response = await api.get(`/eap/gantt/project/${projectId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dados do Gantt:", error);
      throw error;
    }
  },

  // ========== MÉTODOS DE DEPENDÊNCIAS ==========

  /**
   * Cria uma dependência entre dois itens da EAP
   * @param {Object} dependencyData - Dados da dependência
   * @param {number} dependencyData.successor_id - ID do item que depende
   * @param {number} dependencyData.predecessor_id - ID do item do qual depende
   * @param {string} [dependencyData.dependency_type] - Tipo: FS, SS, FF, SF (padrão: FS)
   * @param {number} [dependencyData.lag_days] - Atraso em dias (padrão: 0)
   * @returns {Promise} - Dependência criada
   */
  async createDependency(dependencyData) {
    try {
      const response = await api.post("/eap/dependencies", dependencyData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar dependência:", error);
      throw error;
    }
  },

  /**
   * Busca TODAS as dependências de uma EAP de uma vez (OTIMIZADO)
   * @param {number} eapId - ID da EAP
   * @returns {Promise} - Objeto com todas as dependências por item
   */
  async getAllEAPDependencies(eapId) {
    try {
      const response = await api.get(`/eap/${eapId}/all-dependencies`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar todas as dependências da EAP:", error);
      throw error;
    }
  },

  /**
   * Busca todas as dependências de um item da EAP
   * @param {number} itemId - ID do item
   * @returns {Promise} - Objeto com predecessors e successors
   */
  async getItemDependencies(itemId) {
    try {
      const response = await api.get(`/eap/items/${itemId}/dependencies`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dependências do item:", error);
      throw error;
    }
  },

  /**
   * Remove uma dependência
   * @param {number} dependencyId - ID da dependência
   * @returns {Promise} - Confirmação da exclusão
   */
  async deleteDependency(dependencyId) {
    try {
      const response = await api.delete(`/eap/dependencies/${dependencyId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao deletar dependência:", error);
      throw error;
    }
  },
};

export default eapService;
