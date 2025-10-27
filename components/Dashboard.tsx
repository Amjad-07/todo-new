import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Task, AnalyticsData } from '../types';
import * as taskService from '../services/taskService';
import * as analyticsService from '../services/analyticsService';

import Header from './Header';
import UserProfile from './UserProfile';
import Analytics from './Analytics';
import TaskList from './TaskList';
import { Spinner } from './Spinner';

const Dashboard: React.FC = () => {
    const { user: authUser } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch tasks and analytics in parallel from their respective microservices
            const [fetchedTasks, analyticsData] = await Promise.all([
                taskService.getTasks(),
                analyticsService.getAnalytics()
            ]);
            setTasks(fetchedTasks);
            setAnalytics(analyticsData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load dashboard data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleTaskCreate = async (taskData: { title: string; description: string }) => {
        try {
            const newTask = await taskService.createTask(taskData);
            setTasks(prevTasks => [newTask, ...prevTasks].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            
            // Re-fetch analytics data since the totals have changed
            const newAnalytics = await analyticsService.getAnalytics();
            setAnalytics(newAnalytics);
        } catch (err) {
            console.error("Failed to create task", err);
            setError(err instanceof Error ? err.message : 'Could not create task.');
        }
    };

    const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
        try {
            const updatedTask = await taskService.updateTask(taskId, updates);
            setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? updatedTask : t));

            // Re-fetch analytics if the status changed, as it affects completion stats.
            if (updates.status) {
                const newAnalytics = await analyticsService.getAnalytics();
                setAnalytics(newAnalytics);
            }
        } catch (err) {
            console.error("Failed to update task", err);
            setError(err instanceof Error ? err.message : 'Could not update task.');
        }
    };

    const handleTaskDelete = async (taskId: string) => {
        try {
            await taskService.deleteTask(taskId);
            setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
            
            // Re-fetch analytics data since the totals have changed
            const newAnalytics = await analyticsService.getAnalytics();
            setAnalytics(newAnalytics);
        } catch (err) {
            console.error("Failed to delete task", err);
            setError(err instanceof Error ? err.message : 'Could not delete task.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-red-500">
                <div className="text-center">
                    <p className="font-semibold">Error: {error}</p>
                    <button onClick={fetchData} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <Header user={authUser} />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 space-y-6">
                            <UserProfile user={authUser} />
                            <Analytics data={analytics} />
                        </div>
                        <div className="lg:col-span-2">
                             <TaskList
                                tasks={tasks}
                                onTaskCreate={handleTaskCreate}
                                onTaskUpdate={handleTaskUpdate}
                                onTaskDelete={handleTaskDelete}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
