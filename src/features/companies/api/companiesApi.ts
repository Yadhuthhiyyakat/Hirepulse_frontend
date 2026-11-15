import apiClient from '@/lib/axios';
import { Company, PaginatedResponse, ApiResponse } from '@/types';

export const companiesApi = {
  getCompanies: async (params?: { search?: string; page?: number }): Promise<ApiResponse<PaginatedResponse<Company>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Company>>>('/companies/', { params });
    return response.data;
  },

  getCompanyById: async (id: string): Promise<ApiResponse<Company>> => {
    const response = await apiClient.get<ApiResponse<Company>>(`/companies/${id}/`);
    return response.data;
  },

  getMyCompany: async (): Promise<ApiResponse<Company>> => {
    const response = await apiClient.get<ApiResponse<Company>>('/companies/my_company/');
    return response.data;
  },

  createCompany: async (data: FormData | Partial<Company>): Promise<ApiResponse<Company>> => {
    const response = await apiClient.post<ApiResponse<Company>>('/companies/', data);
    return response.data;
  },

  updateCompany: async (id: string, data: FormData | Partial<Company>): Promise<ApiResponse<Company>> => {
    const response = await apiClient.patch<ApiResponse<Company>>(`/companies/${id}/`, data);
    return response.data;
  },
};

