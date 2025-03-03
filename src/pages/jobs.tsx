import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';

// Örnek veri
const JOBS = [
    {
        id: 1,
        title: 'E-ticaret Web Sitesi Tasarımı',
        company: 'Moda Butik',
        location: 'Uzaktan',
        type: 'Proje Bazlı',
        budget: '5,000 - 10,000 ₺',
        skills: ['Web Tasarım', 'Responsive', 'UI/UX', 'Figma'],
        description: 'Moda e-ticaret sitemiz için modern ve kullanıcı dostu bir arayüz tasarımı arıyoruz. Tasarım Figma üzerinde teslim edilecek ve onay sonrası geliştirme ekibimize aktarılacaktır.',
        postedAt: '2 gün önce',
        companyLogo: 'https://picsum.photos/60/60?random=1',
    },
    {
        id: 2,
        title: 'React Native Mobil Uygulama Geliştirme',
        company: 'Teknoloji A.Ş.',
        location: 'Uzaktan',
        type: 'Proje Bazlı',
        budget: '15,000 - 25,000 ₺',
        skills: ['React Native', 'JavaScript', 'API Entegrasyonu', 'Firebase'],
        description: 'Web sitemiz için kullanıcı dostu bir mobil uygulama geliştirmek istiyoruz. Uygulama, web sitemizdeki içeriklere erişim sağlayacak ve push notification özelliğine sahip olacak.',
        postedAt: '3 gün önce',
        companyLogo: 'https://picsum.photos/60/60?random=2',
    },
    {
        id: 3,
        title: 'SEO Optimizasyonu ve İçerik Stratejisi',
        company: 'Dijital Pazarlama',
        location: 'Uzaktan',
        type: 'Aylık Anlaşma',
        budget: '3,000 - 5,000 ₺/ay',
        skills: ['SEO', 'İçerik Stratejisi', 'Anahtar Kelime Analizi', 'Google Analytics'],
        description: 'Kurumsal web sitemiz için kapsamlı bir SEO çalışması ve içerik stratejisi oluşturacak bir uzman arıyoruz. Arama motorlarında üst sıralara çıkmak istiyoruz.',
        postedAt: '1 hafta önce',
        companyLogo: 'https://picsum.photos/60/60?random=3',
    },
    {
        id: 4,
        title: 'Logo ve Kurumsal Kimlik Tasarımı',
        company: 'Startup Girişimi',
        location: 'Uzaktan',
        type: 'Proje Bazlı',
        budget: '3,500 - 6,000 ₺',
        skills: ['Logo Tasarım', 'Kurumsal Kimlik', 'Illustrator', 'Branding'],
        description: 'Yeni kurulan startup şirketimiz için profesyonel bir logo ve kurumsal kimlik tasarımı arıyoruz. Modern, yenilikçi ve akılda kalıcı bir tasarım olmalı.',
        postedAt: '5 gün önce',
        companyLogo: 'https://picsum.photos/60/60?random=4',
    },
    {
        id: 5,
        title: 'WordPress Blog Tasarımı ve Geliştirmesi',
        company: 'İçerik Platformu',
        location: 'Uzaktan',
        type: 'Proje Bazlı',
        budget: '4,000 - 7,000 ₺',
        skills: ['WordPress', 'PHP', 'Blog Tasarımı', 'Tema Geliştirme'],
        description: 'İçerik odaklı bir web sitesi için WordPress teması tasarımı ve geliştirmesi yapacak bir uzman arıyoruz. SEO dostu, hızlı ve mobil uyumlu bir tema olmalı.',
        postedAt: '3 gün önce',
        companyLogo: 'https://picsum.photos/60/60?random=5',
    },
    {
        id: 6,
        title: 'Sosyal Medya Yönetimi',
        company: 'Kozmetik Markası',
        location: 'Uzaktan',
        type: 'Aylık Anlaşma',
        budget: '2,500 - 4,000 ₺/ay',
        skills: ['Sosyal Medya', 'İçerik Üretimi', 'Grafik Tasarım', 'Topluluk Yönetimi'],
        description: 'Kozmetik markamız için Instagram ve Facebook hesaplarımızı yönetecek, içerik üretecek ve topluluğumuzu büyütecek bir sosyal medya uzmanı arıyoruz.',
        postedAt: '1 gün önce',
        companyLogo: 'https://picsum.photos/60/60?random=6',
    },
];

