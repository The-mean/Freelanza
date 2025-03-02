import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

// Örnek iş ilanı verisi
const jobData = {
    id: 1,
    title: 'E-Ticaret Mağazası için UI/UX Tasarımcı',
    description: `Çevrimiçi alışveriş platformumuz için kapsamlı bir yeniden tasarım projesi üzerinde çalışacak yaratıcı ve kullanıcı odaklı bir UI/UX tasarımcı arıyoruz.

Yapılacak İşler:
- Müşteri yolculuğunu iyileştirecek ve dönüşüm oranlarını artıracak yeni bir kullanıcı deneyimi tasarlamak
- Mobil uyumlu, çekici ve kullanımı kolay arayüzler oluşturmak
- Ürün sayfaları, kategori sayfaları ve ödeme akışı için mockup'lar hazırlamak
- Mevcut kullanıcı araştırma verilerine dayalı tasarım kararları almak

İdeal freelancerımız:
- E-ticaret projelerinde kanıtlanmış deneyime sahip
- Figma, Sketch veya Adobe XD gibi tasarım araçlarında uzman
- Güçlü bir portföy sunabilen
- İyi iletişim becerilerine sahip
- Tek sayfalık (SPA) uygulamalar konusunda bilgili`,
    budget: '8,000 - 12,000 ₺',
    deadline: '25 gün',
    postedDate: '12 Şubat 2024',
    location: 'Uzaktan',
    category: 'UI/UX Tasarım',
    projectType: 'Sabit Fiyatlı',
    skills: ['UI Tasarım', 'UX Tasarım', 'Figma', 'E-ticaret', 'Responsive Tasarım', 'Adobe XD'],
    attachments: [
        { name: 'Proje Detayları.pdf', size: '2.4 MB' },
        { name: 'Marka Kılavuzu.pdf', size: '1.8 MB' },
    ],
    client: {
        id: 5,
        name: 'Dijital Vizyon',
        rating: 4.8,
        reviews: 32,
        profileImg: '/placeholder-client.jpg',
        location: 'İstanbul, Türkiye',
        memberSince: 'Haziran 2021',
        description: 'Dijital Pazarlama ve E-ticaret alanında faaliyet gösteren teknoloji odaklı bir şirketiz.',
        projectsPosted: 24,
        hireRate: '85%',
        totalSpent: '210,000 ₺',
    },
    proposals: 7
};

const JobDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const [showBidForm, setShowBidForm] = useState(false);

    // Gerçek uygulamada ID'ye göre veritabanından veri çekilir
    const job = jobData;

    return (
        <>
            <Head>
                <title>{job.title} | Freelanza</title>
                <meta name="description" content={`${job.title} - ${job.budget} - Teklif ver ve işi kazan.`} />
            </Head>

            <div className="bg-pastel-beige py-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* İş Detayları - Sol Kolon */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                            {job.title}
                                        </h1>
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm text-gray-500">İlan Tarihi: {job.postedDate}</span>
                                            <span className="text-sm text-gray-500">{job.location}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <span className="bg-pastel-blue/20 text-primary px-3 py-1 rounded-full text-sm">
                                            {job.category}
                                        </span>
                                        <span className="bg-pastel-pink/20 text-secondary px-3 py-1 rounded-full text-sm">
                                            {job.projectType}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div className="bg-gray-50 p-4 rounded-md">
                                            <p className="text-sm text-gray-500 mb-1">Bütçe</p>
                                            <p className="text-xl font-bold text-gray-800">{job.budget}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-md">
                                            <p className="text-sm text-gray-500 mb-1">Teslim Süresi</p>
                                            <p className="text-xl font-bold text-gray-800">{job.deadline}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <h2 className="text-xl font-semibold mb-4">İş Açıklaması</h2>
                                        <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                                            {job.description}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 border-b border-gray-100">
                                    <h2 className="text-xl font-semibold mb-4">Gerekli Beceriler</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {job.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="bg-pastel-blue/20 text-primary px-3 py-1 rounded-md text-sm"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {job.attachments.length > 0 && (
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold mb-4">Ekler</h2>
                                        <div className="space-y-3">
                                            {job.attachments.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                                                >
                                                    <svg className="w-6 h-6 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                    </svg>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-700">{file.name}</p>
                                                        <p className="text-xs text-gray-500">{file.size}</p>
                                                    </div>
                                                    <a
                                                        href="#"
                                                        className="text-primary hover:text-primary/80"
                                                    >
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Teklif Formu */}
                            {showBidForm && (
                                <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 p-6">
                                    <h2 className="text-xl font-semibold mb-4">Teklifinizi Gönderin</h2>

                                    <form className="space-y-6">
                                        <div>
                                            <label className="block text-gray-700 mb-2 font-medium">Teklif Tutarı (₺)</label>
                                            <input type="number" className="input" placeholder="Tutarı giriniz" />
                                            <p className="text-xs text-gray-500 mt-1">
                                                * Komisyon tutarı (%10): 0 ₺
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 mb-2 font-medium">Teslim Süresi</label>
                                            <div className="flex gap-4">
                                                <input type="number" className="input w-24" placeholder="Sayı" min="1" />
                                                <select className="input flex-1">
                                                    <option value="days">Gün</option>
                                                    <option value="weeks">Hafta</option>
                                                    <option value="months">Ay</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 mb-2 font-medium">Teklif Açıklaması</label>
                                            <textarea
                                                className="input min-h-[200px]"
                                                placeholder="İşveren neden sizi seçmeli? Deneyimlerinizi ve bu işi nasıl yapacağınızı açıklayın."
                                            ></textarea>
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-4 pt-4">
                                            <button
                                                type="submit"
                                                className="btn-primary flex-1"
                                            >
                                                Teklifi Gönder
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-secondary opacity-70 hover:opacity-100"
                                                onClick={() => setShowBidForm(false)}
                                            >
                                                İptal
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>

                        {/* İşveren Bilgileri ve Teklif Verme - Sağ Kolon */}
                        <div className="lg:col-span-1">
                            {/* Teklife Genel Bakış */}
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 p-6">
                                <h2 className="text-xl font-semibold mb-4">Genel Bakış</h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                        <span className="text-gray-600">Verilen Teklifler</span>
                                        <span className="font-medium">{job.proposals}</span>
                                    </div>

                                    {!showBidForm && (
                                        <button
                                            className="btn-primary w-full"
                                            onClick={() => setShowBidForm(true)}
                                        >
                                            Teklif Ver
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* İşveren Hakkında */}
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6">
                                <h2 className="text-xl font-semibold mb-4">İşveren Hakkında</h2>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative rounded-full overflow-hidden w-14 h-14 bg-pastel-lilac/30 flex items-center justify-center text-2xl">
                                        {job.client.name.charAt(0)}
                                    </div>
                                    <div>
                                        <Link href={`/client/${job.client.id}`} className="font-medium text-gray-800 hover:text-primary">
                                            {job.client.name}
                                        </Link>
                                        <div className="flex items-center mt-1">
                                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span className="text-sm ml-1">{job.client.rating} ({job.client.reviews} yorum)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 text-sm mb-6">
                                    <div className="flex items-start">
                                        <span className="text-gray-500 w-32">Konum</span>
                                        <span>{job.client.location}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 w-32">Üye Olma Tarihi</span>
                                        <span>{job.client.memberSince}</span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <p className="text-gray-700 text-sm">{job.client.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div className="bg-gray-50 rounded-md p-3">
                                        <p className="text-xs text-gray-500 mb-1">Toplam İlan</p>
                                        <p className="font-bold">{job.client.projectsPosted}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-md p-3">
                                        <p className="text-xs text-gray-500 mb-1">İşe Alım Oranı</p>
                                        <p className="font-bold">{job.client.hireRate}</p>
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

export default JobDetails; 