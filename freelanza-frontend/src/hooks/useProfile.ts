import { useState } from 'react';
import { userService } from '../services/api';
import { Profile } from '../types';
import { useQuery } from './useQuery';
import { useAuthContext } from '../context/AuthContext';

export const useProfile = (userId?: string) => {
    const { user: currentUser } = useAuthContext();
    const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'reviews'>('overview');

    // Profil sahibi mevcut kullanıcı mı?
    const isOwnProfile = !userId || (currentUser && userId === currentUser.id);

    // Profil verilerini çekme
    const {
        data: profile,
        isLoading,
        error,
        refetch
    } = useQuery<Profile>(
        ['profile', userId || 'me'],
        () => isOwnProfile
            ? userService.getCurrentUser()
            : userService.getProfile(userId as string),
        {
            enabled: !!(isOwnProfile || userId)
        }
    );

    // Aktif sekmeyi değiştirme
    const changeTab = (tab: 'overview' | 'portfolio' | 'reviews') => {
        setActiveTab(tab);
    };

    return {
        profile,
        isLoading,
        error,
        refetch,
        isOwnProfile,
        activeTab,
        changeTab
    };
};

export default useProfile; 