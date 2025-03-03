import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, userService } from '../services/api';
import { User, LoginCredentials, RegisterData } from '../types';
import { useMutation } from './useMutation';
import { useQuery } from './useQuery';
import { queryClient } from '../App';

interface UseAuthReturn {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
        localStorage.getItem('token') !== null
    );
    const navigate = useNavigate();

    // Kullanıcı bilgilerini çekme
    const {
        data: user,
        isLoading: isUserLoading,
        error: userError,
        refetch: refetchUser
    } = useQuery<User | null, Error>(
        ['currentUser'],
        async () => {
            if (!isAuthenticated) return null;

            try {
                // API'den kullanıcı bilgilerini çekiyoruz
                return await userService.getCurrentUser();
            } catch (error) {
                setIsAuthenticated(false);
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                return null;
            }
        },
        {
            enabled: isAuthenticated,
            retry: false
        }
    );

    // Login işlemi için mutation
    const loginMutation = useMutation(authService.login, {
        onSuccess: (data) => {
            setIsAuthenticated(true);
            // Kullanıcı bilgilerini yeniden çekme
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
            navigate('/dashboard');
        },
        onError: () => {
            setIsAuthenticated(false);
        }
    });

    // Register işlemi için mutation
    const registerMutation = useMutation(authService.register, {
        onSuccess: (data) => {
            setIsAuthenticated(true);
            // Kullanıcı bilgilerini yeniden çekme
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
            navigate('/dashboard');
        },
        onError: () => {
            setIsAuthenticated(false);
        }
    });

    // Login metodu
    const login = async (credentials: LoginCredentials) => {
        await loginMutation.mutateAsync(credentials);
    };

    // Register metodu
    const register = async (data: RegisterData) => {
        await registerMutation.mutateAsync(data);
    };

    // Logout metodu
    const logout = () => {
        authService.logout();
        setIsAuthenticated(false);
        queryClient.clear();
        navigate('/login');
    };

    // Token değişirse kullanıcı bilgilerini yeniden çekme
    useEffect(() => {
        if (isAuthenticated) {
            refetchUser();
        }
    }, [isAuthenticated, refetchUser]);

    return {
        user: user || null,
        isLoading: isUserLoading || loginMutation.isPending || registerMutation.isPending,
        error: userError?.message || loginMutation.error?.message || registerMutation.error?.message || null,
        login,
        register,
        logout,
        isAuthenticated
    };
};

export default useAuth; 