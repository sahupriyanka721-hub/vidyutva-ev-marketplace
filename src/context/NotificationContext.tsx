import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppNotification } from '../types';
import { storage } from '../services/storageService';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const refreshNotifications = () => {
    setNotifications(storage.getNotifications());
  };

  useEffect(() => {
    refreshNotifications();
  }, []);

  const markAsRead = (id: string) => {
    storage.markNotificationRead(id);
    refreshNotifications();
  };

  const markAllAsRead = () => {
    storage.markAllNotificationsRead();
    refreshNotifications();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};
