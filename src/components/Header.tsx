import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function Header() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState<'freelancer' | 'employer' | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    // Kimlik doğrulama durumunu kontrol et
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);

            // Kullanıcı türünü belirle
            const storedUserType = localStorage.getItem('userType');
            if (storedUserType === 'employer') {
                setUserType('employer');
            } else if (storedUserType === 'freelancer') {
                setUserType('freelancer');
            }
        }
    }, []);

    // Çıkış yap
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        setIsAuthenticated(false);
        setUserType(null);
        router.push('/');
    };

    // Menü bağlantıları
    const menuLinks = [
        { name: 'Ana Sayfa', href: '/' },
        { name: 'Freelancerlar', href: '/freelancers' },
        { name: 'İş İlanları', href: '/jobs' },
        { name: 'Hakkımızda', href: '/about' },
        { name: 'İletişim', href: '/contact' },
    ];

    // Profil menüsü bağlantıları
    const profileLinks = isAuthenticated
        ? [
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Profil', href: '/dashboard/profile' },
            { name: 'Mesajlar', href: '/messages' },
            { name: 'Ayarlar', href: '/dashboard/settings' },
        ]
        : [];

    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-blue-600">Freelanza</span>
                        </Link>
                    </div>

                    {/* Masaüstü Menü */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        <nav className="hidden md:ml-6 md:flex md:space-x-8">
                            {menuLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${router.pathname === link.href
                                            ? 'border-blue-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Sağ taraf - Giriş/Kayıt veya Profil */}
                    <div className="flex items-center">
                        {isAuthenticated ? (
                            <div className="hidden md:ml-4 md:flex md:items-center">
                                {/* Bildirimler */}
                                <Link
                                    href="/notifications"
                                    className="p-1 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none relative"
                                >
                                    <span className="sr-only">Bildirimleri görüntüle</span>
                                    <i className="fas fa-bell text-xl"></i>
                                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                                </Link>

                                {/* Mesajlar */}
                                <Link
                                    href="/messages"
                                    className="ml-4 p-1 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none relative"
                                >
                                    <span className="sr-only">Mesajları görüntüle</span>
                                    <i className="fas fa-envelope text-xl"></i>
                                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                                </Link>

                                {/* Profil menüsü */}
                                <div className="ml-4 relative">
                                    <div>
                                        <button
                                            type="button"
                                            className="flex text-sm rounded-full focus:outline-none"
                                            id="user-menu"
                                            aria-expanded="false"
                                            aria-haspopup="true"
                                            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                        >
                                            <span className="sr-only">Menüyü aç</span>
                                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                <Image
                                                    src={userType === 'freelancer' ? '/images/avatars/avatar-2.jpg' : '/images/avatars/avatar-3.jpg'}
                                                    alt="Profil"
                                                    width={32}
                                                    height={32}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        </button>
                                    </div>

                                    {/* Profil dropdown menüsü */}
                                    {isProfileMenuOpen && (
                                        <div
                                            className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                                            role="menu"
                                            aria-orientation="vertical"
                                            aria-labelledby="user-menu"
                                        >
                                            {profileLinks.map((link) => (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    role="menuitem"
                                                    onClick={() => setIsProfileMenuOpen(false)}
                                                >
                                                    {link.name}
                                                </Link>
                                            ))}
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                role="menuitem"
                                                onClick={handleLogout}
                                            >
                                                Çıkış Yap
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="hidden md:flex md:items-center md:space-x-3">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50"
                                >
                                    Giriş Yap
                                </Link>
                                <Link
                                    href="/register"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Kayıt Ol
                                </Link>
                            </div>
                        )}

                        {/* Mobil menü butonu */}
                        <div className="flex items-center md:hidden">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                                aria-expanded="false"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <span className="sr-only">Menüyü aç</span>
                                <i className={`${isMenuOpen ? 'fas fa-times' : 'fas fa-bars'} text-xl`}></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobil menü */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        {menuLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${router.pathname === link.href
                                        ? 'border-blue-500 text-blue-700 bg-blue-50'
                                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                                    }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {isAuthenticated ? (
                        <div className="pt-4 pb-3 border-t border-gray-200">
                            <div className="flex items-center px-4">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                        <Image
                                            src={userType === 'freelancer' ? '/images/avatars/avatar-2.jpg' : '/images/avatars/avatar-3.jpg'}
                                            alt="Profil"
                                            width={40}
                                            height={40}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-gray-800">
                                        {userType === 'freelancer' ? 'Zeynep Kaya' : 'Ali Yılmaz'}
                                    </div>
                                    <div className="text-sm font-medium text-gray-500">
                                        {userType === 'freelancer' ? 'freelancer1@example.com' : 'employer@example.com'}
                                    </div>
                                </div>
                                <div className="ml-auto flex items-center space-x-4">
                                    <Link
                                        href="/notifications"
                                        className="text-gray-400 hover:text-gray-500 relative"
                                    >
                                        <i className="fas fa-bell text-xl"></i>
                                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                                    </Link>
                                    <Link
                                        href="/messages"
                                        className="text-gray-400 hover:text-gray-500 relative"
                                    >
                                        <i className="fas fa-envelope text-xl"></i>
                                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                                    </Link>
                                </div>
                            </div>
                            <div className="mt-3 space-y-1">
                                {profileLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <button
                                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    Çıkış Yap
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="pt-4 pb-3 border-t border-gray-200">
                            <div className="flex items-center justify-center space-x-3 px-4">
                                <Link
                                    href="/login"
                                    className="flex-1 block text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Giriş Yap
                                </Link>
                                <Link
                                    href="/register"
                                    className="flex-1 block text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Kayıt Ol
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
} 