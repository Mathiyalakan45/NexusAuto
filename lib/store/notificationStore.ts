import { create } from 'zustand';
import { Notification, NotificationState } from '@/types';

interface NotificationStore extends NotificationState {
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  setNotifications: (notifications: Notification[]) => void;
  setConnectionStatus: (status: boolean) => void;
  getUnreadNotifications: () => Notification[];
  getNotificationsByType: (type: Notification['type']) => Notification[];
}

// Generate a more reliable ID
const generateId = () => {
  return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const mockNotifications: Notification[] = [
  {
    id: generateId(),
    title: 'Welcome to NexusAuto!',
    message: 'Your account has been successfully created. Start by exploring our services.',
    type: 'success',
    isRead: false,
    createdAt: new Date().toISOString(),
    actionUrl: '/services',
    priority: 'medium'
  },
  {
    id: generateId(),
    title: 'New Appointment Scheduled',
    message: 'Your oil change service is scheduled for tomorrow at 10:00 AM',
    type: 'info',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    actionUrl: '/customer/appointments',
    priority: 'medium'
  },
  {
    id: generateId(),
    title: 'Vehicle Service Completed',
    message: 'Service for your Honda Civic (ABC-123) has been completed successfully',
    type: 'success',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    actionUrl: '/customer/vehicles',
    priority: 'low'
  },
  {
    id: generateId(),
    title: 'Service Reminder',
    message: 'Your Toyota Camry is due for routine maintenance next week',
    type: 'warning',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    actionUrl: '/customer/vehicles',
    priority: 'medium'
  }
];

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: mockNotifications,
  unreadCount: mockNotifications.filter(n => !n.isRead).length,
  isConnected: true,

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
  }
}));