import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

// Sidebar bileşeni (dashboard sayfasından tekrar kullanım için)
const Sidebar = ({ userType, activePage }: { userType: 'freelancer' | 'employer'; activePage: string }) => {
    // Freelancer ve işveren için farklı menü öğeleri
    const menuItems = userType === 'freelancer'
        ? [
            { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
            { name: 'Tekliflerim', path: '/dashboard/proposals', icon: 'fas fa-file-contract' },
            { name: 'Aktif İşlerim', path: '/dashboard/active-jobs', icon: 'fas fa-briefcase' },
            { name: 'Ödemelerim', path: '/dashboard/payments', icon: 'fas fa-money-bill-wave' },
            { name: 'Mesajlarım', path: '/messages', icon: 'fas fa-envelope' },
            { name: 'Değerlendirmelerim', path: '/dashboard/reviews', icon: 'fas fa-star' },
            { name: 'Profil', path: '/dashboard/profile', icon: 'fas fa-user' },
            { name: 'Ayarlar', path: '/dashboard/settings', icon: 'fas fa-cog' },
        ]
        : [
            { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
            { name: 'İş İlanlarım', path: '/dashboard/my-jobs', icon: 'fas fa-briefcase' },
            { name: 'Gelen Teklifler', path: '/dashboard/proposals', icon: 'fas fa-file-contract' },
            { name: 'Aktif İşlerim', path: '/dashboard/active-jobs', icon: 'fas fa-tasks' },
            { name: 'Ödemelerim', path: '/dashboard/payments', icon: 'fas fa-money-bill-wave' },
            { name: 'Mesajlarım', path: '/messages', icon: 'fas fa-envelope' },
            { name: 'Profil', path: '/dashboard/profile', icon: 'fas fa-user' },
            { name: 'Ayarlar', path: '/dashboard/settings', icon: 'fas fa-cog' },
        ];

    return (
        <div className="bg-gray-800 text-white w-64 min-h-screen py-6 flex flex-col">
            <div className="px-6 mb-8">
                <Link href="/" className="text-xl font-bold">
                    Freelanza
                </Link>
            </div>
            <nav className="flex-grow">
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.path} className="mb-1">
                            <Link href={item.path}
                                className={`flex items-center py-2 px-6 hover:bg-gray-700 transition duration-150 ${activePage === item.path ? 'bg-gray-700' : ''
                                    }`}
                            >
                                <i className={`${item.icon} mr-3 w-5 text-center`}></i>
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="px-6 mt-auto pt-4 border-t border-gray-700">
                <button className="w-full flex items-center py-2 text-gray-400 hover:text-white">
                    <i className="fas fa-sign-out-alt mr-3"></i>
                    Çıkış Yap
                </button>
            </div>
        </div>
    );
};

// Profil formunda kullanılacak input bileşeni
const FormInput = ({
    label,
    id,
    type = 'text',
    value,
    onChange,
    placeholder = '',
    required = false
}: {
    label: string;
    id: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    placeholder?: string;
    required?: boolean;
}) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {type === 'textarea' ? (
            <textarea
                id={id}
                name={id}
                rows={4}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required={required}
            />
        ) : (
            <input
                type={type}
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required={required}
            />
        )}
    </div>
);

