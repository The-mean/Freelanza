import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Kenar çubuğu öğesi bileşeni
interface SidebarItemProps {
    href: string;
    icon: string;
    text: string;
    isActive: boolean;
}

const SidebarItem = ({ href, icon, text, isActive }: SidebarItemProps) => {
    return (
        <Link href={href}>
            <a className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}>
                <i className={`${icon} w-5 text-center`}></i>
                <span>{text}</span>
            </a>
        </Link>
    );
};

interface SidebarProps {
    userType: string;
}

export default function Sidebar({ userType }: SidebarProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    // Mobil görünümde sidebar'ı aç/kapat
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Geçerli rotayı kontrol etme yardımcı fonksiyonu
    const isActive = (path: string) => {
        return router.pathname === path;
    };

    // Mobil görünümde menü kapalıysa sadece buton göster
    if (!isOpen && typeof window !== 'undefined' && window.innerWidth < 768) {
        return (
            <button
                onClick={toggleSidebar}
                className="fixed left-4 top-24 z-20 md:hidden bg-white p-2 rounded-full shadow-md"
            >
                <i className="fas fa-bars text-gray-700"></i>
            </button>
        );
    }

    // Kullanıcı tipine göre menü öğeleri
    const freelancerMenuItems = [
        { href: '/dashboard', icon: 'fas fa-th-large', text: 'Genel Bakış' },
        { href: '/dashboard/profile', icon: 'fas fa-user', text: 'Profilim' },
        { href: '/dashboard/proposals', icon: 'fas fa-file-alt', text: 'Tekliflerim' },
        { href: '/dashboard/active-jobs', icon: 'fas fa-briefcase', text: 'Aktif İşlerim' },
        { href: '/dashboard/payments', icon: 'fas fa-credit-card', text: 'Ödemelerim' },
        { href: '/dashboard/messages', icon: 'fas fa-comments', text: 'Mesajlarım' },
        { href: '/dashboard/reviews', icon: 'fas fa-star', text: 'Değerlendirmelerim' },
    ];

    const employerMenuItems = [
        { href: '/dashboard', icon: 'fas fa-th-large', text: 'Genel Bakış' },
        { href: '/dashboard/profile', icon: 'fas fa-user', text: 'Profilim' },
        { href: '/dashboard/my-jobs', icon: 'fas fa-briefcase', text: 'İlanlarım' },
        { href: '/dashboard/post-job', icon: 'fas fa-plus-circle', text: 'İş İlanı Ekle' },
        { href: '/dashboard/candidates', icon: 'fas fa-users', text: 'Adaylar' },
        { href: '/dashboard/contracts', icon: 'fas fa-file-contract', text: 'Sözleşmeler' },
        { href: '/dashboard/payments', icon: 'fas fa-credit-card', text: 'Ödemelerim' },
        { href: '/dashboard/messages', icon: 'fas fa-comments', text: 'Mesajlarım' },
    ];

    const adminMenuItems = [
        { href: '/admin', icon: 'fas fa-th-large', text: 'Genel Bakış' },
        { href: '/admin/users', icon: 'fas fa-users', text: 'Kullanıcılar' },
        { href: '/admin/jobs', icon: 'fas fa-briefcase', text: 'İş İlanları' },
        { href: '/admin/categories', icon: 'fas fa-list', text: 'Kategoriler' },
        { href: '/admin/skills', icon: 'fas fa-tools', text: 'Yetenekler' },
        { href: '/admin/payments', icon: 'fas fa-credit-card', text: 'Ödemeler' },
        { href: '/admin/reports', icon: 'fas fa-flag', text: 'Raporlar' },
        { href: '/admin/settings', icon: 'fas fa-cog', text: 'Ayarlar' },
    ];

    // Kullanıcı tipine göre menü öğelerini seç
    let menuItems;

    switch (userType) {
        case 'freelancer':
            menuItems = freelancerMenuItems;
            break;
        case 'employer':
            menuItems = employerMenuItems;
            break;
        case 'admin':
            menuItems = adminMenuItems;
            break;
        default:
            menuItems = freelancerMenuItems; // Varsayılan olarak freelancer menüsünü göster
    }

    return (
        <>
            {/* Mobil görünümde kapatma butonu ve arka plan overlay */}
            {isOpen && typeof window !== 'undefined' && window.innerWidth < 768 && (
                <div className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden" onClick={toggleSidebar}></div>
            )}

            <div className={`w-64 bg-white shadow-lg z-20 h-[calc(100vh-64px)] overflow-y-auto fixed md:sticky top-16 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}>
                {/* Mobil görünümde kapatma butonu */}
                <button
                    onClick={toggleSidebar}
                    className="absolute right-4 top-4 md:hidden bg-white p-2 rounded-full shadow-sm"
                >
                    <i className="fas fa-times text-gray-700"></i>
                </button>

                <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">
                        {userType === 'freelancer' && 'Freelancer Paneli'}
                        {userType === 'employer' && 'İşveren Paneli'}
                        {userType === 'admin' && 'Admin Paneli'}
                        {!userType && 'Kullanıcı Paneli'}
                    </h2>

                    <div className="space-y-1">
                        {menuItems.map(item => (
                            <SidebarItem
                                key={item.href}
                                href={item.href}
                                icon={item.icon}
                                text={item.text}
                                isActive={isActive(item.href)}
                            />
                        ))}
                    </div>

                    <div className="border-t border-gray-200 mt-6 pt-6">
                        <SidebarItem
                            href="/help"
                            icon="fas fa-question-circle"
                            text="Yardım Merkezi"
                            isActive={isActive('/help')}
                        />
                        <SidebarItem
                            href="/settings"
                            icon="fas fa-cog"
                            text="Ayarlar"
                            isActive={isActive('/settings')}
                        />
                        <button
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-red-500 hover:bg-red-50 w-full"
                            onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('userType');
                                router.push('/login');
                            }}
                        >
                            <i className="fas fa-sign-out-alt w-5 text-center"></i>
                            <span>Çıkış Yap</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
} 