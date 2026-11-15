import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '../api/jobsApi';
import { JobCard } from '../components/JobCard';
import {
  Search,
  MapPin,
  Briefcase,
  Users,
  Building2,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');

  const { data: featuredData } = useQuery({
    queryKey: ['featured-jobs'],
    queryFn: () => jobsApi.getJobs({ page: 1 }),
  });

  const featuredJobs = featuredData?.data?.results?.slice(0, 4) || [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchTerm) query.append('search', searchTerm);
    if (locationTerm) query.append('location', locationTerm);
    navigate(`/jobs?${query.toString()}`);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 to-transparent pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-3.5 py-1 text-xs font-semibold text-primary">
            <Zap className="h-3.5 w-3.5" /> Next-Gen Engineering Recruitment Platform
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl sm:leading-tight">
            Connect with High-Impact <span className="text-primary">Engineering Roles</span>
          </h1>

          <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg">
            HirePulse connects ambitious engineers with transparent salaries, direct recruiter channels, and verified enterprise opportunities.
          </p>

          {/* Search Box Card */}
          <form
            onSubmit={handleSearchSubmit}
            className="mx-auto max-w-3xl rounded-2xl bg-white p-2.5 shadow-xl border border-slate-200/80 flex flex-col sm:flex-row gap-2"
          >
            <div className="flex-1">
              <Input
                placeholder="Role, tech stack (e.g. React, Django, Python)..."
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 shadow-none focus:ring-0 text-sm"
              />
            </div>
            <div className="hidden sm:block h-8 w-px bg-slate-200 self-center" />
            <div className="flex-1">
              <Input
                placeholder="City, country or Remote..."
                leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
                className="border-0 shadow-none focus:ring-0 text-sm"
              />
            </div>
            <Button type="submit" size="lg" className="sm:w-auto shadow-md">
              Find Jobs
            </Button>
          </form>

          {/* Popular Tag Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 pt-2">
            <span>Trending:</span>
            {['React', 'Django', 'TypeScript', 'Remote', 'Full-Stack', 'AI/ML'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => navigate(`/jobs?search=${tag}`)}
                className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700 hover:bg-slate-200 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 rounded-2xl bg-white p-8 border border-slate-200/80 shadow-sm text-center">
          <div>
            <div className="text-3xl font-extrabold text-primary">1,200+</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Verified Active Jobs</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900">450+</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Hiring Tech Companies</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900">92%</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Application Response Rate</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-primary">$135k</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Average Median Salary</div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Preview */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Featured Opportunities
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Top roles actively interviewing qualified candidates this week
            </p>
          </div>
          <Link to="/jobs">
            <Button variant="outline" size="sm" className="gap-1.5">
              Browse All Openings <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* Recruiter Banner CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <span className="inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
              For Employers & Hiring Teams
            </span>
            <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Build your engineering dream team faster
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Post roles, review verified candidate portfolios, streamline applicant workflows, and track recruitment KPIs in one centralized dashboard.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto shadow-lg">
                Start Hiring Today
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-slate-700 hover:bg-slate-800">
                Recruiter Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

