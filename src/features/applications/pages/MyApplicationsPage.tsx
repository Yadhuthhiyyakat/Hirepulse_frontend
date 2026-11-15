import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { applicationsApi } from '../api/applicationsApi';
import { ApplicationStatus, Application } from '@/types';
import { StatusBadge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { formatDate, formatTimeAgo } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Calendar,
  Building2,
  ExternalLink,
  Briefcase,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

export const MyApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [page, setPage] = useState(1);

  const filterParams: any = { page };
  if (selectedStatus !== 'ALL') {
    filterParams.status = selectedStatus;
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-applications', selectedStatus, page],
    queryFn: () => applicationsApi.getApplications(filterParams),
  });

  const paginatedData = data?.data;
  const applications = paginatedData?.results || [];

  const statusTabs = [
    { key: 'ALL', label: 'All Applications' },
    { key: 'APPLIED', label: 'Applied' },
    { key: 'UNDER_REVIEW', label: 'Under Review' },
    { key: 'SHORTLISTED', label: 'Shortlisted' },
    { key: 'INTERVIEW', label: 'Interview' },
    { key: 'HIRED', label: 'Hired' },
    { key: 'REJECTED', label: 'Not Selected' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Application Tracking Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Monitor your application lifecycle from submission to interview and final decision.
        </p>
      </div>

      {/* Pipeline Status Filter Tabs */}
      <div className="flex overflow-x-auto pb-2 border-b border-slate-200 gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setSelectedStatus(tab.key);
              setPage(1);
            }}
            className={`whitespace-nowrap px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              selectedStatus === tab.key
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          title="Could not load applications"
          description="Failed to fetch your applications from the server."
        />
      ) : applications.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-6 h-6 text-slate-400" />}
          title={selectedStatus === 'ALL' ? 'No applications yet' : `No applications in '${selectedStatus}' stage`}
          description="Browse available job postings and start applying today!"
          actionLabel="Explore Jobs"
          onAction={() => navigate('/jobs')}
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app.id} className="p-6 transition-all hover:border-slate-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 border overflow-hidden">
                    {app.job.company.logo ? (
                      <img src={app.job.company.logo} alt={app.job.company.name} className="h-full w-full object-cover" />
                    ) : (
                      <Building2 className="h-6 w-6 text-slate-400" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <Link
                      to={`/jobs/${app.job.id}`}
                      className="text-base font-bold text-slate-900 hover:text-primary transition-colors"
                    >
                      {app.job.title}
                    </Link>
                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                      <span className="font-medium text-slate-700">{app.job.company.name}</span>
                      <span>•</span>
                      <span>{app.job.location}</span>
                      <span>•</span>
                      <span>Applied {formatDate(app.applied_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-2 shrink-0">
                  <StatusBadge status={app.status} />
                  {app.interview_date && (
                    <span className="text-xs text-amber-700 font-semibold flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                      <Calendar className="w-3.5 h-3.5" />
                      Interview: {formatDate(app.interview_date)}
                    </span>
                  )}
                </div>
              </div>

              {/* Cover Letter preview if present */}
              {app.cover_letter && (
                <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 bg-slate-50/50 p-3 rounded-lg">
                  <span className="font-semibold text-slate-700 block mb-1">Your Note to Hiring Team:</span>
                  <p className="line-clamp-2 italic">"{app.cover_letter}"</p>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {app.resume && (
                  <a
                    href={app.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                  >
                    <FileText className="w-3.5 h-3.5" /> View Submitted Resume
                  </a>
                )}
                <Link to={`/jobs/${app.job.id}`} className="font-medium text-slate-600 hover:text-slate-900 ml-auto">
                  Job Details &rarr;
                </Link>
              </div>
            </Card>
          ))}

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

