import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { applicationsApi } from '../api/applicationsApi';
import { jobsApi } from '@/features/jobs/api/jobsApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/Badge';
import { formatDate, formatTimeAgo } from '@/lib/utils';
import { Link } from 'react-router-dom';
import {
  FileText,
  Bookmark,
  Calendar,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Briefcase,
  UserCheck
} from 'lucide-react';

export const JobSeekerDashboard: React.FC = () => {
  const { user } = useAuth();

  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ['jobseeker-stats'],
    queryFn: applicationsApi.getJobSeekerStats,
  });

  const { data: applicationsData, isLoading: isAppsLoading } = useQuery({
    queryKey: ['my-recent-applications'],
    queryFn: () => applicationsApi.getApplications({ page: 1 }),
  });

  const stats = statsData?.data || {
    total_applications: 0,
    saved_jobs: 0,
    interviews: 0,
    profile_completion: 40,
  };

  const recentApplications = applicationsData?.data?.results?.slice(0, 5) || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Welcome back, {user?.first_name || 'Job Seeker'}!
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track your job hunt progress, scheduled interviews, and saved roles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/jobs">
            <Button size="sm">Explore Open Roles</Button>
          </Link>
          <Link to="/profile/edit">
            <Button variant="outline" size="sm">Update Profile</Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row (Requirement #15: Applications, Saved Jobs, Interviews, Profile Completion) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-primary shrink-0">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Applications</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {isStatsLoading ? '...' : stats.total_applications}
            </h3>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 shrink-0">
            <Bookmark className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Saved Jobs</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {isStatsLoading ? '...' : stats.saved_jobs}
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

        <Card className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
            <UserCheck className="h-6 w-6" />
          </div>
          <div className="w-full">
            <div className="flex justify-between items-baseline">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Profile</p>
              <span className="text-xs font-bold text-emerald-700">{stats.profile_completion}%</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${stats.profile_completion}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Applications Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>Recent Job Applications</CardTitle>
            <p className="text-xs text-slate-500 mt-1">Review the live status of your latest submissions</p>
          </div>
          <Link to="/applications">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              View All <ArrowRight className="w-3.5 h-3.5" />
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
          ) : recentApplications.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm text-slate-500">You haven't applied for any jobs yet.</p>
              <Link to="/jobs">
                <Button size="sm">Start Browsing Jobs</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Role & Company</th>
                    <th className="py-3 px-4">Applied Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <Link to={`/jobs/${app.job.id}`} className="font-semibold text-slate-900 hover:text-primary">
                          {app.job.title}
                        </Link>
                        <p className="text-slate-500 mt-0.5">{app.job.company.name} • {app.job.location}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {formatDate(app.applied_at)}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link to={`/jobs/${app.job.id}`}>
                          <Button variant="ghost" size="sm" className="text-xs text-primary">
                            Details
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

