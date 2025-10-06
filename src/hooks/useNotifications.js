import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import notificationAPI from "../services/api/notification";

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Buscar notificações
  const fetchNotifications = useCallback(
    async (params = {}) => {
      console.log("🔔 fetchNotifications chamado", {
        user: user,
        cpf: user?.cpf,
      });
      if (!user?.cpf) {
        console.log("❌ CPF não encontrado no usuário");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log("📡 Fazendo requisição para buscar notificações...");

        const response = await notificationAPI.getNotifications(
          user.cpf,
          params
        );
        console.log("✅ Resposta da API:", response);
        setNotifications(response.notifications || []);
      } catch (err) {
        console.error("❌ Erro ao buscar notificações:", err);
        setError(err.response?.data?.error || "Erro ao carregar notificações");
      } finally {
        setLoading(false);
      }
    },
    [user?.cpf]
  );

  // Contar notificações não lidas
  const fetchUnreadCount = useCallback(async () => {
    if (!user?.cpf) return;

    try {
      const response = await notificationAPI.countUnread(user.cpf);
      setUnreadCount(response.unread_count || 0);
    } catch (err) {
      console.error("Erro ao contar notificações não lidas:", err);
    }
  }, [user?.cpf]);

  // Marcar notificação como lida
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);

      // Atualizar estado local
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.notification_id === notificationId
            ? {
                ...notification,
                is_read: true,
                read_at: new Date().toISOString(),
              }
            : notification
        )
      );

      // Atualizar contador
      setUnreadCount((prev) => Math.max(0, prev - 1));

      return true;
    } catch (err) {
      console.error("Erro ao marcar notificação como lida:", err);
      setError(
        err.response?.data?.error || "Erro ao marcar notificação como lida"
      );
      return false;
    }
  }, []);

  // Marcar todas como lidas
  const markAllAsRead = useCallback(async () => {
    if (!user?.cpf) return;

    try {
      // Buscar todas as notificações não lidas
      const unreadNotifications = notifications.filter((n) => !n.is_read);

      // Marcar cada uma como lida
      await Promise.all(
        unreadNotifications.map((notification) =>
          notificationAPI.markAsRead(notification.notification_id)
        )
      );

      // Atualizar estado local
      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          is_read: true,
          read_at: new Date().toISOString(),
        }))
      );

      setUnreadCount(0);

      return true;
    } catch (err) {
      console.error("Erro ao marcar todas as notificações como lidas:", err);
      setError(err.response?.data?.error || "Erro ao marcar todas como lidas");
      return false;
    }
  }, [notifications, user?.cpf]);

  // Carregar dados iniciais
  useEffect(() => {
    if (user?.cpf) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [user?.cpf, fetchNotifications, fetchUnreadCount]);

  // Atualizar contador a cada 30 segundos
  useEffect(() => {
    if (!user?.cpf) return;

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [user?.cpf, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    refresh: () => {
      fetchNotifications();
      fetchUnreadCount();
    },
  };
};
