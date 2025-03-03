import { useState, useCallback } from 'react';
import { jobService } from '../services/api';
import { Job, PaginatedResponse } from '../types';
import { useQuery } from './useQuery';

interface JobFilters {
    search?: string;
    category?: string;
    minBudget?: number;
    maxBudget?: number;
    skills?: string[];
    page?: number;
    limit?: number;
}

export const useJobs = (initialFilters: JobFilters = {}) => {
    const [filters, setFilters] = useState<JobFilters>(initialFilters);

    // İş ilanlarını çekme
    const {
        data,
        isLoading,
        error,
        refetch
    } = useQuery<PaginatedResponse<Job>>(
        ['jobs', filters],
        () => jobService.getJobs(filters)
    );

    // Filtreleri güncelleme
    const updateFilters = useCallback((newFilters: Partial<JobFilters>) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            // Filtreler değiştiğinde sayfa numarasını sıfırla
            page: newFilters.page !== undefined ? newFilters.page : 1
        }));
    }, []);

    // Sayfa değiştirme
    const changePage = useCallback((page: number) => {
        updateFilters({ page });
    }, [updateFilters]);

    // Filtreleri temizleme
    const clearFilters = useCallback(() => {
        setFilters({
            page: 1,
            limit: filters.limit
        });
    }, [filters.limit]);

    return {
        jobs: data?.items || [],
        totalJobs: data?.total || 0,
        currentPage: data?.page || 1,
        totalPages: data?.totalPages || 1,
        isLoading,
        error,
        filters,
        updateFilters,
        changePage,
        clearFilters,
        refetch
    };
};

export default useJobs; 