"use client";

import { useState, useRef, useEffect } from 'react';
import { useNotificationStore } from '@/lib/store/notificationStore';
import NotificationList from './NotificationList';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useNotificationStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg
          className="h-6 w-6"
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
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <NotificationList onClose={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
}