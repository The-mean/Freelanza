import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { FeaturedJob } from '@/components/job/FeaturedJob';
import { PopularCategory } from '@/components/home/PopularCategory';
import { HowItWorks } from '@/components/home/HowItWorks';

export default function Home() {
  // Örnek kategoriler
  const categories = [
    { id: 1, name: 'Yazılım Geliştirme', icon: '💻', count: 328 },
    { id: 2, name: 'Grafik Tasarım', icon: '🎨', count: 245 },
    { id: 3, name: 'İçerik Yazarlığı', icon: '✍️', count: 186 },
    { id: 4, name: 'Dijital Pazarlama', icon: '📱', count: 164 },
    { id: 5, name: 'Video & Animasyon', icon: '🎬', count: 142 },
    { id: 6, name: 'Ses & Müzik', icon: '🎵', count: 97 },
  ];

  // Örnek iş ilanları
  const featuredJobs = [
    {
      id: 1,
      title: 'React Native Mobil Uygulama Geliştirme',
      description: 'E-ticaret platformumuz için native mobil uygulama geliştirme projesi',
      budget: '10,000 - 15,000 ₺',
      deadline: '2 hafta',
      skills: ['React Native', 'JavaScript', 'API Entegrasyonu'],
      clientName: 'Teknoloji A.Ş.',
      clientRating: 4.9,
    },
    {
      id: 2,
      title: 'Kurumsal Web Sitesi Tasarımı',
      description: 'Mimarlık şirketimiz için minimalist ve modern bir web sitesi tasarımı',
      budget: '5,000 - 8,000 ₺',
      deadline: '3 hafta',
      skills: ['UI/UX Tasarım', 'Figma', 'Responsive Tasarım'],
      clientName: 'Mimari Grup',
      clientRating: 4.7,
    },
    {
      id: 3,
      title: 'SEO Optimizasyonu ve İçerik Stratejisi',
      description: 'E-ticaret sitemizin SEO performansını artıracak stratejik çalışma',
      budget: '3,000 - 5,000 ₺ / Aylık',
      deadline: 'Uzun dönem',
      skills: ['SEO', 'İçerik Yazarlığı', 'Anahtar Kelime Araştırması'],
      clientName: 'Moda Butik',
      clientRating: 4.5,
    },
  ];

  return (
    <>
      <Head>
        <title>Freelanza - Türkiye&apos;nin Freelancer Platformu</title>
        <meta name="description" content="Freelanza ile yeteneklerini paylaş, projelerini büyüt. Türkiye&apos;nin en güvenilir freelancer platformu." />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pastel-beige via-pastel-blue/20 to-pastel-beige py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Yeteneğinle <span className="text-primary">Özgürce</span> Çalış
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Türkiye&apos;nin en güvenilir freelancer platformunda iş veren ve yetenekli freelancerları buluşturuyoruz. Hemen ücretsiz profil oluştur ve teklifler almaya başla.
              </p>

              {/* Search Box */}
              <div className="bg-white p-4 rounded-lg shadow-md mb-8 flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Ne tür bir yeteneğe ihtiyacınız var?"
                  className="input flex-grow"
                />
                <button className="btn-primary whitespace-nowrap">
                  Freelancer Bul
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-500">Popüler Aramalar:</span>
                <a href="#" className="text-sm text-primary hover:underline">Web Tasarım</a>
                <a href="#" className="text-sm text-primary hover:underline">Logo Tasarım</a>
                <a href="#" className="text-sm text-primary hover:underline">SEO</a>
                <a href="#" className="text-sm text-primary hover:underline">React.js</a>
              </div>
            </div>

            <div className="md:w-1/2">
              <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden">
                <div className="w-full h-full bg-pastel-lilac/30 rounded-lg flex items-center justify-center">
                  <div className="text-center p-8">
                    <p className="text-xl font-medium mb-4">İlk işini bulmanın en hızlı yolu!</p>
                    <Link href="/register" className="btn-primary inline-block">
                      Hemen Üye Ol
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Popüler Kategoriler
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <PopularCategory key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 bg-pastel-beige/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">
              Öne Çıkan İş İlanları
            </h2>
            <Link href="/jobs" className="text-primary hover:underline font-medium">
              Tüm İlanları Gör →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <FeaturedJob key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Nasıl Çalışır?
          </h2>

          <HowItWorks />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-pastel-lilac/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Hemen Freelanza&apos;ya Katıl
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            İster yeni projeler bul, ister hayalindeki takımı kur.
            Türkiye&apos;nin en güvenilir freelance platformunda yerini al.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?type=client" className="btn-primary">
              İşveren Olarak Kaydol
            </Link>
            <Link href="/register?type=freelancer" className="btn-secondary">
              Freelancer Olarak Kaydol
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
