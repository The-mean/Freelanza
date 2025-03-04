import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

// Dashboard için sidebar bileşeni
const Sidebar = ({ userType, activePage }: { userType: 'freelancer' | 'employer'; activePage: string }) => {
    // Freelancer ve işveren için farklı menü öğeleri
    const menuItems = userType === 'freelancer'
        ? [
            { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
            { name: 'Tekliflerim', path: '/dashboard/proposals', icon: 'fas fa-file-contract' },
            { name: 'Aktif İşlerim', path: '/dashboard/active-jobs', icon: 'fas fa-briefcase' },
            { name: 'Ödemelerim', path: '/dashboard/payments', icon: 'fas fa-money-bill-wave' },
            { name: 'Mesajlarım', path: '/messages', icon: 'fas fa-envelope' },
            { name: 'Değerlendirmelerim', path: '/dashboard/reviews', icon: 'fas fa-star' },
            { name: 'Profil', path: '/dashboard/profile', icon: 'fas fa-user' },
            { name: 'Ayarlar', path: '/dashboard/settings', icon: 'fas fa-cog' },
        ]
        : [
            { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
            { name: 'İş İlanlarım', path: '/dashboard/my-jobs', icon: 'fas fa-briefcase' },
            { name: 'Gelen Teklifler', path: '/dashboard/proposals', icon: 'fas fa-file-contract' },
            { name: 'Aktif İşlerim', path: '/dashboard/active-jobs', icon: 'fas fa-tasks' },
            { name: 'Ödemelerim', path: '/dashboard/payments', icon: 'fas fa-money-bill-wave' },
            { name: 'Mesajlarım', path: '/messages', icon: 'fas fa-envelope' },
            { name: 'Profil', path: '/dashboard/profile', icon: 'fas fa-user' },
            { name: 'Ayarlar', path: '/dashboard/settings', icon: 'fas fa-cog' },
        ];

    return (
        <div className="bg-gray-800 text-white w-64 min-h-screen py-6 flex flex-col">
            <div className="px-6 mb-8">
                <Link href="/" className="text-xl font-bold">
                    Freelanza
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
            <div className="px-6 mt-auto pt-4 border-t border-gray-700">
                <button className="w-full flex items-center py-2 text-gray-400 hover:text-white">
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

// Freelancer Dashboard içeriği
const FreelancerDashboard = () => {
    // Örnek veriler (API'den gelecektir)
    const stats = {
        activeProposals: 4,
        activeJobs: 2,
        completedJobs: 15,
        totalEarnings: "₺45,750",
        pendingPayments: "₺12,500",
        reviews: 4.8,
    };

    // Aktif teklifler (örnek veriler)
    const activeProposals = [
        { id: 1, title: "E-ticaret Web Sitesi Geliştirme", budget: "₺15,000", date: "05/05/2023", status: "Değerlendirmede" },
        { id: 2, title: "Mobil Uygulama UI Tasarımı", budget: "₺7,500", date: "03/05/2023", status: "Görüşülüyor" },
        { id: 3, title: "SEO Optimizasyonu", budget: "₺4,500", date: "28/04/2023", status: "Değerlendirmede" },
        { id: 4, title: "WordPress Blog Tasarımı", budget: "₺3,500", date: "25/04/2023", status: "Görüşülüyor" },
    ];

    // Aktif işler (örnek veriler)
    const activeJobs = [
        { id: 1, title: "Blog Yazarlığı", client: "ABC Şirketi", deadline: "20/05/2023", progress: 70, payment: "₺5,000" },
        { id: 2, title: "Logo Tasarımı", client: "XYZ Marka", deadline: "15/05/2023", progress: 40, payment: "₺3,000" },
    ];

    return (
        <div className="p-6">
            {/* Karşılama Mesajı */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Hoş Geldin, Zeynep!</h1>
                <p className="text-gray-600">İşlerinizi yönetin ve yeni fırsatları keşfedin.</p>
            </div>

            {/* İstatistik Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="Aktif Teklifler"
                    value={stats.activeProposals}
                    icon="fas fa-file-contract"
                    color="bg-blue-500"
                />
                <StatCard
                    title="Aktif İşler"
                    value={stats.activeJobs}
                    icon="fas fa-briefcase"
                    color="bg-green-500"
                />
                <StatCard
                    title="Tamamlanan İşler"
                    value={stats.completedJobs}
                    icon="fas fa-check-circle"
                    color="bg-purple-500"
                />
                <StatCard
                    title="Toplam Kazanç"
                    value={stats.totalEarnings}
                    icon="fas fa-money-bill-wave"
                    color="bg-yellow-500"
                />
                <StatCard
                    title="Bekleyen Ödemeler"
                    value={stats.pendingPayments}
                    icon="fas fa-clock"
                    color="bg-orange-500"
                />
                <StatCard
                    title="Değerlendirme Puanı"
                    value={stats.reviews}
                    icon="fas fa-star"
                    color="bg-indigo-500"
                />
            </div>

            {/* Aktif Teklifler */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
                <div className="bg-gray-50 px-4 py-3 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-medium text-gray-900">Aktif Tekliflerim</h2>
                        <Link href="/dashboard/proposals" className="text-blue-600 text-sm font-medium hover:text-blue-500">
                            Tümünü Görüntüle
                        </Link>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İş İlanı</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bütçe</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {activeProposals.map((proposal) => (
                                <tr key={proposal.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{proposal.title}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{proposal.budget}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{proposal.date}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${proposal.status === 'Değerlendirmede' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {proposal.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link href={`/dashboard/proposals/${proposal.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                                            Görüntüle
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Aktif İşler */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
                <div className="bg-gray-50 px-4 py-3 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-medium text-gray-900">Aktif İşlerim</h2>
                        <Link href="/dashboard/active-jobs" className="text-blue-600 text-sm font-medium hover:text-blue-500">
                            Tümünü Görüntüle
                        </Link>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İş</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Son Tarih</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İlerleme</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ödeme</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {activeJobs.map((job) => (
                                <tr key={job.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{job.title}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{job.client}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{job.deadline}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${job.progress}%` }}></div>
                                        </div>
                                        <span className="text-xs text-gray-500 mt-1 block">{job.progress}%</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{job.payment}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link href={`/dashboard/active-jobs/${job.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                                            Detaylar
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Önerilen İş İlanları */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                    <h2 className="text-lg font-medium text-gray-900">Size Önerilen İş İlanları</h2>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <h3 className="font-medium text-gray-800 mb-2">Web Tasarım ve Geliştirme</h3>
                                <p className="text-gray-600 text-sm mb-2">Yeni e-ticaret web sitesi için tasarım ve geliştirme hizmetleri arıyoruz.</p>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-blue-600 font-medium">₺10,000 - ₺15,000</span>
                                    <span className="text-gray-500">1 gün önce</span>
                                </div>
                                <div className="mt-3">
                                    <Link href="/jobs/123" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                        İlanı Görüntüle →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-center">
                        <Link href="/jobs" className="text-blue-600 hover:text-blue-800">
                            Daha Fazla İş İlanı Gör
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

// İşveren Dashboard içeriği
const EmployerDashboard = () => {
    // Örnek veriler (API'den gelecektir)
    const stats = {
        activeJobs: 3,
        totalProposals: 27,
        activeContracts: 4,
        completedProjects: 12,
        totalSpent: "₺85,500",
        avgRating: 4.7,
    };

    // Aktif iş ilanları (örnek veriler)
    const activeJobs = [
        { id: 1, title: "Web Sitesi Yenileme", proposals: 12, budget: "₺20,000", date: "05/05/2023", status: "Aktif" },
        { id: 2, title: "Mobil Uygulama Geliştirme", proposals: 8, budget: "₺35,000", date: "01/05/2023", status: "Aktif" },
        { id: 3, title: "Logo Tasarımı", proposals: 7, budget: "₺2,500", date: "28/04/2023", status: "Aktif" },
    ];

    // Aktif sözleşmeler (örnek veriler)
    const activeContracts = [
        { id: 1, title: "SEO Hizmetleri", freelancer: "Zeynep Kaya", deadline: "30/06/2023", progress: 60, payment: "₺12,000" },
        { id: 2, title: "İçerik Yazarlığı", freelancer: "Mehmet Demir", deadline: "15/06/2023", progress: 45, payment: "₺8,500" },
        { id: 3, title: "Sosyal Medya Yönetimi", freelancer: "Ayşe Öztürk", deadline: "31/05/2023", progress: 75, payment: "₺9,000" },
        { id: 4, title: "E-posta Pazarlama", freelancer: "Can Kaya", deadline: "20/05/2023", progress: 85, payment: "₺6,500" },
    ];

    return (
        <div className="p-6">
            {/* Karşılama Mesajı */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Hoş Geldin, Ali!</h1>
                <p className="text-gray-600">İş ilanlarınızı yönetin ve yetenekli freelancerlar bulun.</p>
            </div>

            {/* İstatistik Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="Aktif İlanlar"
                    value={stats.activeJobs}
                    icon="fas fa-briefcase"
                    color="bg-blue-500"
                />
                <StatCard
                    title="Toplam Teklifler"
                    value={stats.totalProposals}
                    icon="fas fa-file-contract"
                    color="bg-green-500"
                />
                <StatCard
                    title="Aktif Sözleşmeler"
                    value={stats.activeContracts}
                    icon="fas fa-handshake"
                    color="bg-purple-500"
                />
                <StatCard
                    title="Tamamlanan Projeler"
                    value={stats.completedProjects}
                    icon="fas fa-check-circle"
                    color="bg-yellow-500"
                />
                <StatCard
                    title="Toplam Harcama"
                    value={stats.totalSpent}
                    icon="fas fa-money-bill-wave"
                    color="bg-orange-500"
                />
                <StatCard
                    title="Ortalama Değerlendirme"
                    value={stats.avgRating}
                    icon="fas fa-star"
                    color="bg-indigo-500"
                />
            </div>

            {/* Aktif İş İlanları */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
                <div className="bg-gray-50 px-4 py-3 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-medium text-gray-900">Aktif İş İlanlarım</h2>
                        <div>
                            <Link href="/jobs/create" className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 mr-2">
                                <i className="fas fa-plus mr-1"></i> Yeni İlan
                            </Link>
                            <Link href="/dashboard/my-jobs" className="text-blue-600 text-sm font-medium hover:text-blue-500">
                                Tümünü Görüntüle
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İş İlanı</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teklifler</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bütçe</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {activeJobs.map((job) => (
                                <tr key={job.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{job.title}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{job.proposals}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{job.budget}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{job.date}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link href={`/dashboard/my-jobs/${job.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                                            Görüntüle
                                        </Link>
                                        <Link href={`/dashboard/my-jobs/${job.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-3">
                                            Düzenle
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Aktif Sözleşmeler */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-medium text-gray-900">Aktif Sözleşmelerim</h2>
                        <Link href="/dashboard/active-jobs" className="text-blue-600 text-sm font-medium hover:text-blue-500">
                            Tümünü Görüntüle
                        </Link>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proje</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Freelancer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Son Tarih</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İlerleme</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ödeme</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {activeContracts.map((contract) => (
                                <tr key={contract.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{contract.title}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{contract.freelancer}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{contract.deadline}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${contract.progress}%` }}></div>
                                        </div>
                                        <span className="text-xs text-gray-500 mt-1 block">{contract.progress}%</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{contract.payment}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link href={`/dashboard/active-jobs/${contract.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                                            Detaylar
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default function Dashboard() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userType, setUserType] = useState<'freelancer' | 'employer'>('freelancer');

    // Kimlik doğrulama kontrolü
    useEffect(() => {
        // Gerçek uygulamada API'den doğrulama yapılır
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login?redirect=/dashboard');
            return;
        }

        // Kullanıcı tipini kontrol et (örnek olarak)
        const storedUserType = localStorage.getItem('userType');
        if (storedUserType === 'employer') {
            setUserType('employer');
        }

        setIsAuthenticated(true);
        setIsLoading(false);
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

    return (
        <>
            <Head>
                <title>Dashboard - Freelanza</title>
                <meta name="description" content="Freelanza kullanıcı paneli" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            </Head>

            <div className="flex min-h-screen bg-gray-100">
                <Sidebar userType={userType} activePage="/dashboard" />

                <div className="flex-1 overflow-auto">
                    <header className="bg-white shadow-sm">
                        <div className="flex items-center justify-between max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

                            <div className="flex items-center">
                                <Link href="/messages" className="mr-4 relative">
                                    <i className="fas fa-envelope text-gray-600 text-xl"></i>
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                                        3
                                    </span>
                                </Link>

                                <Link href="/notifications" className="mr-4 relative">
                                    <i className="fas fa-bell text-gray-600 text-xl"></i>
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                                        5
                                    </span>
                                </Link>

                                <div className="relative">
                                    <button className="flex items-center space-x-2">
                                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                            <Image
                                                src="/images/avatars/avatar-2.jpg"
                                                alt="Profil"
                                                width={32}
                                                height={32}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">
                                            {userType === 'freelancer' ? 'Zeynep Kaya' : 'Ali Yılmaz'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </header>

                    <main>
                        {/* Kullanıcı türüne göre içerik göster */}
                        {userType === 'freelancer' ? <FreelancerDashboard /> : <EmployerDashboard />}
                    </main>
                </div>
            </div>
        </>
    );
} 