import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { useAuthContext } from '../context/AuthContext';

// Mock kullanıcı verisi - gerçek uygulamada API'dan gelecek
const MOCK_USER = {
    id: 1,
    name: 'Ahmet Yılmaz',
    role: 'Freelancer',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    title: 'Full Stack Web Developer',
    location: 'İstanbul, Türkiye',
    hourlyRate: 250,
    memberSince: 'Nisan 2022',
    about: 'Merhaba, ben Ahmet! 5 yıldır full stack web geliştirici olarak çalışıyorum. React, Node.js ve TypeScript konusunda uzmanım. Kullanıcı odaklı, performanslı ve ölçeklenebilir uygulamalar geliştirmeyi seviyorum.',
    skills: [
        { name: 'React', level: 'Expert' },
        { name: 'TypeScript', level: 'Expert' },
        { name: 'Node.js', level: 'Advanced' },
        { name: 'MongoDB', level: 'Intermediate' },
        { name: 'Express', level: 'Advanced' },
        { name: 'Next.js', level: 'Intermediate' },
        { name: 'TailwindCSS', level: 'Advanced' },
        { name: 'PostgreSQL', level: 'Intermediate' },
    ],
    completedJobs: 32,
    inProgressJobs: 3,
    ratings: 4.8,
    totalReviews: 28,
    languages: [
        { name: 'Türkçe', level: 'Anadil' },
        { name: 'İngilizce', level: 'İleri Seviye' },
        { name: 'Almanca', level: 'Başlangıç' },
    ],
    education: [
        { institution: 'İstanbul Teknik Üniversitesi', degree: 'Bilgisayar Mühendisliği', duration: '2014 - 2018' },
    ],
    experience: [
        { company: 'ABC Teknoloji', position: 'Full Stack Developer', duration: '2019 - 2022' },
        { company: 'XYZ Yazılım', position: 'Frontend Developer', duration: '2018 - 2019' },
    ],
    portfolio: [
        {
            id: 1,
            title: 'E-Ticaret Platformu',
            description: 'React ve Node.js ile geliştirilmiş kapsamlı bir e-ticaret çözümü.',
            imageUrl: 'https://via.placeholder.com/300x200?text=E-Commerce+Platform',
            link: '#',
        },
        {
            id: 2,
            title: 'Lokasyon Bazlı Hizmet Uygulaması',
            description: 'React Native ile geliştirilmiş, GPS tabanlı hizmet bulma uygulaması.',
            imageUrl: 'https://via.placeholder.com/300x200?text=Location+Service+App',
            link: '#',
        },
        {
            id: 3,
            title: 'İçerik Yönetim Sistemi',
            description: 'Next.js ve GraphQL kullanılarak geliştirilmiş modern CMS.',
            imageUrl: 'https://via.placeholder.com/300x200?text=Content+Management+System',
            link: '#',
        },
    ],
    reviews: [
        {
            id: 1,
            clientName: 'Mehmet Öz',
            clientAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
            rating: 5,
            date: '15 Mayıs 2023',
            projectTitle: 'Web Sitesi Yenileme',
            comment: 'Ahmet ile çalışmak harikaydı. İhtiyaçlarımızı hızlıca anladı ve beklentilerimizin ötesinde bir iş çıkardı. Kesinlikle tekrar çalışmak isterim.',
        },
        {
            id: 2,
            clientName: 'Ayşe Kaya',
            clientAvatar: 'https://randomuser.me/api/portraits/women/24.jpg',
            rating: 5,
            date: '3 Ocak 2023',
            projectTitle: 'E-Ticaret Entegrasyonu',
            comment: 'Profesyonel yaklaşımı ve teknik becerisi etkileyici. Projemizi zamanında ve bütçe dahilinde tamamladı. Çok memnun kaldık.',
        },
        {
            id: 3,
            clientName: 'Ali Demir',
            clientAvatar: 'https://randomuser.me/api/portraits/men/42.jpg',
            rating: 4,
            date: '22 Kasım 2022',
            projectTitle: 'Mobil Uygulama Geliştirme',
            comment: 'İyi iletişim ve kaliteli kod. Bazı özelliklerin geliştirilmesi biraz zaman aldı ama sonuçtan memnunuz.',
        },
    ],
};

