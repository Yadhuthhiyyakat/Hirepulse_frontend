import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '../api/jobsApi';
import { jobSchema, JobFormData } from '../schemas/jobSchema';
import { Card, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { showToast } from '@/components/common/Toast';
import { Plus, X, ArrowLeft } from 'lucide-react';

export const EditJobPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobsApi.getJobById(id!),
    enabled: !!id,
  });

  const rawData = data as any;
  const job = rawData?.data?.id ? rawData.data : (rawData?.id ? rawData : null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
  });

  useEffect(() => {
    if (job) {
      reset({
        title: job.title,
        description: job.description,
        requirements: job.requirements || '',
        responsibilities: job.responsibilities || '',
        skills: job.skills || [],
        location: job.location,
        job_type: job.job_type,
        work_mode: job.work_mode,
        experience_level: job.experience_level,
        salary_min: job.salary_min ? Number(job.salary_min) : null,
        salary_max: job.salary_max ? Number(job.salary_max) : null,
        status: job.status,
      });
      setSkills(job.skills || []);
    }
  }, [job, reset]);

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      const updated = [...skills, trimmed];
      setSkills(updated);
      setValue('skills', updated);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    const updated = skills.filter((s) => s !== skill);
    setSkills(updated);
    setValue('skills', updated);
  };

  const updateMutation = useMutation({
    mutationFn: (formData: JobFormData) => jobsApi.updateJob(id!, formData),
    onSuccess: () => {
      showToast('Job listing updated successfully!', 'success');
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
      navigate('/recruiter/jobs');
    },
    onError: (err: any) => {
      showToast(err.response?.data?.message || 'Failed to update job.', 'error');
    },
  });

  const onSubmit = (formData: JobFormData) => {
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="p-12 text-center text-sm text-slate-500">Loading job details...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Job Listing</h1>
          <p className="text-xs text-slate-500">Update position details, requirements and compensation</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Job Title *"
              error={errors.title?.message}
              {...register('title')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Job Type *</label>
                <select
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                  {...register('job_type')}
                >
                  <option value="FULL_TIME">Full-time</option>
                  <option value="PART_TIME">Part-time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Work Arrangement *</label>
                <select
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                  {...register('work_mode')}
                >
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="ONSITE">On-site</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Experience Level *</label>
                <select
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                  {...register('experience_level')}
                >
                  <option value="ENTRY">Entry Level</option>
                  <option value="JUNIOR">Junior (1-2 yrs)</option>
                  <option value="MID">Mid Level (3-5 yrs)</option>
                  <option value="SENIOR">Senior (5+ yrs)</option>
                  <option value="LEAD">Lead / Architect</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Location *"
                error={errors.location?.message}
                {...register('location')}
              />

              <Input
                label="Minimum Annual Salary ($)"
                type="number"
                error={errors.salary_min?.message}
                {...register('salary_min')}
              />

              <Input
                label="Maximum Annual Salary ($)"
                type="number"
                error={errors.salary_max?.message}
                {...register('salary_max')}
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Required Technical Skills *
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add skill..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <Button type="button" variant="secondary" onClick={handleAddSkill}>
                  <Plus className="w-4 h-4" /> Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-primary border border-blue-200"
                  >
                    {skill}
                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-red-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Role Overview *</label>
              <textarea
                rows={5}
                className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                {...register('description')}
              />
            </div>

            {/* Responsibilities */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Key Responsibilities</label>
              <textarea
                rows={4}
                className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                {...register('responsibilities')}
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Candidate Requirements & Qualifications</label>
              <textarea
                rows={4}
                className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                {...register('requirements')}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-700">Status:</label>
                <select
                  className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs"
                  {...register('status')}
                >
                  <option value="PUBLISHED">Published (Active)</option>
                  <option value="DRAFT">Draft</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <Button type="button" variant="outline" onClick={() => navigate('/recruiter/jobs')}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting || updateMutation.isPending}>
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

