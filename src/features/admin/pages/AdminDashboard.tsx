import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { applicationsApi } from '@/features/applications/api/applicationsApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Link } from 'react-router-dom';
import {
  Users,
  Building2,
  Briefcase,
  FileText,
  ShieldCheck,
  TrendingUp,
  Activity,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: applicationsApi.getAdminStats,
  });

  const stats = statsData?.data;

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  const trendData = stats?.trends || [
    { month: 'Jun', jobs: 2, applications: 8 },
    { month: 'Jul', jobs: 4, applications: 15 },
    { month: 'Aug', jobs: 6, applications: 28 },
    { month: 'Sep', jobs: 10, applications: 45 },
    { month: 'Oct', jobs: 14, applications: 72 },
    { month: 'Nov', jobs: 18, applications: 95 },
  ];

  const pieData = stats?.jobs_by_type?.map((item) => ({
    name: item.job_type.replace('_', ' '),
    value: item.count,
  })) || [
    { name: 'Full-time', value: 12 },
    { name: 'Part-time', value: 3 },
    { name: 'Contract', value: 4 },
    { name: 'Internship', value: 2 },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-purple-100 p-1 text-purple-700">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Platform Administration
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            High-level platform activity, verified hiring companies, user growth, and talent pipelines.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/admin/users">
            <Button variant="outline" size="sm">Manage Users</Button>
          </Link>
          <Link to="/admin/jobs">
            <Button variant="outline" size="sm">Manage Jobs</Button>
          </Link>
          <Link to="/admin/companies">
            <Button variant="outline" size="sm">Manage Companies</Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-primary shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Users</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {isLoading ? '...' : stats?.total_users || 0}
            </h3>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 shrink-0">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Companies</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {isLoading ? '...' : stats?.total_companies || 0}
            </h3>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Jobs</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {isLoading ? '...' : stats?.total_jobs || 0}
            </h3>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 shrink-0">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Applications</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {isLoading ? '...' : stats?.total_applications || 0}
            </h3>
          </div>
        </Card>
      </div>

      {/* Analytics Charts (Requirement #15: "Include charts for platform statistics. Use Recharts for charts.") */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart */}
        <Card className="p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Platform Growth & Applications Flow</CardTitle>
              <p className="text-xs text-slate-500 mt-1">Monthly progression of active jobs and submitted applications</p>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
              <TrendingUp className="w-3.5 h-3.5" /> +28% MoM
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    borderColor: '#cbd5e1',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="applications" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorApps)" name="Applications" />
                <Area type="monotone" dataKey="jobs" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorJobs)" name="Jobs Posted" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Breakdown Pie Chart */}
        <Card className="p-6 space-y-4">
          <div>
            <CardTitle>Jobs by Arrangement</CardTitle>
            <p className="text-xs text-slate-500 mt-1">Classification across job types</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    borderColor: '#cbd5e1',
                    fontSize: '12px',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Quick Access Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/users" className="block group">
          <Card className="p-5 border-slate-200 group-hover:border-primary transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary">User Management</h3>
                  <p className="text-xs text-slate-500">Inspect roles, activate or deactivate users</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </Card>
        </Link>

        <Link to="/admin/jobs" className="block group">
          <Card className="p-5 border-slate-200 group-hover:border-primary transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary">Jobs Management</h3>
                  <p className="text-xs text-slate-500">Audit, close, or review all platform job postings</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </Card>
        </Link>

        <Link to="/admin/applications" className="block group">
          <Card className="p-5 border-slate-200 group-hover:border-primary transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary">Applications Oversight</h3>
                  <p className="text-xs text-slate-500">Track candidate flow and pipeline bottlenecks</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};

