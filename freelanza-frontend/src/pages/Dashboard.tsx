import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { useAuthContext } from '../context/AuthContext';

// Fake data for now
const MOCK_DATA = {
    user: {
        name: 'Ahmet Yılmaz',
        email: 'ahmet@example.com',
        role: 'freelancer',
        avatarUrl: null,
        hourlyRate: 100,
        completedJobs: 12,
        rating: 4.8,
        balance: 3500
    },
    stats: {
        proposals: 8,
        activeJobs: 3,
        completedJobs: 12,
        earnings: 15000
    },
    activeJobs: [
        {
            id: 101,
            title: 'E-ticaret Mobil Uygulaması',
            client: 'Tech Solutions',
            dueDate: '2023-12-15',
            amount: 8000,
            progress: 60
        },
        {
            id: 102,
            title: 'Web Sitesi SEO Optimizasyonu',
            client: 'Digital Marketing Co.',
            dueDate: '2023-12-05',
            amount: 2500,
            progress: 80
        },
        {
            id: 103,
            title: 'Logo ve Marka Kimliği Tasarımı',
            client: 'StartUp Inc.',
            dueDate: '2023-12-10',
            amount: 1500,
            progress: 30
        }
    ],
    recentActivities: [
        {
            id: 201,
            type: 'message',
            content: 'Tech Solutions projesinde yeni bir mesaj',
            date: '2023-11-29T10:30:00',
            read: false
        },
        {
            id: 202,
            type: 'payment',
            content: '₺1,500 ödeme alındı',
            date: '2023-11-28T15:45:00',
            read: true
        },
        {
            id: 203,
            type: 'proposal',
            content: 'Teklifiniz kabul edildi',
            date: '2023-11-27T09:15:00',
            read: true
        },
        {
            id: 204,
            type: 'review',
            content: 'Yeni bir değerlendirme aldınız',
            date: '2023-11-26T14:20:00',
            read: true
        }
    ]
};

