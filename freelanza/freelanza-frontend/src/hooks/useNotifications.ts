import { useState, useCallback, useEffect } from 'react';
import { notificationService } from '../services/api';
import { Notification, PaginatedResponse } from '../types';
import { useQuery } from './useQuery';
import { useMutation } from './useMutation';
import { queryClient } from '../App';
import { useAuthContext } from '../context/AuthContext';

export const useNotifications = () => {
    const { isAuthenticated } = useAuthContext();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);
    const [notificationFilter, setNotificationFilter] = useState<'all' | 'unread'>('all');

    // Bildirimleri çekme
    const {
        data: notificationsData,
        isLoading: isNotificationsLoading,
        error: notificationsError,
        refetch: refetchNotifications
    } = useQuery<PaginatedResponse<Notification>>(
        ['notifications', notificationFilter, currentPage, itemsPerPage],
        () => notificationService.getNotifications({
            read: notificationFilter === 'unread' ? false : undefined,
            page: currentPage,
            limit: itemsPerPage
        }),
        {
            enabled: isAuthenticated
        }
    );

    // Okunmamış bildirim sayısını çekme
    const {
        data: unreadCountData,
        isLoading: isUnreadCountLoading,
        error: unreadCountError,
        refetch: refetchUnreadCount
    } = useQuery<{ count: number }>(
        ['notificationsUnreadCount'],
        () => notificationService.getUnreadCount(),
        {
            enabled: isAuthenticated
        }
    );

    // Bildirim tercihlerini çekme
    const {
        data: preferencesData,
        isLoading: isPreferencesLoading,
        error: preferencesError,
        refetch: refetchPreferences
    } = useQuery<any>(
        ['notificationPreferences'],
        () => notificationService.getPreferences(),
        {
            enabled: isAuthenticated
        }
    );

    // Bildirimi okundu olarak işaretleme
    const markAsReadMutation = useMutation(
        (notificationId: string) => notificationService.markAsRead(notificationId),
        {
            onSuccess: () => {
                // Bildirimleri ve okunmamış sayısını yenile
                queryClient.invalidateQueries({ queryKey: ['notifications'] });
                queryClient.invalidateQueries({ queryKey: ['notificationsUnreadCount'] });
            }
        }
    );

    // Tüm bildirimleri okundu olarak işaretleme
    const markAllAsReadMutation = useMutation(
        () => notificationService.markAllAsRead(),
        {
            onSuccess: () => {
                // Bildirimleri ve okunmamış sayısını yenile
                queryClient.invalidateQueries({ queryKey: ['notifications'] });
                queryClient.invalidateQueries({ queryKey: ['notificationsUnreadCount'] });
            }
        }
    );

    // Bildirim tercihlerini güncelleme
    const updatePreferencesMutation = useMutation(
        (preferences: any) => notificationService.updatePreferences(preferences),
        {
            onSuccess: () => {
                // Tercihleri yenile
                queryClient.invalidateQueries({ queryKey: ['notificationPreferences'] });
            }
        }
    );

    // Bildirimi okundu olarak işaretleme
    const markAsRead = useCallback(async (notificationId: string) => {
        try {
            await markAsReadMutation.mutateAsync(notificationId);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }, [markAsReadMutation]);

    // Tüm bildirimleri okundu olarak işaretleme
    const markAllAsRead = useCallback(async () => {
        try {
            await markAllAsReadMutation.mutateAsync({});
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    }, [markAllAsReadMutation]);

    // Bildirim tercihlerini güncelleme
    const updatePreferences = useCallback(async (preferences: any) => {
        try {
            await updatePreferencesMutation.mutateAsync(preferences);
        } catch (error) {
            console.error('Error updating notification preferences:', error);
        }
    }, [updatePreferencesMutation]);

    // Sayfa değiştirme
    const changePage = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    // Bildirim filtresini değiştirme
    const changeFilter = useCallback((filter: 'all' | 'unread') => {
        setNotificationFilter(filter);
        setCurrentPage(1); // Filtre değiştiğinde ilk sayfaya dön
    }, []);

    // Periyodik olarak okunmamış bildirim sayısını kontrol etme
    useEffect(() => {
        if (!isAuthenticated) return;

        const checkInterval = setInterval(() => {
            refetchUnreadCount();
        }, 60000); // Her dakika kontrol et

        return () => clearInterval(checkInterval);
    }, [isAuthenticated, refetchUnreadCount]);

    return {
        // Bildirimler
        notifications: notificationsData?.items || [],
        totalNotifications: notificationsData?.total || 0,
        isNotificationsLoading,
        notificationsError,
        refetchNotifications,

        // Okunmamış sayısı
        unreadCount: unreadCountData?.count || 0,
        isUnreadCountLoading,
        unreadCountError,
        refetchUnreadCount,

        // Tercihler
        preferences: preferencesData || {},
        isPreferencesLoading,
        preferencesError,
        refetchPreferences,

        // İşlemler
        markAsRead,
        isMarkingAsRead: markAsReadMutation.isPending,
        markAsReadError: markAsReadMutation.error,

        markAllAsRead,
        isMarkingAllAsRead: markAllAsReadMutation.isPending,
        markAllAsReadError: markAllAsReadMutation.error,

        updatePreferences,
        isUpdatingPreferences: updatePreferencesMutation.isPending,
        updatePreferencesError: updatePreferencesMutation.error,

        // Filtre ve sayfalama
        notificationFilter,
        changeFilter,
        currentPage,
        itemsPerPage,
        changePage
    };
};

export default useNotifications; 