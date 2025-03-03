import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

interface JobApplication {
    id: string;
    job: {
        title: string;
        company: string;
        status: string;
    };
    created_at: string;
    status: 'pending' | 'accepted' | 'rejected';
}

interface Job {
    id: string;
    title: string;
    applications_count: number;
    status: 'active' | 'closed';
    created_at: string;
}

interface Project {
    id: string;
    title: string;
    status: 'in_progress' | 'completed';
    deadline: string;
}

const DashboardPage: React.FC = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            if (session?.user) {
                if (session.user.userType === 'freelancer') {
                    // Freelancer'ın başvurularını ve projelerini yükle
                    const { data: applicationsData } = await supabase
                        .from('job_applications')
                        .select(`
                            id,
                            job:jobs (
                                title,
                                company,
                                status
                            ),
                            created_at,
                            status
                        `)
                        .eq('freelancer_id', session.user.id)
                        .order('created_at', { ascending: false })
                        .limit(5);

                    const { data: projectsData } = await supabase
                        .from('projects')
                        .select('*')
                        .eq('freelancer_id', session.user.id)
                        .order('created_at', { ascending: false })
                        .limit(5);

                    if (applicationsData) setApplications(applicationsData);
                    if (projectsData) setProjects(projectsData);
                } else if (session.user.userType === 'employer') {
                    // İşverenin iş ilanlarını ve projelerini yükle
                    const { data: jobsData } = await supabase
                        .from('jobs')
                        .select(`
                            id,
                            title,
                            applications_count,
                            status,
                            created_at
                        `)
                        .eq('employer_id', session.user.id)
                        .order('created_at', { ascending: false })
                        .limit(5);

                    const { data: projectsData } = await supabase
                        .from('projects')
                        .select('*')
                        .eq('employer_id', session.user.id)
                        .order('created_at', { ascending: false })
                        .limit(5);

                    if (jobsData) setJobs(jobsData);
                    if (projectsData) setProjects(projectsData);
                }
            }
            setIsLoading(false);
        };

        loadDashboardData();
    }, [session]);

    // Oturum kontrolü
    if (status === 'loading' || isLoading) {
        return <div>Yükleniyor...</div>;
    }

    if (!session) {
        router.push('/auth/login');
        return null;
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'closed':
                return 'bg-gray-100 text-gray-800';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Beklemede';
            case 'accepted':
                return 'Kabul Edildi';
            case 'rejected':
                return 'Reddedildi';
            case 'active':
                return 'Aktif';
            case 'closed':
                return 'Kapalı';
            case 'in_progress':
                return 'Devam Ediyor';
            case 'completed':
                return 'Tamamlandı';
            default:
                return status;
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>Dashboard | Freelanza</title>
                <meta name="description" content="Freelanza dashboard" />
            </Head>

            <Header />

            <main className="flex-grow bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {session.user.userType === 'freelancer' ? (
                            <>
                                {/* Başvurular */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Son Başvurularım
                                        </h2>
                                        <button
                                            onClick={() => router.push('/applications')}
                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                        >
                                            Tümünü Gör
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {applications.length > 0 ? (
                                            applications.map((application) => (
                                                <div
                                                    key={application.id}
                                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                                >
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">
                                                            {application.job.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {application.job.company}
                                                        </p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(application.status)}`}>
                                                        {getStatusText(application.status)}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-600">Henüz başvuru yapmadınız.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Aktif Projeler */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Aktif Projelerim
                                        </h2>
                                        <button
                                            onClick={() => router.push('/projects')}
                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                        >
                                            Tümünü Gör
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {projects.length > 0 ? (
                                            projects.map((project) => (
                                                <div
                                                    key={project.id}
                                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                                >
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">
                                                            {project.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            Teslim: {new Date(project.deadline).toLocaleDateString('tr-TR')}
                                                        </p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(project.status)}`}>
                                                        {getStatusText(project.status)}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-600">Henüz aktif projeniz bulunmuyor.</p>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* İş İlanları */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            İş İlanlarım
                                        </h2>
                                        <button
                                            onClick={() => router.push('/jobs/create')}
                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                        >
                                            Yeni İlan Oluştur
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {jobs.length > 0 ? (
                                            jobs.map((job) => (
                                                <div
                                                    key={job.id}
                                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                                >
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">
                                                            {job.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {job.applications_count} başvuru
                                                        </p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(job.status)}`}>
                                                        {getStatusText(job.status)}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-600">Henüz iş ilanı oluşturmadınız.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Aktif Projeler */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Aktif Projeler
                                        </h2>
                                        <button
                                            onClick={() => router.push('/projects')}
                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                        >
                                            Tümünü Gör
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {projects.length > 0 ? (
                                            projects.map((project) => (
                                                <div
                                                    key={project.id}
                                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                                >
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">
                                                            {project.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            Teslim: {new Date(project.deadline).toLocaleDateString('tr-TR')}
                                                        </p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(project.status)}`}>
                                                        {getStatusText(project.status)}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-600">Henüz aktif projeniz bulunmuyor.</p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default DashboardPage; 