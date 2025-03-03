import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { useAuthContext } from '../context/AuthContext';

// Örnek iş verisi - gerçek uygulamada API'dan gelir
const JOB_DATA = {
    id: 1,
    title: 'React Native Mobil Uygulama Geliştiricisi',
    description: 'Mevcut e-ticaret platformumuz için kullanıcı dostu bir mobil uygulama geliştirmek istiyoruz.',
    budget: 10000,
    category: 'Yazılım Geliştirme',
    company: 'XYZ Teknoloji',
    questions: [
        'React Native ile daha önce kaç tane uygulama geliştirdiniz?',
        'Benzer bir e-ticaret uygulaması deneyiminiz var mı?',
        'Proje için ne kadar zaman ayırabilirsiniz?'
    ]
};

const JobApply: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthContext();
    const [job, setJob] = useState(JOB_DATA);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Form state
    const [bidAmount, setBidAmount] = useState<number>(job.budget);
    const [deliveryTime, setDeliveryTime] = useState<string>('7 gün');
    const [coverLetter, setCoverLetter] = useState<string>('');
    const [answers, setAnswers] = useState<string[]>(job.questions.map(() => ''));
    const [attachments, setAttachments] = useState<File[]>([]);

    // Gerçek bir uygulamada burası API'dan veri çeker
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login?redirect=' + encodeURIComponent(`/jobs/${id}/apply`));
            return;
        }

        setLoading(true);
        try {
            // Simüle edilmiş API çağrısı
            setTimeout(() => {
                setJob(JOB_DATA);
                setLoading(false);
            }, 500);
        } catch (err) {
            setError('İş detayları yüklenirken bir hata oluştu.');
            setLoading(false);
        }
    }, [id, isAuthenticated, navigate]);

    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileArray = Array.from(e.target.files);
            setAttachments([...attachments, ...fileArray]);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Simüle edilmiş API çağrısı
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Gerçek uygulamada burada API çağrısı olacak
            // Başarılı olması durumunda:
            setSubmitSuccess(true);
            // Hata olması durumunda:
            // setError('Teklifiniz gönderilirken bir hata oluştu.');
        } catch (err) {
            setError('Teklifiniz gönderilirken bir hata oluştu.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-neutral-200 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-neutral-200 rounded w-1/2 mb-6"></div>
                        <div className="h-32 bg-neutral-200 rounded mb-6"></div>
                        <div className="h-64 bg-neutral-200 rounded"></div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <svg className="h-16 w-16 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="mt-2 text-2xl font-bold text-neutral-900">Hata Oluştu</h2>
                    <p className="mt-1 text-lg text-neutral-500">{error}</p>
                    <div className="mt-6">
                        <Button variant="primary" onClick={() => window.location.reload()}>
                            Yeniden Dene
                        </Button>
                        <Link to={`/jobs/${id}`} className="ml-4">
                            <Button variant="outline">İş Detayına Dön</Button>
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    if (submitSuccess) {
        return (
            <Layout>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-neutral-900">Teklifiniz Başarıyla Gönderildi!</h2>
                    <p className="mt-2 text-lg text-neutral-500">
                        İşveren teklifinizi inceleyecek ve sizinle iletişime geçecektir. Tekliflerinizi ve durumlarını dashboard sayfasından takip edebilirsiniz.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/dashboard">
                            <Button variant="primary">Dashboard'a Git</Button>
                        </Link>
                        <Link to="/jobs">
                            <Button variant="outline">Diğer İşlere Göz At</Button>
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center">
                        <Link to={`/jobs/${id}`} className="text-primary-600 hover:text-primary-700 mr-2">
                            <svg className="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            İş Detayına Dön
                        </Link>
                        <span className="text-neutral-500">/ Teklif Ver</span>
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-900 mt-2">Teklif Ver</h1>
                    <p className="text-neutral-500">{job.title}</p>
                </div>

                {/* Apply Form */}
                <div className="card">
                    <div className="p-6">
                        <form onSubmit={handleSubmit}>
                            {/* Bid Details */}
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Teklif Detayları</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="bidAmount" className="block text-sm font-medium text-neutral-700 mb-1">
                                            Teklif Tutarı (₺)
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-neutral-500 sm:text-sm">₺</span>
                                            </div>
                                            <input
                                                type="number"
                                                name="bidAmount"
                                                id="bidAmount"
                                                required
                                                value={bidAmount}
                                                onChange={(e) => setBidAmount(Number(e.target.value))}
                                                className="input pl-8"
                                                placeholder="0"
                                                min={1}
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-neutral-500">
                                            İşveren bütçesi: <span className="font-medium">₺{job.budget.toLocaleString()}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <label htmlFor="deliveryTime" className="block text-sm font-medium text-neutral-700 mb-1">
                                            Tahmini Teslim Süresi
                                        </label>
                                        <select
                                            id="deliveryTime"
                                            name="deliveryTime"
                                            required
                                            value={deliveryTime}
                                            onChange={(e) => setDeliveryTime(e.target.value)}
                                            className="input"
                                        >
                                            <option value="3 gün">3 gün</option>
                                            <option value="7 gün">7 gün</option>
                                            <option value="14 gün">14 gün</option>
                                            <option value="30 gün">30 gün</option>
                                            <option value="60 gün">60 gün</option>
                                            <option value="90 gün">90 gün</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Cover Letter */}
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Teklif Açıklaması</h2>
                                <div>
                                    <label htmlFor="coverLetter" className="block text-sm font-medium text-neutral-700 mb-1">
                                        İşverene Mesajınız
                                    </label>
                                    <textarea
                                        id="coverLetter"
                                        name="coverLetter"
                                        rows={6}
                                        required
                                        value={coverLetter}
                                        onChange={(e) => setCoverLetter(e.target.value)}
                                        placeholder="Kendinizi tanıtın, bu iş için neden uygun olduğunuzu ve yaklaşımınızı açıklayın..."
                                        className="input"
                                    ></textarea>
                                    <p className="mt-1 text-xs text-neutral-500">
                                        İyi bir teklif mesajı, işverenin sizi seçme olasılığını artırır. Deneyiminizi, becerilerinizi ve işe yaklaşımınızı detaylandırın.
                                    </p>
                                </div>
                            </div>

                            {/* Screening Questions */}
                            {job.questions.length > 0 && (
                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold text-neutral-900 mb-4">İşveren Soruları</h2>
                                    <p className="text-sm text-neutral-500 mb-4">
                                        İşveren, uygun adayları belirlemek için aşağıdaki soruları yanıtlamanızı istiyor.
                                    </p>
                                    <div className="space-y-4">
                                        {job.questions.map((question, index) => (
                                            <div key={index}>
                                                <label htmlFor={`question-${index}`} className="block text-sm font-medium text-neutral-700 mb-1">
                                                    {question}
                                                </label>
                                                <textarea
                                                    id={`question-${index}`}
                                                    rows={3}
                                                    required
                                                    value={answers[index]}
                                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                                    placeholder="Yanıtınızı buraya yazın..."
                                                    className="input"
                                                ></textarea>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Attachments */}
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Ekler</h2>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                                        Dosya Ekle (örnek çalışma, CV vb.)
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            <svg
                                                className="mx-auto h-12 w-12 text-neutral-400"
                                                stroke="currentColor"
                                                fill="none"
                                                viewBox="0 0 48 48"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <div className="flex text-sm text-neutral-600">
                                                <label
                                                    htmlFor="file-upload"
                                                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                                                >
                                                    <span>Dosya yükle</span>
                                                    <input
                                                        id="file-upload"
                                                        name="file-upload"
                                                        type="file"
                                                        className="sr-only"
                                                        multiple
                                                        onChange={handleAttachmentChange}
                                                    />
                                                </label>
                                                <p className="pl-1">veya sürükleyip bırakın</p>
                                            </div>
                                            <p className="text-xs text-neutral-500">
                                                PNG, JPG, PDF, DOC, DOCX (maks. 5MB)
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Attached files list */}
                                {attachments.length > 0 && (
                                    <div className="mt-4">
                                        <h3 className="text-sm font-medium text-neutral-700 mb-2">Ekli Dosyalar</h3>
                                        <ul className="divide-y divide-neutral-200">
                                            {attachments.map((file, index) => (
                                                <li key={index} className="py-3 flex justify-between items-center">
                                                    <div className="flex items-center">
                                                        <svg className="h-5 w-5 text-neutral-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                        <div>
                                                            <p className="text-sm font-medium text-neutral-900">{file.name}</p>
                                                            <p className="text-xs text-neutral-500">
                                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAttachment(index)}
                                                        className="text-neutral-400 hover:text-red-500"
                                                    >
                                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex items-center justify-end mt-8 pt-6 border-t border-neutral-200">
                                <Link to={`/jobs/${id}`} className="text-neutral-700 hover:text-neutral-900 mr-4">
                                    İptal
                                </Link>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    isLoading={submitting}
                                    disabled={submitting}
                                >
                                    Teklifi Gönder
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default JobApply; 