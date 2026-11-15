import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { ApplicationStatus, JobType, WorkMode, ExperienceLevel } from '@/types';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'info';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', children, ...props }) => {
  const variants = {
    default: 'bg-primary-50 text-primary-700 border-primary-200',
    secondary: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    outline: 'border border-slate-300 text-slate-700 bg-white',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const StatusBadge: React.FC<{ status: ApplicationStatus | string }> = ({ status }) => {
  const statusConfig: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    APPLIED: { label: 'Applied', variant: 'secondary' },
    UNDER_REVIEW: { label: 'Under Review', variant: 'warning' },
    SHORTLISTED: { label: 'Shortlisted', variant: 'info' },
    INTERVIEW: { label: 'Interview Scheduled', variant: 'default' },
    REJECTED: { label: 'Not Selected', variant: 'danger' },
    HIRED: { label: 'Hired 🎉', variant: 'success' },
    PUBLISHED: { label: 'Active', variant: 'success' },
    DRAFT: { label: 'Draft', variant: 'secondary' },
    CLOSED: { label: 'Closed', variant: 'danger' },
  };

  const config = statusConfig[status] || { label: status, variant: 'secondary' };

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export const JobTypeBadge: React.FC<{ type: JobType }> = ({ type }) => {
  const labels: Record<JobType, string> = {
    FULL_TIME: 'Full-time',
    PART_TIME: 'Part-time',
    CONTRACT: 'Contract',
    INTERNSHIP: 'Internship',
  };
  return <Badge variant="secondary">{labels[type] || type}</Badge>;
};

export const WorkModeBadge: React.FC<{ mode: WorkMode }> = ({ mode }) => {
  const labels: Record<WorkMode, { label: string; variant: BadgeProps['variant'] }> = {
    REMOTE: { label: 'Remote', variant: 'success' },
    HYBRID: { label: 'Hybrid', variant: 'info' },
    ONSITE: { label: 'On-site', variant: 'secondary' },
  };
  const config = labels[mode] || { label: mode, variant: 'secondary' };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

