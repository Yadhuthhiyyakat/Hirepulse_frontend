import { z } from 'zod';

export const jobSchema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters'),
  description: z.string().min(20, 'Please provide a detailed job description (at least 20 characters)'),
  requirements: z.string().optional(),
  responsibilities: z.string().optional(),
  skills: z.array(z.string()).min(1, 'Please specify at least one required skill'),
  location: z.string().min(2, 'Location is required (e.g. City, Country or Remote)'),
  job_type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']),
  work_mode: z.enum(['REMOTE', 'HYBRID', 'ONSITE']),
  experience_level: z.enum(['ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD']),
  salary_min: z.coerce.number().optional().nullable(),
  salary_max: z.coerce.number().optional().nullable(),
  application_deadline: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED']),
}).refine(
  (data) => {
    if (data.salary_min && data.salary_max) {
      return Number(data.salary_min) <= Number(data.salary_max);
    }
    return true;
  },
  {
    message: 'Maximum salary cannot be less than minimum salary',
    path: ['salary_max'],
  }
);

export type JobFormData = z.infer<typeof jobSchema>;

