import apiClient from '@/lib/axios';
import { Job, PaginatedResponse, ApiResponse, JobFilterParams } from '@/types';

export const jobsApi = {
  getJobs: async (params?: JobFilterParams): Promise<ApiResponse<PaginatedResponse<Job>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Job>>>('/jobs/', { params });
    return response.data;
  },

  getJobById: async (id: string): Promise<ApiResponse<Job>> => {
    const response = await apiClient.get<ApiResponse<Job>>(`/jobs/${id}/`);
    return response.data;
  },

  createJob: async (jobData: Partial<Job>): Promise<ApiResponse<Job>> => {
    const response = await apiClient.post<ApiResponse<Job>>('/jobs/', jobData);
    return response.data;
  },

  updateJob: async (id: string, jobData: Partial<Job>): Promise<ApiResponse<Job>> => {
    const response = await apiClient.patch<ApiResponse<Job>>(`/jobs/${id}/`, jobData);
    return response.data;
  },

  deleteJob: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/jobs/${id}/`);
    return response.data;
  },

  toggleSaveJob: async (id: string): Promise<ApiResponse<{ is_saved: boolean }>> => {
    const response = await apiClient.post<ApiResponse<{ is_saved: boolean }>>(`/jobs/${id}/save/`);
    return response.data;
  },

  togglePublishJob: async (id: string): Promise<ApiResponse<Job>> => {
    const response = await apiClient.patch<ApiResponse<Job>>(`/jobs/${id}/toggle_publish/`);
    return response.data;
  },

  getMyJobs: async (page = 1): Promise<ApiResponse<PaginatedResponse<Job>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Job>>>('/jobs/my_jobs/', {
      params: { page },
    });
    return response.data;
  },

  getSavedJobs: async (page = 1): Promise<ApiResponse<PaginatedResponse<{ id: string; job: Job; created_at: string }>>> => {
    const response = await apiClient.get('/jobs/saved/', { params: { page } });
    return response.data;
  },
};

