import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/lib/store/authStore';
import { useNotificationStore } from '@/lib/store/notificationStore';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect() {
    const { user, isAuthenticated } = useAuthStore.getState();
    
    if (!isAuthenticated || !user) {
      console.log('User not authenticated, skipping socket connection');
      return;
    }

    // Determine recipient type based on user role
    const recipientType = user.role === 'ROLE_CUSTOMER' ? 'user' : 'employee';
    
    this.socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000', {
      transports: ['websocket'],
      withCredentials: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to notification server');
      this.isConnected = true;
      
      // Register user with socket server
      this.socket?.emit('register', {
        id: user.id.toString(),
        type: recipientType
      });
    });

    this.socket.on('notification', (notification) => {
      console.log('New notification received:', notification);
      this.handleNewNotification(notification);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from notification server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  private handleNewNotification(notification: any) {
    // Convert backend notification to frontend format
    const frontendNotification = {
      id: notification._id || notification.id,
      title: notification.title,
      message: notification.message,
      type: this.mapNotificationType(notification),
      isRead: notification.read || false,
      createdAt: notification.createdAt || new Date().toISOString(),
      priority: 'medium' as const,
      actionUrl: this.getActionUrl(notification)
    };

    // Add to notification store
    const { addNotification } = useNotificationStore.getState();
    addNotification(frontendNotification);
  }

  private mapNotificationType(notification: any): 'info' | 'warning' | 'success' | 'error' {
    // Map your backend notification types to frontend types
    if (notification.type) {
      return notification.type;
    }
    return 'info';
  }

  private getActionUrl(notification: any): string | undefined {
    // Map notification types to action URLs
    // Customize based on your application needs
    return '/notifications';
  }

  markAsRead(notificationId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('markAsRead', notificationId);
    }
  }

  deleteNotification(notificationId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('deleteNotification', notificationId);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

export const socketService = new SocketService();