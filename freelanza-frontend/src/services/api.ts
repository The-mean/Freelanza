import axios, { AxiosError, AxiosResponse } from 'axios';
import {
    ApiResponse,
    AuthResponse,
    Conversation,
    Job,
    LoginCredentials,
    Message,
    Notification,
    PaginatedResponse,
    Payment,
    Profile,
    Proposal,
    RegisterData,
    User
} from '../types';

// Base API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config;

        // If error is 401 (Unauthorized) and it's not a refresh token request
        if (error.response?.status === 401 &&
            originalRequest &&
            !(originalRequest.url?.includes('auth/refresh-token'))) {

            // Try to refresh token
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const res = await api.post<ApiResponse<AuthResponse>>('/auth/refresh-token', {
                    refreshToken
                });

                // If token refresh was successful
                if (res.data.success && res.data.data) {
                    // Update tokens
                    localStorage.setItem('token', res.data.data.token);
                    localStorage.setItem('refreshToken', res.data.data.refreshToken);

                    // Update Authorization header
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${res.data.data.token}`;
                    }

                    // Retry original request
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // If refresh token is invalid, logout user
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

// Helper function to handle API responses
const handleResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
    if (!response.data.success) {
        throw new Error(response.data.error || 'Something went wrong');
    }
    return response.data.data as T;
};

// Auth services
export const authService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
        const data = handleResponse(response);

        // Save tokens
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);

        return data;
    },

    register: async (userData: RegisterData): Promise<AuthResponse> => {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', userData);
        const data = handleResponse(response);

        // Save tokens
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);

        return data;
    },

    logout: (): void => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    },

    forgotPassword: async (email: string): Promise<void> => {
        const response = await api.post<ApiResponse<void>>('/auth/forgot-password', { email });
        handleResponse(response);
    },

    resetPassword: async (token: string, password: string): Promise<void> => {
        const response = await api.post<ApiResponse<void>>('/auth/reset-password', { token, password });
        handleResponse(response);
    },

    verifyEmail: async (token: string): Promise<void> => {
        const response = await api.get<ApiResponse<void>>(`/auth/verify-email/${token}`);
        handleResponse(response);
    }
};

// User services
export const userService = {
    getCurrentUser: async (): Promise<User> => {
        const response = await api.get<ApiResponse<User>>('/users/me');
        return handleResponse(response);
    },

    updateProfile: async (userData: Partial<User>): Promise<User> => {
        const response = await api.put<ApiResponse<User>>('/users/me', userData);
        return handleResponse(response);
    },

    getProfile: async (userId: string): Promise<Profile> => {
        const response = await api.get<ApiResponse<Profile>>(`/users/${userId}/profile`);
        return handleResponse(response);
    },

    updatePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
        const response = await api.put<ApiResponse<void>>('/users/me/password', {
            currentPassword,
            newPassword
        });
        handleResponse(response);
    }
};

// Job services
export const jobService = {
    getJobs: async (params?: any): Promise<PaginatedResponse<Job>> => {
        const response = await api.get<ApiResponse<PaginatedResponse<Job>>>('/jobs', { params });
        return handleResponse(response);
    },

    getJobById: async (jobId: string): Promise<Job> => {
        const response = await api.get<ApiResponse<Job>>(`/jobs/${jobId}`);
        return handleResponse(response);
    },

    createJob: async (jobData: Partial<Job>): Promise<Job> => {
        const response = await api.post<ApiResponse<Job>>('/jobs', jobData);
        return handleResponse(response);
    },

    updateJob: async (jobId: string, jobData: Partial<Job>): Promise<Job> => {
        const response = await api.put<ApiResponse<Job>>(`/jobs/${jobId}`, jobData);
        return handleResponse(response);
    },

    deleteJob: async (jobId: string): Promise<void> => {
        const response = await api.delete<ApiResponse<void>>(`/jobs/${jobId}`);
        handleResponse(response);
    },

    getClientJobs: async (params?: any): Promise<PaginatedResponse<Job>> => {
        const response = await api.get<ApiResponse<PaginatedResponse<Job>>>('/jobs/client', { params });
        return handleResponse(response);
    },

    uploadAttachment: async (jobId: string, file: File): Promise<any> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post<ApiResponse<any>>(`/jobs/${jobId}/attachments`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return handleResponse(response);
    }
};

// Proposal services
export const proposalService = {
    getProposalsForJob: async (jobId: string, params?: any): Promise<PaginatedResponse<Proposal>> => {
        const response = await api.get<ApiResponse<PaginatedResponse<Proposal>>>(`/jobs/${jobId}/proposals`, { params });
        return handleResponse(response);
    },

    getMyProposals: async (params?: any): Promise<PaginatedResponse<Proposal>> => {
        const response = await api.get<ApiResponse<PaginatedResponse<Proposal>>>('/proposals/me', { params });
        return handleResponse(response);
    },

    submitProposal: async (jobId: string, proposalData: Partial<Proposal>): Promise<Proposal> => {
        const response = await api.post<ApiResponse<Proposal>>(`/jobs/${jobId}/proposals`, proposalData);
        return handleResponse(response);
    },

    updateProposalStatus: async (proposalId: string, status: 'accepted' | 'rejected'): Promise<Proposal> => {
        const response = await api.put<ApiResponse<Proposal>>(`/proposals/${proposalId}/status`, { status });
        return handleResponse(response);
    },

    uploadAttachment: async (proposalId: string, file: File): Promise<any> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post<ApiResponse<any>>(`/proposals/${proposalId}/attachments`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return handleResponse(response);
    }
};

// Messaging services
export const messageService = {
    getConversations: async (): Promise<Conversation[]> => {
        const response = await api.get<ApiResponse<Conversation[]>>('/conversations');
        return handleResponse(response);
    },

    getConversation: async (conversationId: string): Promise<Conversation> => {
        const response = await api.get<ApiResponse<Conversation>>(`/conversations/${conversationId}`);
        return handleResponse(response);
    },

    getMessages: async (conversationId: string, params?: any): Promise<PaginatedResponse<Message>> => {
        const response = await api.get<ApiResponse<PaginatedResponse<Message>>>(`/conversations/${conversationId}/messages`, { params });
        return handleResponse(response);
    },

    sendMessage: async (conversationId: string, text: string, attachments?: File[]): Promise<Message> => {
        if (attachments && attachments.length > 0) {
            const formData = new FormData();
            formData.append('text', text);

            attachments.forEach((file, index) => {
                formData.append(`attachments[${index}]`, file);
            });

            const response = await api.post<ApiResponse<Message>>(`/conversations/${conversationId}/messages`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return handleResponse(response);
        }

        const response = await api.post<ApiResponse<Message>>(`/conversations/${conversationId}/messages`, { text });
        return handleResponse(response);
    },

    createConversation: async (recipientId: string, initialMessage?: string): Promise<Conversation> => {
        const response = await api.post<ApiResponse<Conversation>>('/conversations', {
            recipientId,
            initialMessage
        });
        return handleResponse(response);
    },

    markAsRead: async (conversationId: string): Promise<void> => {
        const response = await api.put<ApiResponse<void>>(`/conversations/${conversationId}/read`);
        handleResponse(response);
    }
};

// Payment services
export const paymentService = {
    getBalance: async (): Promise<{ balance: number; pendingBalance: number; }> => {
        const response = await api.get<ApiResponse<{ balance: number; pendingBalance: number; }>>('/payments/balance');
        return handleResponse(response);
    },

    getTransactions: async (params?: any): Promise<PaginatedResponse<Payment>> => {
        const response = await api.get<ApiResponse<PaginatedResponse<Payment>>>('/payments/transactions', { params });
        return handleResponse(response);
    },

    requestWithdrawal: async (amount: number, paymentMethodId: string): Promise<void> => {
        const response = await api.post<ApiResponse<void>>('/payments/withdraw', { amount, paymentMethodId });
        handleResponse(response);
    },

    addPaymentMethod: async (paymentMethodData: any): Promise<any> => {
        const response = await api.post<ApiResponse<any>>('/payments/methods', paymentMethodData);
        return handleResponse(response);
    },

    getPaymentMethods: async (): Promise<any[]> => {
        const response = await api.get<ApiResponse<any[]>>('/payments/methods');
        return handleResponse(response);
    },

    removePaymentMethod: async (paymentMethodId: string): Promise<void> => {
        const response = await api.delete<ApiResponse<void>>(`/payments/methods/${paymentMethodId}`);
        handleResponse(response);
    }
};

// Notification services
export const notificationService = {
    getNotifications: async (params?: any): Promise<PaginatedResponse<Notification>> => {
        const response = await api.get<ApiResponse<PaginatedResponse<Notification>>>('/notifications', { params });
        return handleResponse(response);
    },

    markAsRead: async (notificationId: string): Promise<void> => {
        const response = await api.put<ApiResponse<void>>(`/notifications/${notificationId}/read`);
        handleResponse(response);
    },

    markAllAsRead: async (): Promise<void> => {
        const response = await api.put<ApiResponse<void>>('/notifications/read-all');
        handleResponse(response);
    },

    getUnreadCount: async (): Promise<{ count: number }> => {
        const response = await api.get<ApiResponse<{ count: number }>>('/notifications/unread-count');
        return handleResponse(response);
    },

    updatePreferences: async (preferences: any): Promise<void> => {
        const response = await api.put<ApiResponse<void>>('/notifications/preferences', preferences);
        handleResponse(response);
    },

    getPreferences: async (): Promise<any> => {
        const response = await api.get<ApiResponse<any>>('/notifications/preferences');
        return handleResponse(response);
    }
};

// Admin services
export const adminService = {
    getUsers: async (params?: any): Promise<PaginatedResponse<User>> => {
        const response = await api.get<ApiResponse<PaginatedResponse<User>>>('/admin/users', { params });
        return handleResponse(response);
    },

    getUserById: async (userId: string): Promise<User> => {
        const response = await api.get<ApiResponse<User>>(`/admin/users/${userId}`);
        return handleResponse(response);
    },

    updateUser: async (userId: string, userData: Partial<User>): Promise<User> => {
        const response = await api.put<ApiResponse<User>>(`/admin/users/${userId}`, userData);
        return handleResponse(response);
    },

    deleteUser: async (userId: string): Promise<void> => {
        const response = await api.delete<ApiResponse<void>>(`/admin/users/${userId}`);
        handleResponse(response);
    },

    getJobs: async (params?: any): Promise<PaginatedResponse<Job>> => {
        const response = await api.get<ApiResponse<PaginatedResponse<Job>>>('/admin/jobs', { params });
        return handleResponse(response);
    },

    updateJob: async (jobId: string, jobData: Partial<Job>): Promise<Job> => {
        const response = await api.put<ApiResponse<Job>>(`/admin/jobs/${jobId}`, jobData);
        return handleResponse(response);
    },

    deleteJob: async (jobId: string): Promise<void> => {
        const response = await api.delete<ApiResponse<void>>(`/admin/jobs/${jobId}`);
        handleResponse(response);
    },

    getDashboardStats: async (): Promise<any> => {
        const response = await api.get<ApiResponse<any>>('/admin/dashboard');
        return handleResponse(response);
    }
};

export default api; 