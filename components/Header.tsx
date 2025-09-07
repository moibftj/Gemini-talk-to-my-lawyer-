
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { IconLogo, IconUser } from '../constants';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  
  return (
    <header className="relative z-10 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center gap-3">
            <IconLogo className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Law Letter AI</span>
          </div>
          <div className="flex items-center gap-4">
            {user && (
                <div className="text-right hidden sm:block">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{user.email}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                </div>
            )}
            <button
              onClick={logout}
              title="Log Out"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Log Out"
            >
              <IconUser className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
