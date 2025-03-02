import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Normalde bu kısımda API çağrısı yapılacak
        // Şimdilik demo olarak 1 saniye bekletip giriş başarılı gösterelim
        setTimeout(() => {
            setLoading(false);
            // Başarılı giriş sonrası ana sayfaya yönlendir
            router.push('/');
        }, 1000);
    };

    return (
        <>
            <Head>
                <title>Giriş Yap | Freelanza</title>
                <meta name="description" content="Freelanza platformuna giriş yapın ve yeteneklerinizi sergilemeye başlayın." />
            </Head>

            <Header />

            <main className="bg-background min-h-screen pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8">
                        <h1 className="text-2xl font-semibold text-center mb-6">Freelanza&apos;ya Giriş Yap</h1>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    E-posta Adresi
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="input"
                                    placeholder="ornek@mail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-1">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Şifre
                                    </label>
                                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                                        Şifremi Unuttum
                                    </Link>
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    className="input"
                                    placeholder="********"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-primary w-full"
                                disabled={loading}
                            >
                                {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Henüz üye değil misiniz?{' '}
                                <Link href="/register" className="text-primary hover:underline font-medium">
                                    Hemen Kaydolun
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
};

export default Login; 