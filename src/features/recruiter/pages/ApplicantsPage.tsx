import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { applicationsApi } from '@/features/applications/api/applicationsApi';
import { jobsApi } from '@/features/jobs/api/jobsApi';
import { ApplicationStatus, Application } from '@/types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { StatusBadge } from '@/components/common/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { showToast } from '@/components/common/Toast';
import { formatDate } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';
import {
  Search,
  Filter,
  Users,
  FileText,
  Calendar,
  ExternalLink,
  CheckCircle,
  Eye
} from 'lucide-react';

export const ApplicantsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const selectedJobId = searchParams.get('job') || '';
  const selectedStatus = searchParams.get('status') || '';
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearchQuery = useDebounce(searchQuery, 350);

  const { data: myJobsData } = useQuery({
    queryKey: ['my-jobs-dropdown'],
    queryFn: () => jobsApi.getMyJobs(1),
  });

  const myJobs = myJobsData?.data?.results || [];

  const filterParams: any = { page };
  if (selectedJobId) filterParams.job = selectedJobId;
  if (selectedStatus) filterParams.status = selectedStatus;
  if (debouncedSearchQuery) filterParams.search = debouncedSearchQuery;

  const { data: applicantsData, isLoading, isError, refetch } = useQuery({
    queryKey: ['recruiter-applicants', selectedJobId, selectedStatus, debouncedSearchQuery, page],
    queryFn: () => applicationsApi.getApplications(filterParams),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) =>
      applicationsApi.updateStatus(id, { status }),
    onSuccess: (res) => {
      showToast(`Candidate status updated to ${res.data.status}`, 'success');
      queryClient.invalidateQueries({ queryKey: ['recruiter-applicants'] });
      queryClient.invalidateQueries({ queryKey: ['recruiter-stats'] });
    },
  });

  const paginatedData = applicantsData?.data;
  const applicants = paginatedData?.results || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Candidate Applications & Pipeline
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Review candidate resumes, schedule interviews, and advance applicants through your hiring stages.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            placeholder="Search candidate name or email..."
            leftIcon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            value={selectedJobId}
            onChange={(e) => {
              if (e.target.value) {
                searchParams.set('job', e.target.value);
              } else {
                searchParams.delete('job');
              }
              setSearchParams(searchParams);
              setPage(1);
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Job Postings</option>
            {myJobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => {
              if (e.target.value) {
                searchParams.set('status', e.target.value);
              } else {
                searchParams.delete('status');
              }
              setSearchParams(searchParams);
              setPage(1);
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Pipeline Stages</option>
            <option value="APPLIED">Applied</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW">Interview</option>
            <option value="HIRED">Hired</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </Card>

      {/* Applicants Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState title="Could not load applicants" description="Please make sure your server is online." />
      ) : applicants.length === 0 ? (
        <EmptyState
          icon={<Users className="w-6 h-6 text-slate-400" />}
          title="No candidates found"
          description="No candidate applications match the selected job or stage filter."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchParams({});
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Candidate</th>
                  <th className="py-3.5 px-4">Role Applied For</th>
                  <th className="py-3.5 px-4">Skills Highlight</th>
                  <th className="py-3.5 px-4">Stage</th>
                  <th className="py-3.5 px-4">Applied</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applicants.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4">
                      <Link
                        to={`/recruiter/applicants/${app.id}`}
                        className="font-bold text-slate-900 hover:text-primary transition-colors block text-sm"
                      >
                        {app.candidate.full_name}
                      </Link>
                      <span className="text-slate-500 font-normal">{app.candidate.email}</span>
                    </td>

                    <td className="py-4 px-4 font-medium text-slate-700">
                      {app.job.title}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {app.candidate.skills?.slice(0, 3).map((skill, i) => (
                          <span key={i} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {/* Fast stage dropdown */}
                      <select
                        value={app.status}
                        onChange={(e) =>
                          statusMutation.mutate({
                            id: app.id,
                            status: e.target.value as ApplicationStatus,
                          })
                        }
                        className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="APPLIED">Applied</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="SHORTLISTED">Shortlisted</option>
                        <option value="INTERVIEW">Interview</option>
                        <option value="HIRED">Hired 🎉</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </td>

                    <td className="py-4 px-4 text-slate-500">
                      {formatDate(app.applied_at)}
                    </td>

                    <td className="py-4 px-4 text-right space-x-2">
                      {app.resume && (
                        <a
                          href={app.resume}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center text-primary hover:underline font-medium"
                          title="Download Resume"
                        >
                          <FileText className="w-4 h-4" />
                        </a>
                      )}

                      <Link to={`/recruiter/applicants/${app.id}`}>
                        <Button size="sm" variant="outline" className="text-xs">
                          Full Profile
                        </Button>
                      </Link>
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

