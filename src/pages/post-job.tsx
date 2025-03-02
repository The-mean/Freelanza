import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// Örnek kategoriler
const categories = [
    { id: 1, name: 'Web Geliştirme' },
    { id: 2, name: 'Mobil Uygulama Geliştirme' },
    { id: 3, name: 'UI/UX Tasarım' },
    { id: 4, name: 'Grafik Tasarım' },
    { id: 5, name: 'İçerik Yazarlığı' },
    { id: 6, name: 'SEO & Dijital Pazarlama' },
    { id: 7, name: 'Video & Animasyon' },
    { id: 8, name: 'Ses & Müzik' },
    { id: 9, name: 'Çeviri & Yerelleştirme' },
    { id: 10, name: 'Sosyal Medya Yönetimi' }
];

// Örnek beceriler
const allSkills = [
    'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js', 'Node.js',
    'PHP', 'Laravel', 'WordPress', 'Python', 'Django', 'Java', 'Spring Boot',
    'Swift', 'Kotlin', 'React Native', 'Flutter', 'UI Tasarım', 'UX Tasarım',
    'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'İçerik Yazarlığı', 'SEO'
];

const PostJob = () => {
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState('');
    const [activeStep, setActiveStep] = useState(1);
    const [files, setFiles] = useState<File[]>([]);

    const handleSkillAdd = (skill: string) => {
        if (skill && !selectedSkills.includes(skill)) {
            setSelectedSkills([...selectedSkills, skill]);
            setSkillInput('');
        }
    }

    const handleSkillRemove = (skill: string) => {
        setSelectedSkills(selectedSkills.filter(s => s !== skill));
    }

    const filteredSkills = allSkills.filter(skill =>
        !selectedSkills.includes(skill) &&
        skill.toLowerCase().includes(skillInput.toLowerCase())
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles([...files, ...newFiles]);
        }
    };

    const handleFileRemove = (fileName: string) => {
        setFiles(files.filter(file => file.name !== fileName));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // İşlem gerçekleştirilecek (veritabanına kayıt, API çağrısı vb.)
        alert('İş ilanı başarıyla oluşturuldu!');
    };

    // Adım başlıkları
    const steps = [
        { number: 1, title: 'İlan Detayları' },
        { number: 2, title: 'Beceriler ve Dosyalar' },
        { number: 3, title: 'Bütçe ve Zaman' },
    ];

    return (
        <>
            <Head>
                <title>İş İlanı Oluştur | Freelanza</title>
                <meta name="description" content="Yeni bir iş ilanı oluşturun ve yetenekli freelancerlarla çalışın." />
            </Head>

            <div className="bg-pastel-beige py-8 min-h-screen">
                <div className="container mx-auto px-4">
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">
                            İş İlanı Oluştur
                        </h1>
                        <p className="text-gray-600">
                            İlanınızı oluşturun ve en uygun freelancerları bulun.
                        </p>
                    </div>

                    {/* Adımlar */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <div className="flex flex-wrap justify-between mb-8">
                            {steps.map((step) => (
                                <div
                                    key={step.number}
                                    className={`flex items-center relative ${step.number < steps.length ? 'flex-1' : ''
                                        }`}
                                >
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold z-10 ${step.number <= activeStep ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                                            }`}
                                    >
                                        {step.number}
                                    </div>
                                    <div className="ml-4 hidden sm:block">
                                        <p className="font-medium text-gray-800">{step.title}</p>
                                    </div>
                                    {step.number < steps.length && (
                                        <div className={`absolute top-5 left-10 w-full h-0.5 z-0 ${step.number < activeStep ? 'bg-primary' : 'bg-gray-200'
                                            }`}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <form onSubmit={handleSubmit}>
                            {/* Adım 1: İlan Detayları */}
                            {activeStep === 1 && (
                                <div className="p-6 md:p-8">
                                    <h2 className="text-xl font-semibold mb-6">1. İlan Detayları</h2>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-gray-700 mb-2 font-medium">İlan Başlığı</label>
                                            <input
                                                type="text"
                                                className="input"
                                                placeholder="Örn: Web Sitesi Tasarımı"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 mb-2 font-medium">Kategori</label>
                                            <select className="input" required>
                                                <option value="">Kategori Seçin</option>
                                                {categories.map(category => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 mb-2 font-medium">İş Tipi</label>
                                            <div className="flex flex-wrap gap-4">
                                                <label className="flex items-center">
                                                    <input type="radio" name="projectType" value="fixed" className="mr-2" defaultChecked />
                                                    <span>Sabit Fiyatlı</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="radio" name="projectType" value="hourly" className="mr-2" />
                                                    <span>Saatlik</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 mb-2 font-medium">İş Açıklaması</label>
                                            <textarea
                                                className="input min-h-[200px]"
                                                placeholder="Projenizi detaylı bir şekilde açıklayın..."
                                                required
                                            ></textarea>
                                            <p className="text-xs text-gray-500 mt-1">
                                                İlan açıklamanız ne kadar detaylı olursa, o kadar kaliteli teklif alırsınız.
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 mb-2 font-medium">Lokasyon Kısıtlaması</label>
                                            <div className="flex flex-wrap gap-4">
                                                <label className="flex items-center">
                                                    <input type="radio" name="location" value="remote" className="mr-2" defaultChecked />
                                                    <span>Uzaktan (Herhangi bir yer)</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="radio" name="location" value="turkey" className="mr-2" />
                                                    <span>Sadece Türkiye</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex justify-end">
                                        <button
                                            type="button"
                                            className="btn-primary"
                                            onClick={() => setActiveStep(2)}
                                        >
                                            Devam Et
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Adım 2: Beceriler ve Dosyalar */}
                            {activeStep === 2 && (
                                <div className="p-6 md:p-8">
                                    <h2 className="text-xl font-semibold mb-6">2. Beceriler ve Dosyalar</h2>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-gray-700 mb-2 font-medium">Gerekli Beceriler</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    className="input pr-10"
                                                    placeholder="Beceri ekle..."
                                                    value={skillInput}
                                                    onChange={(e) => setSkillInput(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            handleSkillAdd(skillInput);
                                                        }
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary"
                                                    onClick={() => handleSkillAdd(skillInput)}
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {skillInput && filteredSkills.length > 0 && (
                                                <div className="mt-2 bg-white border border-gray-200 rounded-md shadow-sm max-h-48 overflow-y-auto">
                                                    {filteredSkills.slice(0, 5).map((skill, index) => (
                                                        <div
                                                            key={index}
                                                            className="p-2 hover:bg-gray-50 cursor-pointer"
                                                            onClick={() => handleSkillAdd(skill)}
                                                        >
                                                            {skill}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {selectedSkills.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-4">
                                                    {selectedSkills.map((skill, index) => (
                                                        <div
                                                            key={index}
                                                            className="bg-pastel-blue/20 text-primary px-3 py-1 rounded-full text-sm flex items-center"
                                                        >
                                                            {skill}
                                                            <button
                                                                type="button"
                                                                className="ml-2 text-primary/70 hover:text-primary"
                                                                onClick={() => handleSkillRemove(skill)}
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 mb-2 font-medium">Dosya Ekle (İsteğe Bağlı)</label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                                                <input
                                                    type="file"
                                                    id="file-upload"
                                                    className="hidden"
                                                    multiple
                                                    onChange={handleFileChange}
                                                />
                                                <label htmlFor="file-upload" className="cursor-pointer">
                                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                    <span className="mt-2 block text-sm font-medium text-gray-700">
                                                        Dosyaları buraya sürükleyin veya göz atın
                                                    </span>
                                                    <span className="mt-1 block text-xs text-gray-500">
                                                        En fazla 5 dosya, her biri 10MB'dan küçük olmalı
                                                    </span>
                                                </label>
                                            </div>

                                            {files.length > 0 && (
                                                <div className="mt-4 space-y-3">
                                                    {files.map((file, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center p-3 border border-gray-200 rounded-md"
                                                        >
                                                            <svg className="w-6 h-6 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                                            </svg>
                                                            <div className="flex-1">
                                                                <p className="font-medium text-sm text-gray-700">{file.name}</p>
                                                                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="text-gray-400 hover:text-red-500"
                                                                onClick={() => handleFileRemove(file.name)}
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-8 flex justify-between">
                                        <button
                                            type="button"
                                            className="btn-secondary opacity-70 hover:opacity-100"
                                            onClick={() => setActiveStep(1)}
                                        >
                                            Geri
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-primary"
                                            onClick={() => setActiveStep(3)}
                                        >
                                            Devam Et
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Adım 3: Bütçe ve Zaman */}
                            {activeStep === 3 && (
                                <div className="p-6 md:p-8">
                                    <h2 className="text-xl font-semibold mb-6">3. Bütçe ve Zaman</h2>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-gray-700 mb-2 font-medium">Bütçe</label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm mb-1">Minimum (₺)</label>
                                                    <input type="number" min="0" className="input" required />
                                                </div>
                                                <div>
                                                    <label className="block text-sm mb-1">Maksimum (₺)</label>
                                                    <input type="number" min="0" className="input" required />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 mb-2 font-medium">Teslim Süresi</label>
                                            <div className="flex gap-4">
                                                <input type="number" min="1" className="input w-24" required />
                                                <select className="input flex-1" required>
                                                    <option value="days">Gün</option>
                                                    <option value="weeks">Hafta</option>
                                                    <option value="months">Ay</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 mb-2 font-medium">
                                                Ödeme Tercihi
                                            </label>
                                            <div className="space-y-3">
                                                <label className="flex items-start p-4 border border-gray-200 rounded-md cursor-pointer hover:border-primary">
                                                    <input type="radio" name="paymentMethod" value="escrow" className="mt-1 mr-3" defaultChecked />
                                                    <div>
                                                        <span className="font-medium block mb-1">
                                                            Güvenli Ödeme (Tavsiye Edilir)
                                                        </span>
                                                        <span className="text-sm text-gray-600">
                                                            Ödemeniz iş tamamlanana kadar Freelanza tarafından güvenle tutulur.
                                                        </span>
                                                    </div>
                                                </label>
                                                <label className="flex items-start p-4 border border-gray-200 rounded-md cursor-pointer hover:border-primary">
                                                    <input type="radio" name="paymentMethod" value="direct" className="mt-1 mr-3" />
                                                    <div>
                                                        <span className="font-medium block mb-1">
                                                            Doğrudan Ödeme
                                                        </span>
                                                        <span className="text-sm text-gray-600">
                                                            Ödemenizi doğrudan freelancer'a yaparsınız. Daha az güvenli bir seçenektir.
                                                        </span>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="bg-pastel-blue/10 p-4 rounded-md">
                                            <h3 className="font-medium mb-2">İlanınız Yayınlandıktan Sonra</h3>
                                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                                <li>İlanınız tüm ilgili freelancerlara bildirilecek</li>
                                                <li>Teklifler aldıkça size e-posta ile bildirilecek</li>
                                                <li>Teklifleri inceleyin ve iletişime geçin</li>
                                                <li>En uygun freelancer'ı seçin ve projeye başlayın</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex justify-between">
                                        <button
                                            type="button"
                                            className="btn-secondary opacity-70 hover:opacity-100"
                                            onClick={() => setActiveStep(2)}
                                        >
                                            Geri
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn-primary"
                                        >
                                            İlanı Yayınla
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostJob; 