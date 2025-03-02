import { jobService, proposalService } from '../services/api';
import { Job, Proposal, PaginatedResponse } from '../types';
import { useQuery } from './useQuery';

export const useJobDetail = (jobId: string) => {
    // İş detaylarını çekme
    const {
        data: job,
        isLoading: isJobLoading,
        error: jobError,
        refetch: refetchJob
    } = useQuery<Job>(
        ['job', jobId],
        () => jobService.getJobById(jobId),
        {
            enabled: !!jobId
        }
    );

    // İş için teklifleri çekme (sadece işveren veya admin için)
    const {
        data: proposalsData,
        isLoading: isProposalsLoading,
        error: proposalsError,
        refetch: refetchProposals
    } = useQuery<PaginatedResponse<Proposal>>(
        ['jobProposals', jobId],
        () => proposalService.getProposalsForJob(jobId),
        {
            enabled: !!jobId
        }
    );

    return {
        job,
        isJobLoading,
        jobError,
        refetchJob,
        proposals: proposalsData?.items || [],
        totalProposals: proposalsData?.total || 0,
        isProposalsLoading,
        proposalsError,
        refetchProposals
    };
};

export default useJobDetail; 