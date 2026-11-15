import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '../api/jobsApi';
import { jobSchema, JobFormData } from '../schemas/jobSchema';
import { Card, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { showToast } from '@/components/common/Toast';
import { Plus, X, ArrowLeft } from 'lucide-react';

export const CreateJobPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [skills, setSkills] = useState<string[]>(['React', 'TypeScript']);
  const [skillInput, setSkillInput] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      description: '',
      requirements: '',
      responsibilities: '',
      skills: ['React', 'TypeScript'],
      location: '',
      job_type: 'FULL_TIME',
      work_mode: 'REMOTE',
      experience_level: 'MID',
      salary_min: 90000,
      salary_max: 130000,
      status: 'PUBLISHED',
    },
  });

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

  const createMutation = useMutation({
    mutationFn: (data: JobFormData) => jobsApi.createJob(data),
    onSuccess: (res) => {
      showToast('Job posting created and published!', 'success');
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
      navigate('/recruiter/jobs');
    },
    onError: (err: any) => {
      showToast(err.response?.data?.message || 'Failed to post job. Please check company profile.', 'error');
    },
  });

  const onSubmit = (data: JobFormData) => {
    createMutation.mutate(data);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Post a New Job Opening</h1>
          <p className="text-xs text-slate-500">Create an attractive position description to source high-caliber talent</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Job Title *"
              placeholder="e.g. Senior Frontend Architect (React / Next.js)"
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
                placeholder="e.g. San Francisco, CA or Remote"
                error={errors.location?.message}
                {...register('location')}
              />

              <Input
                label="Minimum Annual Salary ($)"
                type="number"
                placeholder="e.g. 90000"
                error={errors.salary_min?.message}
                {...register('salary_min')}
              />

              <Input
                label="Maximum Annual Salary ($)"
                type="number"
                placeholder="e.g. 130000"
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
                  placeholder="Type a skill and press Enter or Add..."
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
              {errors.skills && <p className="text-xs text-red-600 mt-1">{errors.skills.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Role Overview *</label>
              <textarea
                rows={5}
                placeholder="Describe the opportunity, core mission, team dynamics..."
                className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                {...register('description')}
              />
              {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>}
            </div>

            {/* Responsibilities */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Key Responsibilities</label>
              <textarea
                rows={4}
                placeholder="• Architect core UI components&#10;• Optimize API performance&#10;• Collaborate with product designers"
                className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                {...register('responsibilities')}
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Candidate Requirements & Qualifications</label>
              <textarea
                rows={4}
                placeholder="• 3+ years experience with React and TypeScript&#10;• Strong background in REST APIs&#10;• Solid computer science fundamentals"
                className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                {...register('requirements')}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-700">Initial Status:</label>
                <select
                  className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs"
                  {...register('status')}
                >
                  <option value="PUBLISHED">Published (Active)</option>
                  <option value="DRAFT">Save as Draft</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <Button type="button" variant="outline" onClick={() => navigate('/recruiter/jobs')}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting || createMutation.isPending}>
                  Post Job Opening
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

