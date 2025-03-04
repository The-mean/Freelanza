import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { useAuthContext } from '../context/AuthContext';

// Mock ödeme verileri
const MOCK_PAYMENT_DATA = {
    balance: 8750,
    pendingBalance: 2500,
    totalEarned: 42500,
    withdrawalRequests: [
        {
            id: 1,
            amount: 5000,
            status: 'pending',
            requestDate: '10 Mayıs 2023',
            estimatedDate: '15 Mayıs 2023',
            method: 'Banka Havalesi',
        },
    ],
    transactions: [
        {
            id: 1,
            type: 'payment',
            amount: 3500,
            status: 'completed',
            date: '05 Mayıs 2023',
            description: 'Web sitesi tasarımı projesi ödemesi',
            projectId: 123,
            projectTitle: 'E-ticaret Web Sitesi Tasarımı',
            client: 'ABC Şirketi',
        },
        {
            id: 2,
            type: 'payment',
            amount: 2500,
            status: 'pending',
            date: '02 Mayıs 2023',
            description: 'Logo tasarımı projesi ödemesi',
            projectId: 122,
            projectTitle: 'Kurumsal Kimlik ve Logo Tasarımı',
            client: 'XYZ Teknoloji Ltd. Şti.',
        },
        {
            id: 3,
            type: 'withdrawal',
            amount: 4000,
            status: 'completed',
            date: '28 Nisan 2023',
            description: 'Banka hesabına para çekimi',
            method: 'Banka Havalesi',
            accountDetails: 'TR** **** **** **** **** ****',
        },
        {
            id: 4,
            type: 'payment',
            amount: 5250,
            status: 'completed',
            date: '21 Nisan 2023',
            description: 'Mobil uygulama geliştirme projesi ödemesi',
            projectId: 121,
            projectTitle: 'iOS Fitness Uygulaması',
            client: 'Fitness Plus',
        },
        {
            id: 5,
            type: 'withdrawal',
            amount: 7000,
            status: 'completed',
            date: '15 Nisan 2023',
            description: 'Banka hesabına para çekimi',
            method: 'Banka Havalesi',
            accountDetails: 'TR** **** **** **** **** ****',
        },
        {
            id: 6,
            type: 'payment',
            amount: 8000,
            status: 'completed',
            date: '10 Nisan 2023',
            description: 'Web uygulama geliştirme projesi ödemesi',
            projectId: 120,
            projectTitle: 'Müşteri Yönetim Sistemi',
            client: 'DEF Danışmanlık',
        },
    ],
};

// İşlem filtre tipleri
type TransactionFilterType = 'all' | 'payments' | 'withdrawals';

