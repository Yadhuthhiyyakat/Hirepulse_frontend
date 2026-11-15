import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '../api/jobsApi';
import { applicationsApi } from '@/features/applications/api/applicationsApi';
import { useAuth } from '@/hooks/useAuth';
import { Job } from '@/types';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { JobTypeBadge, WorkModeBadge, Badge } from '@/components/common/Badge';
import { Card, CardContent } from '@/components/common/Card';
import { formatCurrency, formatDate, formatTimeAgo } from '@/lib/utils';
import { showToast } from '@/components/common/Toast';
import {
  MapPin,
  DollarSign,
  Calendar,
  Building2,
  Bookmark,
  Share2,
  CheckCircle2,
  ExternalLink,
  ArrowLeft,
  Upload,
  FileText,
  AlertCircle
} from 'lucide-react';

export const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, role } = useAuth();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applyError, setApplyError] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobsApi.getJobById(id!),
    enabled: !!id,
  });

  const rawData = data as any;
  const job = (rawData?.data?.id ? rawData.data : (rawData?.id ? rawData : null)) as Job | null;

  const toggleSaveMutation = useMutation({
    mutationFn: () => jobsApi.toggleSaveJob(id!),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['job', id] });
      const previousJob = queryClient.getQueryData(['job', id]);

      queryClient.setQueryData(['job', id], (old: any) => {
        if (!old) return old;
        if (old.data) {
          return {
            ...old,
            data: {
              ...old.data,
              is_saved: !old.data.is_saved,
            },
          };
        }
        return {
          ...old,
          is_saved: !old.is_saved,
        };
      });

      return { previousJob };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previousJob) {
        queryClient.setQueryData(['job', id], context.previousJob);
      }
      showToast('Could not update saved job. Please try again.', 'error');
    },
    onSuccess: (res) => {
      showToast(res.message, 'success');
      queryClient.invalidateQueries({ queryKey: ['saved_jobs'] });
    },
  });

  const applyMutation = useMutation({
    mutationFn: async () => {
      if (!resumeFile) {
        throw new Error('Please select or upload a resume file (PDF, DOC, DOCX).');
      }
      return applicationsApi.applyForJob({
        job_id: id!,
        resume: resumeFile,
        cover_letter: coverLetter,
      });
    },
    onSuccess: () => {
      showToast('Application submitted successfully! Good luck.', 'success');
      setIsApplyModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
    onError: (err: any) => {
      const res = err.response?.data;
      const serverErr = res?.errors?.server?.[0];
      const nonFieldErr = res?.errors?.non_field_errors?.[0];
      const jobErr = res?.errors?.job_id?.[0] || res?.errors?.resume?.[0];
      const msg = serverErr || nonFieldErr || jobErr || res?.message || err.message || 'Failed to submit application.';
      setApplyError(msg);
    },
  });

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }
    if (role !== 'JOB_SEEKER') {
      showToast('Only candidate accounts can apply for jobs.', 'error');
      return;
    }
    setApplyError(null);
    setIsApplyModalOpen(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: job?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Job link copied to clipboard!', 'info');
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 animate-pulse space-y-6">
        <div className="h-6 w-32 bg-slate-200 rounded" />
        <div className="h-40 bg-white rounded-xl border p-6 space-y-4" />
        <div className="h-96 bg-white rounded-xl border p-6" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Job Posting Not Found</h2>
        <p className="text-sm text-slate-500">The job you are looking for may have been closed or removed.</p>
        <Link to="/jobs">
          <Button variant="outline">Back to Job Listings</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Search Results
        </Link>
      </div>

      {/* Hero Header Card */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shadow-sm">
              {job.company?.logo ? (
                <img src={job.company.logo} alt={job.company.name} className="h-full w-full object-cover" />
              ) : (
                <Building2 className="h-8 w-8 text-slate-400" />
              )}
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-slate-600">
                <Link
                  to={`/companies/${job.company?.id}`}
                  className="hover:text-primary transition-colors underline-offset-2 hover:underline"
                >
                  {job.company?.name}
                </Link>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-500 font-normal">
                  <MapPin className="w-3.5 h-3.5" /> {job.location}
                </span>
                <span>•</span>
                <span className="text-slate-500 font-normal">
                  Posted {formatTimeAgo(job.created_at)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isAuthenticated && role === 'JOB_SEEKER' && (
              <Button
                variant={job.is_saved ? 'secondary' : 'outline'}
                onClick={() => toggleSaveMutation.mutate()}
                isLoading={toggleSaveMutation.isPending}
                className="gap-1.5"
              >
                <Bookmark className={`w-4 h-4 ${job.is_saved ? 'fill-primary text-primary' : ''}`} />
                {job.is_saved ? 'Saved' : 'Save'}
              </Button>
            )}

            <Button variant="ghost" onClick={handleShare} className="p-2.5">
              <Share2 className="w-4 h-4 text-slate-600" />
            </Button>

            {job.has_applied ? (
              <Button disabled className="bg-emerald-600 text-white gap-1.5 opacity-90 cursor-default">
                <CheckCircle2 className="w-4 h-4" /> Already Applied
              </Button>
            ) : (
              <Button onClick={handleApplyClick} className="shadow-md">
                Apply Now
              </Button>
            )}
          </div>
        </div>

        {/* Highlights Bar */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Job Type</span>
            <div className="mt-1 font-semibold text-slate-800">
              <JobTypeBadge type={job.job_type} />
            </div>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Work Arrangement</span>
            <div className="mt-1 font-semibold text-slate-800">
              <WorkModeBadge mode={job.work_mode} />
            </div>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Experience Level</span>
            <div className="mt-1 font-semibold text-slate-800 capitalize">
              {job.experience_level.toLowerCase()}
            </div>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Compensation Range</span>
            <div className="mt-1 font-semibold text-slate-900">
              {job.salary_min || job.salary_max ? (
                `${job.salary_min ? formatCurrency(job.salary_min) : '$0'} - ${
                  job.salary_max ? formatCurrency(job.salary_max) : 'Negotiable'
                }`
              ) : (
                'Competitive'
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Description & Specs */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
                About the Role
              </h2>
              <div className="mt-3 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {job.responsibilities && (
              <div className="pt-4 border-t border-slate-100">
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
                  Key Responsibilities
                </h2>
                <div className="mt-3 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {job.responsibilities}
                </div>
              </div>
            )}

            {job.requirements && (
              <div className="pt-4 border-t border-slate-100">
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
                  Qualifications & Requirements
                </h2>
                <div className="mt-3 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {job.requirements}
                </div>
              </div>
            )}

            {job.skills && job.skills.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs mb-3">
                  Required Technologies & Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-lg bg-blue-50/80 px-3 py-1 text-xs font-semibold text-primary border border-blue-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Company Snapshot */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Company Overview
            </h3>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 border overflow-hidden">
                {job.company?.logo ? (
                  <img src={job.company.logo} alt={job.company.name} className="h-full w-full object-cover" />
                ) : (
                  <Building2 className="h-6 w-6 text-slate-400" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{job.company?.name}</h4>
                <p className="text-xs text-slate-500">{job.company?.industry || 'Technology'}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Location</span>
                <span className="font-medium text-slate-800">{job.company?.location || 'Global'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Company Size</span>
                <span className="font-medium text-slate-800">{job.company?.company_size || '50-200'}</span>
              </div>
              {job.company?.website && (
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Website</span>
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    Visit Site <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            <Link to={`/companies/${job.company?.id}`} className="block w-full">
              <Button variant="outline" size="sm" className="w-full">
                View Company Profile
              </Button>
            </Link>
          </Card>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={`Apply for ${job.title}`}
        description={`Submit your resume and details to the recruiting team at ${job.company?.name}`}
        maxWidth="lg"
      >
        <div className="space-y-4 pt-2">
          {applyError && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{applyError}</span>
            </div>
          )}

          {/* Resume Upload Box */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Resume / CV *</label>
            <div className="rounded-xl border-2 border-dashed border-slate-300 p-5 text-center hover:border-primary transition-colors bg-slate-50/50">
              <input
                type="file"
                id="resume-upload"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setResumeFile(e.target.files[0]);
                  }
                }}
              />
              <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-primary mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                {resumeFile ? (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <FileText className="w-4 h-4" />
                    <span>{resumeFile.name} ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-medium text-slate-700">
                      Click to upload your resume
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      PDF, DOC, DOCX up to 5MB
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Cover Letter */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Cover Letter / Introduction (Optional)
            </label>
            <textarea
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell the hiring manager why you are interested in this position and what unique value you bring..."
              className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setIsApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => applyMutation.mutate()}
              isLoading={applyMutation.isPending}
              disabled={!resumeFile}
            >
              Submit Application
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

