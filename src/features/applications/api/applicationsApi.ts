import apiClient from '@/lib/axios';
import { Application, ApplicationStatus, PaginatedResponse, ApiResponse } from '@/types';

export interface ApplyPayload {
  job_id: string;
  resume: File;
  cover_letter?: string;
}

export interface RecruiterStats {
  active_jobs: number;
  total_applications: number;
  shortlisted: number;
  interviews: number;
  hired: number;
}

export interface JobSeekerStats {
  total_applications: number;
  saved_jobs: number;
  interviews: number;
  profile_completion: number;
}

export interface AdminStats {
  total_users: number;
  total_companies: number;
  total_jobs: number;
  total_applications: number;
  users_by_role: Array<{ role: string; count: number }>;
  jobs_by_type: Array<{ job_type: string; count: number }>;
  applications_by_status: Array<{ status: string; count: number }>;
  trends: Array<{ month: string; jobs: number; applications: number }>;
}

export const applicationsApi = {
  getApplications: async (params?: { job?: string; status?: ApplicationStatus; search?: string; page?: number }): Promise<ApiResponse<PaginatedResponse<Application>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Application>>>('/applications/', { params });
    return response.data;
  },

  getApplicationById: async (id: string): Promise<ApiResponse<Application>> => {
    const response = await apiClient.get<ApiResponse<Application>>(`/applications/${id}/`);
    return response.data;
  },

  applyForJob: async (data: ApplyPayload): Promise<ApiResponse<Application>> => {
    const formData = new FormData();
    formData.append('job_id', data.job_id);
    formData.append('resume', data.resume);
    if (data.cover_letter) {
      formData.append('cover_letter', data.cover_letter);
    }
    const response = await apiClient.post<ApiResponse<Application>>('/applications/', formData);
    return response.data;
  },

  updateStatus: async (
    id: string,
    payload: { status: ApplicationStatus; internal_notes?: string; interview_date?: string }
  ): Promise<ApiResponse<Application>> => {
    const response = await apiClient.patch<ApiResponse<Application>>(
      `/applications/${id}/update_status/`,
      payload
    );
    return response.data;
  },

  getRecruiterStats: async (): Promise<ApiResponse<RecruiterStats>> => {
    const response = await apiClient.get<ApiResponse<RecruiterStats>>('/applications/recruiter_stats/');
    return response.data;
  },

  getJobSeekerStats: async (): Promise<ApiResponse<JobSeekerStats>> => {
    const response = await apiClient.get<ApiResponse<JobSeekerStats>>('/applications/jobseeker_stats/');
    return response.data;
  },

  getAdminStats: async (): Promise<ApiResponse<AdminStats>> => {
    const response = await apiClient.get<ApiResponse<AdminStats>>('/applications/admin_stats/');
    return response.data;
  },
};

