import Link from 'next/link';

export default function Footer() {
    // Footer bağlantıları
    const links = {
        company: [
            { name: 'Hakkımızda', href: '/about' },
            { name: 'İletişim', href: '/contact' },
            { name: 'Blog', href: '/blog' },
            { name: 'Kariyer', href: '/careers' },
        ],
        support: [
            { name: 'Yardım Merkezi', href: '/help' },
            { name: 'SSS', href: '/faq' },
            { name: 'Topluluk Kuralları', href: '/community-guidelines' },
            { name: 'Güvenlik İpuçları', href: '/security-tips' },
        ],
        legal: [
            { name: 'Gizlilik Politikası', href: '/privacy' },
            { name: 'Kullanım Koşulları', href: '/terms' },
            { name: 'Çerez Politikası', href: '/cookies' },
            { name: 'Telif Hakkı Politikası', href: '/copyright' },
        ],
        resources: [
            { name: 'Freelancer Rehberi', href: '/resources/freelancer-guide' },
            { name: 'İşveren Rehberi', href: '/resources/employer-guide' },
            { name: 'Fiyatlandırma', href: '/pricing' },
            { name: 'Nasıl Çalışır', href: '/how-it-works' },
        ],
    };

    // Sosyal medya bağlantıları
    const socialLinks = [
        { name: 'Twitter', href: 'https://twitter.com/freelanza', icon: 'fab fa-twitter' },
        { name: 'Facebook', href: 'https://facebook.com/freelanza', icon: 'fab fa-facebook-f' },
        { name: 'Instagram', href: 'https://instagram.com/freelanza', icon: 'fab fa-instagram' },
        { name: 'LinkedIn', href: 'https://linkedin.com/company/freelanza', icon: 'fab fa-linkedin-in' },
        { name: 'YouTube', href: 'https://youtube.com/freelanza', icon: 'fab fa-youtube' },
    ];

    // Yıl bilgisi
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Üst kısım */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
                    {/* Logo ve açıklama */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="text-2xl font-bold text-white">
                            Freelanza
                        </Link>
                        <p className="mt-4 text-gray-300 text-sm">
                            Freelanza, freelancer'lar ve işverenler arasında güvenilir bir köprü kurarak,
                            her iki tarafın da başarıya ulaşmasına yardımcı olan bir platformdur.
                            Yeteneklerinizi sergilemek veya ihtiyacınız olan uzmanları bulmak için en iyi yer.
                        </p>

                        {/* Sosyal medya */}
                        <div className="mt-6 flex space-x-4">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white transition-colors duration-300"
                                    title={link.name}
                                >
                                    <i className={`${link.icon} text-xl`}></i>
                                    <span className="sr-only">{link.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Bağlantılar */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Şirket</h3>
                        <ul className="space-y-2">
                            {links.company.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-gray-300 hover:text-white text-sm">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Destek</h3>
                        <ul className="space-y-2">
                            {links.support.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-gray-300 hover:text-white text-sm">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Kaynaklar</h3>
                        <ul className="space-y-2">
                            {links.resources.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-gray-300 hover:text-white text-sm">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Alt kısım */}
                <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-gray-300 text-sm">
                            &copy; {currentYear} Freelanza. Tüm hakları saklıdır.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center space-x-4">
                        {links.legal.map((link) => (
                            <Link key={link.name} href={link.href} className="text-gray-300 hover:text-white text-sm mb-2">
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
} 