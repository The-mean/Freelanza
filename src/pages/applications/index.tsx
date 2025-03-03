import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface JobApplication {
    id: string;
    job_id: string;
    status: 'pending' | 'accepted' | 'rejected';
    created_at: string;
    job: {
        title: string;
        company: string;
        budget: number;
    };
    freelancer: {
        full_name: string;
        title: string;
        user_id: string;
    };
}

interface User {
    id: string;
    userType: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

const ApplicationsPage: React.FC = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!session) return;

        const loadApplications = async () => {
            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('job_applications')
                    .select(`
                        *,
                        job:jobs (
                            title,
                            company,
                            budget
                        ),
                        freelancer:freelancer_profiles (
                            full_name,
                            title,
                            user_id
                        )
                    `)
                    .eq(session.user.userType === 'employer' ? 'employer_id' : 'freelancer_id', (session.user as User).id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setApplications(data || []);
            } catch (error) {
                console.error('Error loading applications:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadApplications();
    }, [session]);

    const handleStatusUpdate = async (applicationId: string, status: 'accepted' | 'rejected') => {
        setIsUpdating(applicationId);
        try {
            const response = await fetch('/api/applications/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationId, status })
            });

            if (!response.ok) throw new Error('Failed to update status');

            setApplications(apps =>
                apps.map(app =>
                    app.id === applicationId ? { ...app, status } : app
                )
            );
        } catch (error) {
            console.error('Error updating application status:', error);
        } finally {
            setIsUpdating(null);
        }
    };

    // Oturum kontrolü
    if (status === 'loading' || isLoading) {
        return <div>Yükleniyor...</div>;
    }

    if (!session) {
        router.push('/auth/login');
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>Başvurular | Freelanza</title>
                <meta name="description" content="İş başvurularını yönetin" />
            </Head>

            <Header />

            <main className="flex-grow bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl font-bold text-gray-900 mb-8">
                        {session.user.userType === 'employer' ? 'Gelen Başvurular' : 'Başvurularım'}
                    </h1>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        {applications.length > 0 ? (
                            applications.map((application) => (
                                <Card key={application.id} className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-xl font-semibold mb-2">{application.job.title}</h2>
                                            <p className="text-gray-600 mb-1">{application.job.company}</p>
                                            <p className="text-gray-600 mb-2">Bütçe: ₺{application.job.budget.toLocaleString()}</p>

                                            {session.user.userType === 'employer' && (
                                                <div className="mt-2">
                                                    <p className="font-medium">{application.freelancer.full_name}</p>
                                                    <p className="text-gray-600">{application.freelancer.title}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            {application.status === 'pending' && session.user.userType === 'employer' ? (
                                                <>
                                                    <Button
                                                        onClick={() => handleStatusUpdate(application.id, 'accepted')}
                                                        disabled={!!isUpdating}
                                                        className="bg-green-500 hover:bg-green-600"
                                                    >
                                                        {isUpdating === application.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            'Kabul Et'
                                                        )}
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleStatusUpdate(application.id, 'rejected')}
                                                        disabled={!!isUpdating}
                                                        variant="destructive"
                                                    >
                                                        {isUpdating === application.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            'Reddet'
                                                        )}
                                                    </Button>
                                                </>
                                            ) : (
                                                <span className={`
                                                    px-3 py-1 rounded-full text-sm font-medium
                                                    ${application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                        application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'}
                                                `}>
                                                    {application.status === 'accepted' ? 'Kabul Edildi' :
                                                        application.status === 'rejected' ? 'Reddedildi' :
                                                            'Beklemede'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                                <p className="text-gray-600">
                                    {session.user.userType === 'employer'
                                        ? 'Henüz hiç başvuru almadınız.'
                                        : 'Henüz hiç başvuru yapmadınız.'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ApplicationsPage; 