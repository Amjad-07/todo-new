import { AnalyticsData } from '../types';
import apiClient from './apiClient';

// This service now makes a real API call to a backend Analytics microservice.
// The backend is responsible for aggregating and calculating all analytics data.
export const getAnalytics = (): Promise<AnalyticsData> => {
    return apiClient.get<AnalyticsData>('/analytics');
};
