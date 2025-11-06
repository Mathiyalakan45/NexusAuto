"use client";

import { useNotificationStore } from '@/lib/store/notificationStore';
import NotificationItem from './NotificationItem';
import { useRouter } from 'next/navigation';

interface NotificationListProps {
  onClose: () => void;
}

export default function NotificationList({ onClose }: NotificationListProps) {
  const router = useRouter();
  const { 
    notifications, 
    unreadCount, 
    markAllAsRead, 
    clearAll,
    getUnreadNotifications 
  } = useNotificationStore();

  const unreadNotifications = getUnreadNotifications();

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all notifications?")) {
      clearAll();
      onClose();
    }
  };

  const handleViewAll = () => {
    onClose();
    router.push('/notifications');
  };

  return (
    <div className="max-h-96 overflow-hidden flex flex-col w-80">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <p className="text-sm text-gray-500">
            {unreadCount} unread {unreadCount === 1 ? 'message' : 'messages'}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium focus:outline-none"
            >
              Mark all read
            </button>
          )}
          
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm text-red-600 hover:text-red-800 font-medium focus:outline-none"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-4.66-7.4 1 1 0 00-1.2-1.2 5.97 5.97 0 01-7.4 4.66 1 1 0 00-1.2 1.2 5.97 5.97 0 014.66 7.4 1 1 0 001.2 1.2 5.97 5.97 0 017.4-4.66z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
            <p className="mt-1 text-sm text-gray-500">
              You're all caught up! New notifications will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {/* Unread notifications */}
            {unreadNotifications.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-blue-50">
                  <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">
                    Unread ({unreadNotifications.length})
                  </span>
                </div>
                {unreadNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                ))}
              </div>
            )}

            {/* Read notifications */}
            {notifications.filter(n => n.isRead).length > 0 && (
              <div>
                <div className="px-4 py-2 bg-gray-50">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Earlier
                  </span>
                </div>
                {notifications
                  .filter(notification => notification.isRead)
                  .map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <button
          onClick={handleViewAll}
          className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
        >
          View all notifications
        </button>
      </div>
    </div>
  );
}