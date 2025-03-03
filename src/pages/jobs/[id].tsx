import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// İş ilanı tipi
interface Job {
    id: number;
    title: string;
    company: string;
    location: string;
    type: 'full-time' | 'part-time' | 'project-based' | 'hourly';
    category: string;
    skills: string[];
    budget: {
        min: number;
        max: number;
        currency: string;
    };
    description: string;
    requirements: string[];
    postedAt: string;
    deadline: string;
    status: 'active' | 'closed';
    applicantsCount: number;
}

// Örnek iş ilanı verisi
const SAMPLE_JOB: Job = {
    id: 1,
    title: 'Senior React Developer',
    company: 'Tech Solutions Ltd.',
    location: 'Remote',
    type: 'full-time',
    category: 'Web Development',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
    budget: {
        min: 8000,
        max: 15000,
        currency: 'TRY'
    },
    description: 'Deneyimli bir React geliştirici arıyoruz. E-ticaret projemizde çalışacak, modern web teknolojilerine hakim bir takım arkadaşı aramaktayız. Projemizde React, TypeScript ve Node.js teknolojilerini kullanıyoruz. AWS üzerinde çalışan mikroservis mimarisine sahip bir yapımız var. Agile/Scrum metodolojileri ile çalışıyoruz.',
    requirements: [
        'En az 4 yıl React deneyimi',
        'TypeScript ve modern JavaScript bilgisi',
        'Node.js ve REST API deneyimi',
        'AWS veya benzeri cloud servis deneyimi',
        'Agile/Scrum metodolojilerine aşinalık',
        'İyi derecede İngilizce',
        'Takım çalışmasına yatkın',
        'Problem çözme yeteneği güçlü',
        'Clean code prensiplerini benimseyen'
    ],
    postedAt: '2024-03-15',
    deadline: '2024-04-15',
    status: 'active',
    applicantsCount: 12
};