const Payments: React.FC = () => {
    const { isAuthenticated } = useAuthContext();
    const [paymentData, setPaymentData] = useState(MOCK_PAYMENT_DATA);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [withdrawalAmount, setWithdrawalAmount] = useState<number>(0);
    const [withdrawalMethod, setWithdrawalMethod] = useState<string>('bank');
    const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
    const [transactionFilter, setTransactionFilter] = useState<TransactionFilterType>('all');
    const [activeTab, setActiveTab] = useState<'transactions' | 'withdrawals'>('transactions');

    // Gerçek uygulamada API'dan ödeme verilerini çeker
    useEffect(() => {
        if (!isAuthenticated) return;

        setLoading(true);
        // Burada API çağrısı olacak
        setTimeout(() => {
            setPaymentData(MOCK_PAYMENT_DATA);
            setLoading(false);
        }, 500);
    }, [isAuthenticated]);

    // İşlem filtreleme
    const filteredTransactions = paymentData.transactions.filter((transaction) => {
        if (transactionFilter === 'all') return true;
        if (transactionFilter === 'payments') return transaction.type === 'payment';
        if (transactionFilter === 'withdrawals') return transaction.type === 'withdrawal';
        return true;
    });

    const handleWithdrawalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (withdrawalAmount <= 0 || withdrawalAmount > paymentData.balance) {
            return;
        }

        // Gerçek uygulamada API çağrısı olacak
        // Burada sadece simülasyon yapıyoruz
        const newWithdrawalRequest = {
            id: Math.floor(Math.random() * 1000),
            amount: withdrawalAmount,
            status: 'pending',
            requestDate: new Date().toLocaleDateString('tr-TR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }),
            estimatedDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }),
            method: withdrawalMethod === 'bank' ? 'Banka Havalesi' : 'Kredi Kartı',
        };

        // Bakiyeyi güncelle
        setPaymentData({
            ...paymentData,
            balance: paymentData.balance - withdrawalAmount,
            withdrawalRequests: [...paymentData.withdrawalRequests, newWithdrawalRequest],
        });

        // Modalı kapat ve formu sıfırla
        setIsWithdrawalModalOpen(false);
        setWithdrawalAmount(0);
    };

    // Kimlik doğrulama kontrolü
    if (!isAuthenticated) {
        return (
            <Layout>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-neutral-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h2 className="mt-2 text-2xl font-bold text-neutral-900">Bu sayfayı görüntülemek için giriş yapmalısınız</h2>
                    <p className="mt-1 text-lg text-neutral-500">Ödeme bilgilerinizi görmek için lütfen giriş yapın veya kaydolun.</p>
                    <div className="mt-6">
                        <Link to="/login">
                            <Button variant="primary">Giriş Yap</Button>
                        </Link>
                        <Link to="/register" className="ml-4">
                            <Button variant="outline">Kayıt Ol</Button>
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-neutral-900 mb-6">Bakiye ve Ödemeler</h1>

                {/* Bakiye Kartları */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-neutral-500">Mevcut Bakiye</p>
                                <p className="text-2xl font-bold text-neutral-900 mt-1">₺{paymentData.balance.toLocaleString()}</p>
                            </div>
                            <div className="bg-primary-100 rounded-full p-3">
                                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={() => setIsWithdrawalModalOpen(true)}
                                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Para Çek
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <p className="text-sm font-medium text-neutral-500">Bekleyen Bakiye</p>
                        <p className="text-2xl font-bold text-neutral-900 mt-1">₺{paymentData.pendingBalance.toLocaleString()}</p>
                        <p className="text-xs text-neutral-500 mt-1">İşverenin ödeme onayı bekleyen tutarlar</p>
                        <div className="mt-4">
                            <Link to="/dashboard">
                                <button className="w-full py-2 px-4 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                    Projeleri Görüntüle
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <p className="text-sm font-medium text-neutral-500">Toplam Kazanç</p>
                        <p className="text-2xl font-bold text-neutral-900 mt-1">₺{paymentData.totalEarned.toLocaleString()}</p>
                        <p className="text-xs text-neutral-500 mt-1">Platform üzerinde tüm zamanlar</p>
                        <div className="mt-4">
                            <button className="w-full py-2 px-4 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                Analizi Görüntüle
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sekmeler */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
                    <div className="border-b border-neutral-200">
                        <nav className="-mb-px flex">
                            <button
                                onClick={() => setActiveTab('transactions')}
                                className={`py-4 px-6 border-b-2 font-medium text-sm ${activeTab === 'transactions'
                                        ? 'border-primary-500 text-primary-600'
                                        : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                                    }`}
                            >
                                İşlem Geçmişi
                            </button>
                            <button
                                onClick={() => setActiveTab('withdrawals')}
                                className={`py-4 px-6 border-b-2 font-medium text-sm ${activeTab === 'withdrawals'
                                        ? 'border-primary-500 text-primary-600'
                                        : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                                    }`}
                            >
                                Para Çekme Talepleri
                            </button>
                        </nav>
                    </div>

                    {/* İşlem Geçmişi Sekmesi */}
                    {activeTab === 'transactions' && (
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setTransactionFilter('all')}
                                        className={`px-4 py-2 text-sm font-medium rounded-md ${transactionFilter === 'all'
                                                ? 'bg-primary-100 text-primary-700'
                                                : 'bg-white text-neutral-700 hover:bg-neutral-100'
                                            }`}
                                    >
                                        Tümü
                                    </button>
                                    <button
                                        onClick={() => setTransactionFilter('payments')}
                                        className={`px-4 py-2 text-sm font-medium rounded-md ${transactionFilter === 'payments'
                                                ? 'bg-primary-100 text-primary-700'
                                                : 'bg-white text-neutral-700 hover:bg-neutral-100'
                                            }`}
                                    >
                                        Ödemeler
                                    </button>
                                    <button
                                        onClick={() => setTransactionFilter('withdrawals')}
                                        className={`px-4 py-2 text-sm font-medium rounded-md ${transactionFilter === 'withdrawals'
                                                ? 'bg-primary-100 text-primary-700'
                                                : 'bg-white text-neutral-700 hover:bg-neutral-100'
                                            }`}
                                    >
                                        Para Çekimler
                                    </button>
                                </div>

                                <div>
                                    <select className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                                        <option>Son 30 gün</option>
                                        <option>Son 3 ay</option>
                                        <option>Son 6 ay</option>
                                        <option>Tüm zamanlar</option>
                                    </select>
                                </div>
                            </div>

                            {/* İşlem Tablosu */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-neutral-200">
                                    <thead className="bg-neutral-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                                Tarih
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                                Açıklama
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                                Tutar
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                                Durum
                                            </th>
                                            <th scope="col" className="relative px-6 py-3">
                                                <span className="sr-only">Detay</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-neutral-200">
                                        {filteredTransactions.map((transaction) => (
                                            <tr key={transaction.id} className="hover:bg-neutral-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                                    {transaction.date}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-neutral-900">{transaction.description}</div>
                                                    {transaction.type === 'payment' && (
                                                        <div className="text-xs text-neutral-500">
                                                            {transaction.client} • {transaction.projectTitle}
                                                        </div>
                                                    )}
                                                    {transaction.type === 'withdrawal' && (
                                                        <div className="text-xs text-neutral-500">
                                                            {transaction.method} • {transaction.accountDetails}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`text-sm font-medium ${transaction.type === 'payment' ? 'text-green-600' : 'text-amber-600'
                                                        }`}>
                                                        {transaction.type === 'payment' ? '+' : '-'}₺{transaction.amount.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.status === 'completed'
                                                            ? 'bg-green-100 text-green-800'
                                                            : transaction.status === 'pending'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {transaction.status === 'completed' ? 'Tamamlandı' :
                                                            transaction.status === 'pending' ? 'Beklemede' : 'İptal Edildi'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {transaction.type === 'payment' && transaction.projectId && (
                                                        <Link to={`/projects/${transaction.projectId}`} className="text-primary-600 hover:text-primary-900">
                                                            Projeyi Görüntüle
                                                        </Link>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredTransactions.length === 0 && (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                                        />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-neutral-900">İşlem bulunamadı</h3>
                                    <p className="mt-1 text-sm text-neutral-500">
                                        Bu dönemde seçilen filtrelerle hiçbir işlem kaydı bulunmamaktadır.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Para Çekme Talepleri Sekmesi */}
                    {activeTab === 'withdrawals' && (
                        <div className="p-6">
                            <div className="flex justify-end mb-6">
                                <button
                                    onClick={() => setIsWithdrawalModalOpen(true)}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    Yeni Para Çekme Talebi
                                </button>
                            </div>

                            {/* Para Çekme Talepleri Listesi */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-neutral-200">
                                    <thead className="bg-neutral-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                                Talep Tarihi
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                                Metod
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                                Tutar
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                                Tahmini Tarih
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                                Durum
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-neutral-200">
                                        {paymentData.withdrawalRequests.map((request) => (
                                            <tr key={request.id} className="hover:bg-neutral-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                                    {request.requestDate}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                                                    {request.method}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                                                    ₺{request.amount.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                                    {request.estimatedDate}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.status === 'completed'
                                                            ? 'bg-green-100 text-green-800'
                                                            : request.status === 'pending'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {request.status === 'completed' ? 'Tamamlandı' :
                                                            request.status === 'pending' ? 'Beklemede' : 'İptal Edildi'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {paymentData.withdrawalRequests.length === 0 && (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                                        />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-neutral-900">Para çekme talebi bulunamadı</h3>
                                    <p className="mt-1 text-sm text-neutral-500">
                                        Henüz hiç para çekme talebi oluşturmadınız. Yeni bir talep oluşturmak için "Yeni Para Çekme Talebi" düğmesine tıklayın.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Para Çekme Modal */}
            {isWithdrawalModalOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-neutral-500 bg-opacity-75 transition-opacity"
                            onClick={() => setIsWithdrawalModalOpen(false)}
                        ></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>

                        {/* Modal Panel */}
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-neutral-900">
                                            Para Çekme Talebi Oluştur
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-neutral-500">
                                                Çekmek istediğiniz tutarı ve ödeme yöntemini seçin. Para çekme işlemleri genellikle 2-5 iş günü içinde tamamlanır.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <form className="mt-6" onSubmit={handleWithdrawalSubmit}>
                                    <div className="mb-4">
                                        <label htmlFor="withdrawalAmount" className="block text-sm font-medium text-neutral-700 mb-1">
                                            Çekilecek Tutar (₺)
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-neutral-500 sm:text-sm">₺</span>
                                            </div>
                                            <input
                                                type="number"
                                                name="withdrawalAmount"
                                                id="withdrawalAmount"
                                                min="1"
                                                max={paymentData.balance}
                                                required
                                                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-8 pr-12 sm:text-sm border-neutral-300 rounded-md py-2"
                                                placeholder="0"
                                                value={withdrawalAmount || ''}
                                                onChange={(e) => setWithdrawalAmount(Number(e.target.value))}
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <span className="text-neutral-500 sm:text-sm">TL</span>
                                            </div>
                                        </div>
                                        <p className="mt-1 text-xs text-neutral-500">
                                            Kullanılabilir bakiye: <span className="font-semibold">₺{paymentData.balance.toLocaleString()}</span>
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="withdrawalMethod" className="block text-sm font-medium text-neutral-700 mb-1">
                                            Ödeme Yöntemi
                                        </label>
                                        <select
                                            id="withdrawalMethod"
                                            name="withdrawalMethod"
                                            className="mt-1 block w-full py-2 px-3 border border-neutral-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                            value={withdrawalMethod}
                                            onChange={(e) => setWithdrawalMethod(e.target.value)}
                                        >
                                            <option value="bank">Banka Havalesi</option>
                                            <option value="credit_card">Kredi Kartı</option>
                                        </select>
                                    </div>

                                    {withdrawalMethod === 'bank' && (
                                        <div className="mb-4">
                                            <label htmlFor="accountDetails" className="block text-sm font-medium text-neutral-700 mb-1">
                                                Banka Bilgileri
                                            </label>
                                            <select
                                                id="accountDetails"
                                                name="accountDetails"
                                                className="mt-1 block w-full py-2 px-3 border border-neutral-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                            >
                                                <option value="1">Garanti Bankası - TR** **** **** **** **** ****</option>
                                                <option value="new">+ Yeni Banka Hesabı Ekle</option>
                                            </select>
                                        </div>
                                    )}

                                    {withdrawalMethod === 'credit_card' && (
                                        <div className="mb-4">
                                            <label htmlFor="cardDetails" className="block text-sm font-medium text-neutral-700 mb-1">
                                                Kredi Kartı
                                            </label>
                                            <select
                                                id="cardDetails"
                                                name="cardDetails"
                                                className="mt-1 block w-full py-2 px-3 border border-neutral-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                            >
                                                <option value="1">**** **** **** 1234 (Bonus)</option>
                                                <option value="new">+ Yeni Kart Ekle</option>
                                            </select>
                                        </div>
                                    )}

                                    <div className="bg-neutral-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse mt-4 -mx-4 -mb-4">
                                        <button
                                            type="submit"
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={withdrawalAmount <= 0 || withdrawalAmount > paymentData.balance}
                                        >
                                            Para Çek
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 w-full inline-flex justify-center rounded-md border border-neutral-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                            onClick={() => setIsWithdrawalModalOpen(false)}
                                        >
                                            İptal
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Payments; 