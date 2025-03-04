import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { useAuthContext } from '../context/AuthContext';

// Örnek iş verisi
const JOB_DATA = {
    id: 1,
    title: 'React Native Mobil Uygulama Geliştiricisi',
    description: 'Mevcut e-ticaret platformumuz için kullanıcı dostu bir mobil uygulama geliştirmek istiyoruz. Uygulama, Android ve iOS platformlarında çalışmalı ve mevcut REST API\'miz ile entegre olmalıdır. Kullanıcıların ürünleri taraması, arama yapması, sepete eklemesi ve satın alması gerekiyor. Ayrıca kullanıcı hesapları, sipariş geçmişi ve bildirimler için destek olmalıdır.',
    longDescription: `
    <h3>Proje Genel Bakış</h3>
    <p>XYZ Teknoloji olarak hızla büyüyen e-ticaret platformumuz için kullanıcılarımıza daha iyi bir mobil deneyim sunmak istiyoruz. Mevcut web sitemiz responsive olsa da, mobil kullanıcılarımıza özel olarak tasarlanmış daha hızlı ve yerel bir deneyim sunmak istiyoruz.</p>
    
    <h3>Gereksinimler</h3>
    <ul>
      <li>React Native kullanarak cross-platform (Android ve iOS) bir uygulama geliştirme</li>
      <li>Redux veya Context API kullanarak durum yönetimi</li>
      <li>REST API entegrasyonu</li>
      <li>Kullanıcı kimlik doğrulama ve oturum yönetimi</li>
      <li>Ürün listeleme, filtreleme ve arama</li>
      <li>Sepet ve ödeme işlevselliği</li>
      <li>Kullanıcı profili ve sipariş geçmişi</li>
      <li>Push bildirimleri</li>
      <li>Offline kullanım için veri önbelleğe alma</li>
      <li>Performans optimizasyonu</li>
    </ul>
    
    <h3>Teknik Detaylar</h3>
    <p>Backend sistemimiz Node.js ve Express.js üzerine inşa edilmiş bir REST API'dir. Veritabanı olarak MongoDB kullanıyoruz. API belgelerimiz Swagger ile oluşturulmuştur ve geliştirme için size sağlanacaktır.</p>
    
    <h3>Beklenen Teslimatlar</h3>
    <ul>
      <li>Tamamlanmış React Native uygulaması kaynak kodu</li>
      <li>Android APK ve iOS IPA dosyaları</li>
      <li>Kurulum ve dağıtım talimatları</li>
      <li>Teknik dokümantasyon</li>
    </ul>
    
    <h3>Zaman Çizelgesi</h3>
    <p>Projenin 2-3 ay içinde tamamlanmasını bekliyoruz. İlerleme durumunu izlemek için düzenli kontrol noktaları planlayacağız.</p>
  `,
    budget: 10000,
    duration: '2-3 ay',
    expertise: 'Orta-İleri Seviye',
    createdAt: '2023-11-15',
    deadline: '2023-12-15',
    company: {
        id: 101,
        name: 'XYZ Teknoloji',
        logo: null, // Şimdilik logo yok
        location: 'İstanbul, Türkiye',
        website: 'https://xyz-tech.com',
        foundedYear: 2015,
        employees: '10-50',
        about: 'XYZ Teknoloji, e-ticaret ve fintech alanında yenilikçi çözümler sunan bir teknoloji şirketidir.',
        rating: 4.8,
        reviewCount: 23,
        verifiedPayment: true,
        jobsPosted: 12
    },
    category: 'Yazılım Geliştirme',
    skills: ['React Native', 'JavaScript', 'TypeScript', 'Redux', 'RESTful API', 'Firebase', 'Mobile App Development'],
    proposals: 8,
    attachments: [
        { id: 1, name: 'project_requirements.pdf', size: '1.2 MB', type: 'pdf' },
        { id: 2, name: 'design_mockups.zip', size: '5.8 MB', type: 'zip' }
    ],
    questions: [
        'React Native ile daha önce kaç tane uygulama geliştirdiniz?',
        'Benzer bir e-ticaret uygulaması deneyiminiz var mı?',
        'Proje için ne kadar zaman ayırabilirsiniz?'
    ]
};

const JobDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthContext();
    const [job, setJob] = useState(JOB_DATA);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showApplyForm, setShowApplyForm] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    // Gerçek bir uygulamada burası API'dan veri çeker
    useEffect(() => {
        setLoading(true);
        try {
            // Simüle edilmiş API çağrısı
            setTimeout(() => {
                setJob(JOB_DATA);
                setLoading(false);
            }, 500);
        } catch (err) {
            setError('İş detayları yüklenirken bir hata oluştu.');
            setLoading(false);
        }
    }, [id]);

    const handleApplyClick = () => {
        if (!isAuthenticated) {
            setShowLoginPrompt(true);
        } else {
            navigate(`/jobs/${id}/apply`);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-neutral-200 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-neutral-200 rounded w-1/2 mb-6"></div>
                        <div className="h-48 bg-neutral-200 rounded mb-6"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <div className="h-32 bg-neutral-200 rounded mb-4"></div>
                                <div className="h-64 bg-neutral-200 rounded"></div>
                            </div>
                            <div>
                                <div className="h-96 bg-neutral-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <svg className="h-16 w-16 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="mt-2 text-2xl font-bold text-neutral-900">Hata Oluştu</h2>
                    <p className="mt-1 text-lg text-neutral-500">{error}</p>
                    <div className="mt-6">
                        <Button variant="primary" onClick={() => window.location.reload()}>
                            Yeniden Dene
                        </Button>
                        <Link to="/jobs" className="ml-4">
                            <Button variant="outline">İş İlanlarına Dön</Button>
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Job Header */}
                <div className="mb-6">
                    <div className="flex items-center">
                        <Link to="/jobs" className="text-primary-600 hover:text-primary-700 mr-2">
                            <svg className="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            İş İlanlarına Dön
                        </Link>
                        <span className="text-neutral-500">/ İş Detayı</span>
                    </div>
                    <div className="mt-2 flex items-start justify-between">
                        <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mb-2">
                                {job.category}
                            </span>
                            <h1 className="text-3xl font-bold text-neutral-900">{job.title}</h1>
                            <p className="mt-1 text-neutral-500">
                                {new Date(job.createdAt).toLocaleDateString('tr-TR')} tarihinde yayınlandı • {job.proposals} başvuru
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-primary-600 mb-1">₺{job.budget.toLocaleString()}</div>
                            <span className="text-neutral-500">{job.duration}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Job Description */}
                        <div className="card mb-6">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-neutral-900 mb-4">İş Açıklaması</h2>
                                <p className="text-neutral-700 mb-4">{job.description}</p>
                                <div
                                    className="text-neutral-700 prose max-w-none"
                                    dangerouslySetInnerHTML={{ __html: job.longDescription }}
                                />

                                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-neutral-500">Kategori</h3>
                                        <p className="mt-1 text-base text-neutral-900">{job.category}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-neutral-500">Proje Süresi</h3>
                                        <p className="mt-1 text-base text-neutral-900">{job.duration}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-neutral-500">Uzmanlık Seviyesi</h3>
                                        <p className="mt-1 text-base text-neutral-900">{job.expertise}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Skills Section */}
                        <div className="card mb-6">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-neutral-900 mb-4">Gerekli Beceriler</h2>
                                <div className="flex flex-wrap gap-2">
                                    {job.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-neutral-100 text-neutral-800"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Attachments */}
                        {job.attachments.length > 0 && (
                            <div className="card mb-6">
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-neutral-900 mb-4">Ekler</h2>
                                    <div className="divide-y divide-neutral-200">
                                        {job.attachments.map((attachment) => (
                                            <div key={attachment.id} className="py-3 flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <svg className="h-5 w-5 text-neutral-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                    <div>
                                                        <p className="text-sm font-medium text-neutral-900">{attachment.name}</p>
                                                        <p className="text-xs text-neutral-500">{attachment.size}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-1.5 border border-neutral-300 text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50"
                                                >
                                                    İndir
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Questions */}
                        {job.questions.length > 0 && (
                            <div className="card mb-6">
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                                        Başvuru için yanıtlamanız gereken sorular
                                    </h2>
                                    <ul className="space-y-3 list-disc pl-5">
                                        {job.questions.map((question, index) => (
                                            <li key={index} className="text-neutral-700">
                                                {question}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Client Activity */}
                        <div className="card">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-neutral-900 mb-4">İşveren Aktivitesi</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                    <div className="bg-neutral-50 p-3 rounded-md">
                                        <p className="text-sm text-neutral-500">Son Görülme</p>
                                        <p className="text-base font-medium text-neutral-900">Bugün</p>
                                    </div>
                                    <div className="bg-neutral-50 p-3 rounded-md">
                                        <p className="text-sm text-neutral-500">Açık İlanlar</p>
                                        <p className="text-base font-medium text-neutral-900">{job.company.jobsPosted}</p>
                                    </div>
                                    <div className="bg-neutral-50 p-3 rounded-md">
                                        <p className="text-sm text-neutral-500">Ortalama Yanıt Süresi</p>
                                        <p className="text-base font-medium text-neutral-900">2 saat</p>
                                    </div>
                                    <div className="bg-neutral-50 p-3 rounded-md">
                                        <p className="text-sm text-neutral-500">Tamamlanan İşler</p>
                                        <p className="text-base font-medium text-neutral-900">34</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div>
                        {/* Apply Button */}
                        <div className="card mb-6">
                            <div className="p-6">
                                <Button variant="primary" className="w-full" onClick={handleApplyClick}>
                                    Bu İşe Başvur
                                </Button>
                                <div className="mt-4 text-center text-sm text-neutral-500">
                                    Son başvuru tarihi: {new Date(job.deadline).toLocaleDateString('tr-TR')}
                                </div>
                            </div>
                        </div>

                        {/* Client Info */}
                        <div className="card mb-6">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-neutral-900 mb-4">İşveren Hakkında</h2>
                                <div className="flex items-center mb-4">
                                    {job.company.logo ? (
                                        <img
                                            src={job.company.logo}
                                            alt={job.company.name}
                                            className="h-12 w-12 rounded-full"
                                        />
                                    ) : (
                                        <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                                            <span className="text-lg font-medium text-primary-800">
                                                {job.company.name.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="ml-3">
                                        <h3 className="text-lg font-medium text-neutral-900">{job.company.name}</h3>
                                        <p className="text-sm text-neutral-500">{job.company.location}</p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="flex items-center mb-1">
                                        <div className="flex items-center">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`h-5 w-5 ${i < Math.floor(job.company.rating) ? 'text-yellow-400' : 'text-neutral-300'
                                                        }`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                            <span className="ml-1 text-sm text-neutral-700">{job.company.rating}</span>
                                        </div>
                                        <span className="ml-2 text-sm text-neutral-500">({job.company.reviewCount} değerlendirme)</span>
                                    </div>
                                    {job.company.verifiedPayment && (
                                        <div className="flex items-center text-sm text-green-600">
                                            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            Doğrulanmış Ödeme Yöntemi
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <h3 className="text-sm font-medium text-neutral-500">Kuruluş Yılı</h3>
                                        <p className="mt-1 text-sm text-neutral-900">{job.company.foundedYear}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-neutral-500">Çalışan Sayısı</h3>
                                        <p className="mt-1 text-sm text-neutral-900">{job.company.employees}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-neutral-500">Web Sitesi</h3>
                                        <a
                                            href={job.company.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-1 text-sm text-primary-600 hover:text-primary-800"
                                        >
                                            {job.company.website}
                                        </a>
                                    </div>
                                </div>

                                <div className="mt-4 border-t border-neutral-200 pt-4">
                                    <p className="text-sm text-neutral-700">{job.company.about}</p>
                                </div>
                            </div>
                        </div>

                        {/* Report Job */}
                        <div className="text-center">
                            <button className="text-sm text-neutral-500 hover:text-neutral-700">
                                <svg className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                                Bu İlanı Bildir
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Login Prompt Modal */}
            {showLoginPrompt && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-neutral-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div>
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100">
                                    <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                </div>
                                <div className="mt-3 text-center sm:mt-5">
                                    <h3 className="text-lg leading-6 font-medium text-neutral-900">Giriş Yapmanız Gerekiyor</h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-neutral-500">
                                            Bu işe başvurmak için giriş yapmanız veya bir hesap oluşturmanız gerekmektedir.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6 grid grid-cols-2 gap-3">
                                <Link to="/register">
                                    <Button variant="outline" className="w-full">
                                        Kaydol
                                    </Button>
                                </Link>
                                <Link to={`/login?redirect=/jobs/${id}/apply`}>
                                    <Button variant="primary" className="w-full">
                                        Giriş Yap
                                    </Button>
                                </Link>
                            </div>
                            <div className="mt-3">
                                <button
                                    type="button"
                                    className="w-full text-center text-sm text-neutral-500 hover:text-neutral-700"
                                    onClick={() => setShowLoginPrompt(false)}
                                >
                                    İptal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default JobDetail; 