const CATEGORIES = [
    'Hepsi',
    'Web Geliştirme',
    'Mobil Uygulama',
    'Tasarım',
    'SEO',
    'İçerik Yazarlığı',
    'Sosyal Medya',
    'Pazarlama',
];

const JobList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Hepsi');

    // Arama ve filtreleme fonksiyonu
    const filteredJobs = JOBS.filter((job) => {
        // Kategori filtresi
        if (selectedCategory !== 'Hepsi') {
            // Burada gerçek bir uygulamada iş ilanının kategorisini kontrol ederdik
            // Şimdilik sadece skill'lerinde geçiyorsa gösterelim
            const hasMatchingSkill = job.skills.some(skill =>
                skill.toLowerCase().includes(selectedCategory.toLowerCase())
            );
            if (!hasMatchingSkill) return false;
        }

        // Arama filtresi
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            return (
                job.title.toLowerCase().includes(searchLower) ||
                job.company.toLowerCase().includes(searchLower) ||
                job.description.toLowerCase().includes(searchLower) ||
                job.skills.some(skill => skill.toLowerCase().includes(searchLower))
            );
        }

        return true;
    });

    return (
        <Layout>
            <Head>
                <title>İş İlanları | Freelanza</title>
                <meta name="description" content="Freelanza'da binlerce iş ilanını keşfedin, yeteneklerinize uygun projelere teklif verin ve freelancer kariyerinizi ilerletin." />
            </Head>

            <h1 className="text-3xl font-bold mb-2">İş İlanları</h1>
            <p className="text-gray-600 mb-8">
                Yeteneklerinize uygun iş ilanlarını keşfedin ve hemen teklif verin.
            </p>

            {/* Arama ve Filtreler */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                            Arama
                        </label>
                        <input
                            type="text"
                            id="search"
                            className="input"
                            placeholder="İş başlığı, şirket veya beceri ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="w-full md:w-72">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            Kategori
                        </label>
                        <select
                            id="category"
                            className="input"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {CATEGORIES.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            className="btn-primary md:mt-0"
                            onClick={() => {
                                // Gelişmiş filtreleme sayfasına yönlendirilebilir
                                // Şimdilik bir işlevi yok
                            }}
                        >
                            Filtrele
                        </button>
                    </div>
                </div>
            </div>

            {/* İş İlanları Listesi */}
            <div className="space-y-6">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                        <div key={job.id} className="card hover:shadow-md transition-shadow">
                            <div className="flex items-start">
                                <img
                                    src={job.companyLogo}
                                    alt={job.company}
                                    className="w-12 h-12 rounded object-cover"
                                />
                                <div className="ml-4 flex-1">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                                        <div>
                                            <h3 className="font-semibold text-lg">{job.title}</h3>
                                            <p className="text-gray-600">{job.company}</p>
                                        </div>
                                        <div className="md:text-right mt-2 md:mt-0">
                                            <span className="text-gray-700 font-medium block">{job.budget}</span>
                                            <span className="text-gray-500 text-sm">{job.type}</span>
                                        </div>
                                    </div>

                                    <p className="text-gray-700 mb-4">{job.description}</p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {job.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                        <div className="flex items-center text-gray-500 text-sm mb-2 sm:mb-0">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {job.location}
                                            <span className="mx-2">•</span>
                                            <span>{job.postedAt}</span>
                                        </div>

                                        <Link
                                            href={`/job/${job.id}`}
                                            className="btn-primary sm:w-auto w-full text-center"
                                        >
                                            Teklif Ver
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <svg
                            className="w-16 h-16 text-gray-300 mx-auto mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-700 mb-1">Sonuç Bulunamadı</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            Arama kriterlerinize uygun iş ilanı bulunamadı. Lütfen farklı anahtar kelimeler kullanarak tekrar deneyin.
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default JobList; 