const JobDetail: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const [job, setJob] = useState<Job | null>(null);
    const [isApplying, setIsApplying] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [expectedSalary, setExpectedSalary] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState<'freelancer' | 'employer' | null>(null);

    useEffect(() => {
        // Kimlik doğrulama kontrolü
        const token = localStorage.getItem('token');
        const storedUserType = localStorage.getItem('userType') as 'freelancer' | 'employer' | null;

        if (token) {
            setIsAuthenticated(true);
            setUserType(storedUserType);
        }

        // İş ilanı verilerini getir
        // Gerçek uygulamada API'den gelecek
        setJob(SAMPLE_JOB);
    }, [id]);

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated) {
            router.push(`/login?redirect=/jobs/${id}`);
            return;
        }

        try {
            // Başvuru gönderme
            // Gerçek uygulamada API çağrısı yapılacak
            console.log('Başvuru yapılıyor...', {
                jobId: id,
                coverLetter,
                expectedSalary
            });

            // Başarılı başvuru
            setIsApplying(false);
            alert('Başvurunuz başarıyla gönderildi!');
            setCoverLetter('');
            setExpectedSalary('');
        } catch (error) {
            console.error('Başvuru hatası:', error);
            alert('Başvuru sırasında bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };

    if (!job) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>{job.title} | Freelanza</title>
                <meta name="description" content={job.description.slice(0, 160)} />
            </Head>

            <Header />

            <main className="flex-grow bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    {/* Üst başlık */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                                <div className="mt-4 space-y-2">
                                    <p className="text-gray-600">
                                        <i className="fas fa-building mr-2"></i>
                                        {job.company}
                                    </p>
                                    <p className="text-gray-600">
                                        <i className="fas fa-map-marker-alt mr-2"></i>
                                        {job.location}
                                    </p>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-gray-600">
                                            <i className="fas fa-clock mr-2"></i>
                                            {job.type === 'full-time' ? 'Tam Zamanlı' :
                                                job.type === 'part-time' ? 'Yarı Zamanlı' :
                                                    job.type === 'project-based' ? 'Proje Bazlı' :
                                                        'Saatlik'}
                                        </span>
                                        <span className="text-gray-600">
                                            <i className="fas fa-tag mr-2"></i>
                                            {job.category}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">
                                    {job.budget.min.toLocaleString('tr-TR')} - {job.budget.max.toLocaleString('tr-TR')} {job.budget.currency}
                                </div>
                                <div className="text-sm text-gray-500 mt-2">
                                    {new Date(job.postedAt).toLocaleDateString('tr-TR')}
                                </div>
                                {isAuthenticated && userType === 'freelancer' && !isApplying && (
                                    <button
                                        onClick={() => setIsApplying(true)}
                                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Başvur
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Yetenekler */}
                        <div className="mt-6 pt-6 border-t">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Aranan Yetenekler</h2>
                            <div className="flex flex-wrap gap-2">
                                {job.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Alt bilgiler */}
                        <div className="mt-6 pt-6 border-t flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                                <span>
                                    <i className="fas fa-users mr-2"></i>
                                    {job.applicantsCount} başvuru
                                </span>
                                <span>
                                    <i className="fas fa-calendar-alt mr-2"></i>
                                    Son başvuru: {new Date(job.deadline).toLocaleDateString('tr-TR')}
                                </span>
                            </div>
                            <div>
                                <button className="text-blue-600 hover:text-blue-800">
                                    <i className="fas fa-share-alt mr-2"></i>
                                    Paylaş
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Sol içerik */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* İş Açıklaması */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">İş Açıklaması</h2>
                                <div className="prose max-w-none">
                                    <p className="text-gray-600 whitespace-pre-line">
                                        {job.description}
                                    </p>
                                </div>
                            </div>

                            {/* Gereksinimler */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Aranan Nitelikler</h2>
                                <ul className="space-y-2">
                                    {job.requirements.map((requirement, index) => (
                                        <li key={index} className="flex items-start">
                                            <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                                            <span className="text-gray-600">{requirement}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Başvuru formu */}
                            {isApplying && (
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Başvuru Formu</h2>
                                    <form onSubmit={handleApply} className="space-y-4">
                                        <div>
                                            <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
                                                Ön Yazı
                                            </label>
                                            <textarea
                                                id="coverLetter"
                                                rows={6}
                                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Kendinizi tanıtın ve neden bu pozisyon için uygun olduğunuzu belirtin..."
                                                value={coverLetter}
                                                onChange={(e) => setCoverLetter(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="expectedSalary" className="block text-sm font-medium text-gray-700 mb-1">
                                                Beklenen Ücret ({job.budget.currency})
                                            </label>
                                            <input
                                                type="number"
                                                id="expectedSalary"
                                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Beklediğiniz ücreti girin"
                                                value={expectedSalary}
                                                onChange={(e) => setExpectedSalary(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-end space-x-4">
                                            <button
                                                type="button"
                                                onClick={() => setIsApplying(false)}
                                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                            >
                                                İptal
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            >
                                                Başvuruyu Gönder
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>

                        {/* Sağ sidebar */}
                        <div className="space-y-8">
                            {/* Şirket bilgileri */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Şirket Bilgileri</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                            <i className="fas fa-building text-gray-400 text-2xl"></i>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="font-medium text-gray-900">{job.company}</h3>
                                            <p className="text-sm text-gray-500">{job.location}</p>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t">
                                        <Link href={`/company/${job.company.toLowerCase().replace(/\s+/g, '-')}`}>
                                            <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                                                <i className="fas fa-external-link-alt mr-2"></i>
                                                Şirket Profilini Görüntüle
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Benzer ilanlar */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Benzer İlanlar</h2>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <Link key={i} href={`/jobs/${i}`}>
                                            <div className="block p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                                <h3 className="font-medium text-gray-900">Senior Frontend Developer</h3>
                                                <p className="text-sm text-gray-500 mt-1">Tech Company {i}</p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-sm text-gray-500">Remote</span>
                                                    <span className="text-sm font-medium text-blue-600">
                                                        10,000 TRY
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default JobDetail; 