import { Task, TaskStatus, AnalyticsData } from '../types';

// In-memory database for tasks
let tasks: Task[] = [
    {
        id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        title: 'Setup GKE Cluster',
        description: 'Provision a new Google Kubernetes Engine cluster for the microservices.',
        status: TaskStatus.Done,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
    {
        id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1',
        title: 'Deploy Task Service',
        description: 'Containerize and deploy the Node.js Task microservice to GKE.',
        status: TaskStatus.InProgress,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
    {
        id: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12',
        title: 'Configure GCS for Frontend',
        description: 'Setup a Google Cloud Storage bucket to host the static React frontend.',
        status: TaskStatus.ToDo,
        createdAt: new Date().toISOString(),
    },
     {
        id: 'd4e5f6a7-b8c9-0123-4567-890abcdef123',
        title: 'Implement User Authentication',
        description: 'Integrate Firebase Authentication with the frontend and backend services.',
        status: TaskStatus.Done,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    },
];

// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getAnalyticsData = (): AnalyticsData => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === TaskStatus.Done).length;
    const inProgressTasks = tasks.filter(t => t.status === TaskStatus.InProgress).length;
    const todoTasks = tasks.filter(t => t.status === TaskStatus.ToDo).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return { totalTasks, completedTasks, inProgressTasks, todoTasks, completionRate };
};

// --- Mock API implementation ---
export const mockApi = {
    async getTasks(): Promise<Task[]> {
        await delay(300);
        // Return a sorted copy
        return [...tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },

    async createTask(taskData: { title: string; description: string }): Promise<Task> {
        await delay(300);
        const newTask: Task = {
            id: crypto.randomUUID(),
            ...taskData,
            status: TaskStatus.ToDo,
            createdAt: new Date().toISOString(),
        };
        tasks.push(newTask);
        return newTask;
    },

    async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
        await delay(300);
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) {
            throw new Error('Task not found');
        }
        tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
        return tasks[taskIndex];
    },

    async deleteTask(taskId: string): Promise<{ id: string }> {
        await delay(300);
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) {
            throw new Error('Task not found');
        }
        tasks = tasks.filter(t => t.id !== taskId);
        return { id: taskId };
    },

    async getAnalytics(): Promise<AnalyticsData> {
        await delay(400); // Make it slightly slower to simulate a separate service
        return getAnalyticsData();
    }
};
