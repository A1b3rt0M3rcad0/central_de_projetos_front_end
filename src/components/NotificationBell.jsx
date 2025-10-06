import React, { useState } from "react";
import { Bell, BellRing } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import NotificationDropdown from "./NotificationDropdown";

const NotificationBell = () => {
  const { unreadCount, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const handleBellClick = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAllAsRead = async () => {
    const success = await markAllAsRead();
    if (success) {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleBellClick}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full transition-colors"
        aria-label="Notificações"
      >
        {unreadCount > 0 ? (
          <BellRing className="h-6 w-6 text-blue-600" />
        ) : (
          <Bell className="h-6 w-6" />
        )}

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown
          onClose={() => setIsOpen(false)}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      )}
    </div>
  );
};

export default NotificationBell;
