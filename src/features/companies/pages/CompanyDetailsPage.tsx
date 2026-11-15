import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { companiesApi } from '../api/companiesApi';
import { jobsApi } from '@/features/jobs/api/jobsApi';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { JobCard } from '@/features/jobs/components/JobCard';
import {
  Building2,
  MapPin,
  Users,
  Globe,
  Calendar,
  ExternalLink,
  ArrowLeft,
  Briefcase
} from 'lucide-react';

export const CompanyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: companyData, isLoading: isCompanyLoading } = useQuery({
    queryKey: ['company', id],
    queryFn: () => companiesApi.getCompanyById(id!),
    enabled: !!id,
  });

  const { data: jobsData, isLoading: isJobsLoading } = useQuery({
    queryKey: ['company-jobs', id],
    queryFn: () => jobsApi.getJobs({ company: id }),
    enabled: !!id,
  });

  const rawCompany = companyData as any;
  const company = rawCompany?.data?.id ? rawCompany.data : (rawCompany?.id ? rawCompany : null);
  const jobs = jobsData?.data?.results || [];

  if (isCompanyLoading) {
    return <div className="p-12 text-center text-sm text-slate-500">Loading company profile...</div>;
  }

  if (!company) {
    return (
      <div className="p-12 text-center text-sm text-slate-500">
        Company profile not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <Link
          to="/companies"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Companies
        </Link>
      </div>

      {/* Hero Header */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-slate-100 border overflow-hidden">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="h-full w-full object-cover" />
              ) : (
                <Building2 className="h-10 w-10 text-slate-400" />
              )}
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{company.name}</h1>
              <p className="text-xs font-semibold text-primary">{company.industry || 'Technology'}</p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                {company.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {company.location}
                  </span>
                )}
                {company.company_size && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {company.company_size} employees
                  </span>
                )}
                {company.founded_year && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Founded {company.founded_year}
                  </span>
                )}
              </div>
            </div>
          </div>

          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="self-start"
            >
              <Button size="sm" variant="outline" className="gap-1.5">
                <Globe className="w-4 h-4" /> Visit Website <ExternalLink className="w-3 h-3" />
              </Button>
            </a>
          )}
        </div>

        {company.description && (
          <div className="mt-6 pt-6 border-t border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {company.description}
          </div>
        )}
      </Card>

      {/* Active Job Openings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Open Positions at {company.name} ({jobs.length})
          </h2>
        </div>

        {isJobsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 bg-white rounded-xl border animate-pulse" />
            <div className="h-32 bg-white rounded-xl border animate-pulse" />
          </div>
        ) : jobs.length === 0 ? (
          <Card className="p-8 text-center text-sm text-slate-500">
            There are currently no active openings posted by this company.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

