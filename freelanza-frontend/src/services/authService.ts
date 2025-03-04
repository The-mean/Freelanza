import api from './api';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    role: 'FREELANCER' | 'CLIENT';
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        role: string;
    };
}

export interface ForgotPasswordData {
    email: string;
}

export interface ResetPasswordData {
    token: string;
    password: string;
}

const authService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    logout: async (refreshToken: string): Promise<void> => {
        await api.post('/auth/logout', { refreshToken });
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    },

    forgotPassword: async (data: ForgotPasswordData): Promise<{ message: string }> => {
        const response = await api.post<{ message: string }>('/auth/forgot-password', data);
        return response.data;
    },

    resetPassword: async (data: ResetPasswordData): Promise<{ message: string }> => {
        const response = await api.post<{ message: string }>('/auth/reset-password', data);
        return response.data;
    },

    getCurrentUser: async (): Promise<any> => {
        try {
            const response = await api.get('/users/me');
            return response.data;
        } catch (error) {
            return null;
        }
    },

    saveTokens: (accessToken: string, refreshToken: string): void => {
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    },

    getToken: (): string | null => {
        return localStorage.getItem('token');
    },

    getRefreshToken: (): string | null => {
        return localStorage.getItem('refreshToken');
    },

    isAuthenticated: (): boolean => {
        return localStorage.getItem('token') !== null;
    }
};

export default authService; 