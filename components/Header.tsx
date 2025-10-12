import React, { useState, useRef, useEffect } from 'react';
import NotificationPanel from './NotificationPanel';
import { BellIcon, ClockIcon, LogoutIcon } from './icons';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  credits: number;
}

const UserDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
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

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 hover:bg-gray-100 p-1.5 rounded-lg">
                 <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
                    {user.name.charAt(0)}
                </div>
                <span className="font-semibold text-sm hidden md:inline">{user.name}</span>
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    <div className="p-2 border-b border-gray-200">
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="p-1">
                        <button onClick={logout} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md">
                            <LogoutIcon className="w-4 h-4" />
                            Log Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

const Header: React.FC<HeaderProps> = ({ credits }) => {
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const { unreadCount } = useNotifications();

  return (
    <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shrink-0 h-16">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-gray-900">AI Chat</h1>
      </div>
      <div className="flex items-center gap-4">
        {/* Credits Counter */}
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full text-sm font-medium">
          <ClockIcon className="w-5 h-5 text-blue-600" />
          <span className="text-blue-800 font-semibold">{credits.toLocaleString()}</span>
        </div>
        
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setNotificationsOpen(!isNotificationsOpen)} 
            className="text-gray-500 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <BellIcon className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
          {isNotificationsOpen && (
            <NotificationPanel 
              onClose={() => setNotificationsOpen(false)}
            />
          )}
        </div>
        
        {/* User Dropdown */}
        <UserDropdown />
      </div>
    </header>
  );
};

export default Header;
