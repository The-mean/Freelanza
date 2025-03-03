import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Admin tokenı varsa admin paneline yönlendir
        const adminToken = localStorage.getItem('adminToken');
        if (adminToken) {
            router.push('/admin');
        }
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Lütfen email ve şifrenizi giriniz.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Gerçek uygulamada burada API çağrısı yapılır
            // Basit bir demo için sabit bir admin kullanıcısı kontrolü yapıyoruz
            if (email === 'admin@freelanza.com' && password === 'admin123') {
                // Başarılı giriş
                localStorage.setItem('adminToken', 'admin-token-123');
                localStorage.setItem('userType', 'admin');
                router.push('/admin');
            } else {
                setError('Geçersiz email veya şifre.');
            }
        } catch (err) {
            setError('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Head>
                <title>Admin Girişi | Freelanza</title>
                <meta name="description" content="Freelanza Admin Paneli Giriş" />
            </Head>

            <div className="flex flex-col items-center justify-center flex-grow px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <Link href="/">
                            <a className="text-3xl font-bold text-blue-600">Freelanza</a>
                        </Link>
                        <h1 className="mt-2 text-2xl font-bold text-gray-900">Admin Paneli</h1>
                        <p className="mt-2 text-gray-600">Yönetici hesabınızla giriş yapın</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-8">
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                                    Email Adresi
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="admin@freelanza.com"
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                                    Şifre
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                                disabled={loading}
                            >
                                {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                            </button>
                        </form>

                        <div className="mt-4 text-center">
                            <Link href="/">
                                <a className="text-blue-600 hover:text-blue-800">
                                    Ana Sayfaya Dön
                                </a>
                            </Link>
                        </div>
                    </div>

                    <div className="mt-8 text-center text-gray-600 text-sm">
                        <p>
                            &copy; {new Date().getFullYear()} Freelanza. Tüm hakları saklıdır.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 