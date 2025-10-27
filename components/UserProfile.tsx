import React from 'react';
import { User } from '../types';
import { Spinner } from './Spinner';

interface UserProfileProps {
    user: User | null;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  
    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Profile</h3>
            <div className="flex items-center space-x-4">
                {user ? (
                    <>
                        <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                            {user.initials}
                        </div>
                        <div>
                            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{user.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                    </>
                ) : (
                    <Spinner />
                )}
            </div>
            <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">Data from: Authentication Service</p>
        </div>
    );
};

export default UserProfile;