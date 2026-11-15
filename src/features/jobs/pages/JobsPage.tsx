import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '../api/jobsApi';
import { JobFilterParams } from '@/types';
import { JobCard } from '../components/JobCard';
import { JobFilterBar } from '../components/JobFilterBar';
import { JobCardSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { showToast } from '@/components/common/Toast';
import { Briefcase } from 'lucide-react';

export const JobsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<JobFilterParams>({
    page: 1,
    ordering: '-created_at',
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => jobsApi.getJobs(filters),
  });

  const toggleSaveMutation = useMutation({
    mutationFn: (jobId: string) => jobsApi.toggleSaveJob(jobId),
    onMutate: async (jobId: string) => {
      await queryClient.cancelQueries({ queryKey: ['jobs', filters] });
      const previousJobs = queryClient.getQueryData(['jobs', filters]);

      queryClient.setQueryData(['jobs', filters], (old: any) => {
        if (!old?.data?.results) return old;
        return {
          ...old,
          data: {
            ...old.data,
            results: old.data.results.map((job: any) =>
              job.id === jobId ? { ...job, is_saved: !job.is_saved } : job
            ),
          },
        };
      });

      return { previousJobs };
    },
    onError: (_err, _jobId, context: any) => {
      if (context?.previousJobs) {
        queryClient.setQueryData(['jobs', filters], context.previousJobs);
      }
      showToast('Could not save job. Please try again.', 'error');
    },
    onSuccess: (res) => {
      showToast(res.message, 'success');
      queryClient.invalidateQueries({ queryKey: ['saved_jobs'] });
    },
  });

  const handleToggleSave = React.useCallback(
    (jobId: string) => {
      toggleSaveMutation.mutate(jobId);
    },
    [toggleSaveMutation]
  );

  const paginatedData = data?.data;
  const jobs = paginatedData?.results || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Find Your Next Engineering Opportunity
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Discover verified roles at top tech companies, startups, and remote-first engineering teams.
        </p>
      </div>

      {/* Filter Component */}
      <JobFilterBar
        filters={filters}
        onChange={(newFilters) => setFilters(newFilters)}
        onReset={() => setFilters({ page: 1, ordering: '-created_at' })}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-sm font-medium text-slate-600">
          {isLoading ? 'Searching jobs...' : `${paginatedData?.count || 0} active openings found`}
        </span>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium">Sort by:</label>
          <select
            value={filters.ordering || '-created_at'}
            onChange={(e) => setFilters({ ...filters, ordering: e.target.value, page: 1 })}
            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="-created_at">Most Recent</option>
            <option value="-salary_max">Highest Salary</option>
            <option value="title">Job Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid / List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          title="Failed to load job listings"
          description="Could not connect to the API server. Please make sure the backend is running."
          actionLabel="Try Again"
          onAction={() => refetch()}
        />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="w-6 h-6 text-slate-400" />}
          title="No jobs found"
          description="We couldn't find any opportunities matching your exact search criteria. Try loosening your filters or searching for related keywords."
          actionLabel="Reset Filters"
          onAction={() => setFilters({ page: 1, ordering: '-created_at' })}
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onToggleSave={handleToggleSave}
                isSaving={toggleSaveMutation.isPending && toggleSaveMutation.variables === job.id}
              />
            ))}
          </div>

          {/* Pagination */}
          {paginatedData && (
            <Pagination
              currentPage={paginatedData.current_page}
              totalPages={paginatedData.total_pages}
              hasNext={paginatedData.has_next}
              hasPrevious={paginatedData.has_previous}
              onPageChange={(page) => setFilters({ ...filters, page })}
            />
          )}
        </div>
      )}
    </div>
  );
};

