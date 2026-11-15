import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '@/features/jobs/api/jobsApi';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { StatusBadge, JobTypeBadge, WorkModeBadge } from '@/components/common/Badge';
import { Pagination } from '@/components/common/Pagination';
import { showToast } from '@/components/common/Toast';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const JobsManagementPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-jobs', page],
    queryFn: () => jobsApi.getJobs({ page }),
  });

  const togglePublishMutation = useMutation({
    mutationFn: (id: string) => jobsApi.togglePublishJob(id),
    onSuccess: (res) => {
      showToast(res.message, 'success');
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => jobsApi.deleteJob(id),
    onSuccess: () => {
      showToast('Job removed from platform.', 'info');
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
    },
  });

  const paginatedData = data?.data;
  const jobs = paginatedData?.results || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/admin/dashboard" className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Job Management</h1>
          <p className="text-xs text-slate-500">Monitor all company postings across the entire platform</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-4">Title & Company</th>
              <th className="py-3.5 px-4">Location</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Date Posted</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-400">Loading jobs...</td></tr>
            ) : jobs.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-400">No jobs found.</td></tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <Link to={`/jobs/${job.id}`} className="hover:text-primary">
                      {job.title}
                    </Link>
                    <div className="text-slate-500 font-normal">{job.company.name}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {job.location} ({job.work_mode})
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {formatDate(job.created_at)}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => togglePublishMutation.mutate(job.id)}
                      className="p-1.5"
                      title={job.status === 'PUBLISHED' ? 'Close job' : 'Publish job'}
                    >
                      {job.status === 'PUBLISHED' ? (
                        <XCircle className="w-4 h-4 text-amber-600" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (confirm(`Delete "${job.title}"?`)) {
                          deleteMutation.mutate(job.id);
                        }
                      }}
                      className="p-1.5 text-red-500 hover:text-red-700"
                      title="Delete job"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
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
  );
};

