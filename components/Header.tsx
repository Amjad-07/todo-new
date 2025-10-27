
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';
import { LogoutIcon } from './icons';

interface HeaderProps {
    user: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
    const { logout } = useAuth();

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Microservice Dashboard</h1>
                    </div>
                    <div className="flex items-center">
                         <div className="mr-4 text-right">
                             <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{user?.name}</div>
                             <div className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</div>
                         </div>
                         <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                             {user?.initials}
                         </div>
                        <button
                            onClick={logout}
                            className="ml-4 p-2 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            aria-label="Logout"
                        >
                           <LogoutIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
