import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Örnek veri
const freelancerData = {
    id: 1,
    name: 'Ahmet Yılmaz',
    title: 'Senior Frontend Geliştirici',
    rating: 4.8,
    reviews: 24,
    completedJobs: 35,
    hourlyRate: '150 ₺',
    location: 'İstanbul, Türkiye',
    memberSince: 'Mayıs 2022',
    avatar: '/placeholder-avatar.jpg',
    about: 'Frontend geliştirme konusunda 6+ yıl deneyime sahibim. React, Next.js ve TypeScript konularında uzmanım. Kullanıcı deneyimini ön planda tutan, performanslı ve ölçeklenebilir web uygulamaları geliştirmekteyim.',
    skills: ['React.js', 'Next.js', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Tailwind CSS', 'Redux', 'UI/UX', 'Responsive Design'],
    education: [
        { degree: 'Bilgisayar Mühendisliği', school: 'İstanbul Teknik Üniversitesi', year: '2016-2020' }
    ],
    languages: [
        { name: 'Türkçe', level: 'Anadil' },
        { name: 'İngilizce', level: 'İleri Seviye' },
        { name: 'Almanca', level: 'Orta Seviye' }
    ],
    portfolio: [
        { id: 1, title: 'E-Ticaret Platformu', image: '/placeholder-portfolio-1.jpg', description: 'React ve Next.js ile geliştirilmiş modern bir e-ticaret platformu.' },
        { id: 2, title: 'Finans Dashboard', image: '/placeholder-portfolio-2.jpg', description: 'Kriptopara takibi için geliştirilmiş gerçek zamanlı veri görselleştirme dashboard\'u.' },
        { id: 3, title: 'Mobil Yemek Siparişi Uygulaması', image: '/placeholder-portfolio-3.jpg', description: 'React Native ile geliştirilmiş, gerçek zamanlı sipariş takibi yapılabilen mobil uygulama.' }
    ]
};

const FreelancerProfile = () => {
    const router = useRouter();
    const { id = '1' } = router.query;

    // Gerçek uygulamada ID'ye göre veritabanından veri çekilir
    // Bu örnekte id parametresi: ${id} yerine şu şekilde kullanılmalı:
    console.log(`Freelancer ID: ${id}`);

    // Bu örnekte id parametresi: ${id}
    const freelancer = freelancerData;

    return (
        <>
            <Head>
                <title>{freelancer.name} | Freelanza</title>
                <meta name="description" content={`${freelancer.name} - ${freelancer.title}. Freelanza üzerinden hizmet veren profesyonel freelancer.`} />
            </Head>

            <div className="bg-pastel-beige py-8">
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        {/* Üst Bölüm - Ana Bilgiler */}
                        <div className="p-6 md:p-8 border-b border-gray-100">
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                {/* Avatar */}
                                <div className="relative rounded-full overflow-hidden w-32 h-32 border-4 border-white shadow-md">
                                    <div className="w-full h-full bg-pastel-blue/30 flex items-center justify-center text-4xl">
                                        {freelancer.name.charAt(0)}
                                    </div>
                                    {/* Gerçek uygulamada avatar resmi olacak */}
                                    {/*<Image 
                    src={freelancer.avatar} 
                    alt={freelancer.name} 
                    fill 
                    className="object-cover" 
                  />*/}
                                </div>

                                {/* Ana Bilgiler */}
                                <div className="flex-1">
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                                        {freelancer.name}
                                    </h1>
                                    <p className="text-lg text-gray-600 mb-3">{freelancer.title}</p>

                                    <div className="flex flex-wrap gap-4 text-sm mb-4">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span className="font-medium">{freelancer.rating}</span>
                                            <span className="text-gray-500 ml-1">({freelancer.reviews} değerlendirme)</span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-primary mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>{freelancer.completedJobs} tamamlanan iş</span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>{freelancer.location}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* İletişim ve Fiyat */}
                                <div className="w-full md:w-auto flex flex-col gap-3 mt-4 md:mt-0">
                                    <div className="bg-gray-50 p-3 rounded-md text-center">
                                        <p className="text-sm text-gray-500 mb-1">Saatlik Ücret</p>
                                        <p className="text-xl font-bold text-gray-800">{freelancer.hourlyRate}</p>
                                    </div>
                                    <button className="btn-primary">İletişime Geç</button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-6">
                            {/* Sol Kolon - Beceriler ve Bilgiler */}
                            <div className="md:col-span-1 border-r border-gray-100 p-6 md:p-8">
                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold mb-4">Beceriler</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {freelancer.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="bg-pastel-blue/20 text-primary px-3 py-1 rounded-full text-sm"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold mb-4">Eğitim</h2>
                                    <div>
                                        {freelancer.education.map((edu, index) => (
                                            <div key={index} className="mb-3">
                                                <p className="font-medium">{edu.degree}</p>
                                                <p className="text-gray-600 text-sm">{edu.school}</p>
                                                <p className="text-gray-500 text-sm">{edu.year}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold mb-4">Diller</h2>
                                    <div>
                                        {freelancer.languages.map((lang, index) => (
                                            <div key={index} className="mb-2 flex justify-between">
                                                <span>{lang.name}</span>
                                                <span className="text-gray-500 text-sm">{lang.level}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold mb-4">Bilgiler</h2>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-start">
                                            <span className="text-gray-500 w-32">Üye Olma Tarihi</span>
                                            <span>{freelancer.memberSince}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sağ Kolon - Hakkında ve Portföy */}
                            <div className="md:col-span-2 p-6 md:p-8">
                                {/* Hakkında */}
                                <div className="mb-10">
                                    <h2 className="text-xl font-semibold mb-4">Hakkında</h2>
                                    <p className="text-gray-700 whitespace-pre-line">{freelancer.about}</p>
                                </div>

                                {/* Portföy */}
                                <div>
                                    <h2 className="text-xl font-semibold mb-6">Portföy</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {freelancer.portfolio.map((item) => (
                                            <div key={item.id} className="card group cursor-pointer">
                                                <div className="relative h-48 mb-4 rounded-md overflow-hidden bg-pastel-lilac/30">
                                                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-lg">
                                                        {/* Gerçek uygulamada resim olacak */}
                                                        Proje Görseli
                                                    </div>
                                                    {/*<Image 
                            src={item.image} 
                            alt={item.title} 
                            fill 
                            className="object-cover group-hover:scale-105 transition duration-300" 
                          />*/}
                                                </div>
                                                <h3 className="font-medium text-lg mb-1">{item.title}</h3>
                                                <p className="text-gray-600 text-sm">{item.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FreelancerProfile; 