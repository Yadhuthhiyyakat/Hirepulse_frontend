import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '@/types';
import { Card } from '@/components/common/Card';
import { JobTypeBadge, WorkModeBadge, Badge } from '@/components/common/Badge';
import { formatCurrency, formatTimeAgo } from '@/lib/utils';
import { MapPin, DollarSign, Bookmark, Building2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface JobCardProps {
  job: Job;
  onToggleSave?: (jobId: string) => void;
  isSaving?: boolean;
}

export const JobCard: React.FC<JobCardProps> = React.memo(({ job, onToggleSave, isSaving = false }) => {
  const { isAuthenticated, role } = useAuth();

  return (
    <Card className="group relative flex flex-col justify-between p-6 hover:border-primary/40 hover:shadow-md transition-all">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 overflow-hidden">
              {job.company?.logo ? (
                <img
                  src={job.company.logo}
                  alt={job.company.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="h-6 w-6 text-slate-400" />
              )}
            </div>

            <div>
              <Link
                to={`/jobs/${job.id}`}
                className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1"
              >
                {job.title}
              </Link>
              <Link
                to={`/companies/${job.company?.id}`}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                {job.company?.name}
              </Link>
            </div>
          </div>

          {isAuthenticated && role === 'JOB_SEEKER' && onToggleSave && (
            <button
              onClick={() => onToggleSave(job.id)}
              disabled={isSaving}
              aria-label={job.is_saved ? 'Unsave job' : 'Save job'}
              className={`rounded-lg p-2 transition-colors ${
                job.is_saved
                  ? 'bg-blue-50 text-primary hover:bg-blue-100'
                  : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${job.is_saved ? 'fill-primary' : ''}`} />
            </button>
          )}
        </div>

        {/* Location & Salary */}
        <div className="mt-3 flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {job.location}
          </span>
          {(job.salary_min || job.salary_max) && (
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
              {job.salary_min ? formatCurrency(job.salary_min) : '$0'} -{' '}
              {job.salary_max ? formatCurrency(job.salary_max) : 'Negotiable'}
            </span>
          )}
        </div>

        {/* Description snippet */}
        <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Badges */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          <JobTypeBadge type={job.job_type} />
          <WorkModeBadge mode={job.work_mode} />
          <Badge variant="outline">{job.experience_level.toLowerCase()}</Badge>

          {job.skills?.slice(0, 3).map((skill, i) => (
            <span
              key={i}
              className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
            >
              {skill}
            </span>
          ))}
          {job.skills && job.skills.length > 3 && (
            <span className="text-[11px] text-slate-400 self-center">
              +{job.skills.length - 3} more
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-400">
        <span>Posted {formatTimeAgo(job.created_at)}</span>

        {job.has_applied ? (
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" /> Applied
          </span>
        ) : (
          <Link
            to={`/jobs/${job.id}`}
            className="font-medium text-primary hover:text-primary-hover hover:underline"
          >
            View Details &rarr;
          </Link>
        )}
      </div>
    </Card>
  );
});

