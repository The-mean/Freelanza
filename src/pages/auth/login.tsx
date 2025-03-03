import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const LoginPage: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError('Email veya şifre hatalı');
            } else {
                const returnUrl = (router.query.returnUrl as string) || '/dashboard';
                router.push(returnUrl);
            }
        } catch (error) {
            setError('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>Giriş Yap | Freelanza</title>
                <meta name="description" content="Freelanza platformuna giriş yapın" />
            </Head>

            <Header />

            <main className="flex-grow bg-gray-50 py-12">
                <div className="container max-w-md mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">
                            Freelanza'ya Hoş Geldiniz
                        </h1>

                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Adresi
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Şifre
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        className="h-4 w-4 text-blue-600 rounded border-gray-300"
                                    />
                                    <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                                        Beni hatırla
                                    </label>
                                </div>
                                <Link href="/auth/forgot-password">
                                    <span className="text-sm text-blue-600 hover:text-blue-800">
                                        Şifremi unuttum
                                    </span>
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Hesabınız yok mu?{' '}
                                <Link href="/auth/register">
                                    <span className="text-blue-600 hover:text-blue-800">
                                        Hemen kaydolun
                                    </span>
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default LoginPage; 