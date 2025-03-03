import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/dashboard/Sidebar';

// İstatistik kart bileşeni
interface StatCardProps {
    title: string;
    value: string | number;
    change: string;
    isPositive: boolean;
    icon: string;
    bgColor: string;
}

const StatCard = ({ title, value, change, isPositive, icon, bgColor }: StatCardProps) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">{title}</p>
                    <h3 className="text-2xl font-bold mt-1">{value}</h3>
                    <p className={`text-sm mt-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        <span className="flex items-center">
                            <i className={`fas fa-${isPositive ? 'arrow-up' : 'arrow-down'} mr-1`}></i>
                            {change}
                        </span>
                    </p>
                </div>
                <div className={`${bgColor} text-white p-3 rounded-lg`}>
                    <i className={`${icon} text-xl`}></i>
                </div>
            </div>
        </div>
    );
};

// Son etkinlikler bileşeni
interface ActivityProps {
    type: string;
    message: string;
    time: string;
    isNew?: boolean;
}

const ActivityItem = ({ type, message, time, isNew }: ActivityProps) => {
    // Aktivite tipine göre simge belirle
    let icon;
    let bgColor;

    switch (type) {
        case 'user':
            icon = 'fas fa-user';
            bgColor = 'bg-blue-500';
            break;
        case 'job':
            icon = 'fas fa-briefcase';
            bgColor = 'bg-purple-500';
            break;
        case 'payment':
            icon = 'fas fa-credit-card';
            bgColor = 'bg-green-500';
            break;
        case 'report':
            icon = 'fas fa-flag';
            bgColor = 'bg-red-500';
            break;
        default:
            icon = 'fas fa-bell';
            bgColor = 'bg-gray-500';
    }

    return (
        <div className={`flex items-start p-4 border-b border-gray-100 ${isNew ? 'bg-blue-50' : ''}`}>
            <div className={`${bgColor} text-white p-2 rounded-lg mr-4`}>
                <i className={`${icon}`}></i>
            </div>
            <div className="flex-grow">
                <p className="text-gray-700">{message}</p>
                <p className="text-gray-500 text-sm mt-1">{time}</p>
            </div>
            {isNew && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Yeni</span>
            )}
        </div>
    );
};

export default function AdminDashboard() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // İstatistik verileri
    const stats = [
        {
            title: 'Toplam Kullanıcılar',
            value: '2,845',
            change: '%12.5 son ayda',
            isPositive: true,
            icon: 'fas fa-users',
            bgColor: 'bg-blue-500'
        },
        {
            title: 'Toplam İş İlanları',
            value: '1,257',
            change: '%8.2 son ayda',
            isPositive: true,
            icon: 'fas fa-briefcase',
            bgColor: 'bg-purple-500'
        },
        {
            title: 'Toplam Kazanç',
            value: '₺128,540',
            change: '%15.3 son ayda',
            isPositive: true,
            icon: 'fas fa-money-bill-wave',
            bgColor: 'bg-green-500'
        },
        {
            title: 'Aktif Projeler',
            value: '384',
            change: '%5.1 son ayda',
            isPositive: true,
            icon: 'fas fa-project-diagram',
            bgColor: 'bg-yellow-500'
        }
    ];

    // Son etkinlikler
    const activities = [
        {
            type: 'user',
            message: 'Mehmet Yılmaz adlı yeni bir freelancer kaydoldu.',
            time: '10 dakika önce',
            isNew: true
        },
        {
            type: 'job',
            message: 'Web Geliştirme kategorisinde yeni bir iş ilanı yayınlandı.',
            time: '30 dakika önce',
            isNew: true
        },
        {
            type: 'payment',
            message: 'Ayşe Demir adlı kullanıcı 1,250₺ tutarında ödeme aldı.',
            time: '1 saat önce',
            isNew: false
        },
        {
            type: 'report',
            message: 'Bir iş ilanı uygunsuz içerik nedeniyle raporlandı.',
            time: '2 saat önce',
            isNew: false
        },
        {
            type: 'user',
            message: 'Ali Kaya adlı kullanıcı profilini güncelledi.',
            time: '3 saat önce',
            isNew: false
        }
    ];

    useEffect(() => {
        // Admin tokenı kontrolü
        const adminToken = localStorage.getItem('adminToken');

        if (!adminToken) {
            router.push('/admin/login');
        } else {
            setIsAuthenticated(true);
            setLoading(false);
        }
    }, [router]);

    // Yükleniyor durumu
    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Yükleniyor...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>Admin Dashboard | Freelanza</title>
                <meta name="description" content="Freelanza Admin Paneli" />
            </Head>

            <Header />

            <div className="flex flex-grow">
                <Sidebar userType="admin" />

                <div className="flex-grow bg-gray-50">
                    <div className="container mx-auto px-4 py-8">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-500">
                                    <i className="far fa-calendar-alt mr-2"></i>
                                    {new Date().toLocaleDateString('tr-TR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none">
                                    <i className="fas fa-download mr-2"></i>
                                    Rapor İndir
                                </button>
                            </div>
                        </div>

                        {/* İstatistik Kartları */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {stats.map((stat, index) => (
                                <StatCard
                                    key={index}
                                    title={stat.title}
                                    value={stat.value}
                                    change={stat.change}
                                    isPositive={stat.isPositive}
                                    icon={stat.icon}
                                    bgColor={stat.bgColor}
                                />
                            ))}
                        </div>

                        {/* Grafik ve Aktiviteler */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Grafik */}
                            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold">Aylık İstatistikler</h2>
                                    <div className="text-sm text-gray-500">
                                        <select className="border rounded-lg px-2 py-1 focus:outline-none">
                                            <option>Son 30 Gün</option>
                                            <option>Son 90 Gün</option>
                                            <option>Son 1 Yıl</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Basit bir grafik gösterimi (gerçek uygulamada bir grafik kütüphanesi kullanılabilir) */}
                                <div className="h-64 border-b border-gray-200 flex items-end justify-between">
                                    {Array.from({ length: 12 }).map((_, index) => {
                                        // Rastgele yükseklikler
                                        const height = Math.floor(Math.random() * 80) + 20;
                                        return (
                                            <div key={index} className="flex flex-col items-center">
                                                <div
                                                    className="w-6 bg-blue-500 rounded-t-sm"
                                                    style={{ height: `${height}%` }}
                                                ></div>
                                                <span className="text-xs text-gray-500 mt-2">
                                                    {new Date(2023, index).toLocaleDateString('tr-TR', { month: 'short' })}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex justify-between mt-6">
                                    <div className="flex items-center">
                                        <span className="w-3 h-3 bg-blue-500 rounded-full inline-block mr-2"></span>
                                        <span className="text-sm text-gray-600">Kullanıcılar</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="w-3 h-3 bg-purple-500 rounded-full inline-block mr-2"></span>
                                        <span className="text-sm text-gray-600">İşler</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="w-3 h-3 bg-green-500 rounded-full inline-block mr-2"></span>
                                        <span className="text-sm text-gray-600">Kazançlar</span>
                                    </div>
                                </div>
                            </div>

                            {/* Son Etkinlikler */}
                            <div className="bg-white rounded-lg shadow-md">
                                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                                    <h2 className="text-lg font-semibold">Son Etkinlikler</h2>
                                    <Link href="/admin/activities">
                                        <a className="text-blue-500 text-sm hover:underline">
                                            Tümünü Gör
                                        </a>
                                    </Link>
                                </div>

                                <div className="max-h-96 overflow-y-auto">
                                    {activities.map((activity, index) => (
                                        <ActivityItem
                                            key={index}
                                            type={activity.type}
                                            message={activity.message}
                                            time={activity.time}
                                            isNew={activity.isNew}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Hızlı Erişim Linkleri */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                            <Link href="/admin/users">
                                <a className="bg-white rounded-lg shadow-md p-6 flex items-center hover:shadow-lg transition-shadow">
                                    <div className="bg-blue-100 text-blue-500 p-3 rounded-lg mr-4">
                                        <i className="fas fa-users text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Kullanıcılar</h3>
                                        <p className="text-gray-500 text-sm">Kullanıcıları yönet</p>
                                    </div>
                                </a>
                            </Link>

                            <Link href="/admin/jobs">
                                <a className="bg-white rounded-lg shadow-md p-6 flex items-center hover:shadow-lg transition-shadow">
                                    <div className="bg-purple-100 text-purple-500 p-3 rounded-lg mr-4">
                                        <i className="fas fa-briefcase text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">İş İlanları</h3>
                                        <p className="text-gray-500 text-sm">İlanları yönet</p>
                                    </div>
                                </a>
                            </Link>

                            <Link href="/admin/payments">
                                <a className="bg-white rounded-lg shadow-md p-6 flex items-center hover:shadow-lg transition-shadow">
                                    <div className="bg-green-100 text-green-500 p-3 rounded-lg mr-4">
                                        <i className="fas fa-credit-card text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Ödemeler</h3>
                                        <p className="text-gray-500 text-sm">Ödemeleri yönet</p>
                                    </div>
                                </a>
                            </Link>

                            <Link href="/admin/settings">
                                <a className="bg-white rounded-lg shadow-md p-6 flex items-center hover:shadow-lg transition-shadow">
                                    <div className="bg-gray-100 text-gray-500 p-3 rounded-lg mr-4">
                                        <i className="fas fa-cog text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Ayarlar</h3>
                                        <p className="text-gray-500 text-sm">Site ayarları</p>
                                    </div>
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
} 