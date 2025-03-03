import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

interface JobFormData {
    title: string;
    company: string;
    location: string;
    type: 'full-time' | 'part-time' | 'project-based' | 'hourly';
    category: string;
    skills: string[];
    budgetMin: number;
    budgetMax: number;
    description: string;
    requirements: string[];
    deadline: string;
}

const CreateJobPage: React.FC = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [skillInput, setSkillInput] = useState('');
    const [requirementInput, setRequirementInput] = useState('');

    const [formData, setFormData] = useState<JobFormData>({
        title: '',
        company: '',
        location: '',
        type: 'full-time',
        category: '',
        skills: [],
        budgetMin: 0,
        budgetMax: 0,
        description: '',
        requirements: [],
        deadline: ''
    });

    // Oturum kontrolü
    if (status === 'loading') {
        return <div>Yükleniyor...</div>;
    }

    if (!session || session.user.userType !== 'employer') {
        router.push('/auth/login');
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSkillAdd = () => {
        if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, skillInput.trim()]
            }));
            setSkillInput('');
        }
    };

    const handleSkillRemove = (skill: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skill)
        }));
    };

    const handleRequirementAdd = () => {
        if (requirementInput.trim() && !formData.requirements.includes(requirementInput.trim())) {
            setFormData(prev => ({
                ...prev,
                requirements: [...prev.requirements, requirementInput.trim()]
            }));
            setRequirementInput('');
        }
    };

    const handleRequirementRemove = (requirement: string) => {
        setFormData(prev => ({
            ...prev,
            requirements: prev.requirements.filter(r => r !== requirement)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Form validasyonu
            if (formData.budgetMin > formData.budgetMax) {
                throw new Error('Minimum bütçe, maksimum bütçeden büyük olamaz');
            }

            if (formData.skills.length === 0) {
                throw new Error('En az bir yetenek eklemelisiniz');
            }

            if (formData.requirements.length === 0) {
                throw new Error('En az bir gereksinim eklemelisiniz');
            }

            // İş ilanını oluştur
            const { data: job, error: jobError } = await supabase
                .from('jobs')
                .insert([
                    {
                        title: formData.title,
                        company: formData.company,
                        location: formData.location,
                        type: formData.type,
                        category: formData.category,
                        skills: formData.skills,
                        budget_min: formData.budgetMin,
                        budget_max: formData.budgetMax,
                        description: formData.description,
                        requirements: formData.requirements,
                        deadline: new Date(formData.deadline).toISOString(),
                        employer_id: session.user.id
                    }
                ])
                .select()
                .single();

            if (jobError) throw jobError;

            // Başarılı oluşturma sonrası iş ilanı sayfasına yönlendir
            router.push(`/jobs/${job.id}`);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>İş İlanı Oluştur | Freelanza</title>
                <meta name="description" content="Yeni bir iş ilanı oluşturun" />
            </Head>

            <Header />

            <main className="flex-grow bg-gray-50 py-12">
                <div className="container max-w-3xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-8">
                            Yeni İş İlanı Oluştur
                        </h1>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    İlan Başlığı
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                                    Şirket Adı
                                </label>
                                <input
                                    type="text"
                                    id="company"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                    Lokasyon
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                                    Çalışma Şekli
                                </label>
                                <select
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="full-time">Tam Zamanlı</option>
                                    <option value="part-time">Yarı Zamanlı</option>
                                    <option value="project-based">Proje Bazlı</option>
                                    <option value="hourly">Saatlik</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                    Kategori
                                </label>
                                <input
                                    type="text"
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Yetenekler
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        className="flex-grow px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Yetenek ekle"
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
                                    {formData.skills.map((skill, index) => (
                                        <span
                                            key={index}
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

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="budgetMin" className="block text-sm font-medium text-gray-700 mb-1">
                                        Minimum Bütçe (TRY)
                                    </label>
                                    <input
                                        type="number"
                                        id="budgetMin"
                                        name="budgetMin"
                                        value={formData.budgetMin}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="budgetMax" className="block text-sm font-medium text-gray-700 mb-1">
                                        Maksimum Bütçe (TRY)
                                    </label>
                                    <input
                                        type="number"
                                        id="budgetMax"
                                        name="budgetMax"
                                        value={formData.budgetMax}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    İş Açıklaması
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={6}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Gereksinimler
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={requirementInput}
                                        onChange={(e) => setRequirementInput(e.target.value)}
                                        className="flex-grow px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Gereksinim ekle"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRequirementAdd}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Ekle
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {formData.requirements.map((requirement, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                                        >
                                            <span className="text-sm text-gray-700">{requirement}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRequirementRemove(requirement)}
                                                className="text-red-400 hover:text-red-600"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                                    Son Başvuru Tarihi
                                </label>
                                <input
                                    type="date"
                                    id="deadline"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {isLoading ? 'Oluşturuluyor...' : 'İlanı Yayınla'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CreateJobPage; 