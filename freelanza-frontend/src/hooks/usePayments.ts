import { useState, useCallback } from 'react';
import { paymentService } from '../services/api';
import { Payment, PaginatedResponse } from '../types';
import { useQuery } from './useQuery';
import { useMutation } from './useMutation';
import { queryClient } from '../App';

export type TransactionFilter = 'all' | 'earnings' | 'withdrawals' | 'refunds';

export interface PaymentData {
    balance: number;
    pendingBalance: number;
    totalEarnings: number;
    withdrawalRequests: WithdrawalRequest[];
}

export interface WithdrawalRequest {
    id: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed' | 'rejected';
    method: string;
    createdAt: string;
    accountDetails?: Record<string, string>;
}

export const usePayments = () => {
    const [activeTab, setActiveTab] = useState<'transactions' | 'withdrawals'>('transactions');
    const [transactionFilter, setTransactionFilter] = useState<TransactionFilter>('all');
    const [withdrawalAmount, setWithdrawalAmount] = useState<number>(0);
    const [withdrawalMethod, setWithdrawalMethod] = useState<string>('bank');
    const [withdrawalModalOpen, setWithdrawalModalOpen] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);

    // Ödeme verilerini çekme
    const {
        data: balanceData,
        isLoading: isBalanceLoading,
        error: balanceError,
        refetch: refetchBalance
    } = useQuery<{ balance: number; pendingBalance: number }>(
        ['balance'],
        () => paymentService.getBalance()
    );

    // İşlem geçmişini çekme
    const {
        data: transactionsData,
        isLoading: isTransactionsLoading,
        error: transactionsError,
        refetch: refetchTransactions
    } = useQuery<PaginatedResponse<Payment>>(
        ['transactions', transactionFilter, currentPage, itemsPerPage],
        () => paymentService.getTransactions({
            type: transactionFilter !== 'all' ? transactionFilter : undefined,
            page: currentPage,
            limit: itemsPerPage
        })
    );

    // Ödeme yöntemlerini çekme
    const {
        data: paymentMethods,
        isLoading: isPaymentMethodsLoading,
        error: paymentMethodsError,
        refetch: refetchPaymentMethods
    } = useQuery<any[]>(
        ['paymentMethods'],
        () => paymentService.getPaymentMethods()
    );

    // Para çekme isteği oluşturma
    const withdrawalMutation = useMutation(
        (data: { amount: number; paymentMethodId: string }) =>
            paymentService.requestWithdrawal(data.amount, data.paymentMethodId),
        {
            onSuccess: () => {
                // Para çekme isteği oluşturulduktan sonra verileri yenile
                queryClient.invalidateQueries({ queryKey: ['balance'] });
                queryClient.invalidateQueries({ queryKey: ['transactions'] });
                // Modalı kapat ve formu temizle
                setWithdrawalModalOpen(false);
                setWithdrawalAmount(0);
            }
        }
    );

    // Ödeme yöntemi ekleme
    const addPaymentMethodMutation = useMutation(
        (data: any) => paymentService.addPaymentMethod(data),
        {
            onSuccess: () => {
                // Ödeme yöntemi eklendikten sonra verileri yenile
                queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
            }
        }
    );

    // Ödeme yöntemi silme
    const removePaymentMethodMutation = useMutation(
        (paymentMethodId: string) => paymentService.removePaymentMethod(paymentMethodId),
        {
            onSuccess: () => {
                // Ödeme yöntemi silindikten sonra verileri yenile
                queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
            }
        }
    );

    // İşlem filtresini değiştirme
    const changeTransactionFilter = useCallback((filter: TransactionFilter) => {
        setTransactionFilter(filter);
        setCurrentPage(1); // Filtre değiştiğinde ilk sayfaya dön
    }, []);

    // Aktif sekmeyi değiştirme
    const changeTab = useCallback((tab: 'transactions' | 'withdrawals') => {
        setActiveTab(tab);
        setCurrentPage(1); // Sekme değiştiğinde ilk sayfaya dön
    }, []);

    // Sayfa değiştirme
    const changePage = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    // Para çekme isteği oluşturma
    const requestWithdrawal = useCallback(async (paymentMethodId: string) => {
        if (withdrawalAmount <= 0) return;

        try {
            await withdrawalMutation.mutateAsync({
                amount: withdrawalAmount,
                paymentMethodId
            });
        } catch (error) {
            console.error('Error requesting withdrawal:', error);
        }
    }, [withdrawalAmount, withdrawalMutation]);

    // Ödeme yöntemi ekleme
    const addPaymentMethod = useCallback(async (paymentMethodData: any) => {
        try {
            await addPaymentMethodMutation.mutateAsync(paymentMethodData);
        } catch (error) {
            console.error('Error adding payment method:', error);
        }
    }, [addPaymentMethodMutation]);

    // Ödeme yöntemi silme
    const removePaymentMethod = useCallback(async (paymentMethodId: string) => {
        try {
            await removePaymentMethodMutation.mutateAsync(paymentMethodId);
        } catch (error) {
            console.error('Error removing payment method:', error);
        }
    }, [removePaymentMethodMutation]);

    // Para çekme modalını açma
    const openWithdrawalModal = useCallback(() => {
        setWithdrawalModalOpen(true);
    }, []);

    // Para çekme modalını kapatma
    const closeWithdrawalModal = useCallback(() => {
        setWithdrawalModalOpen(false);
        setWithdrawalAmount(0);
    }, []);

    // Toplam kazanç hesaplama (tüm tamamlanmış ödemeler)
    const totalEarnings = transactionsData?.items
        .filter(transaction => transaction.type === 'payment' && transaction.status === 'completed')
        .reduce((sum, transaction) => sum + transaction.amount, 0) || 0;

    // Ödeme verilerini oluşturma
    const paymentData: PaymentData = {
        balance: balanceData?.balance || 0,
        pendingBalance: balanceData?.pendingBalance || 0,
        totalEarnings,
        withdrawalRequests: transactionsData?.items
            .filter(transaction => transaction.type === 'withdrawal')
            .map(transaction => ({
                id: transaction.id,
                amount: transaction.amount,
                status: transaction.status,
                method: transaction.description || 'bank',
                createdAt: transaction.createdAt
            })) || []
    };

    return {
        // Ödeme verileri
        paymentData,
        isPaymentDataLoading: isBalanceLoading || isTransactionsLoading,
        paymentDataError: balanceError || transactionsError,
        refetchPaymentData: () => {
            refetchBalance();
            refetchTransactions();
        },

        // İşlemler
        transactions: transactionsData?.items || [],
        totalTransactions: transactionsData?.total || 0,
        isTransactionsLoading,
        transactionsError,
        refetchTransactions,
        transactionFilter,
        changeTransactionFilter,

        // Ödeme yöntemleri
        paymentMethods: paymentMethods || [],
        isPaymentMethodsLoading,
        paymentMethodsError,
        refetchPaymentMethods,
        addPaymentMethod,
        isAddingPaymentMethod: addPaymentMethodMutation.isPending,
        addPaymentMethodError: addPaymentMethodMutation.error,
        removePaymentMethod,
        isRemovingPaymentMethod: removePaymentMethodMutation.isPending,
        removePaymentMethodError: removePaymentMethodMutation.error,

        // Para çekme işlemleri
        withdrawalAmount,
        setWithdrawalAmount,
        withdrawalMethod,
        setWithdrawalMethod,
        withdrawalModalOpen,
        openWithdrawalModal,
        closeWithdrawalModal,
        requestWithdrawal,
        isRequestingWithdrawal: withdrawalMutation.isPending,
        withdrawalError: withdrawalMutation.error,

        // Sayfalama ve sekmeler
        currentPage,
        itemsPerPage,
        changePage,
        activeTab,
        changeTab
    };
};

export default usePayments; 