const Profile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { isAuthenticated } = useAuthContext();
    const [user, setUser] = useState(MOCK_USER);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'reviews'>('overview');
    const [isOwnProfile, setIsOwnProfile] = useState(false);

    // Gerçek uygulamada burası API'dan kullanıcı verisini çeker
    useEffect(() => {
        setLoading(true);
        // Burada API çağrısı olacak
        setTimeout(() => {
            setUser(MOCK_USER);
            // isOwnProfile mantığı: gerçek uygulamada mevcut kullanıcı ID'si ile profil ID'si karşılaştırılır
            setIsOwnProfile(id === '1' || !id);
            setLoading(false);
        }, 500);
    }, [id]);

    if (loading) {
        return (
            <Layout>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="animate-pulse">
                        <div className="flex items-center space-x-4">
                            <div className="rounded-full bg-neutral-300 h-20 w-20"></div>
                            <div className="flex-1 space-y-3">
                                <div className="h-6 bg-neutral-300 rounded w-1/4"></div>
                                <div className="h-4 bg-neutral-300 rounded w-1/2"></div>
                            </div>
                        </div>
                        <div className="mt-6 h-32 bg-neutral-300 rounded"></div>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="h-40 bg-neutral-300 rounded"></div>
                            <div className="h-40 bg-neutral-300 rounded"></div>
                            <div className="h-40 bg-neutral-300 rounded"></div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <svg className="h-16 w-16 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="mt-2 text-2xl font-bold text-neutral-900">Hata Oluştu</h2>
                    <p className="mt-1 text-lg text-neutral-500">{error}</p>
                    <div className="mt-6">
                        <Button variant="primary" onClick={() => window.location.reload()}>
                            Yeniden Dene
                        </Button>
                    </div>
                </div>
            </Layout>
        );
    }

    // Değerlendirme yıldızları render fonksiyonu
    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <svg
                    key={i}
                    className={`h-5 w-5 ${i <= rating ? 'text-yellow-400' : 'text-neutral-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            );
        }
        return stars;
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profil Başlık */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center">
                            {/* Avatar */}
                            <div className="flex-shrink-0 mb-4 sm:mb-0">
                                <img
                                    className="h-24 w-24 rounded-full object-cover border-4 border-white shadow"
                                    src={user.avatar}
                                    alt={user.name}
                                />
                            </div>

                            {/* Kullanıcı Bilgileri */}
                            <div className="flex-1 ml-0 sm:ml-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                    <div>
                                        <h1 className="text-2xl font-bold text-neutral-900">{user.name}</h1>
                                        <p className="text-lg text-neutral-600">{user.title}</p>
                                        <div className="flex items-center mt-1 text-sm text-neutral-500">
                                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                            {user.location}
                                        </div>
                                        <div className="flex items-center mt-1">
                                            <div className="flex mr-4">
                                                {renderStars(user.ratings)}
                                                <span className="text-sm text-neutral-600 ml-1">
                                                    ({user.totalReviews} değerlendirme)
                                                </span>
                                            </div>
                                            <div className="text-sm text-neutral-500">
                                                Üyelik: {user.memberSince}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 sm:mt-0 flex flex-col sm:items-end">
                                        <p className="text-xl font-bold text-primary-600">₺{user.hourlyRate}/saat</p>
                                        <div className="flex mt-2 space-x-2">
                                            {isOwnProfile ? (
                                                <Link to="/profile/edit">
                                                    <Button variant="outline">
                                                        Profili Düzenle
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <>
                                                    <Button variant="primary">İletişime Geç</Button>
                                                    <Button variant="outline">İşe Teklif Ver</Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* İstatistikler */}
                        <div className="mt-6 pt-6 border-t border-neutral-200 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <p className="text-sm font-medium text-neutral-500">Tamamlanan İşler</p>
                                <p className="mt-1 text-2xl font-semibold text-neutral-900">{user.completedJobs}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-neutral-500">Devam Eden İşler</p>
                                <p className="mt-1 text-2xl font-semibold text-neutral-900">{user.inProgressJobs}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-neutral-500">Değerlendirme</p>
                                <p className="mt-1 text-2xl font-semibold text-neutral-900">{user.ratings}/5</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-neutral-500">Yanıt Oranı</p>
                                <p className="mt-1 text-2xl font-semibold text-neutral-900">%98</p>
                            </div>
                        </div>
                    </div>

                    {/* Sekmeler */}
                    <div className="border-t border-neutral-200">
                        <nav className="flex">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`-mb-px px-6 py-3 border-b-2 text-sm font-medium ${activeTab === 'overview'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                                    }`}
                            >
                                Genel Bakış
                            </button>
                            <button
                                onClick={() => setActiveTab('portfolio')}
                                className={`-mb-px px-6 py-3 border-b-2 text-sm font-medium ${activeTab === 'portfolio'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                                    }`}
                            >
                                Portföy
                            </button>
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`-mb-px px-6 py-3 border-b-2 text-sm font-medium ${activeTab === 'reviews'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                                    }`}
                            >
                                Değerlendirmeler ({user.totalReviews})
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Sekme İçeriği */}
                <div className="mt-6">
                    {/* Genel Bakış */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Sol Sütun - Hakkında ve Beceriler */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Hakkında */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h2 className="text-lg font-semibold text-neutral-900 mb-4">Hakkında</h2>
                                    <p className="text-neutral-700 whitespace-pre-line">{user.about}</p>
                                </div>

                                {/* Beceriler */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h2 className="text-lg font-semibold text-neutral-900 mb-4">Beceriler</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {user.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-100 text-neutral-800"
                                            >
                                                {skill.name}
                                                <span className="ml-1 text-xs text-neutral-500">• {skill.level}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Deneyim */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h2 className="text-lg font-semibold text-neutral-900 mb-4">İş Deneyimi</h2>
                                    <div className="space-y-4">
                                        {user.experience.map((exp, index) => (
                                            <div key={index} className="border-b border-neutral-200 last:border-b-0 pb-4 last:pb-0">
                                                <h3 className="font-medium text-neutral-900">{exp.position}</h3>
                                                <p className="text-neutral-600">{exp.company}</p>
                                                <p className="text-sm text-neutral-500">{exp.duration}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Eğitim */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h2 className="text-lg font-semibold text-neutral-900 mb-4">Eğitim</h2>
                                    <div className="space-y-4">
                                        {user.education.map((edu, index) => (
                                            <div key={index} className="border-b border-neutral-200 last:border-b-0 pb-4 last:pb-0">
                                                <h3 className="font-medium text-neutral-900">{edu.degree}</h3>
                                                <p className="text-neutral-600">{edu.institution}</p>
                                                <p className="text-sm text-neutral-500">{edu.duration}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sağ Sütun - Diller ve İletişim */}
                            <div className="space-y-6">
                                {/* Diller */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h2 className="text-lg font-semibold text-neutral-900 mb-4">Diller</h2>
                                    <div className="space-y-3">
                                        {user.languages.map((lang, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <span className="text-neutral-700">{lang.name}</span>
                                                <span className="text-sm text-neutral-500">{lang.level}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* İletişim - Giriş yapmış kullanıcılara gösterilir */}
                                {isAuthenticated && (
                                    <div className="bg-white rounded-lg shadow-sm p-6">
                                        <h2 className="text-lg font-semibold text-neutral-900 mb-4">İletişim</h2>
                                        <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                            Mesaj Gönder
                                        </button>
                                        {!isOwnProfile && (
                                            <button className="mt-3 w-full py-2 px-4 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                                İşe Teklif Ver
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Portföy */}
                    {activeTab === 'portfolio' && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-neutral-900 mb-6">Portföy</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {user.portfolio.map((item) => (
                                    <div key={item.id} className="border border-neutral-200 rounded-lg overflow-hidden">
                                        <div className="h-48 overflow-hidden">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-neutral-900">{item.title}</h3>
                                            <p className="mt-1 text-sm text-neutral-600">{item.description}</p>
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-3 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
                                            >
                                                Detayları Gör
                                                <svg
                                                    className="ml-1 h-4 w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                    />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Değerlendirmeler */}
                    {activeTab === 'reviews' && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-neutral-900">Müşteri Değerlendirmeleri</h2>
                                <div className="flex items-center">
                                    <div className="flex">
                                        {renderStars(user.ratings)}
                                    </div>
                                    <span className="ml-2 text-neutral-700">
                                        {user.ratings}/5 ({user.totalReviews} değerlendirme)
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {user.reviews.map((review) => (
                                    <div key={review.id} className="border-b border-neutral-200 last:border-b-0 pb-6 last:pb-0">
                                        <div className="flex items-start">
                                            <img
                                                className="h-10 w-10 rounded-full mr-4"
                                                src={review.clientAvatar}
                                                alt={review.clientName}
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-medium text-neutral-900">{review.clientName}</h3>
                                                    <span className="text-sm text-neutral-500">{review.date}</span>
                                                </div>
                                                <p className="text-sm text-neutral-600 mt-1">{review.projectTitle}</p>
                                                <div className="flex mt-1">
                                                    {renderStars(review.rating)}
                                                </div>
                                                <p className="mt-2 text-neutral-700">{review.comment}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Profile; 