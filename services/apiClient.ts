import { auth } from '../firebase';
import { mockApi } from './mockApi';

// ====================================================================================
// DEVELOPMENT MOCK API CLIENT
// ------------------------------------------------------------------------------------
// This file is currently configured to use a MOCK API (`services/mockApi.ts`)
// to simulate a real backend. This resolves the "File not found" error and allows
// the frontend to be developed and tested independently.
//
// To connect to a real backend, you would re-implement the methods below
// to use `fetch` against your live microservice endpoints.
// ====================================================================================

/**
 * A template function for retrieving the Firebase ID token for the current user.
 * This token should be sent in the Authorization header to a real backend.
 * @returns {Promise<string | null>} The JWT token or null if not logged in.
 */
const getAuthToken = async (): Promise<string | null> => {
    const user = auth.currentUser;
    if (!user) {
        return null;
    }
    return await user.getIdToken();
};


const apiClient = {
    get: <T>(endpoint: string): Promise<T> => {
        switch (endpoint) {
            case '/tasks':
                return mockApi.getTasks() as Promise<T>;
            case '/analytics':
                return mockApi.getAnalytics() as Promise<T>;
            default:
                return Promise.reject(new Error(`Mock GET endpoint not found: ${endpoint}`));
        }
    },
    post: <T>(endpoint: string, body: any): Promise<T> => {
        switch (endpoint) {
            case '/tasks':
                return mockApi.createTask(body) as Promise<T>;
            default:
                return Promise.reject(new Error(`Mock POST endpoint not found: ${endpoint}`));
        }
    },
    put: <T>(endpoint: string, body: any): Promise<T> => {
        // Endpoint format: /tasks/:taskId
        const taskIdMatch = endpoint.match(/^\/tasks\/(.+)$/);
        if (taskIdMatch && taskIdMatch[1]) {
            return mockApi.updateTask(taskIdMatch[1], body) as Promise<T>;
        }
        return Promise.reject(new Error(`Mock PUT endpoint not found: ${endpoint}`));
    },
    del: <T>(endpoint: string): Promise<T> => {
        // Endpoint format: /tasks/:taskId
        const taskIdMatch = endpoint.match(/^\/tasks\/(.+)$/);
        if (taskIdMatch && taskIdMatch[1]) {
            return mockApi.deleteTask(taskIdMatch[1]) as Promise<T>;
        }
        return Promise.reject(new Error(`Mock DELETE endpoint not found: ${endpoint}`));
    },
};

export default apiClient;
