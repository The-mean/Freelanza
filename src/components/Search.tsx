import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

interface SearchFilters {
    category?: string;
    location?: string;
    type?: string;
    minBudget?: number;
    maxBudget?: number;
    skills?: string[];
}

interface Category {
    id: string;
    name: string;
}

const Search: React.FC = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    const [filters, setFilters] = useState<SearchFilters>({});
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState('');

    useEffect(() => {
        // URL'den filtreleri al
        const query = router.query;
        setFilters({
            category: query.category as string,
            location: query.location as string,
            type: query.type as string,
            minBudget: query.minBudget ? parseInt(query.minBudget as string) : undefined,
            maxBudget: query.maxBudget ? parseInt(query.maxBudget as string) : undefined,
            skills: query.skills ? (query.skills as string).split(',') : []
        });
        setSearchTerm(query.q as string || '');
        setSelectedSkills(query.skills ? (query.skills as string).split(',') : []);

        // Kategorileri yükle
        const loadCategories = async () => {
            const { data } = await supabase
                .from('categories')
                .select('*')
                .order('name');
            if (data) setCategories(data);
        };
        loadCategories();
    }, [router.query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const query = {
            ...router.query,
            q: searchTerm,
            ...filters,
            skills: selectedSkills.join(',')
        };

        // Boş değerleri temizle
        Object.keys(query).forEach(key => {
            if (!query[key]) delete query[key];
        });

        router.push({
            pathname: router.pathname,
            query
        });
    };

    const handleSkillAdd = () => {
        if (skillInput.trim() && !selectedSkills.includes(skillInput.trim())) {
            setSelectedSkills(prev => [...prev, skillInput.trim()]);
            setSkillInput('');
        }
    };

    const handleSkillRemove = (skill: string) => {
        setSelectedSkills(prev => prev.filter(s => s !== skill));
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex gap-4">
                    <div className="flex-grow">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="İş ilanı veya freelancer ara..."
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Ara
                    </button>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                        {isAdvancedOpen ? 'Gelişmiş Filtreleri Gizle' : 'Gelişmiş Filtreler'}
                    </button>
                    {Object.keys(filters).some(key => filters[key]) && (
                        <button
                            type="button"
                            onClick={() => {
                                setFilters({});
                                setSelectedSkills([]);
                                router.push(router.pathname);
                            }}
                            className="text-red-600 hover:text-red-800 text-sm"
                        >
                            Filtreleri Temizle
                        </button>
                    )}
                </div>

                {isAdvancedOpen && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kategori
                            </label>
                            <select
                                value={filters.category || ''}
                                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Tüm Kategoriler</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Lokasyon
                            </label>
                            <input
                                type="text"
                                value={filters.location || ''}
                                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                                placeholder="Şehir veya ülke"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Çalışma Şekli
                            </label>
                            <select
                                value={filters.type || ''}
                                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Tümü</option>
                                <option value="full-time">Tam Zamanlı</option>
                                <option value="part-time">Yarı Zamanlı</option>
                                <option value="project-based">Proje Bazlı</option>
                                <option value="hourly">Saatlik</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Minimum Bütçe
                            </label>
                            <input
                                type="number"
                                value={filters.minBudget || ''}
                                onChange={(e) => setFilters(prev => ({ ...prev, minBudget: parseInt(e.target.value) || undefined }))}
                                placeholder="TRY"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Maksimum Bütçe
                            </label>
                            <input
                                type="number"
                                value={filters.maxBudget || ''}
                                onChange={(e) => setFilters(prev => ({ ...prev, maxBudget: parseInt(e.target.value) || undefined }))}
                                placeholder="TRY"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Yetenekler
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSkillAdd())}
                                    placeholder="Yetenek ekle"
                                    className="flex-grow px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={handleSkillAdd}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Ekle
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {selectedSkills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm flex items-center"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => handleSkillRemove(skill)}
                                            className="ml-2 text-blue-400 hover:text-blue-600"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Search; 