// Kategoriler için seçim bileşeni
const CategorySelect = ({
    selectedCategories,
    setSelectedCategories,
}: {
    selectedCategories: string[];
    setSelectedCategories: (categories: string[]) => void;
}) => {
    // Örnek kategoriler
    const categories = [
        "Web Geliştirme",
        "Mobil Uygulama",
        "Grafik Tasarım",
        "UI/UX Tasarım",
        "SEO",
        "İçerik Yazarlığı",
        "Sosyal Medya Yönetimi",
        "Video Prodüksiyon",
        "Dijital Pazarlama",
        "Logo Tasarımı",
    ];

    const toggleCategory = (category: string) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Hizmet Kategorileri <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <button
                        key={category}
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className={`px-3 py-1 rounded-full text-sm ${selectedCategories.includes(category)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
};

// Beceriler için seçim bileşeni
const SkillsSelect = ({
    selectedSkills,
    setSelectedSkills,
}: {
    selectedSkills: string[];
    setSelectedSkills: (skills: string[]) => void;
}) => {
    const [inputValue, setInputValue] = useState('');

    // Önerilen beceriler (gerçekte API'den gelir)
    const suggestedSkills = [
        "JavaScript", "React", "Node.js", "TypeScript", "HTML", "CSS", "Python",
        "PHP", "WordPress", "UI/UX", "Figma", "Adobe Photoshop", "Adobe Illustrator",
        "SEO", "Content Writing", "Social Media", "Marketing", "Video Editing"
    ];

    const [filteredSkills, setFilteredSkills] = useState<string[]>([]);

    useEffect(() => {
        if (inputValue.trim()) {
            const filtered = suggestedSkills.filter(
                skill => skill.toLowerCase().includes(inputValue.toLowerCase()) && !selectedSkills.includes(skill)
            );
            setFilteredSkills(filtered);
        } else {
            setFilteredSkills([]);
        }
    }, [inputValue, selectedSkills]);

    const addSkill = (skill: string) => {
        if (!selectedSkills.includes(skill) && skill.trim()) {
            setSelectedSkills([...selectedSkills, skill]);
            setInputValue('');
        }
    };

    const removeSkill = (skill: string) => {
        setSelectedSkills(selectedSkills.filter(s => s !== skill));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            addSkill(inputValue);
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Beceriler <span className="text-red-500">*</span>
            </label>
            <div className="mb-2">
                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedSkills.map((skill) => (
                        <div
                            key={skill}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center text-sm"
                        >
                            {skill}
                            <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="ml-1 text-blue-800 hover:text-blue-600"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    ))}
                </div>
                <div className="relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Becerilerinizi yazın ve Enter'a basın"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    {filteredSkills.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300 max-h-60 overflow-auto">
                            {filteredSkills.map((skill) => (
                                <div
                                    key={skill}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                    onClick={() => addSkill(skill)}
                                >
                                    {skill}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function Profile() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userType, setUserType] = useState<'freelancer' | 'employer'>('freelancer');
    const [activeTab, setActiveTab] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Profil formları için state
    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        title: '',
        bio: '',
        company: '',
        website: '',
        hourlyRate: '',
        avatar: '',
    });

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

    // Örnek kullanıcı bilgileri (gerçekte API'den gelir)
    useEffect(() => {
        // Gerçek uygulamada API'den doğrulama yapılır
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login?redirect=/dashboard/profile');
            return;
        }

        // Kullanıcı tipini kontrol et
        const storedUserType = localStorage.getItem('userType');
        if (storedUserType === 'employer') {
            setUserType('employer');

            // İşveren örnek verileri
            setProfileData({
                fullName: 'Ali Yılmaz',
                email: 'employer@example.com',
                phone: '+90 533 123 45 67',
                location: 'İstanbul, Türkiye',
                title: 'Genel Müdür',
                bio: 'Acme Corporation şirketinde genel müdür olarak çalışıyorum. Web ve mobil uygulama geliştirme üzerine projelerde uzman freelancerlar ile çalışmaktayız.',
                company: 'Acme Corporation',
                website: 'acmecorp.com',
                hourlyRate: '',
                avatar: '/images/avatars/avatar-3.jpg',
            });
        } else {
            // Freelancer örnek verileri
            setProfileData({
                fullName: 'Zeynep Kaya',
                email: 'freelancer1@example.com',
                phone: '+90 532 987 65 43',
                location: 'Ankara, Türkiye',
                title: 'Full Stack Geliştirici',
                bio: 'Frontend ve backend teknolojilerinde 5+ yıl deneyime sahip full stack geliştiriciyim. Modern web uygulamaları geliştirmekteyim.',
                company: '',
                website: 'zeynepcv.com',
                hourlyRate: '250',
                avatar: '/images/avatars/avatar-2.jpg',
            });

            setSelectedCategories(['Web Geliştirme', 'Mobil Uygulama']);
            setSelectedSkills(['JavaScript', 'React', 'Node.js', 'TypeScript', 'HTML', 'CSS']);
        }

        setIsAuthenticated(true);
        setIsLoading(false);
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSuccessMessage('');

        try {
            // Burada gerçek API çağrısı yapılacak
            // Şimdilik bir gecikme simüle ediyoruz
            setTimeout(() => {
                setSuccessMessage('Profil bilgileriniz başarıyla güncellendi.');
                setIsSaving(false);
            }, 1500);
        } catch (error) {
            console.error('Profil güncellenirken bir hata oluştu', error);
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Yönlendirme yapılıyor, içerik gösterme
    }

    return (
        <>
            <Head>
                <title>Profil - Freelanza</title>
                <meta name="description" content="Freelanza kullanıcı profili" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            </Head>

            <div className="flex min-h-screen bg-gray-100">
                <Sidebar userType={userType} activePage="/dashboard/profile" />

                <div className="flex-1 overflow-auto">
                    <header className="bg-white shadow-sm">
                        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                            <h1 className="text-2xl font-semibold text-gray-900">Profil</h1>
                        </div>
                    </header>

                    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="border-b border-gray-200">
                                <nav className="flex -mb-px">
                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'profile'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <i className="fas fa-user mr-2"></i>
                                        Profil Bilgileri
                                    </button>
                                    {userType === 'freelancer' && (
                                        <button
                                            onClick={() => setActiveTab('portfolio')}
                                            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'portfolio'
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            <i className="fas fa-briefcase mr-2"></i>
                                            Portföy
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setActiveTab('security')}
                                        className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'security'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <i className="fas fa-lock mr-2"></i>
                                        Güvenlik
                                    </button>
                                </nav>
                            </div>

                            <div className="p-6">
                                {successMessage && (
                                    <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                                        <div className="flex">
                                            <i className="fas fa-check-circle mr-2 mt-1"></i>
                                            <span>{successMessage}</span>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'profile' && (
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-6 flex items-center">
                                            <div className="mr-4">
                                                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                    {profileData.avatar ? (
                                                        <Image
                                                            src={profileData.avatar}
                                                            alt="Profil"
                                                            width={96}
                                                            height={96}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-gray-500 text-3xl">
                                                            {profileData.fullName.charAt(0)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-1">{profileData.fullName}</h3>
                                                <p className="text-gray-500">{profileData.title}</p>
                                                <div className="mt-2">
                                                    <button
                                                        type="button"
                                                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                    >
                                                        Fotoğraf Değiştir
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <FormInput
                                                    label="Ad Soyad"
                                                    id="fullName"
                                                    value={profileData.fullName}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                                <FormInput
                                                    label="E-posta"
                                                    id="email"
                                                    type="email"
                                                    value={profileData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                                <FormInput
                                                    label="Telefon"
                                                    id="phone"
                                                    value={profileData.phone}
                                                    onChange={handleInputChange}
                                                />
                                                <FormInput
                                                    label="Konum"
                                                    id="location"
                                                    value={profileData.location}
                                                    onChange={handleInputChange}
                                                    placeholder="Şehir, Ülke"
                                                    required
                                                />
                                                <FormInput
                                                    label="Web Sitesi"
                                                    id="website"
                                                    value={profileData.website}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div>
                                                <FormInput
                                                    label="Ünvan / Pozisyon"
                                                    id="title"
                                                    value={profileData.title}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                                {userType === 'employer' && (
                                                    <FormInput
                                                        label="Şirket Adı"
                                                        id="company"
                                                        value={profileData.company}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                )}
                                                {userType === 'freelancer' && (
                                                    <FormInput
                                                        label="Saatlik Ücret (₺)"
                                                        id="hourlyRate"
                                                        type="number"
                                                        value={profileData.hourlyRate}
                                                        onChange={handleInputChange}
                                                    />
                                                )}
                                                <div className="mb-4">
                                                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Hakkımda / Bio <span className="text-red-500">*</span>
                                                    </label>
                                                    <textarea
                                                        id="bio"
                                                        name="bio"
                                                        rows={5}
                                                        value={profileData.bio}
                                                        onChange={handleInputChange}
                                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                        required
                                                    />
                                                </div>

                                                {userType === 'freelancer' && (
                                                    <>
                                                        <CategorySelect
                                                            selectedCategories={selectedCategories}
                                                            setSelectedCategories={setSelectedCategories}
                                                        />

                                                        <SkillsSelect
                                                            selectedSkills={selectedSkills}
                                                            setSelectedSkills={setSelectedSkills}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-end">
                                            <button
                                                type="button"
                                                className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                İptal
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSaving}
                                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                            >
                                                {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {activeTab === 'portfolio' && (
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-lg font-medium text-gray-900">Portföy Çalışmaları</h2>
                                            <button className="px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                                                <i className="fas fa-plus mr-1"></i> Yeni Proje Ekle
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {/* Örnek portföy projeleri */}
                                            {Array.from({ length: 3 }).map((_, index) => (
                                                <div key={index} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="h-44 bg-gray-200 relative">
                                                        <Image
                                                            src={`/images/portfolio/project${index + 1}.jpg`}
                                                            alt={`Proje ${index + 1}`}
                                                            layout="fill"
                                                            objectFit="cover"
                                                        />
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="font-medium text-gray-900 mb-1">E-ticaret Web Sitesi</h3>
                                                        <p className="text-gray-500 text-sm mb-2">React, Node.js ile geliştirilmiş modern e-ticaret platformu</p>
                                                        <div className="flex justify-between items-center mt-3">
                                                            <div className="text-sm text-gray-500">2023</div>
                                                            <div className="flex space-x-2">
                                                                <button className="text-blue-600 hover:text-blue-800">
                                                                    <i className="fas fa-edit"></i>
                                                                </button>
                                                                <button className="text-red-600 hover:text-red-800">
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'security' && (
                                    <div>
                                        <div className="mb-6">
                                            <h2 className="text-lg font-medium text-gray-900 mb-4">Şifre Değiştir</h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <FormInput
                                                        label="Mevcut Şifre"
                                                        id="currentPassword"
                                                        type="password"
                                                        value=""
                                                        onChange={() => { }}
                                                        required
                                                    />
                                                    <FormInput
                                                        label="Yeni Şifre"
                                                        id="newPassword"
                                                        type="password"
                                                        value=""
                                                        onChange={() => { }}
                                                        required
                                                    />
                                                    <FormInput
                                                        label="Yeni Şifre (Tekrar)"
                                                        id="confirmPassword"
                                                        type="password"
                                                        value=""
                                                        onChange={() => { }}
                                                        required
                                                    />
                                                    <div className="mt-4">
                                                        <button
                                                            type="button"
                                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        >
                                                            Şifreyi Güncelle
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-md">
                                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Şifre Gereksinimleri:</h3>
                                                    <ul className="text-sm text-gray-600 space-y-1">
                                                        <li className="flex items-center">
                                                            <i className="fas fa-check-circle text-green-500 mr-2"></i>
                                                            En az 8 karakter uzunluğunda
                                                        </li>
                                                        <li className="flex items-center">
                                                            <i className="fas fa-check-circle text-green-500 mr-2"></i>
                                                            En az bir büyük harf içermeli
                                                        </li>
                                                        <li className="flex items-center">
                                                            <i className="fas fa-check-circle text-green-500 mr-2"></i>
                                                            En az bir küçük harf içermeli
                                                        </li>
                                                        <li className="flex items-center">
                                                            <i className="fas fa-check-circle text-green-500 mr-2"></i>
                                                            En az bir rakam içermeli
                                                        </li>
                                                        <li className="flex items-center">
                                                            <i className="fas fa-check-circle text-green-500 mr-2"></i>
                                                            En az bir özel karakter içermeli (@, #, $, !, % vb.)
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 pt-6 mt-6">
                                            <h2 className="text-lg font-medium text-gray-900 mb-4">İki Faktörlü Kimlik Doğrulama</h2>
                                            <div className="bg-gray-50 p-4 rounded-md mb-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-sm font-medium text-gray-900">İki faktörlü kimlik doğrulama</h3>
                                                        <p className="text-sm text-gray-500 mt-1">Hesabınıza giriş yaparken ek bir güvenlik katmanı ekleyin.</p>
                                                    </div>
                                                    <div>
                                                        <button
                                                            type="button"
                                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        >
                                                            Etkinleştir
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 pt-6 mt-6">
                                            <h2 className="text-lg font-medium text-gray-900 mb-4">Hesabı Sil</h2>
                                            <div className="bg-red-50 p-4 rounded-md border border-red-200">
                                                <h3 className="text-sm font-medium text-red-800">Tehlikeli Bölge</h3>
                                                <p className="text-sm text-red-700 mt-1">
                                                    Hesabınızı sildiğinizde, tüm verileriniz kalıcı olarak silinecektir. Bu işlem geri alınamaz.
                                                </p>
                                                <div className="mt-4">
                                                    <button
                                                        type="button"
                                                        className="px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                    >
                                                        Hesabımı Sil
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
} 