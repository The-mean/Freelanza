import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

interface FreelancerProfile {
    id: string;
    title: string;
    description: string;
    skills: string[];
    hourly_rate: number;
    availability: 'available' | 'partially-available' | 'not-available';
    portfolio_links: string[];
    user: {
        name: string;
        email: string;
    };
}

interface Props {
    profile: FreelancerProfile;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { data: profile, error } = await supabase
        .from('freelancer_profiles')
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

const FreelancerProfilePage: React.FC<Props> = ({ profile }) => {
    const router = useRouter();

    const getAvailabilityText = (status: string) => {
        switch (status) {
            case 'available':
                return 'Müsait';
            case 'partially-available':
                return 'Kısmen Müsait';
            case 'not-available':
                return 'Müsait Değil';
            default:
                return 'Bilinmiyor';
        }
    };

    const getAvailabilityColor = (status: string) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'partially-available':
                return 'bg-yellow-100 text-yellow-800';
            case 'not-available':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>{profile.user.name} | Freelanza</title>
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
                                    <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                                        <i className="fas fa-user text-4xl text-gray-400"></i>
                                    </div>
                                    <h1 className="mt-4 text-2xl font-bold text-gray-900">
                                        {profile.user.name}
                                    </h1>
                                    <p className="mt-2 text-lg text-gray-600">
                                        {profile.title}
                                    </p>
                                    <div className="mt-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAvailabilityColor(profile.availability)}`}>
                                            {getAvailabilityText(profile.availability)}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t">
                                    <div className="space-y-4">
                                        <div>
                                            <h2 className="text-sm font-medium text-gray-500">Saatlik Ücret</h2>
                                            <p className="mt-1 text-lg font-medium text-gray-900">
                                                {profile.hourly_rate} TRY
                                            </p>
                                        </div>
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
                            {/* Hakkında */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Hakkında</h2>
                                <p className="text-gray-600 whitespace-pre-line">
                                    {profile.description}
                                </p>
                            </div>

                            {/* Yetenekler */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Yetenekler</h2>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Portfolyo */}
                            {profile.portfolio_links.length > 0 && (
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Portfolyo</h2>
                                    <div className="space-y-2">
                                        {profile.portfolio_links.map((link, index) => (
                                            <a
                                                key={index}
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex items-center">
                                                    <i className="fas fa-external-link-alt text-gray-400 mr-2"></i>
                                                    <span className="text-blue-600 hover:text-blue-800">
                                                        {link}
                                                    </span>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default FreelancerProfilePage; 