import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

interface ProfileFormData {
    company_name: string;
    company_size: string;
    industry: string;
    website: string;
    description: string;
}

const EditProfilePage: React.FC = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<ProfileFormData>({
        company_name: '',
        company_size: '1-10',
        industry: '',
        website: '',
        description: ''
    });

    useEffect(() => {
        const loadProfile = async () => {
            if (session?.user) {
                const { data: profile } = await supabase
                    .from('employer_profiles')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .single();

                if (profile) {
                    setFormData({
                        company_name: profile.company_name,
                        company_size: profile.company_size,
                        industry: profile.industry,
                        website: profile.website || '',
                        description: profile.description
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const { data: existingProfile } = await supabase
                .from('employer_profiles')
                .select('id')
                .eq('user_id', session.user.id)
                .single();

            let result;
            if (existingProfile) {
                // Profili güncelle
                result = await supabase
                    .from('employer_profiles')
                    .update({
                        company_name: formData.company_name,
                        company_size: formData.company_size,
                        industry: formData.industry,
                        website: formData.website || null,
                        description: formData.description,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existingProfile.id);
            } else {
                // Yeni profil oluştur
                result = await supabase
                    .from('employer_profiles')
                    .insert([{
                        user_id: session.user.id,
                        company_name: formData.company_name,
                        company_size: formData.company_size,
                        industry: formData.industry,
                        website: formData.website || null,
                        description: formData.description
                    }]);
            }

            if (result.error) throw result.error;

            // Başarılı güncelleme sonrası profil sayfasına yönlendir
            router.push(`/employers/${existingProfile?.id || result.data[0].id}`);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>Şirket Profilini Düzenle | Freelanza</title>
                <meta name="description" content="Şirket profilinizi düzenleyin" />
            </Head>

            <Header />

            <main className="flex-grow bg-gray-50 py-12">
                <div className="container max-w-3xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-8">
                            Şirket Profilini Düzenle
                        </h1>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Şirket Adı
                                </label>
                                <input
                                    type="text"
                                    id="company_name"
                                    name="company_name"
                                    value={formData.company_name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="company_size" className="block text-sm font-medium text-gray-700 mb-1">
                                    Şirket Büyüklüğü
                                </label>
                                <select
                                    id="company_size"
                                    name="company_size"
                                    value={formData.company_size}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="1-10">1-10 çalışan</option>
                                    <option value="11-50">11-50 çalışan</option>
                                    <option value="51-200">51-200 çalışan</option>
                                    <option value="201-500">201-500 çalışan</option>
                                    <option value="500+">500+ çalışan</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                                    Sektör
                                </label>
                                <input
                                    type="text"
                                    id="industry"
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                                    Website
                                </label>
                                <input
                                    type="url"
                                    id="website"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Şirket Hakkında
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