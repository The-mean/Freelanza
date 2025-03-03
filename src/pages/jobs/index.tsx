import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// İş ilanı tipi
interface Job {
    id: number;
    title: string;
    company: string;
    location: string;
    type: 'full-time' | 'part-time' | 'project-based' | 'hourly';
    category: string;
    skills: string[];
    budget: {
        min: number;
        max: number;
        currency: string;
    };
    description: string;
    requirements: string[];
    postedAt: string;
    deadline: string;
    status: 'active' | 'closed';
    applicantsCount: number;
}

// Örnek iş ilanları verisi
const SAMPLE_JOBS: Job[] = [
    {
        id: 1,
        title: 'Senior React Developer',
        company: 'Tech Solutions Ltd.',
        location: 'Remote',
        type: 'full-time',
        category: 'Web Development',
        skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
        budget: {
            min: 8000,
            max: 15000,
            currency: 'TRY'
        },
        description: 'Deneyimli bir React geliştirici arıyoruz. E-ticaret projemizde çalışacak, modern web teknolojilerine hakim bir takım arkadaşı aramaktayız.',
        requirements: [
            'En az 4 yıl React deneyimi',
            'TypeScript ve modern JavaScript bilgisi',
            'Node.js ve REST API deneyimi',
            'AWS veya benzeri cloud servis deneyimi',
            'Agile/Scrum metodolojilerine aşinalık'
        ],
        postedAt: '2024-03-15',
        deadline: '2024-04-15',
        status: 'active',
        applicantsCount: 12
    },
    {
        id: 2,
        title: 'UI/UX Designer',
        company: 'Creative Agency',
        location: 'İstanbul',
        type: 'project-based',
        category: 'Design',
        skills: ['Figma', 'Adobe XD', 'Sketch', 'UI Design', 'UX Research'],
        budget: {
            min: 20000,
            max: 35000,
            currency: 'TRY'
        },
        description: 'Mobil uygulamamız için kullanıcı deneyimi ve arayüz tasarımı yapacak designer arayışımız bulunmaktadır.',
        requirements: [
            'En az 3 yıl UI/UX tasarım deneyimi',
            'Figma ve Adobe Creative Suite hakimiyeti',
            'Mobile-first tasarım yaklaşımı',
            'User research ve testing deneyimi'
        ],
        postedAt: '2024-03-14',
        deadline: '2024-04-01',
        status: 'active',
        applicantsCount: 8
    },
    {
        id: 3,
        title: 'WordPress Developer',
        company: 'Digital Marketing Co.',
        location: 'Hybrid - Ankara',
        type: 'part-time',
        category: 'Web Development',
        skills: ['WordPress', 'PHP', 'MySQL', 'HTML/CSS', 'JavaScript'],
        budget: {
            min: 5000,
            max: 8000,
            currency: 'TRY'
        },
        description: 'WordPress tabanlı web sitelerimizin geliştirilmesi ve yönetimi için part-time geliştirici arayışımız bulunmaktadır.',
        requirements: [
            'WordPress tema ve plugin geliştirme deneyimi',
            'PHP ve MySQL bilgisi',
            'Responsive tasarım tecrübesi',
            'SEO best practices bilgisi'
        ],
        postedAt: '2024-03-13',
        deadline: '2024-03-30',
        status: 'active',
        applicantsCount: 15
    }
];

