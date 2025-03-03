import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Freelanza</h3>
                        <p className="text-gray-400">
                            Freelancer ve işverenleri buluşturan profesyonel platform
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Hızlı Linkler</h3>
                        <ul className="space-y-2">
                            <li><a href="/jobs" className="text-gray-400 hover:text-white">İş İlanları</a></li>
                            <li><a href="/freelancers" className="text-gray-400 hover:text-white">Freelancerlar</a></li>
                            <li><a href="/how-it-works" className="text-gray-400 hover:text-white">Nasıl Çalışır</a></li>
                            <li><a href="/pricing" className="text-gray-400 hover:text-white">Fiyatlandırma</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Destek</h3>
                        <ul className="space-y-2">
                            <li><a href="/help" className="text-gray-400 hover:text-white">Yardım Merkezi</a></li>
                            <li><a href="/contact" className="text-gray-400 hover:text-white">İletişim</a></li>
                            <li><a href="/faq" className="text-gray-400 hover:text-white">SSS</a></li>
                            <li><a href="/terms" className="text-gray-400 hover:text-white">Kullanım Şartları</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">İletişim</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <i className="fas fa-envelope mr-2"></i>
                                info@freelanza.com
                            </li>
                            <li>
                                <i className="fas fa-phone mr-2"></i>
                                +90 (212) 123 45 67
                            </li>
                            <li>
                                <i className="fas fa-map-marker-alt mr-2"></i>
                                İstanbul, Türkiye
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Freelanza. Tüm hakları saklıdır.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 