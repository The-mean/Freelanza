import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

interface ProfileFormData {
    title: string;
    description: string;
    skills: string[];
    hourly_rate: number;
    availability: 'available' | 'partially-available' | 'not-available';
    portfolio_links: string[];
}

const EditProfilePage: React.FC = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [skillInput, setSkillInput] = useState('');
    const [portfolioInput, setPortfolioInput] = useState('');

    const [formData, setFormData] = useState<ProfileFormData>({
        title: '',
        description: '',
        skills: [],
        hourly_rate: 0,
        availability: 'available',
        portfolio_links: []
    });

    useEffect(() => {
        const loadProfile = async () => {
            if (session?.user) {
                const { data: profile } = await supabase
                    .from('freelancer_profiles')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .single();

                if (profile) {
                    setFormData({
                        title: profile.title,
                        description: profile.description,
                        skills: profile.skills,
                        hourly_rate: profile.hourly_rate,
                        availability: profile.availability,
                        portfolio_links: profile.portfolio_links
                    });
                }
            }
        };

        loadProfile();
    }, [session]);

    // Oturum kontrolü
    if (status === 'loading') {
        return <div>Yükleniyor...</div>;
    }

    if (!session || session.user.userType !== 'freelancer') {
        router.push('/auth/login');
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'hourly_rate' ? parseInt(value) || 0 : value
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

    const handlePortfolioAdd = () => {
        if (portfolioInput.trim() && !formData.portfolio_links.includes(portfolioInput.trim())) {
            setFormData(prev => ({
                ...prev,
                portfolio_links: [...prev.portfolio_links, portfolioInput.trim()]
            }));
            setPortfolioInput('');
        }
    };

    const handlePortfolioRemove = (link: string) => {
        setFormData(prev => ({
            ...prev,
            portfolio_links: prev.portfolio_links.filter(l => l !== link)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const { data: existingProfile } = await supabase
                .from('freelancer_profiles')
                .select('id')
                .eq('user_id', session.user.id)
                .single();

            let result;
            if (existingProfile) {
                // Profili güncelle
                result = await supabase
                    .from('freelancer_profiles')
                    .update({
                        title: formData.title,
                        description: formData.description,
                        skills: formData.skills,
                        hourly_rate: formData.hourly_rate,
                        availability: formData.availability,
                        portfolio_links: formData.portfolio_links,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existingProfile.id);
            } else {
                // Yeni profil oluştur
                result = await supabase
                    .from('freelancer_profiles')
                    .insert([{
                        user_id: session.user.id,
                        title: formData.title,
                        description: formData.description,
                        skills: formData.skills,
                        hourly_rate: formData.hourly_rate,
                        availability: formData.availability,
                        portfolio_links: formData.portfolio_links
                    }]);
            }

            if (result.error) throw result.error;

            // Başarılı güncelleme sonrası profil sayfasına yönlendir
            router.push(`/freelancers/${existingProfile?.id || result.data[0].id}`);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>Profili Düzenle | Freelanza</title>
                <meta name="description" content="Freelancer profilinizi düzenleyin" />
            </Head>

            <Header />

            <main className="flex-grow bg-gray-50 py-12">
                <div className="container max-w-3xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-8">
                            Profili Düzenle
                        </h1>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    Başlık
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
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Hakkında
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

                            <div>
                                <label htmlFor="hourly_rate" className="block text-sm font-medium text-gray-700 mb-1">
                                    Saatlik Ücret (TRY)
                                </label>
                                <input
                                    type="number"
                                    id="hourly_rate"
                                    name="hourly_rate"
                                    value={formData.hourly_rate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                    min="0"
                                />
                            </div>

                            <div>
                                <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
                                    Müsaitlik Durumu
                                </label>
                                <select
                                    id="availability"
                                    name="availability"
                                    value={formData.availability}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="available">Müsait</option>
                                    <option value="partially-available">Kısmen Müsait</option>
                                    <option value="not-available">Müsait Değil</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Portfolyo Linkleri
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="url"
                                        value={portfolioInput}
                                        onChange={(e) => setPortfolioInput(e.target.value)}
                                        className="flex-grow px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="https://..."
                                    />
                                    <button
                                        type="button"
                                        onClick={handlePortfolioAdd}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Ekle
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {formData.portfolio_links.map((link, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                                        >
                                            <a
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                {link}
                                            </a>
                                            <button
                                                type="button"
                                                onClick={() => handlePortfolioRemove(link)}
                                                className="text-red-400 hover:text-red-600"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
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
                                    {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
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

export default EditProfilePage; 