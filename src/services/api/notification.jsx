import api from "../api";

const notificationAPI = {
  // Buscar notificações de um usuário
  getNotifications: async (recipientCpf, params = {}) => {
    const { limit = 20, offset = 0, unreadOnly = false } = params;

    const response = await api.get("/notification/find", {
      params: {
        recipient_cpf: recipientCpf,
        limit,
        offset,
        unread_only: unreadOnly,
      },
    });

    return response.data;
  },

  // Marcar notificação como lida
  markAsRead: async (notificationId) => {
    const response = await api.post(
      "/notification/mark_as_read",
      {},
      {
        params: {
          notification_id: notificationId,
        },
      }
    );

    return response.data;
  },

  // Contar notificações não lidas
  countUnread: async (recipientCpf) => {
    const response = await api.get("/notification/count_unread", {
      params: {
        recipient_cpf: recipientCpf,
      },
    });

    return response.data;
  },
};

export default notificationAPI;
