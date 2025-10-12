import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import type { Notification } from '../types';
import { useAuth } from './AuthContext';

// Mock initial data
const mockInitialNotifications: Notification[] = [
  { id: '1', text: 'Your credits are running low. Top up now!', timestamp: '2 hours ago', read: false },
  { id: '2', text: 'New feature alert: You can now export chat history.', timestamp: '1 day ago', read: true },
  { id: '3', text: 'Maintenance scheduled for tonight at 2 AM PST.', timestamp: '2 days ago', read: true },
];

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      // In a real app, you would fetch initial notifications here.
      setNotifications(mockInitialNotifications);

      // This timeout simulates a real-time notification from a Socket.IO server.
      const timer = setTimeout(() => {
        const newNotification: Notification = {
          id: `notif-${Date.now()}`,
          text: "A new member, 'Sarah Connor', just joined your organization.",
          timestamp: 'Just now',
          read: false,
        };
        // This is where you'd handle a socket event like `socket.on('new_notification', ...)`
        setNotifications(prev => [newNotification, ...prev]);
      }, 5000); // Simulate a notification after 5 seconds

      return () => clearTimeout(timer);
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = useCallback(() => {
    // This is where you might call an API to mark notifications as read on the backend.
    console.log("Frontend: Marking all notifications as read.");
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};