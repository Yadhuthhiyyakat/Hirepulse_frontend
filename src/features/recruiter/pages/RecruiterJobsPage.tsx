import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '@/features/jobs/api/jobsApi';
import { Card, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { StatusBadge, JobTypeBadge, WorkModeBadge } from '@/components/common/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { showToast } from '@/components/common/Toast';
import { formatDate } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  PlusCircle,
  Users,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const RecruiterJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['my-jobs', page],
    queryFn: () => jobsApi.getMyJobs(page),
  });

  const togglePublishMutation = useMutation({
    mutationFn: (id: string) => jobsApi.togglePublishJob(id),
    onSuccess: (res) => {
      showToast(res.message, 'success');
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => jobsApi.deleteJob(id),
    onSuccess: () => {
      showToast('Job posting deleted.', 'info');
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: () => {
      showToast('Failed to delete job posting.', 'error');
    },
  });

  const paginatedData = data?.data;
  const jobs = paginatedData?.results || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Manage Job Postings
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Publish, edit and track applicants across all your active and draft positions.
          </p>
        </div>

        <Link to="/recruiter/jobs/create">
          <Button size="sm" className="gap-1.5 shadow-sm">
            <PlusCircle className="w-4 h-4" /> Post New Job
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState title="Error loading jobs" description="Could not load your job postings." />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="w-6 h-6 text-slate-400" />}
          title="No jobs created yet"
          description="You haven't posted any jobs yet. Create your first listing to start receiving candidate applications."
          actionLabel="Post a Job"
          onAction={() => navigate('/recruiter/jobs/create')}
        />
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Job Title</th>
                  <th className="py-3.5 px-4">Location & Arrangement</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Applicants</th>
                  <th className="py-3.5 px-4">Date Posted</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 font-semibold text-slate-900">
                      <Link to={`/jobs/${job.id}`} className="hover:text-primary transition-colors">
                        {job.title}
                      </Link>
                    </td>

                    <td className="py-4 px-4 text-slate-600">
                      <div>{job.location}</div>
                      <div className="mt-1 flex gap-1">
                        <JobTypeBadge type={job.job_type} />
                        <WorkModeBadge mode={job.work_mode} />
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <StatusBadge status={job.status} />
                    </td>

                    <td className="py-4 px-4">
                      <Link
                        to={`/recruiter/applicants?job=${job.id}`}
                        className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                      >
                        <Users className="w-3.5 h-3.5" />
                        {job.applications_count !== undefined ? job.applications_count : 0} Candidates
                      </Link>
                    </td>

                    <td className="py-4 px-4 text-slate-500">
                      {formatDate(job.created_at)}
                    </td>

                    <td className="py-4 px-4 text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePublishMutation.mutate(job.id)}
                        title={job.status === 'PUBLISHED' ? 'Unpublish (Close)' : 'Publish'}
                        className="p-1.5"
                      >
                        {job.status === 'PUBLISHED' ? (
                          <XCircle className="w-4 h-4 text-amber-600" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        )}
                      </Button>

                      <Link to={`/recruiter/jobs/${job.id}/edit`}>
                        <Button variant="ghost" size="sm" className="p-1.5 text-slate-600" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </Link>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${job.title}"?`)) {
                            deleteMutation.mutate(job.id);
                          }
                        }}
                        className="p-1.5 text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

