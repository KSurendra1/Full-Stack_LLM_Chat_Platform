import React, { useEffect, useRef } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { CheckDoubleIcon } from './icons';

interface NotificationPanelProps {
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const { notifications, markAllAsRead } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  
  return (
    <div ref={panelRef} className="absolute top-full right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-20">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
        <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
            <CheckDoubleIcon className="w-4 h-4" />
            Mark all as read
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          <ul>
            {notifications.map((notification, index) => (
              <li key={notification.id} className={`p-4 ${index < notifications.length - 1 ? 'border-b border-gray-100' : ''} transition-colors ${!notification.read ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>{notification.text}</p>
                <p className="text-xs text-gray-400 mt-1">{notification.timestamp}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-4 text-sm text-gray-500">No new notifications.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
