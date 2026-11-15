import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { applicationsApi } from '@/features/applications/api/applicationsApi';
import { StatusBadge } from '@/components/common/Badge';
import { Pagination } from '@/components/common/Pagination';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ApplicationsManagementPage: React.FC = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-applications', page],
    queryFn: () => applicationsApi.getApplications({ page }),
  });

  const paginatedData = data?.data;
  const applications = paginatedData?.results || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/admin/dashboard" className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Applications Oversight</h1>
          <p className="text-xs text-slate-500">Cross-company applicant audit trail and candidate funnel</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-4">Candidate</th>
              <th className="py-3.5 px-4">Job & Company</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Applied Date</th>
              <th className="py-3.5 px-4 text-right">Resume</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-400">Loading applications...</td></tr>
            ) : applications.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-400">No applications found.</td></tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div>{app.candidate.full_name}</div>
                    <div className="text-slate-400 font-normal">{app.candidate.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">{app.job.title}</div>
                    <div className="text-slate-400">{app.job.company.name}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {formatDate(app.applied_at)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {app.resume && (
                      <a
                        href={app.resume}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-primary hover:underline font-semibold"
                      >
                        <FileText className="w-4 h-4 mr-1" /> View CV
                      </a>
                    )}
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

