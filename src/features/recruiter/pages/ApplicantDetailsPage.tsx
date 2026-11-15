import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationsApi } from '@/features/applications/api/applicationsApi';
import { ApplicationStatus, Application } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { StatusBadge } from '@/components/common/Badge';
import { showToast } from '@/components/common/Toast';
import { formatDate } from '@/lib/utils';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  FileText,
  Globe,
  Github,
  Linkedin,
  Calendar,
  Save,
  CheckCircle2,
  Building2
} from 'lucide-react';

export const ApplicantDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['applicant-details', id],
    queryFn: () => applicationsApi.getApplicationById(id!),
    enabled: !!id,
  });

  const rawData = data as any;
  const application = (rawData?.data?.id ? rawData.data : (rawData?.id ? rawData : null)) as Application | null;
  const candidate = application?.candidate;

  const [currentStatus, setCurrentStatus] = useState<ApplicationStatus>('APPLIED');
  const [internalNotes, setInternalNotes] = useState('');
  const [interviewDate, setInterviewDate] = useState('');

  useEffect(() => {
    if (application) {
      setCurrentStatus(application.status);
      setInternalNotes(application.internal_notes || '');
      setInterviewDate(application.interview_date ? application.interview_date.substring(0, 16) : '');
    }
  }, [application]);

  const updateMutation = useMutation({
    mutationFn: () =>
      applicationsApi.updateStatus(id!, {
        status: currentStatus,
        internal_notes: internalNotes,
        interview_date: interviewDate ? new Date(interviewDate).toISOString() : undefined,
      }),
    onSuccess: () => {
      showToast('Application updated and candidate notified.', 'success');
      queryClient.invalidateQueries({ queryKey: ['applicant-details', id] });
      queryClient.invalidateQueries({ queryKey: ['recruiter-applicants'] });
    },
    onError: () => {
      showToast('Failed to update application.', 'error');
    },
  });

  if (isLoading) {
    return <div className="p-12 text-center text-sm text-slate-500">Loading candidate profile...</div>;
  }

  if (isError || !application) {
    return (
      <div className="p-12 text-center text-sm text-slate-500">
        Candidate application not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {candidate?.full_name}
          </h1>
          <p className="text-xs text-slate-500">
            Applied for <span className="font-semibold text-slate-700">{application.job.title}</span> on {formatDate(application.applied_at)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Candidate Profile & Resume */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-100 border text-slate-700 font-bold text-xl overflow-hidden">
                {candidate?.profile_picture ? (
                  <img src={candidate.profile_picture} alt={candidate.full_name} className="h-full w-full object-cover" />
                ) : (
                  candidate?.first_name?.charAt(0) || 'U'
                )}
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900">{candidate?.full_name}</h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> {candidate?.email}
                  </span>
                  {candidate?.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" /> {candidate.phone}
                    </span>
                  )}
                  {candidate?.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {candidate.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Links and Resume */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
              {application.resume && (
                <a
                  href={application.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-white px-3.5 py-1.5 text-xs font-semibold hover:bg-primary-hover shadow-sm"
                >
                  <FileText className="w-4 h-4" /> Download Resume
                </a>
              )}
              {candidate?.portfolio_url && (
                <a
                  href={candidate.portfolio_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
                >
                  <Globe className="w-3.5 h-3.5" /> Portfolio
                </a>
              )}
              {candidate?.linkedin_url && (
                <a
                  href={candidate.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
                >
                  <Linkedin className="w-3.5 h-3.5 text-blue-600" /> LinkedIn
                </a>
              )}
              {candidate?.github_url && (
                <a
                  href={candidate.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
                >
                  <Github className="w-3.5 h-3.5" /> GitHub
                </a>
              )}
            </div>

            {/* Cover Letter */}
            {application.cover_letter && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Cover Letter / Candidate Statement
                </h3>
                <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                  {application.cover_letter}
                </div>
              </div>
            )}

            {/* Skills */}
            {candidate?.skills && candidate.skills.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Technical Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {candidate?.experience && candidate.experience.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Experience History
                </h3>
                {candidate.experience.map((exp, i) => (
                  <div key={i} className="text-xs space-y-1">
                    <p className="font-bold text-slate-900">{exp.title} at {exp.company}</p>
                    <p className="text-slate-500">{exp.start_date} - {exp.current ? 'Present' : exp.end_date}</p>
                    {exp.description && <p className="text-slate-600 mt-1">{exp.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Hiring Actions & Internal Notes */}
        <div className="space-y-6">
          <Card className="p-6 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recruitment Workflow Actions
            </h3>

            {/* Stage Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Hiring Funnel Stage</label>
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value as ApplicationStatus)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="APPLIED">Applied</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="INTERVIEW">Interview</option>
                <option value="HIRED">Hired 🎉</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* Interview Date Picker */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Schedule Interview</label>
              <input
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Internal Notes (Requirement #4: "Add internal notes") */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Internal Recruiter Notes (Confidential)
              </label>
              <textarea
                rows={5}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Write private notes on coding assessment, culture fit, interview feedback... (Invisible to candidate)"
                className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <Button
              className="w-full gap-1.5 shadow-sm"
              onClick={() => updateMutation.mutate()}
              isLoading={updateMutation.isPending}
            >
              <Save className="w-4 h-4" /> Save & Update Status
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

