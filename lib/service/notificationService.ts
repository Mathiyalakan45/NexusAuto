export interface BackendNotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  status: 'pending' | 'sent';
  recipientType: 'user' | 'employee';
  createdAt: string;
  updatedAt: string;
}

export const notificationService = {
  // Get all notifications for current user
  async getNotifications(userId: string): Promise<BackendNotification[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/notify/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }
    const data = await response.json();
    return data.notifications || [];
  },

  // Mark all notifications as read
  async markAllAsRead(userId: string): Promise<void> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/notify/mark-all-read/${userId}`, {
      method: 'PUT',
    });
    if (!response.ok) {
      throw new Error('Failed to mark notifications as read');
    }
  },

  // Delete a notification
  async deleteNotification(notificationId: string): Promise<void> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/notify/${notificationId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete notification');
    }
  },

  // Delete all notifications for user
  async deleteAllNotifications(userId: string): Promise<void> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/notify/delete-all/${userId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete all notifications');
    }
  },

  // Send a notification (for testing or admin use)
  async sendNotification(notificationData: {
    userId: string;
    title: string;
    message: string;
    recipientType: 'user' | 'employee';
  }): Promise<BackendNotification> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send notification');
    }
    
    const data = await response.json();
    return data.notification;
  }
};