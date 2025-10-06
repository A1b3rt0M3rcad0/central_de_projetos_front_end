import React, { useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Filter,
  RefreshCw,
  AlertCircle,
  MessageSquare,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../hooks/useNotifications";
import { ROUTES } from "../../config/constants";
import BasePage from "../../components/layout/BasePage";

const NotificationPage = () => {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh,
  } = useNotifications();
  const navigate = useNavigate();

  const [filter, setFilter] = useState("all"); // 'all', 'unread', 'read'
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "WORK_PROJECT_CREATED":
        return <Bell className="h-5 w-5 text-blue-500" />;
      case "SYSTEM_ALERT":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "ADMIN_MESSAGE":
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case "PROJECT_UPDATE":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "FISCAL_ALERT":
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getNotificationTypeLabel = (type) => {
    switch (type) {
      case "WORK_PROJECT_CREATED":
        return "Novo Work Project";
      case "SYSTEM_ALERT":
        return "Alerta do Sistema";
      case "ADMIN_MESSAGE":
        return "Mensagem Admin";
      case "PROJECT_UPDATE":
        return "Atualização de Projeto";
      case "FISCAL_ALERT":
        return "Alerta Fiscal";
      default:
        return "Notificação";
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.is_read;
    if (filter === "read") return notification.is_read;
    return true;
  });

  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications((prev) =>
      prev.includes(notificationId)
        ? prev.filter((id) => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    const unreadIds = filteredNotifications
      .filter((n) => !n.is_read)
      .map((n) => n.notification_id);

    if (selectedNotifications.length === unreadIds.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(unreadIds);
    }
  };

  const handleMarkSelectedAsRead = async () => {
    await Promise.all(selectedNotifications.map((id) => markAsRead(id)));
    setSelectedNotifications([]);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setSelectedNotifications([]);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.notification_id);
    }

    // Redirecionar para work project se for do tipo WORK_PROJECT_CREATED
    if (
      notification.notification_type === "WORK_PROJECT_CREATED" &&
      notification.related_entity_id
    ) {
      navigate(ROUTES.PROJECTS.WORK_PROJECT_VIEW, {
        state: {
          workProjectId: notification.related_entity_id,
          projectName: `Work Project #${notification.related_entity_id}`,
        },
      });
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <BasePage title="Notificações">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Carregando notificações...</p>
          </div>
        </div>
      </BasePage>
    );
  }

  if (error) {
    return (
      <BasePage title="Notificações">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={refresh}
            className="mt-2 text-red-600 hover:text-red-800 font-medium"
          >
            Tentar novamente
          </button>
        </div>
      </BasePage>
    );
  }

  return (
    <BasePage title="Notificações">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notificações</h1>
            <p className="text-gray-600 mt-1">
              {unreadCount > 0
                ? `${unreadCount} não lidas`
                : "Todas as notificações foram lidas"}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={refresh}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Atualizar</span>
            </button>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <CheckCheck className="h-4 w-4" />
                <span>Marcar todas como lidas</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtrar:</span>
          </div>

          <div className="flex space-x-2">
            {[
              { key: "all", label: "Todas", count: notifications.length },
              { key: "unread", label: "Não lidas", count: unreadCount },
              {
                key: "read",
                label: "Lidas",
                count: notifications.length - unreadCount,
              },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  filter === key
                    ? "bg-blue-100 text-blue-800 border-blue-300"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedNotifications.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-blue-800">
                {selectedNotifications.length} notificação(ões) selecionada(s)
              </span>
              <button
                onClick={handleMarkSelectedAsRead}
                className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Check className="h-4 w-4" />
                <span>Marcar como lidas</span>
              </button>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="bg-white rounded-lg border border-gray-200">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium">
                Nenhuma notificação encontrada
              </p>
              <p className="text-sm">
                {filter === "unread"
                  ? "Você não tem notificações não lidas"
                  : "Você não tem notificações"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filter === "unread" && filteredNotifications.length > 0 && (
                <div className="p-3 bg-gray-50 border-b border-gray-200">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={
                        selectedNotifications.length ===
                        filteredNotifications.length
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      Selecionar todas
                    </span>
                  </label>
                </div>
              )}

              {filteredNotifications.map((notification) => (
                <div
                  key={notification.notification_id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.is_read
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {filter === "unread" && (
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(
                          notification.notification_id
                        )}
                        onChange={() =>
                          handleSelectNotification(notification.notification_id)
                        }
                        className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    )}

                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.notification_type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </h3>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {getNotificationTypeLabel(
                              notification.notification_type
                            )}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {formatDate(notification.created_at)}
                          </span>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>

                      {notification.related_entity_id && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">
                            Relacionado: {notification.related_entity_type} #
                            {notification.related_entity_id}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </BasePage>
  );
};

export default NotificationPage;
