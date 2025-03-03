import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import Button from '../ui/Button';

const Header: React.FC = () => {
    const { isAuthenticated, logout } = useAuthContext();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-2xl font-bold text-primary-600">
                                Freelanza
                            </Link>
                        </div>
                        <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to="/"
                                className="border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                Ana Sayfa
                            </Link>
                            <Link
                                to="/jobs"
                                className="border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                İş İlanları
                            </Link>
                            <Link
                                to="/freelancers"
                                className="border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                Freelancerlar
                            </Link>
                            <Link
                                to="/how-it-works"
                                className="border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                Nasıl Çalışır
                            </Link>
                        </nav>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard">
                                    <Button variant="outline">Dashboard</Button>
                                </Link>
                                <Button variant="ghost" onClick={handleLogout}>
                                    Çıkış Yap
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="outline">Giriş Yap</Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="primary">Kaydol</Button>
                                </Link>
                            </>
                        )}
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={toggleMobileMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {mobileMenuOpen ? (
                                <svg
                                    className="block h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="block h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            to="/"
                            className="bg-neutral-50 border-primary-500 text-primary-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Ana Sayfa
                        </Link>
                        <Link
                            to="/jobs"
                            className="border-transparent text-neutral-500 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            İş İlanları
                        </Link>
                        <Link
                            to="/freelancers"
                            className="border-transparent text-neutral-500 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Freelancerlar
                        </Link>
                        <Link
                            to="/how-it-works"
                            className="border-transparent text-neutral-500 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Nasıl Çalışır
                        </Link>
                    </div>
                    <div className="pt-4 pb-3 border-t border-neutral-200">
                        <div className="space-y-1">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/dashboard"
                                        className="border-transparent text-neutral-500 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="border-transparent text-neutral-500 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left"
                                    >
                                        Çıkış Yap
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="border-transparent text-neutral-500 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Giriş Yap
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="border-transparent text-neutral-500 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Kaydol
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header; 