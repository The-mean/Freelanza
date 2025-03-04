import { useState, useCallback, useEffect } from 'react';
import { jobService, proposalService } from '../services/api';
import { Job, Proposal, PaginatedResponse, Attachment } from '../types';
import { useQuery } from './useQuery';
import { useMutation } from './useMutation';
import { queryClient } from '../App';

export const useJobManagement = (jobId?: string) => {
    const [jobFormData, setJobFormData] = useState<Partial<Job>>({
        title: '',
        description: '',
        longDescription: '',
        budget: 0,
        duration: '',
        expertise: 'intermediate',
        category: '',
        skills: [],
        location: '',
        questions: []
    });

    const [attachments, setAttachments] = useState<File[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);

    // İş ilanlarını çekme (client için)
    const {
        data: clientJobsData,
        isLoading: isClientJobsLoading,
        error: clientJobsError,
        refetch: refetchClientJobs
    } = useQuery<PaginatedResponse<Job>>(
        ['clientJobs', currentPage, itemsPerPage],
        () => jobService.getClientJobs({ page: currentPage, limit: itemsPerPage })
    );

    // Belirli bir iş ilanını çekme
    const {
        data: jobDetail,
        isLoading: isJobDetailLoading,
        error: jobDetailError,
        refetch: refetchJobDetail
    } = useQuery<Job>(
        ['job', jobId],
        () => jobService.getJobById(jobId as string),
        {
            enabled: !!jobId
        }
    );

    // İş ilanı verilerini form verilerine yükle (düzenleme için)
    useEffect(() => {
        if (jobDetail && jobId) {
            setJobFormData({
                title: jobDetail.title,
                description: jobDetail.description,
                longDescription: jobDetail.longDescription,
                budget: jobDetail.budget,
                duration: jobDetail.duration,
                expertise: jobDetail.expertise,
                category: jobDetail.category,
                skills: jobDetail.skills,
                location: jobDetail.location,
                questions: jobDetail.questions
            });
        }
    }, [jobDetail, jobId]);

    // İş ilanına gelen teklifleri çekme
    const {
        data: proposalsData,
        isLoading: isProposalsLoading,
        error: proposalsError,
        refetch: refetchProposals
    } = useQuery<PaginatedResponse<Proposal>>(
        ['proposals', jobId, currentPage, itemsPerPage],
        () => proposalService.getProposalsForJob(jobId as string, { page: currentPage, limit: itemsPerPage }),
        {
            enabled: !!jobId
        }
    );

    // İş ilanı oluşturma
    const createJobMutation = useMutation(
        (data: Partial<Job>) => jobService.createJob(data),
        {
            onSuccess: (newJob) => {
                // İş ilanı oluşturulduktan sonra dosya yükleme
                if (attachments.length > 0) {
                    attachments.forEach(file => {
                        uploadAttachmentMutation.mutate({ jobId: newJob.id, file });
                    });
                }

                // İş ilanları listesini yenile
                queryClient.invalidateQueries({ queryKey: ['clientJobs'] });

                // Form verilerini temizle
                setJobFormData({
                    title: '',
                    description: '',
                    longDescription: '',
                    budget: 0,
                    duration: '',
                    expertise: 'intermediate',
                    category: '',
                    skills: [],
                    location: '',
                    questions: []
                });
                setAttachments([]);
            }
        }
    );

    // İş ilanı güncelleme
    const updateJobMutation = useMutation(
        (data: { jobId: string; jobData: Partial<Job> }) =>
            jobService.updateJob(data.jobId, data.jobData),
        {
            onSuccess: () => {
                // İş ilanı güncellendikten sonra dosya yükleme
                if (attachments.length > 0 && jobId) {
                    attachments.forEach(file => {
                        uploadAttachmentMutation.mutate({ jobId, file });
                    });
                }

                // İş ilanları listesini ve detayını yenile
                queryClient.invalidateQueries({ queryKey: ['clientJobs'] });
                queryClient.invalidateQueries({ queryKey: ['job', jobId] });

                // Eklenen dosyaları temizle
                setAttachments([]);
            }
        }
    );

    // İş ilanı silme
    const deleteJobMutation = useMutation(
        (jobId: string) => jobService.deleteJob(jobId),
        {
            onSuccess: () => {
                // İş ilanları listesini yenile
                queryClient.invalidateQueries({ queryKey: ['clientJobs'] });
            }
        }
    );

    // Dosya yükleme
    const uploadAttachmentMutation = useMutation(
        (data: { jobId: string; file: File }) =>
            jobService.uploadAttachment(data.jobId, data.file)
    );

    // Teklif durumunu güncelleme
    const updateProposalStatusMutation = useMutation(
        (data: { proposalId: string; status: 'accepted' | 'rejected' }) =>
            proposalService.updateProposalStatus(data.proposalId, data.status),
        {
            onSuccess: () => {
                // Teklifleri ve iş ilanı detayını yenile
                queryClient.invalidateQueries({ queryKey: ['proposals', jobId] });
                queryClient.invalidateQueries({ queryKey: ['job', jobId] });
            }
        }
    );

    // Form verilerini güncelleme
    const updateJobFormData = useCallback((field: string, value: any) => {
        setJobFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    // Dosya ekleme
    const handleAttachmentChange = useCallback((files: FileList | null) => {
        if (files) {
            setAttachments(prev => [...prev, ...Array.from(files)]);
        }
    }, []);

    // Dosya kaldırma
    const removeAttachment = useCallback((index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    }, []);

    // Sayfa değiştirme
    const changePage = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    // İş ilanı oluşturma
    const createJob = useCallback(async () => {
        try {
            await createJobMutation.mutateAsync(jobFormData);
        } catch (error) {
            console.error('Error creating job:', error);
        }
    }, [jobFormData, createJobMutation]);

    // İş ilanı güncelleme
    const updateJob = useCallback(async () => {
        if (!jobId) return;

        try {
            await updateJobMutation.mutateAsync({
                jobId,
                jobData: jobFormData
            });
        } catch (error) {
            console.error('Error updating job:', error);
        }
    }, [jobId, jobFormData, updateJobMutation]);

    // İş ilanı silme
    const deleteJob = useCallback(async (id: string) => {
        try {
            await deleteJobMutation.mutateAsync(id);
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    }, [deleteJobMutation]);

    // Teklif durumunu güncelleme
    const updateProposalStatus = useCallback(async (proposalId: string, status: 'accepted' | 'rejected') => {
        try {
            await updateProposalStatusMutation.mutateAsync({ proposalId, status });
        } catch (error) {
            console.error('Error updating proposal status:', error);
        }
    }, [updateProposalStatusMutation]);

    return {
        // İş ilanları
        clientJobs: clientJobsData?.items || [],
        totalClientJobs: clientJobsData?.total || 0,
        isClientJobsLoading,
        clientJobsError,
        refetchClientJobs,

        // İş ilanı detayı
        jobDetail,
        isJobDetailLoading,
        jobDetailError,
        refetchJobDetail,

        // Teklifler
        proposals: proposalsData?.items || [],
        totalProposals: proposalsData?.total || 0,
        isProposalsLoading,
        proposalsError,
        refetchProposals,

        // Form verileri
        jobFormData,
        updateJobFormData,

        // Dosya işlemleri
        attachments,
        handleAttachmentChange,
        removeAttachment,

        // İş ilanı işlemleri
        createJob,
        isCreatingJob: createJobMutation.isPending,
        createJobError: createJobMutation.error,

        updateJob,
        isUpdatingJob: updateJobMutation.isPending,
        updateJobError: updateJobMutation.error,

        deleteJob,
        isDeletingJob: deleteJobMutation.isPending,
        deleteJobError: deleteJobMutation.error,

        // Teklif işlemleri
        updateProposalStatus,
        isUpdatingProposalStatus: updateProposalStatusMutation.isPending,
        updateProposalStatusError: updateProposalStatusMutation.error,

        // Sayfalama
        currentPage,
        itemsPerPage,
        changePage
    };
};

export default useJobManagement; 