const Dashboard: React.FC = () => {
    const { isAuthenticated } = useAuthContext();
    const [view, setView] = useState<'freelancer' | 'client'>('freelancer');

    // In a real application, we would fetch the data based on the authenticated user
    const data = MOCK_DATA;

    if (!isAuthenticated) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <svg className="h-24 w-24 text-neutral-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h2 className="mt-2 text-2xl font-bold text-neutral-900">Erişim Kısıtlı</h2>
                    <p className="mt-1 text-lg text-neutral-500">
                        Bu sayfayı görüntülemek için giriş yapmalısınız.
                    </p>
                    <div className="mt-6">
                        <Link to="/login">
                            <Button variant="primary">Giriş Yap</Button>
                        </Link>
                        <Link to="/register" className="ml-4">
                            <Button variant="outline">Kaydol</Button>
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Dashboard Header */}
                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-3xl font-bold leading-tight text-neutral-900">Dashboard</h1>
                        <p className="mt-1 text-lg text-neutral-500">
                            Hoş geldiniz, {data.user.name}
                        </p>
                    </div>
                    <div className="mt-4 flex md:mt-0 md:ml-4">
                        <div className="inline-flex rounded-md shadow">
                            <Button
                                variant={view === 'freelancer' ? 'primary' : 'outline'}
                                onClick={() => setView('freelancer')}
                            >
                                Freelancer Görünümü
                            </Button>
                        </div>
                        <div className="ml-3 inline-flex">
                            <Button
                                variant={view === 'client' ? 'primary' : 'outline'}
                                onClick={() => setView('client')}
                            >
                                İşveren Görünümü
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="card p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-neutral-500 truncate">Teklifler</dt>
                                    <dd>
                                        <div className="text-lg font-medium text-neutral-900">{data.stats.proposals}</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>

                    <div className="card p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-neutral-500 truncate">Aktif İşler</dt>
                                    <dd>
                                        <div className="text-lg font-medium text-neutral-900">{data.stats.activeJobs}</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>

                    <div className="card p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-neutral-500 truncate">Tamamlanan İşler</dt>
                                    <dd>
                                        <div className="text-lg font-medium text-neutral-900">{data.stats.completedJobs}</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>

                    <div className="card p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-neutral-500 truncate">Toplam Kazanç</dt>
                                    <dd>
                                        <div className="text-lg font-medium text-neutral-900">₺{data.stats.earnings.toLocaleString()}</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Active Jobs */}
                    <div className="lg:col-span-2">
                        <div className="card overflow-hidden">
                            <div className="px-6 py-5 border-b border-neutral-200 bg-neutral-50">
                                <h3 className="text-lg font-medium text-neutral-900">Aktif İşler</h3>
                            </div>
                            <div className="divide-y divide-neutral-200">
                                {data.activeJobs.map((job) => (
                                    <div key={job.id} className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-lg font-medium text-neutral-900">{job.title}</h4>
                                                <div className="mt-1 flex items-center">
                                                    <span className="text-sm text-neutral-500 mr-2">{job.client}</span>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                                        Son Tarih: {new Date(job.dueDate).toLocaleDateString('tr-TR')}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-xl font-bold text-primary-600">₺{job.amount.toLocaleString()}</span>
                                        </div>
                                        <div className="mt-4">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-neutral-500">İlerleme</span>
                                                <span className="text-neutral-700 font-medium">{job.progress}%</span>
                                            </div>
                                            <div className="mt-2 w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary-500 rounded-full"
                                                    style={{ width: `${job.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex justify-end space-x-2">
                                            <Link to={`/jobs/${job.id}`}>
                                                <Button variant="outline" size="sm">
                                                    Detaylar
                                                </Button>
                                            </Link>
                                            <Link to={`/jobs/${job.id}/messages`}>
                                                <Button variant="primary" size="sm">
                                                    Mesajlar
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                                {data.activeJobs.length === 0 && (
                                    <div className="p-6 text-center">
                                        <p className="text-neutral-500">Henüz aktif bir işiniz bulunmuyor.</p>
                                    </div>
                                )}
                            </div>
                            <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50">
                                <Link to="/jobs">
                                    <Button variant="outline" className="w-full">
                                        Tüm İşleri Gör
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Activity & Profile */}
                    <div className="space-y-6">
                        {/* Profile Card */}
                        <div className="card p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    {data.user.avatarUrl ? (
                                        <img
                                            className="h-16 w-16 rounded-full"
                                            src={data.user.avatarUrl}
                                            alt={data.user.name}
                                        />
                                    ) : (
                                        <div className="h-16 w-16 rounded-full bg-primary-500 flex items-center justify-center text-white text-xl font-bold">
                                            {data.user.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-neutral-900">{data.user.name}</h3>
                                    <p className="text-sm text-neutral-500">
                                        {data.user.role === 'freelancer' ? 'Freelancer' : 'İşveren'}
                                    </p>
                                    <div className="mt-1 flex items-center">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`h-4 w-4 ${i < Math.floor(data.user.rating) ? 'text-yellow-400' : 'text-neutral-300'
                                                    }`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                        <span className="ml-1 text-sm text-neutral-500">{data.user.rating}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div className="bg-neutral-50 p-3 rounded-md">
                                    <p className="text-sm text-neutral-500">Saatlik Ücret</p>
                                    <p className="text-lg font-medium text-neutral-900">₺{data.user.hourlyRate}/sa</p>
                                </div>
                                <div className="bg-neutral-50 p-3 rounded-md">
                                    <p className="text-sm text-neutral-500">Bakiye</p>
                                    <p className="text-lg font-medium text-neutral-900">₺{data.user.balance}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <Link to="/profile">
                                    <Button variant="outline" className="w-full">
                                        Profili Düzenle
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="card overflow-hidden">
                            <div className="px-6 py-5 border-b border-neutral-200 bg-neutral-50">
                                <h3 className="text-lg font-medium text-neutral-900">Son Aktiviteler</h3>
                            </div>
                            <div className="divide-y divide-neutral-200">
                                {data.recentActivities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className={`p-4 ${activity.read ? '' : 'bg-primary-50'}`}
                                    >
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 mr-3">
                                                {activity.type === 'message' && (
                                                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                                                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                {activity.type === 'payment' && (
                                                    <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                                                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                {activity.type === 'proposal' && (
                                                    <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
                                                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                {activity.type === 'review' && (
                                                    <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center">
                                                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-neutral-900">{activity.content}</p>
                                                <p className="text-xs text-neutral-500 mt-1">
                                                    {new Date(activity.date).toLocaleString('tr-TR')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {data.recentActivities.length === 0 && (
                                    <div className="p-6 text-center">
                                        <p className="text-neutral-500">Henüz bir aktivite bulunmuyor.</p>
                                    </div>
                                )}
                            </div>
                            <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50">
                                <Link to="/activities">
                                    <Button variant="outline" className="w-full">
                                        Tüm Aktiviteleri Gör
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard; 