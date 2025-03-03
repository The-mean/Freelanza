import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

interface EmployerProfile {
    id: string;
    company_name: string;
    company_size: string;
    industry: string;
    website: string;
    description: string;
    user: {
        name: string;
        email: string;
    };
}

interface Props {
    profile: EmployerProfile;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { data: profile, error } = await supabase
        .from('employer_profiles')
        .select(`
            *,
            user:users (
                name,
                email
            )
        `)
        .eq('id', params?.id)
        .single();

    if (error || !profile) {
        return {
            notFound: true
        };
    }

    return {
        props: {
            profile
        }
    };
};

const EmployerProfilePage: React.FC<Props> = ({ profile }) => {
    const router = useRouter();

    const getCompanySizeText = (size: string) => {
        switch (size) {
            case '1-10':
                return '1-10 çalışan';
            case '11-50':
                return '11-50 çalışan';
            case '51-200':
                return '51-200 çalışan';
            case '201-500':
                return '201-500 çalışan';
            case '500+':
                return '500+ çalışan';
            default:
                return 'Belirtilmemiş';
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>{profile.company_name} | Freelanza</title>
                <meta name="description" content={profile.description.slice(0, 160)} />
            </Head>

            <Header />

            <main className="flex-grow bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Sol profil kartı */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="text-center">
                                    <div className="w-32 h-32 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                                        <i className="fas fa-building text-4xl text-gray-400"></i>
                                    </div>
                                    <h1 className="mt-4 text-2xl font-bold text-gray-900">
                                        {profile.company_name}
                                    </h1>
                                    <p className="mt-2 text-lg text-gray-600">
                                        {profile.industry}
                                    </p>
                                </div>

                                <div className="mt-6 pt-6 border-t">
                                    <div className="space-y-4">
                                        <div>
                                            <h2 className="text-sm font-medium text-gray-500">Şirket Büyüklüğü</h2>
                                            <p className="mt-1 text-gray-900">
                                                {getCompanySizeText(profile.company_size)}
                                            </p>
                                        </div>
                                        {profile.website && (
                                            <div>
                                                <h2 className="text-sm font-medium text-gray-500">Website</h2>
                                                <a
                                                    href={profile.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-1 text-blue-600 hover:text-blue-800 block"
                                                >
                                                    {profile.website}
                                                </a>
                                            </div>
                                        )}
                                        <div>
                                            <h2 className="text-sm font-medium text-gray-500">İletişim</h2>
                                            <p className="mt-1 text-gray-900">
                                                {profile.user.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sağ içerik */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Şirket Hakkında */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Şirket Hakkında</h2>
                                <p className="text-gray-600 whitespace-pre-line">
                                    {profile.description}
                                </p>
                            </div>

                            {/* Aktif İş İlanları */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Aktif İş İlanları</h2>
                                <div className="space-y-4">
                                    {/* İş ilanları buraya gelecek */}
                                    <p className="text-gray-600">Henüz aktif iş ilanı bulunmuyor.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default EmployerProfilePage; 