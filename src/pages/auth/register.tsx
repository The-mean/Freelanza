import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const RegisterPage: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        userType: 'freelancer'
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Şifre kontrolü
        if (formData.password !== formData.confirmPassword) {
            setError('Şifreler eşleşmiyor');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    userType: formData.userType
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Kayıt sırasında bir hata oluştu');
            }

            // Başarılı kayıt sonrası giriş sayfasına yönlendir
            router.push('/auth/login?registered=true');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>Kayıt Ol | Freelanza</title>
                <meta name="description" content="Freelanza platformuna üye olun" />
            </Head>

            <Header />

            <main className="flex-grow bg-gray-50 py-12">
                <div className="container max-w-md mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">
                            Freelanza'ya Üye Olun
                        </h1>

                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ad Soyad
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Adresi
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
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
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Şifre Tekrar
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div>
                                <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
                                    Hesap Türü
                                </label>
                                <select
                                    id="userType"
                                    name="userType"
                                    value={formData.userType}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="freelancer">Freelancer</option>
                                    <option value="employer">İşveren</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isLoading ? 'Kaydediliyor...' : 'Kayıt Ol'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Zaten hesabınız var mı?{' '}
                                <Link href="/auth/login">
                                    <span className="text-blue-600 hover:text-blue-800">
                                        Giriş yapın
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

export default RegisterPage; 