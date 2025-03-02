import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService, { LoginCredentials, RegisterData } from '../services/authService';

interface User {
    id: string;
    email: string;
    role: string;
}

interface UseAuthReturn {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
    const navigate = useNavigate();

    const fetchCurrentUser = useCallback(async () => {
        try {
            setIsLoading(true);
            const userData = await authService.getCurrentUser();
            setUser(userData);
            setIsAuthenticated(!!userData);
        } catch (err) {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (authService.isAuthenticated()) {
            fetchCurrentUser();
        } else {
            setIsLoading(false);
        }
    }, [fetchCurrentUser]);

    const login = async (credentials: LoginCredentials) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await authService.login(credentials);
            authService.saveTokens(response.accessToken, response.refreshToken);
            setUser(response.user);
            setIsAuthenticated(true);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: RegisterData) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await authService.register(data);
            authService.saveTokens(response.accessToken, response.refreshToken);
            setUser(response.user);
            setIsAuthenticated(true);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            const refreshToken = authService.getRefreshToken();
            if (refreshToken) {
                await authService.logout(refreshToken);
            }
            setUser(null);
            setIsAuthenticated(false);
            navigate('/login');
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        isAuthenticated,
    };
};

export default useAuth; 