import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';

// Fake job data for now
const MOCK_JOBS = [
    {
        id: 1,
        title: 'React Native Mobil Uygulama Geliştiricisi',
        description: 'Mevcut bir e-ticaret platformu için kullanıcı dostu bir mobil uygulama geliştirmek.',
        budget: 10000,
        createdAt: '2023-11-15',
        company: 'XYZ Teknoloji',
        category: 'Yazılım Geliştirme',
        skills: ['React Native', 'JavaScript', 'Firebase', 'REST API'],
        location: 'Uzaktan'
    },
    {
        id: 2,
        title: 'WordPress Web Sitesi Geliştirme',
        description: 'Küçük bir işletme için WordPress tabanlı kurumsal web sitesi tasarımı ve geliştirmesi.',
        budget: 5000,
        createdAt: '2023-11-20',
        company: 'ABC Digital',
        category: 'Web Geliştirme',
        skills: ['WordPress', 'PHP', 'CSS', 'JavaScript'],
        location: 'Uzaktan'
    },
    {
        id: 3,
        title: 'Mobil Uygulama UI/UX Tasarımı',
        description: 'Fitness uygulaması için kullanıcı deneyimi ve arayüz tasarımı.',
        budget: 8000,
        createdAt: '2023-11-22',
        company: 'FitTech',
        category: 'UI/UX Tasarım',
        skills: ['Figma', 'Adobe XD', 'UI Design', 'Mobile App Design'],
        location: 'Uzaktan'
    },
    {
        id: 4,
        title: 'E-Ticaret SEO Optimizasyonu',
        description: 'Mevcut bir e-ticaret sitesi için SEO stratejisi oluşturma ve uygulama.',
        budget: 3500,
        createdAt: '2023-11-25',
        company: 'ShopSmart',
        category: 'Dijital Pazarlama',
        skills: ['SEO', 'Google Analytics', 'Keyword Research', 'Link Building'],
        location: 'Uzaktan'
    },
    {
        id: 5,
        title: 'Node.js Backend Geliştirici',
        description: 'Sosyal medya uygulaması için ölçeklenebilir bir backend API geliştirilmesi.',
        budget: 15000,
        createdAt: '2023-11-28',
        company: 'SocialHub',
        category: 'Backend Geliştirme',
        skills: ['Node.js', 'Express', 'MongoDB', 'GraphQL', 'JWT'],
        location: 'İstanbul'
    }
];

// List of categories and skills for filters
const CATEGORIES = ['Tümü', 'Yazılım Geliştirme', 'Web Geliştirme', 'UI/UX Tasarım', 'Dijital Pazarlama', 'Backend Geliştirme'];
const SKILLS = ['React Native', 'JavaScript', 'Firebase', 'REST API', 'WordPress', 'PHP', 'CSS', 'Figma', 'Adobe XD', 'UI Design', 'SEO', 'Google Analytics', 'Node.js', 'Express', 'MongoDB', 'GraphQL'];

const Jobs: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tümü');
    const [budget, setBudget] = useState<[number, number]>([0, 20000]);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

    const handleSkillToggle = (skill: string) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(selectedSkills.filter(s => s !== skill));
        } else {
            setSelectedSkills([...selectedSkills, skill]);
        }
    };

    // Filter jobs based on search, category, budget and skills
    const filteredJobs = MOCK_JOBS.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Tümü' || job.category === selectedCategory;
        const matchesBudget = job.budget >= budget[0] && job.budget <= budget[1];
        const matchesSkills = selectedSkills.length === 0 ||
            selectedSkills.some(skill => job.skills.includes(skill));

        return matchesSearch && matchesCategory && matchesBudget && matchesSkills;
    });

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="md:flex md:items-center md:justify-between mb-6">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-3xl font-bold leading-tight text-neutral-900">İş İlanları</h1>
                        <p className="mt-1 text-lg text-neutral-500">
                            Yeteneklerinize uygun iş fırsatları bulun ve tekliflerinizi gönderin
                        </p>
                    </div>
                    <div className="mt-4 flex md:mt-0 md:ml-4">
                        {/* If we had user authentication, we could show different content for employers */}
                        <Link to="/post-job">
                            <Button variant="primary">İş İlanı Yayınla</Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Filters */}
                    <div className="lg:col-span-1">
                        <div className="card p-4">
                            <h3 className="text-lg font-medium text-neutral-900 mb-4">Filtreler</h3>

                            <div className="mb-4">
                                <label htmlFor="search" className="block text-sm font-medium text-neutral-700 mb-1">
                                    Arama
                                </label>
                                <input
                                    type="text"
                                    id="search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="İş başlığı veya açıklama"
                                    className="input"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-1">
                                    Kategori
                                </label>
                                <select
                                    id="category"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="input"
                                >
                                    {CATEGORIES.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <h4 className="block text-sm font-medium text-neutral-700 mb-1">Bütçe</h4>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-neutral-500">₺{budget[0]}</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="20000"
                                        step="1000"
                                        value={budget[1]}
                                        onChange={(e) => setBudget([budget[0], parseInt(e.target.value)])}
                                        className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="text-sm text-neutral-500">₺{budget[1]}</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="block text-sm font-medium text-neutral-700 mb-2">Beceriler</h4>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {SKILLS.map(skill => (
                                        <div key={skill} className="flex items-center">
                                            <input
                                                id={`skill-${skill}`}
                                                type="checkbox"
                                                checked={selectedSkills.includes(skill)}
                                                onChange={() => handleSkillToggle(skill)}
                                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                                            />
                                            <label htmlFor={`skill-${skill}`} className="ml-2 text-sm text-neutral-700">
                                                {skill}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory('Tümü');
                                        setBudget([0, 20000]);
                                        setSelectedSkills([]);
                                    }}
                                    className="w-full"
                                >
                                    Filtreleri Temizle
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Job Listings */}
                    <div className="lg:col-span-3">
                        <div className="space-y-4">
                            {filteredJobs.length > 0 ? (
                                filteredJobs.map(job => (
                                    <div key={job.id} className="card p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mb-2">
                                                    {job.category}
                                                </span>
                                                <h3 className="text-lg font-medium text-neutral-900">{job.title}</h3>
                                                <p className="mt-1 text-sm text-neutral-500 line-clamp-2">
                                                    {job.description}
                                                </p>
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {job.skills.slice(0, 3).map(skill => (
                                                        <span key={skill} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-800">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                    {job.skills.length > 3 && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-800">
                                                            +{job.skills.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-xl font-bold text-primary-600">₺{job.budget.toLocaleString()}</span>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-neutral-200"></div>
                                                <div className="ml-2">
                                                    <p className="text-sm font-medium text-neutral-900">{job.company}</p>
                                                    <p className="text-xs text-neutral-500">{job.location} • {new Date(job.createdAt).toLocaleDateString('tr-TR')}</p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Link to={`/jobs/${job.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        Detaylar
                                                    </Button>
                                                </Link>
                                                <Link to={`/jobs/${job.id}/apply`}>
                                                    <Button variant="primary" size="sm">
                                                        Teklif Ver
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="card p-8 text-center">
                                    <svg className="h-12 w-12 text-neutral-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="mt-2 text-lg font-medium text-neutral-900">Sonuç Bulunamadı</h3>
                                    <p className="mt-1 text-sm text-neutral-500">
                                        Aramanıza uygun iş bulunamadı. Lütfen filtrelerinizi değiştirip tekrar deneyin.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Jobs; 