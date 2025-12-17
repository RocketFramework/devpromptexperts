import React from 'react';
import Link from 'next/link';
import { FaBell, FaCheckDouble } from 'react-icons/fa';
import { Notification } from '@/services/business/NotificationService';
import NotificationItem from './NotificationItem';

interface NotificationDropdownProps {
  notifications: Notification[];
  isLoading: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
}

export default function NotificationDropdown({ 
  notifications, 
  isLoading, 
  onMarkAsRead, 
  onMarkAllAsRead,
  onClose 
}: NotificationDropdownProps) {
  return (
    <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white text-gray-800 rounded-xl shadow-xl z-50 border border-slate-200 overflow-hidden ring-1 ring-black ring-opacity-5">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
        <h3 className="font-bold text-gray-900">Notifications</h3>
        {notifications.some(n => !n.is_read) && (
          <button 
            onClick={onMarkAllAsRead}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
          >
            <FaCheckDouble /> Mark all read
          </button>
        )}
      </div>
      
      {/* List */}
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-xs text-gray-500">Loading updates...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div>
            {notifications.map(notification => (
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
                onRead={onMarkAsRead}
                onClick={onClose}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaBell className="text-gray-400 text-xl" />
            </div>
            <p className="text-sm font-medium text-gray-900">No notifications</p>
            <p className="text-xs text-gray-500 mt-1">You're all caught up!</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-slate-100 bg-gray-50">
        <Link
          href="/notifications"
          className="block text-center text-xs font-semibold text-blue-600 hover:text-blue-700 py-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200"
          onClick={onClose}
        >
          View All Notifications
        </Link>
      </div>
    </div>
  );
}
