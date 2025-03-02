import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Register = () => {
    const [userType, setUserType] = useState<'freelancer' | 'employer'>('freelancer');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // URL'den gelen kullanıcı tipini kontrol et
    React.useEffect(() => {
        const { type } = router.query;
        if (type === 'employer') {
            setUserType('employer');
        }
    }, [router.query]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Şifre eşleşmesini kontrol et
        if (password !== confirmPassword) {
            setError('Şifreler eşleşmiyor');
            return;
        }

        setLoading(true);
        setError('');

        // Normalde bu kısımda API çağrısı yapılacak
        // Şimdilik demo olarak 1 saniye bekletip kayıt başarılı gösterelim
        setTimeout(() => {
            setLoading(false);
            // Başarılı kayıt sonrası ana sayfaya yönlendir
            router.push('/');
        }, 1000);
    };

    return (
        <>
            <Head>
                <title>Kayıt Ol | Freelanza</title>
                <meta
                    name="description"
                    content={`Freelanza platformuna ${userType === 'freelancer' ? 'freelancer' : 'işveren'} olarak kayıt olun.`}
                />
            </Head>

            <Header />

            <main className="bg-background min-h-screen pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8">
                        <h1 className="text-2xl font-semibold text-center mb-6">
                            Freelanza&apos;ya Kaydolun
                        </h1>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        <div className="flex bg-gray-100 rounded-md mb-6">
                            <button
                                type="button"
                                className={`flex-1 py-2 px-4 rounded-md text-center ${userType === 'freelancer'
                                        ? 'bg-primary text-white font-medium'
                                        : 'text-gray-700'
                                    }`}
                                onClick={() => setUserType('freelancer')}
                            >
                                Freelancer
                            </button>
                            <button
                                type="button"
                                className={`flex-1 py-2 px-4 rounded-md text-center ${userType === 'employer'
                                        ? 'bg-primary text-white font-medium'
                                        : 'text-gray-700'
                                    }`}
                                onClick={() => setUserType('employer')}
                            >
                                İşveren
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ad Soyad
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    className="input"
                                    placeholder="Ad Soyad"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>

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

                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Şifre
                                </label>
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

                            <div className="mb-6">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Şifre (Tekrar)
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    className="input"
                                    placeholder="********"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div className="mb-6">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                        required
                                    />
                                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                                        <span>
                                            <Link href="/terms" className="text-primary hover:underline">
                                                Kullanım Şartları
                                            </Link>
                                            {' '}ve{' '}
                                            <Link href="/privacy" className="text-primary hover:underline">
                                                Gizlilik Politikası
                                            </Link>
                                            &apos;nı kabul ediyorum
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn-primary w-full"
                                disabled={loading}
                            >
                                {loading ? 'Kaydınız Oluşturuluyor...' : 'Kayıt Ol'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Zaten üye misiniz?{' '}
                                <Link href="/login" className="text-primary hover:underline font-medium">
                                    Giriş Yapın
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

export default Register; 