export default function Jobs() {
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>(SAMPLE_JOBS);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>(SAMPLE_JOBS);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [sortBy, setSortBy] = useState('latest');

    // Kategoriler
    const categories = ['Web Development', 'Mobile Development', 'Design', 'Marketing', 'Writing', 'Admin Support'];

    // İş türleri
    const jobTypes = ['full-time', 'part-time', 'project-based', 'hourly'];

    // Lokasyonlar
    const locations = ['Remote', 'İstanbul', 'Ankara', 'İzmir', 'Hybrid'];

    // Filtreleme ve arama
    useEffect(() => {
        let result = [...jobs];

        // Arama terimi filtresi
        if (searchTerm) {
            result = result.filter(job =>
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Kategori filtresi
        if (selectedCategory) {
            result = result.filter(job => job.category === selectedCategory);
        }

        // İş türü filtresi
        if (selectedType) {
            result = result.filter(job => job.type === selectedType);
        }

        // Lokasyon filtresi
        if (selectedLocation) {
            result = result.filter(job => job.location.includes(selectedLocation));
        }

        // Sıralama
        result.sort((a, b) => {
            switch (sortBy) {
                case 'latest':
                    return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
                case 'oldest':
                    return new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime();
                case 'budget-high':
                    return b.budget.max - a.budget.max;
                case 'budget-low':
                    return a.budget.min - b.budget.min;
                default:
                    return 0;
            }
        });

        setFilteredJobs(result);
    }, [jobs, searchTerm, selectedCategory, selectedType, selectedLocation, sortBy]);

    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>İş İlanları | Freelanza</title>
                <meta name="description" content="Freelanza'da freelancer ve uzman arayışındaki iş ilanlarını keşfedin." />
            </Head>

            <Header />

            <main className="flex-grow bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    {/* Üst başlık */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">İş İlanları</h1>
                            <p className="text-gray-600 mt-1">
                                Yeteneklerinize uygun işleri keşfedin
                            </p>
                        </div>
                        <Link href="/jobs/post">
                            <a className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                <i className="fas fa-plus mr-2"></i>
                                İlan Ver
                            </a>
                        </Link>
                    </div>

                    {/* Filtreler ve arama */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {/* Arama */}
                            <div className="lg:col-span-2">
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="İş ara..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                                </div>
                            </div>

                            {/* Kategori filtresi */}
                            <div>
                                <select
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">Tüm Kategoriler</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            {/* İş türü filtresi */}
                            <div>
                                <select
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                >
                                    <option value="">Tüm İş Türleri</option>
                                    {jobTypes.map(type => (
                                        <option key={type} value={type}>
                                            {type === 'full-time' ? 'Tam Zamanlı' :
                                                type === 'part-time' ? 'Yarı Zamanlı' :
                                                    type === 'project-based' ? 'Proje Bazlı' :
                                                        'Saatlik'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Lokasyon filtresi */}
                            <div>
                                <select
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                >
                                    <option value="">Tüm Lokasyonlar</option>
                                    {locations.map(location => (
                                        <option key={location} value={location}>{location}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Sıralama ve sonuç sayısı */}
                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                            <div className="text-gray-600">
                                {filteredJobs.length} ilan bulundu
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-600">Sırala:</span>
                                <select
                                    className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="latest">En Yeni</option>
                                    <option value="oldest">En Eski</option>
                                    <option value="budget-high">En Yüksek Bütçe</option>
                                    <option value="budget-low">En Düşük Bütçe</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* İş ilanları listesi */}
                    <div className="space-y-4">
                        {filteredJobs.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                                <i className="fas fa-search text-gray-400 text-4xl mb-4"></i>
                                <h3 className="text-lg font-medium text-gray-900">İlan Bulunamadı</h3>
                                <p className="text-gray-600 mt-2">
                                    Arama kriterlerinize uygun ilan bulunamadı. Lütfen farklı filtreler deneyin.
                                </p>
                            </div>
                        ) : (
                            filteredJobs.map(job => (
                                <div key={job.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <Link href={`/jobs/${job.id}`}>
                                                <a className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                                                    {job.title}
                                                </a>
                                            </Link>
                                            <div className="mt-2 space-y-2">
                                                <p className="text-gray-600">
                                                    <i className="fas fa-building mr-2"></i>
                                                    {job.company}
                                                </p>
                                                <p className="text-gray-600">
                                                    <i className="fas fa-map-marker-alt mr-2"></i>
                                                    {job.location}
                                                </p>
                                                <div className="flex items-center space-x-4">
                                                    <span className="text-gray-600">
                                                        <i className="fas fa-clock mr-2"></i>
                                                        {job.type === 'full-time' ? 'Tam Zamanlı' :
                                                            job.type === 'part-time' ? 'Yarı Zamanlı' :
                                                                job.type === 'project-based' ? 'Proje Bazlı' :
                                                                    'Saatlik'}
                                                    </span>
                                                    <span className="text-gray-600">
                                                        <i className="fas fa-tag mr-2"></i>
                                                        {job.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-semibold text-gray-900">
                                                {job.budget.min.toLocaleString('tr-TR')} - {job.budget.max.toLocaleString('tr-TR')} {job.budget.currency}
                                            </div>
                                            <div className="text-sm text-gray-500 mt-2">
                                                {new Date(job.postedAt).toLocaleDateString('tr-TR')}
                                            </div>
                                            <div className="mt-4">
                                                <Link href={`/jobs/${job.id}`}>
                                                    <a className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                                                        Detayları Gör
                                                        <i className="fas fa-arrow-right ml-2"></i>
                                                    </a>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Yetenekler */}
                                    <div className="mt-4 pt-4 border-t">
                                        <div className="flex flex-wrap gap-2">
                                            {job.skills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Alt bilgiler */}
                                    <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm text-gray-500">
                                        <div>
                                            <i className="fas fa-users mr-2"></i>
                                            {job.applicantsCount} başvuru
                                        </div>
                                        <div>
                                            <i className="fas fa-calendar-alt mr-2"></i>
                                            Son başvuru: {new Date(job.deadline).toLocaleDateString('tr-TR')}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
} 