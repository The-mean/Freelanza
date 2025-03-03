import { useQuery as useReactQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ApiResponse } from '../types';

/**
 * API istekleri için özelleştirilmiş useQuery hooku
 * @param queryKey - React Query için benzersiz anahtar
 * @param queryFn - API isteği yapan fonksiyon
 * @param options - React Query için opsiyonlar
 */
export function useQuery<TData, TError = AxiosError<ApiResponse<any>>>(
    queryKey: unknown[],
    queryFn: () => Promise<TData>,
    options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData, TError> {
    return useReactQuery<TData, TError>({
        queryKey,
        queryFn,
        staleTime: 1000 * 60 * 5, // 5 dakika
        refetchOnWindowFocus: false,
        ...options
    });
}

export default useQuery; 