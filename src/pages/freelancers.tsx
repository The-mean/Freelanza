import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Örnek veri
const FREELANCERS = [
    {
        id: 1,
        name: 'Ahmet Yılmaz',
        title: 'UI/UX Tasarımcı',
        rating: 4.9,
        hourlyRate: 250,
        skills: ['Figma', 'Adobe XD', 'UI Tasarım', 'Web Tasarım'],
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
        id: 2,
        name: 'Zeynep Kaya',
        title: 'Full Stack Geliştirici',
        rating: 4.8,
        hourlyRate: 300,
        skills: ['React', 'Node.js', 'JavaScript', 'MongoDB'],
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
        id: 3,
        name: 'Mehmet Demir',
        title: 'SEO Uzmanı',
        rating: 4.7,
        hourlyRate: 200,
        skills: ['SEO', 'Google Analytics', 'İçerik Stratejisi', 'Backlink'],
        image: 'https://randomuser.me/api/portraits/men/55.jpg',
    },
    {
        id: 4,
        name: 'Ayşe Şahin',
        title: 'Grafik Tasarımcı',
        rating: 5.0,
        hourlyRate: 275,
        skills: ['Photoshop', 'Illustrator', 'Logo Tasarım', 'Marka Kimliği'],
        image: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    {
        id: 5,
        name: 'Can Özkan',
        title: 'Mobil Uygulama Geliştirici',
        rating: 4.6,
        hourlyRate: 325,
        skills: ['Flutter', 'React Native', 'Firebase', 'UI/UX'],
        image: 'https://randomuser.me/api/portraits/men/41.jpg',
    },
    {
        id: 6,
        name: 'Elif Yıldız',
        title: 'İçerik Yazarı',
        rating: 4.9,
        hourlyRate: 180,
        skills: ['Blog Yazarlığı', 'SEO Yazarlığı', 'Copywriting', 'E-posta Pazarlama'],
        image: 'https://randomuser.me/api/portraits/women/33.jpg',
    },
];

const CATEGORIES = [
    'Hepsi',
    'Yazılım Geliştirme',
    'Tasarım',
    'Pazarlama',
    'İçerik Yazarlığı',
    'SEO',
    'Veri Analizi',
    'Mobil Uygulama',
];

const FreelancerList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Hepsi');

    // Arama ve filtreleme fonksiyonu
    const filteredFreelancers = FREELANCERS.filter((freelancer) => {
        // Kategori filtresi
        if (selectedCategory !== 'Hepsi') {
            // Burada gerçek bir uygulamada freelancer'ın kategorisini kontrol ederdik
            // Şimdilik sadece skill'lerinde geçiyorsa gösterelim
            const hasMatchingSkill = freelancer.skills.some(skill =>
                skill.toLowerCase().includes(selectedCategory.toLowerCase())
            );
            if (!hasMatchingSkill) return false;
        }

        // Arama filtresi
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            return (
                freelancer.name.toLowerCase().includes(searchLower) ||
                freelancer.title.toLowerCase().includes(searchLower) ||
                freelancer.skills.some(skill => skill.toLowerCase().includes(searchLower))
            );
        }

        return true;
    });

    return (
        <>
            <Head>
                <title>Freelancerlar | Freelanza</title>
                <meta name="description" content="Türkiye'nin en yetenekli freelancerları Freelanza'da. İhtiyacınıza uygun freelancer bulun ve projelerinizi hayata geçirin." />
            </Head>

            <Header />

            <main className="bg-background min-h-screen pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-2">Freelancerlar</h1>
                    <p className="text-gray-600 mb-8">
                        İhtiyacınıza uygun yetenekli freelancerları keşfedin ve projelerinizi hayata geçirin.
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
                                    placeholder="İsim, unvan veya beceri ara..."
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

                    {/* Freelancer Listesi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredFreelancers.length > 0 ? (
                            filteredFreelancers.map((freelancer) => (
                                <div key={freelancer.id} className="card hover:shadow-md transition-shadow">
                                    <div className="flex items-center mb-4">
                                        <img
                                            src={freelancer.image}
                                            alt={freelancer.name}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                        <div className="ml-4">
                                            <h3 className="font-semibold">{freelancer.name}</h3>
                                            <p className="text-gray-600 text-sm">{freelancer.title}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center">
                                            <svg
                                                className="w-5 h-5 text-yellow-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span className="text-gray-700 ml-1">{freelancer.rating}</span>
                                        </div>
                                        <div className="text-gray-700 font-medium">
                                            {freelancer.hourlyRate} ₺/saat
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {freelancer.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    <Link
                                        href={`/freelancer/${freelancer.id}`}
                                        className="btn-primary w-full text-center block"
                                    >
                                        Profili Görüntüle
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
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
                                    Arama kriterlerinize uygun freelancer bulunamadı. Lütfen farklı anahtar kelimeler kullanarak tekrar deneyin.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
};

export default FreelancerList; 