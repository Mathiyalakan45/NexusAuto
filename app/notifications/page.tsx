"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useNotificationStore } from "@/lib/store/notificationStore";
import { formatRelativeTime } from "@/lib/utils/dateUtils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <NotificationsContent />
    </ProtectedRoute>
  );
}

function NotificationsContent() {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    syncMarkAllAsRead,
    syncClearAll,
    syncMarkAsRead,
    syncDeleteNotification,
    getUnreadNotifications,
    loadNotificationsFromBackend
  } = useNotificationStore();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Load notifications on component mount
  useEffect(() => {
    loadNotificationsFromBackend();
  }, [loadNotificationsFromBackend]);

  const unreadNotifications = getUnreadNotifications();
  
  const filteredNotifications = filter === 'unread' 
    ? unreadNotifications 
    : notifications;

  const handleMarkAllAsRead = async () => {
    await syncMarkAllAsRead();
  };

  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to clear all notifications?")) {
      await syncClearAll();
    }
  };

  const handleMarkAsRead = async (id: string) => {
    await syncMarkAsRead(id);
  };

  const handleDeleteNotification = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      await syncDeleteNotification(id);
    }
  };

  const handleViewDetails = (notificationId: string, actionUrl?: string) => {
    handleMarkAsRead(notificationId);
    if (actionUrl) {
      router.push(actionUrl);
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return (
          <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'error':
        return (
          <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-2 text-gray-600">
            Manage your notifications and stay updated with system activities
          </p>
        </div>

        {/* Actions and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {unreadCount} unread • {notifications.length} total
            </span>
            
            {/* Filter Buttons */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-sm font-medium ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 text-sm font-medium ${
                  filter === 'unread' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Unread
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Mark all as read
              </button>
            )}
            
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
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
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
              </h3>
              <p className="mt-2 text-gray-500">
                {filter === 'unread' 
                  ? "You're all caught up! New notifications will appear here when they arrive."
                  : "You don't have any notifications yet."
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 border-l-4 ${getTypeStyles(notification.type)} transition-all duration-200 hover:shadow-md`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="shrink-0 mt-0.5">
                        {getTypeIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className={`text-lg font-semibold ${
                            !notification.isRead ? 'text-gray-900' : 'text-gray-600'
                          }`}>
                            {notification.title}
                          </h4>
                          
                          <div className="flex items-center space-x-2">
                            {!notification.isRead && (
                              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                New
                              </span>
                            )}
                            {notification.priority === 'high' && (
                              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                Urgent
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-3">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {formatRelativeTime(notification.createdAt)}
                          </span>
                          
                          <div className="flex items-center space-x-3">
                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Mark as read
                              </button>
                            )}
                            
                            {notification.actionUrl && (
                              <button
                                onClick={() => handleViewDetails(notification.id, notification.actionUrl)}
                                className="text-sm text-green-600 hover:text-green-800 font-medium"
                              >
                                View details
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="text-sm text-red-600 hover:text-red-800 font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}