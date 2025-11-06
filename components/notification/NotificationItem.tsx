"use client";

import { Notification } from '@/types';
import { useNotificationStore } from '@/lib/store/notificationStore';
import { formatRelativeTime } from '@/lib/utils/dateUtils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NotificationItemProps {
  notification: Notification;
}

export default function NotificationItem({ notification }: NotificationItemProps) {
  const { markAsRead, deleteNotification } = useNotificationStore();
  const router = useRouter();

  const getTypeStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
      case 'error':
        return 'bg-red-50 border-red-200 hover:bg-red-100';
      default:
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
    }
  };

  const getTypeIcon = (type: Notification['type']) => {
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

  const handleMarkAsRead = () => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this notification?')) {
      deleteNotification(notification.id);
    }
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMarkAsRead();
    
    if (notification.actionUrl) {
      // Use router.push for programmatic navigation
      router.push(notification.actionUrl);
    }
  };

  const handleItemClick = () => {
    handleMarkAsRead();
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  return (
    <div
      className={`p-4 border-l-4 ${getTypeStyles(notification.type)} ${
        !notification.isRead ? 'border-l-4' : 'border-l-2 opacity-75'
      } transition-all duration-200 hover:shadow-md cursor-pointer`}
      onClick={handleItemClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 mt-0.5">
            {getTypeIcon(notification.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className={`text-sm font-medium ${
                !notification.isRead ? 'text-gray-900' : 'text-gray-600'
              }`}>
                {notification.title}
              </h4>
              
              {notification.priority === 'high' && !notification.isRead && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Urgent
                </span>
              )}
            </div>
            
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
              {notification.message}
            </p>
            
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {formatRelativeTime(notification.createdAt)}
              </span>
              
              <div className="flex items-center space-x-2">
                {notification.actionUrl && (
                  <button
                    onClick={handleActionClick}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium focus:outline-none"
                  >
                    View details
                  </button>
                )}
                
                <button
                  onClick={handleDelete}
                  className="text-xs text-red-600 hover:text-red-800 font-medium focus:outline-none"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}