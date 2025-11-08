import { create } from 'zustand';
import { Notification, NotificationState } from '@/types';
import { notificationService } from '@/lib/service/notificationService';
import { socketService } from '@/lib/service/socketService';
import { useAuthStore } from './authStore';

interface NotificationStore extends NotificationState {
  // Local actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  setNotifications: (notifications: Notification[]) => void;
  setConnectionStatus: (status: boolean) => void;
  getUnreadNotifications: () => Notification[];
  getNotificationsByType: (type: Notification['type']) => Notification[];
  
  // Backend sync actions
  loadNotificationsFromBackend: () => Promise<void>;
  syncMarkAsRead: (id: string) => Promise<void>;
  syncDeleteNotification: (id: string) => Promise<void>;
  syncMarkAllAsRead: () => Promise<void>;
  syncClearAll: () => Promise<void>;
  initializeSocket: () => void;
  disconnectSocket: () => void;
}

const generateId = () => {
  return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Convert backend notification to frontend format
const mapBackendToFrontendNotification = (backendNotif: any): Notification => ({
  id: backendNotif._id || backendNotif.id,
  title: backendNotif.title,
  message: backendNotif.message,
  type: 'info', // You can map this based on your backend data
  isRead: backendNotif.read || false,
  createdAt: backendNotif.createdAt || new Date().toISOString(),
  priority: 'medium',
  actionUrl: '/notifications'
});

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isConnected: false,

  // Local actions (immediate UI update)
  addNotification: (notificationData) => {
    const newNotification: Notification = {
      ...notificationData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      isRead: false
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }));
  },

  markAsRead: (id: string) => {
    set((state) => {
      const updatedNotifications = state.notifications.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      );
      
      return {
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter(n => !n.isRead).length
      };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(notification => ({
        ...notification,
        isRead: true
      })),
      unreadCount: 0
    }));
  },

  deleteNotification: (id: string) => {
    set((state) => {
      const notificationToDelete = state.notifications.find(n => n.id === id);
      const updatedNotifications = state.notifications.filter(n => n.id !== id);
      
      return {
        notifications: updatedNotifications,
        unreadCount: notificationToDelete && !notificationToDelete.isRead 
          ? state.unreadCount - 1 
          : state.unreadCount
      };
    });
  },

  clearAll: () => {
    set({
      notifications: [],
      unreadCount: 0
    });
  },

  setNotifications: (notifications: Notification[]) => {
    set({
      notifications,
      unreadCount: notifications.filter(n => !n.isRead).length
    });
  },

  setConnectionStatus: (status: boolean) => {
    set({ isConnected: status });
  },

  getUnreadNotifications: () => {
    return get().notifications.filter(notification => !notification.isRead);
  },

  getNotificationsByType: (type: Notification['type']) => {
    return get().notifications.filter(notification => notification.type === type);
  },

  // Backend sync actions
  loadNotificationsFromBackend: async () => {
    try {
      const { user } = useAuthStore.getState();
      if (!user) return;

      const backendNotifications = await notificationService.getNotifications(user.id.toString());
      const frontendNotifications = backendNotifications.map(mapBackendToFrontendNotification);
      
      set({
        notifications: frontendNotifications,
        unreadCount: frontendNotifications.filter(n => !n.isRead).length
      });
    } catch (error) {
      console.error('Failed to load notifications from backend:', error);
    }
  },

  syncMarkAsRead: async (id: string) => {
    try {
      // Update locally first for immediate feedback
      get().markAsRead(id);
      
      // Sync with backend
      socketService.markAsRead(id);
    } catch (error) {
      console.error('Failed to sync mark as read:', error);
    }
  },

  syncDeleteNotification: async (id: string) => {
    try {
      // Update locally first for immediate feedback
      get().deleteNotification(id);
      
      // Sync with backend
      await notificationService.deleteNotification(id);
      socketService.deleteNotification(id);
    } catch (error) {
      console.error('Failed to sync delete notification:', error);
    }
  },

  syncMarkAllAsRead: async () => {
    try {
      const { user } = useAuthStore.getState();
      if (!user) return;

      // Update locally first
      get().markAllAsRead();
      
      // Sync with backend
      await notificationService.markAllAsRead(user.id.toString());
    } catch (error) {
      console.error('Failed to sync mark all as read:', error);
    }
  },

  syncClearAll: async () => {
    try {
      const { user } = useAuthStore.getState();
      if (!user) return;

      // Update locally first
      get().clearAll();
      
      // Sync with backend
      await notificationService.deleteAllNotifications(user.id.toString());
    } catch (error) {
      console.error('Failed to sync clear all:', error);
    }
  },

  initializeSocket: () => {
    socketService.connect();
    set({ isConnected: true });
  },

  disconnectSocket: () => {
    socketService.disconnect();
    set({ isConnected: false });
  }
}));