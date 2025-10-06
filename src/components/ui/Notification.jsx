import React, { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
};

export default function Notification({
  type = "info",
  title,
  message,
  duration = 5000,
  onClose,
  className = "",
}) {
  const [isVisible, setIsVisible] = useState(true);
  const Icon = icons[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ease-in-out ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      } ${className}`}
    >
      <div className={`${colors[type]} border rounded-xl p-4 shadow-lg`}>
        <div className="flex items-start gap-3">
          <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            {title && <h4 className="font-semibold text-sm mb-1">{title}</h4>}
            {message && <p className="text-sm opacity-90">{message}</p>}
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-black/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook para gerenciar notificações
export function useNotification() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now();
    const newNotification = { ...notification, id };
    setNotifications((prev) => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const showSuccess = (title, message) => {
    return addNotification({ type: "success", title, message });
  };

  const showError = (title, message) => {
    return addNotification({ type: "error", title, message });
  };

  const showWarning = (title, message) => {
    return addNotification({ type: "warning", title, message });
  };

  const showInfo = (title, message) => {
    return addNotification({ type: "info", title, message });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}

// Container para múltiplas notificações
export function NotificationContainer({ notifications, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Notification
          key={notification.notification_id}
          {...notification}
          onClose={() => onRemove(notification.notification_id)}
        />
      ))}
    </div>
  );
}
