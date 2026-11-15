export type Role = 'JOB_SEEKER' | 'RECRUITER' | 'ADMIN';

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
export type WorkMode = 'REMOTE' | 'HYBRID' | 'ONSITE';
export type ExperienceLevel = 'ENTRY' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD';
export type JobStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED';

export type ApplicationStatus =
  | 'APPLIED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'INTERVIEW'
  | 'REJECTED'
  | 'HIRED';

export interface EducationItem {
  institution: string;
  degree: string;
  field_of_study?: string;
  start_year?: string;
  end_year?: string;
}

export interface ExperienceItem {
  company: string;
  title: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  current?: boolean;
  description?: string;
}

export interface Profile {
  id: string;
  bio?: string;
  location?: string;
  skills?: string[];
  education?: EducationItem[];
  experience?: ExperienceItem[];
  portfolio_url?: string;
  linkedin_url?: string;
  github_url?: string;
  resume?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: Role;
  phone?: string;
  profile_picture?: string | null;
  is_active?: boolean;
  profile?: Profile;
  created_at?: string;
  updated_at?: string;
}

export interface CompanySummary {
  id: string;
  name: string;
  logo?: string | null;
  industry?: string;
  location?: string;
  website?: string;
  company_size?: string;
}

export interface Company extends CompanySummary {
  recruiter: string;
  recruiter_name?: string;
  recruiter_email?: string;
  description?: string;
  founded_year?: number | null;
  jobs_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Job {
  id: string;
  company: CompanySummary;
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  skills: string[];
  location: string;
  job_type: JobType;
  work_mode: WorkMode;
  experience_level: ExperienceLevel;
  salary_min?: number | string | null;
  salary_max?: number | string | null;
  application_deadline?: string | null;
  status: JobStatus;
  is_saved?: boolean;
  has_applied?: boolean;
  applications_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CandidateSummary {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone?: string;
  profile_picture?: string | null;
  bio?: string;
  location?: string;
  skills?: string[];
  education?: EducationItem[];
  experience?: ExperienceItem[];
  portfolio_url?: string;
  linkedin_url?: string;
  github_url?: string;
}

export interface Application {
  id: string;
  job: Job;
  candidate: CandidateSummary;
  resume: string;
  cover_letter?: string;
  status: ApplicationStatus;
  internal_notes?: string;
  interview_date?: string | null;
  applied_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  notification_type: 'STATUS_UPDATE' | 'INTERVIEW' | 'NEW_APPLICATION' | 'JOB_ALERT' | 'SYSTEM';
  data?: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  total_pages: number;
  current_page: number;
  has_next: boolean;
  has_previous: boolean;
  results: T[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}

export interface JobFilterParams {
  search?: string;
  location?: string;
  job_type?: string;
  work_mode?: string;
  experience_level?: string;
  salary_min?: number | string;
  salary_max?: number | string;
  skill?: string;
  company?: string;
  page?: number;
  ordering?: string;
}

