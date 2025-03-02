import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <div className="font-bold text-2xl text-primary">Freelanza</div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    <Link href="/freelancers" className="text-gray-700 hover:text-primary transition">
                        Freelancerlar
                    </Link>
                    <Link href="/jobs" className="text-gray-700 hover:text-primary transition">
                        İş İlanları
                    </Link>
                    <Link href="/how-it-works" className="text-gray-700 hover:text-primary transition">
                        Nasıl Çalışır
                    </Link>
                    <Link href="/login" className="text-gray-700 hover:text-primary transition">
                        Giriş Yap
                    </Link>
                    <Link
                        href="/register"
                        className="bg-primary text-white px-4 py-2 rounded-md hover:opacity-90 transition"
                    >
                        Kayıt Ol
                    </Link>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-gray-700"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white px-4 py-2 shadow-md">
                    <div className="flex flex-col space-y-4 py-2">
                        <Link
                            href="/freelancers"
                            className="text-gray-700 hover:text-primary py-2 transition"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Freelancerlar
                        </Link>
                        <Link
                            href="/jobs"
                            className="text-gray-700 hover:text-primary py-2 transition"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            İş İlanları
                        </Link>
                        <Link
                            href="/how-it-works"
                            className="text-gray-700 hover:text-primary py-2 transition"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Nasıl Çalışır
                        </Link>
                        <Link
                            href="/login"
                            className="text-gray-700 hover:text-primary py-2 transition"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Giriş Yap
                        </Link>
                        <Link
                            href="/register"
                            className="bg-primary text-white px-4 py-2 rounded-md hover:opacity-90 transition inline-block text-center"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Kayıt Ol
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header; 