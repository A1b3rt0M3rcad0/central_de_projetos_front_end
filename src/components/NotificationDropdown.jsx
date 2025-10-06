import React, { useEffect, useRef } from "react";
import {
  X,
  Check,
  Clock,
  AlertCircle,
  MessageSquare,
  FileText,
  CheckCheck,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";
import { ROUTES } from "../config/constants";

const NotificationDropdown = ({ onClose, onMarkAllAsRead }) => {
  const { notifications, loading, markAsRead } = useNotifications();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "WORK_PROJECT_CREATED":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "SYSTEM_ALERT":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "ADMIN_MESSAGE":
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case "PROJECT_UPDATE":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "FISCAL_ALERT":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Agora";
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return date.toLocaleDateString("pt-BR");
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
      onClose(); // Fechar dropdown após navegação
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.is_read);
  const readNotifications = notifications.filter((n) => n.is_read).slice(0, 5);

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Notificações</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              navigate(ROUTES.NOTIFICATIONS.LIST);
              onClose();
            }}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Ver todas
          </button>
          {unreadNotifications.length > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Marcar todas como lidas
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">
            Carregando notificações...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Nenhuma notificação encontrada
          </div>
        ) : (
          <>
            {/* Notificações não lidas */}
            {unreadNotifications.length > 0 && (
              <div className="border-b border-gray-100">
                {unreadNotifications.map((notification) => (
                  <div
                    key={notification.notification_id}
                    onClick={() => handleNotificationClick(notification)}
                    className="p-4 hover:bg-gray-50 cursor-pointer border-l-4 border-blue-500 bg-blue-50"
                  >
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.notification_type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDate(notification.created_at)}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Notificações lidas */}
            {readNotifications.length > 0 && (
              <div>
                {readNotifications.map((notification) => (
                  <div
                    key={notification.notification_id}
                    onClick={() => handleNotificationClick(notification)}
                    className="p-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.notification_type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDate(notification.created_at)}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <Check className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => {
              onClose();
              navigate(ROUTES.NOTIFICATIONS.LIST);
            }}
            className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Ver todas as notificações
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
