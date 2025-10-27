import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';
import { PlusIcon, TrashIcon, CheckCircleIcon, ClockIcon, DocumentIcon } from './icons';

interface TaskListProps {
    tasks: Task[];
    onTaskCreate: (taskData: { title: string; description: string }) => Promise<void>;
    onTaskUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
    onTaskDelete: (taskId: string) => Promise<void>;
}

const statusConfig = {
    [TaskStatus.ToDo]: { icon: <DocumentIcon className="h-5 w-5 text-gray-500" />, color: 'bg-gray-200 dark:bg-gray-600', text: 'text-gray-800 dark:text-gray-200' },
    [TaskStatus.InProgress]: { icon: <ClockIcon className="h-5 w-5 text-yellow-500" />, color: 'bg-yellow-100 dark:bg-yellow-900/50', text: 'text-yellow-800 dark:text-yellow-200' },
    [TaskStatus.Done]: { icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />, color: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-800 dark:text-green-200' },
};

const statusOptions = [TaskStatus.ToDo, TaskStatus.InProgress, TaskStatus.Done];

const TaskItem: React.FC<{ task: Task, onTaskUpdate: TaskListProps['onTaskUpdate'], onTaskDelete: TaskListProps['onTaskDelete'] }> = ({ task, onTaskUpdate, onTaskDelete }) => {
    
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onTaskUpdate(task.id, { status: e.target.value as TaskStatus });
    };

    return (
        <li className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex-1 pr-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">{task.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{task.description}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Created: {new Date(task.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
                <select
                    value={task.status}
                    onChange={handleStatusChange}
                    className={`text-sm rounded-md border-0 py-1.5 pl-2 pr-8 font-semibold ${statusConfig[task.status].color} ${statusConfig[task.status].text} focus:ring-2 focus:ring-blue-500`}
                >
                    {statusOptions.map(status => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
                <button
                    onClick={() => onTaskDelete(task.id)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Delete task"
                >
                    <TrashIcon className="h-5 w-5" />
                </button>
            </div>
        </li>
    );
};

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskCreate, onTaskUpdate, onTaskDelete }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) return;
        await onTaskCreate({ title, description });
        setTitle('');
        setDescription('');
        setIsCreating(false);
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tasks</h3>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
                >
                    <PlusIcon className="h-5 w-5 mr-1" />
                    New Task
                </button>
            </div>

            {isCreating && (
                <form onSubmit={handleCreate} className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Task title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            required
                        />
                    </div>
                     <div>
                        <textarea
                            placeholder="Task description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">Add Task</button>
                    </div>
                </form>
            )}

            {tasks.length > 0 ? (
                 <ul className="space-y-4">
                    {tasks.map(task => (
                        <TaskItem key={task.id} task={task} onTaskUpdate={onTaskUpdate} onTaskDelete={onTaskDelete} />
                    ))}
                </ul>
            ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No tasks yet. Add one to get started!</p>
                </div>
            )}
             <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">Data from: Task Service</p>
        </div>
    );
};

export default TaskList;
