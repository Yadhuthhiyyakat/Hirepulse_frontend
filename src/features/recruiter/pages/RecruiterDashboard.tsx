import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { applicationsApi } from '@/features/applications/api/applicationsApi';
import { jobsApi } from '@/features/jobs/api/jobsApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/Badge';
import { formatDate, formatTimeAgo } from '@/lib/utils';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  CheckCircle,
  Calendar,
  Award,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';

export const RecruiterDashboard: React.FC = () => {
  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ['recruiter-stats'],
    queryFn: applicationsApi.getRecruiterStats,
  });

  const { data: recentAppsData, isLoading: isAppsLoading } = useQuery({
    queryKey: ['recruiter-recent-applications'],
    queryFn: () => applicationsApi.getApplications({ page: 1 }),
  });

  const stats = statsData?.data || {
    active_jobs: 0,
    total_applications: 0,
    shortlisted: 0,
    interviews: 0,
    hired: 0,
  };

  const recentApplicants = recentAppsData?.data?.results?.slice(0, 5) || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Recruiter Control Center
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor active job postings, evaluate incoming applications, and manage hiring velocity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/recruiter/jobs/create">
            <Button size="sm" className="gap-1.5 shadow-sm">
              <PlusCircle className="w-4 h-4" /> Post New Job
            </Button>
          </Link>
          <Link to="/recruiter/applicants">
            <Button variant="outline" size="sm">
              Applicant Pipeline
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row (Requirement #15: Active Jobs, Applications, Shortlisted, Interviews, Hired) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-primary shrink-0">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Jobs</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {isStatsLoading ? '...' : stats.active_jobs}
            </h3>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Applications</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {isStatsLoading ? '...' : stats.total_applications}
            </h3>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600 shrink-0">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Shortlisted</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {isStatsLoading ? '...' : stats.shortlisted}
            </h3>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 shrink-0">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Interviews</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {isStatsLoading ? '...' : stats.interviews}
            </h3>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 col-span-2 lg:col-span-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Hired</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {isStatsLoading ? '...' : stats.hired}
            </h3>
          </div>
        </Card>
      </div>

      {/* Recent Applicants Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>Recent Candidate Submissions</CardTitle>
            <p className="text-xs text-slate-500 mt-1">Review and advance candidates in your hiring funnel</p>
          </div>
          <Link to="/recruiter/applicants">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              View All Pipeline <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </CardHeader>

        <CardContent>
          {isAppsLoading ? (
            <div className="space-y-3 py-4">
              <div className="h-10 bg-slate-100 rounded animate-pulse" />
              <div className="h-10 bg-slate-100 rounded animate-pulse" />
              <div className="h-10 bg-slate-100 rounded animate-pulse" />
            </div>
          ) : recentApplicants.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <Users className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm text-slate-500">No applicant submissions yet.</p>
              <Link to="/recruiter/jobs/create">
                <Button size="sm">Post an Opening</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Role Applied</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Stage</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentApplicants.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <Link to={`/recruiter/applicants/${app.id}`} className="hover:text-primary">
                          {app.candidate.full_name}
                        </Link>
                        <p className="text-slate-500 font-normal mt-0.5">{app.candidate.email}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {app.job.title}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {formatDate(app.applied_at)}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link to={`/recruiter/applicants/${app.id}`}>
                          <Button variant="outline" size="sm" className="text-xs">
                            Review Candidate
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

