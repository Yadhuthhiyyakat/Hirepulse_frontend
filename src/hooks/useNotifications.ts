import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '@/features/notifications/api/notificationsApi';
import { socketService } from '@/services/socketService';
import { useAuth } from '@/hooks/useAuth';
import { Notification } from '@/types';

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const { data: unreadData, refetch: refetchUnread } = useQuery({
    queryKey: ['notifications', 'unread_count'],
    queryFn: notificationsApi.getUnreadCount,
    enabled: isAuthenticated,
    refetchInterval: 120000, // passive backup poll every 2 minutes (WebSockets push realtime events)
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      socketService.disconnect();
      return;
    }

    socketService.connect();

    const unsubscribe = socketService.subscribe((newNotification: Notification) => {
      // Invalidate queries to fetch new notifications and unread counter
      queryClient.invalidateQueries({ queryKey: ['notifications'] });

      // Trigger custom toast event
      window.dispatchEvent(
        new CustomEvent('app:toast', {
          detail: {
            title: newNotification.title,
            message: newNotification.message,
            type: 'info',
          },
        })
      );
    });

    return () => {
      unsubscribe();
    };
  }, [isAuthenticated, queryClient]);

  return {
    unreadCount: unreadData?.data?.unread_count || 0,
    markAsRead: markReadMutation.mutate,
    markAllAsRead: markAllReadMutation.mutate,
    refetchUnread,
  };
};

