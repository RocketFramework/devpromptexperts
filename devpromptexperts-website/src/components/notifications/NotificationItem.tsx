import React from 'react';
import Link from 'next/link';
import { FaInfoCircle, FaCheckCircle, FaExclamationCircle, FaGraduationCap, FaMoneyBillWave } from 'react-icons/fa';
import { Notification } from '@/services/business/NotificationService';

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
  onClick?: () => void;
}

export default function NotificationItem({ notification, onRead, onClick }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'induction':
        return <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center"><FaGraduationCap /></div>;
      case 'payment':
        return <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><FaMoneyBillWave /></div>;
      case 'project':
        return <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"><FaCheckCircle /></div>;
      case 'system':
        return <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center"><FaInfoCircle /></div>;
      default:
        return <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center"><FaInfoCircle /></div>;
    }
  };

  const handleClick = () => {
    if (!notification.is_read) {
      onRead(notification.id);
    }
    if (onClick) onClick();
  };

  const Content = () => (
    <div className={`flex items-start space-x-3 p-3 hover:bg-slate-50 transition-colors ${!notification.is_read ? 'bg-blue-50/30' : ''}`}>
      <div className="flex-shrink-0 mt-1">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <p className={`text-sm ${!notification.is_read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
            {notification.title}
          </p>
          {!notification.is_read && (
            <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notification.message}</p>
        <p className="text-[10px] text-gray-400 mt-1">
          {new Date(notification.created_at).toLocaleDateString()} • {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );

  if (notification.link) {
    return (
      <Link href={notification.link} onClick={handleClick} className="block border-b border-slate-100 last:border-0">
        <Content />
      </Link>
    );
  }

  return (
    <div onClick={handleClick} className="cursor-pointer border-b border-slate-100 last:border-0">
      <Content />
    </div>
  );
}
