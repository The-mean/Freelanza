import { useMutation as useReactMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ApiResponse } from '../types';

/**
 * API mutasyon istekleri için özelleştirilmiş useMutation hooku
 * @param mutationFn - API isteği yapan fonksiyon
 * @param options - React Query için opsiyonlar
 */
export function useMutation<TData, TVariables, TError = AxiosError<ApiResponse<any>>>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>
): UseMutationResult<TData, TError, TVariables> {
    return useReactMutation<TData, TError, TVariables>({
        mutationFn,
        ...options
    });
}

export default useMutation; 