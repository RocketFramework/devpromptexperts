'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { NotificationService, Notification } from '@/services/business/NotificationService';
import NotificationItem from '@/components/notifications/NotificationItem';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FaBell, FaCheckDouble } from 'react-icons/fa';

export default function NotificationsPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      if (session?.user?.id) {
        setLoading(true);
        const data = await NotificationService.getUserNotifications(session.user.id, 50); // Fetch more for full page
        setNotifications(data);
        setLoading(false);
      }
    };

    loadNotifications();
  }, [session?.user?.id]);

  const handleMarkAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    await NotificationService.markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    if (session?.user?.id) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      await NotificationService.markAllAsRead(session.user.id);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            {notifications.some(n => !n.is_read) && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <FaCheckDouble /> Mark all as read
              </button>
            )}
          </div>

          <div className="divide-y divide-gray-100">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={handleMarkAsRead}
                />
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBell className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
                <p className="text-gray-500 mt-1">You don&#39;t have any notifications right now.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
