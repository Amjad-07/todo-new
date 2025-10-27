import { Task } from '../types';
import apiClient from './apiClient';

// This service now makes real API calls to a backend Task microservice.
// The backend would be responsible for all data storage and business logic.

export const getTasks = (): Promise<Task[]> => {
    return apiClient.get<Task[]>('/tasks');
};

export const createTask = (taskData: { title: string; description: string }): Promise<Task> => {
    return apiClient.post<Task>('/tasks', taskData);
};

export const updateTask = (taskId: string, updates: Partial<Task>): Promise<Task> => {
    return apiClient.put<Task>(`/tasks/${taskId}`, updates);
};

export const deleteTask = (taskId: string): Promise<{ id: string }> => {
    // Assuming the backend returns the id of the deleted task for confirmation.
    return apiClient.del<{ id: string }>(`/tasks/${taskId}`);
};
