import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Admin paneli için sidebar bileşeni
const Sidebar = ({ activePage }: { activePage: string }) => {
    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: 'fas fa-tachometer-alt' },
        { name: 'Kullanıcılar', path: '/admin/users', icon: 'fas fa-users' },
        { name: 'İş İlanları', path: '/admin/jobs', icon: 'fas fa-briefcase' },
        { name: 'Ödemeler', path: '/admin/payments', icon: 'fas fa-money-bill-wave' },
        { name: 'Mesajlar', path: '/admin/messages', icon: 'fas fa-envelope' },
        { name: 'Kategoriler', path: '/admin/categories', icon: 'fas fa-tags' },
        { name: 'Ayarlar', path: '/admin/settings', icon: 'fas fa-cog' },
    ];

    return (
        <div className="bg-gray-800 text-white w-64 py-6 flex flex-col h-full">
            <div className="px-6 mb-8">
                <Link href="/admin/dashboard" className="text-xl font-bold">
                    Freelanza Admin
                </Link>
            </div>
            <nav className="flex-grow">
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.path} className="mb-1">
                            <Link href={item.path}
                                className={`flex items-center py-2 px-6 hover:bg-gray-700 transition duration-150 ${activePage === item.path ? 'bg-gray-700' : ''
                                    }`}
                            >
                                <i className={`${item.icon} mr-3 w-5 text-center`}></i>
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="px-6 mt-auto">
                <button className="w-full flex items-center py-2 px-4 hover:bg-gray-700 transition duration-150">
                    <i className="fas fa-sign-out-alt mr-3"></i>
                    Çıkış Yap
                </button>
            </div>
        </div>
    );
};

// Özet kart bileşeni
const StatCard = ({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
            <div className={`rounded-full p-3 ${color} text-white mr-4`}>
                <i className={icon}></i>
            </div>
            <div>
                <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    </div>
);

export default function AdminDashboard() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Admin kimlik doğrulama kontrolü
    useEffect(() => {
        const checkAuth = () => {
            const adminToken = localStorage.getItem('adminToken');
            if (!adminToken) {
                router.push('/admin');
                return;
            }
            setIsAuthenticated(true);
            setIsLoading(false);
        };

        checkAuth();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Yönlendirme yapılıyor, içerik gösterme
    }

    // Platform istatistikleri (örnek veriler)
    const stats = {
        totalUsers: 1250,
        activeFreelancers: 876,
        activeJobs: 324,
        totalRevenue: "₺125,000",
        pendingProposals: 145,
        completedJobs: 892,
    };

    // Son 5 kullanıcı (örnek veriler)
    const recentUsers = [
        { id: 1, name: "Zeynep Kaya", email: "freelancer1@example.com", role: "Freelancer", date: "2023-05-15" },
        { id: 2, name: "Mehmet Demir", email: "freelancer2@example.com", role: "Freelancer", date: "2023-05-14" },
        { id: 3, name: "Ali Yılmaz", email: "employer@example.com", role: "İşveren", date: "2023-05-12" },
        { id: 4, name: "Ayşe Öztürk", email: "ayse@example.com", role: "Freelancer", date: "2023-05-10" },
        { id: 5, name: "Can Kaya", email: "can@example.com", role: "İşveren", date: "2023-05-08" },
    ];

    return (
        <>
            <Head>
                <title>Admin Dashboard - Freelanza</title>
                <meta name="description" content="Freelanza admin dashboard" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            </Head>

            <div className="flex h-screen bg-gray-100">
                <Sidebar activePage="/admin/dashboard" />

                <div className="flex-1 overflow-auto">
                    <header className="bg-white shadow-sm">
                        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                        </div>
                    </header>

                    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        {/* İstatistik Kartları */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            <StatCard
                                title="Toplam Kullanıcı"
                                value={stats.totalUsers}
                                icon="fas fa-users"
                                color="bg-blue-500"
                            />
                            <StatCard
                                title="Aktif Freelancerlar"
                                value={stats.activeFreelancers}
                                icon="fas fa-user-tie"
                                color="bg-green-500"
                            />
                            <StatCard
                                title="Aktif İş İlanları"
                                value={stats.activeJobs}
                                icon="fas fa-briefcase"
                                color="bg-yellow-500"
                            />
                            <StatCard
                                title="Toplam Gelir"
                                value={stats.totalRevenue}
                                icon="fas fa-money-bill-wave"
                                color="bg-purple-500"
                            />
                            <StatCard
                                title="Bekleyen Teklifler"
                                value={stats.pendingProposals}
                                icon="fas fa-clock"
                                color="bg-orange-500"
                            />
                            <StatCard
                                title="Tamamlanan İşler"
                                value={stats.completedJobs}
                                icon="fas fa-check-circle"
                                color="bg-indigo-500"
                            />
                        </div>

                        {/* Son Kullanıcılar */}
                        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
                            <div className="bg-gray-50 px-4 py-3 border-b">
                                <h2 className="text-lg font-medium text-gray-900">Son Kayıt Olan Kullanıcılar</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İsim</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kayıt Tarihi</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {recentUsers.map((user) => (
                                            <tr key={user.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'Freelancer' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.date}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link href={`/admin/users/${user.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                                                        Görüntüle
                                                    </Link>
                                                    <button className="text-red-600 hover:text-red-900">Sil</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-right">
                                <Link href="/admin/users" className="text-blue-600 text-sm font-medium hover:text-blue-500">
                                    Tüm Kullanıcıları Görüntüle →
                                </Link>
                            </div>
                        </div>

                        {/* Hızlı Erişim Butonları */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Link href="/admin/jobs/create"
                                className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition duration-150"
                            >
                                <i className="fas fa-plus-circle text-blue-500 text-3xl mb-3"></i>
                                <h3 className="text-lg font-medium">Yeni İş İlanı Ekle</h3>
                            </Link>
                            <Link href="/admin/categories"
                                className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition duration-150"
                            >
                                <i className="fas fa-tags text-green-500 text-3xl mb-3"></i>
                                <h3 className="text-lg font-medium">Kategorileri Yönet</h3>
                            </Link>
                            <Link href="/admin/reports"
                                className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition duration-150"
                            >
                                <i className="fas fa-chart-bar text-purple-500 text-3xl mb-3"></i>
                                <h3 className="text-lg font-medium">Raporları Görüntüle</h3>
                            </Link>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
} 