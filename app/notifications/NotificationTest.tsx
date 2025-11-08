"use client";

import { notificationService } from '@/lib/service/notificationService';
import { useAuth } from '@/lib/store/authStore';
import { useState } from 'react';

export function NotificationTest() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');

  const sendTestNotification = async () => {
    if (!user) return;

    try {
      await notificationService.sendNotification({
        userId: user.id.toString(),
        title: 'Test Notification',
        message: 'This is a test notification from the frontend',
        recipientType: user.role === 'ROLE_CUSTOMER' ? 'user' : 'employee'
      });
      setMessage('Test notification sent successfully!');
    } catch (error) {
      setMessage('Failed to send test notification');
    }
  };

  if (!user) return null;

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-semibold mb-2">Notification Test</h3>
      <button
        onClick={sendTestNotification}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Send Test Notification
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}