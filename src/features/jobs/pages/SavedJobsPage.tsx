import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '../api/jobsApi';
import { JobCard } from '../components/JobCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { showToast } from '@/components/common/Toast';
import { Bookmark } from 'lucide-react';

export const SavedJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['saved-jobs', page],
    queryFn: () => jobsApi.getSavedJobs(page),
  });

  const toggleSaveMutation = useMutation({
    mutationFn: (jobId: string) => jobsApi.toggleSaveJob(jobId),
    onSuccess: (res) => {
      showToast(res.message, 'success');
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  const paginatedData = data?.data;
  const savedItems = paginatedData?.results || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Saved Job Bookmarks
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Roles you have bookmarked to review or apply for later.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 bg-white rounded-xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          title="Could not load saved jobs"
          description="Failed to fetch your bookmarked jobs."
          actionLabel="Retry"
          onAction={() => refetch()}
        />
      ) : savedItems.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="w-6 h-6 text-slate-400" />}
          title="No saved jobs"
          description="You haven't bookmarked any jobs yet. When browsing roles, click the bookmark icon to save them here."
          actionLabel="Browse Jobs"
          onAction={() => navigate('/jobs')}
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedItems.map((item) => (
              <JobCard
                key={item.id}
                job={{ ...item.job, is_saved: true }}
                onToggleSave={(id) => toggleSaveMutation.mutate(id)}
                isSaving={toggleSaveMutation.isPending}
              />
            ))}
          </div>

          {paginatedData && (
            <Pagination
              currentPage={paginatedData.current_page}
              totalPages={paginatedData.total_pages}
              hasNext={paginatedData.has_next}
              hasPrevious={paginatedData.has_previous}
              onPageChange={(p) => setPage(p)}
            />
          )}
        </div>
      )}
    </div>
  );
};

