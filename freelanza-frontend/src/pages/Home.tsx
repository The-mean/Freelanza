import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';

const Home: React.FC = () => {
    return (
        <Layout>
            {/* Hero section */}
            <section className="relative bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <div className="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-neutral-900 sm:text-5xl md:text-6xl">
                                    <span className="block">En iyi freelancer'ları</span>
                                    <span className="block text-primary-600">en iyi işlerle buluşturuyoruz</span>
                                </h1>
                                <p className="mt-3 text-base text-neutral-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    Freelanza ile yeteneklerinizi sergileyebilir, yeni projeler bulabilir ve kariyerinizi özgürce yönetebilirsiniz. İşverenler için ise en iyi yetenek havuzuna erişim sağlıyoruz.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        <Link to="/register">
                                            <Button variant="primary" className="w-full px-8 py-3">
                                                Hemen Başla
                                            </Button>
                                        </Link>
                                    </div>
                                    <div className="mt-3 sm:mt-0 sm:ml-3">
                                        <Link to="/how-it-works">
                                            <Button variant="outline" className="w-full px-8 py-3">
                                                Nasıl Çalışır
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <img
                        className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
                        src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80"
                        alt="Freelance çalışma ortamı"
                    />
                </div>
            </section>

            {/* Features section */}
            <section className="py-12 bg-neutral-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Özellikler</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
                            Freelancer ve işverenler için daha iyi bir platform
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-neutral-500 lg:mx-auto">
                            Freelanza size güvenli, kolay ve kullanıcı dostu bir ortam sunar.
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                            {/* Feature 1 */}
                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="ml-16">
                                    <h3 className="text-lg leading-6 font-medium text-neutral-900">Kaliteli İş Fırsatları</h3>
                                    <p className="mt-2 text-base text-neutral-500">
                                        Yeteneklerinize uygun, doğrulanmış müşterilerden gelen iş fırsatlarına erişin.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                    </svg>
                                </div>
                                <div className="ml-16">
                                    <h3 className="text-lg leading-6 font-medium text-neutral-900">Güvenli Ödeme Sistemi</h3>
                                    <p className="mt-2 text-base text-neutral-500">
                                        Depozito sistemi ile her zaman güvende kalın ve zamanında ödemenizi alın.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div className="ml-16">
                                    <h3 className="text-lg leading-6 font-medium text-neutral-900">Hızlı İletişim</h3>
                                    <p className="mt-2 text-base text-neutral-500">
                                        Entegre mesajlaşma sistemi ile müşterilerinizle doğrudan iletişime geçin.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Jobs section */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center mb-10">
                        <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Yeni Fırsatlar</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
                            Son Eklenen İşler
                        </p>
                    </div>

                    {/* For now, we'll show placeholder jobs */}
                    <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                        {[1, 2, 3].map((job) => (
                            <div key={job} className="card p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mb-2">
                                            Yazılım Geliştirme
                                        </span>
                                        <h3 className="text-lg font-medium text-neutral-900">React Native Mobil Uygulama Geliştiricisi</h3>
                                        <p className="mt-1 text-sm text-neutral-500">
                                            Mevcut bir e-ticaret platformu için kullanıcı dostu bir mobil uygulama geliştirmek.
                                        </p>
                                    </div>
                                    <span className="text-xl font-bold text-primary-600">₺10,000</span>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-neutral-200"></div>
                                        <div className="ml-2">
                                            <p className="text-sm font-medium text-neutral-900">XYZ Teknoloji</p>
                                            <p className="text-xs text-neutral-500">3 gün önce</p>
                                        </div>
                                    </div>
                                    <div>
                                        <Link to="/jobs/1">
                                            <Button variant="outline" size="sm">
                                                Detaylar
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <Link to="/jobs">
                            <Button variant="secondary">Tüm İşleri Gör</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA section */}
            <section className="bg-primary-700">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        <span className="block">Hazır mısınız?</span>
                        <span className="block text-primary-300">Bugün freelance yolculuğunuza başlayın.</span>
                    </h2>
                    <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                        <div className="inline-flex rounded-md shadow">
                            <Link to="/register">
                                <Button className="py-3 px-6 bg-white text-primary-700 hover:bg-neutral-100" variant="outline">
                                    Hemen Kaydol
                                </Button>
                            </Link>
                        </div>
                        <div className="ml-3 inline-flex rounded-md shadow">
                            <Link to="/jobs">
                                <Button className="py-3 px-6 text-white border-white hover:bg-primary-600" variant="outline">
                                    İşlere Göz At
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Home; 