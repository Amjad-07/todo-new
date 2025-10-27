
import React from 'react';
import { AnalyticsData } from '../types';
import { Spinner } from './Spinner';
import { CheckCircleIcon, ClockIcon, DocumentIcon } from './icons';

interface AnalyticsProps {
    data: AnalyticsData | null;
}

const StatCard: React.FC<{ title: string, value: string | number, icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
            {icon}
        </div>
        <div className="ml-3">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const Analytics: React.FC<AnalyticsProps> = ({ data }) => {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Task Analytics</h3>
            {data ? (
                <div className="space-y-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full" style={{ width: `${data.completionRate}%` }}></div>
                    </div>
                    <p className="text-center font-medium text-gray-700 dark:text-gray-300">{data.completionRate}% Complete</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                         <StatCard title="Total" value={data.totalTasks} icon={<DocumentIcon className="h-5 w-5 text-blue-500" />} />
                         <StatCard title="Done" value={data.completedTasks} icon={<CheckCircleIcon className="h-5 w-5 text-green-500" />} />
                         <StatCard title="In Progress" value={data.inProgressTasks} icon={<ClockIcon className="h-5 w-5 text-yellow-500" />} />
                         <StatCard title="To Do" value={data.todoTasks} icon={<DocumentIcon className="h-5 w-5 text-gray-500" />} />
                    </div>

                </div>
            ) : (
                <div className="flex justify-center">
                    <Spinner />
                </div>
            )}
             <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">Data from: Analytics Service</p>
        </div>
    );
};

export default Analytics;
