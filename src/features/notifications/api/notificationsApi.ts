import apiClient from '@/lib/axios';
import { Notification, PaginatedResponse, ApiResponse } from '@/types';

export const notificationsApi = {
  getNotifications: async (page = 1): Promise<ApiResponse<PaginatedResponse<Notification>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Notification>>>('/notifications/', {
      params: { page },
    });
    return response.data;
  },

  getUnreadCount: async (): Promise<ApiResponse<{ unread_count: number }>> => {
    const response = await apiClient.get<ApiResponse<{ unread_count: number }>>('/notifications/unread_count/');
    return response.data;
  },

  markAsRead: async (id: string): Promise<ApiResponse<Notification>> => {
    const response = await apiClient.patch<ApiResponse<Notification>>(`/notifications/${id}/mark_read/`);
    return response.data;
  },

  markAllAsRead: async (): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/notifications/mark_all_read/');
    return response.data;
  },
};

