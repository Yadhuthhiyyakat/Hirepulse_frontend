import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/notificationsApi';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { formatTimeAgo } from '@/lib/utils';
import { Bell, Check, Clock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotificationsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', page],
    queryFn: () => notificationsApi.getNotifications(page),
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

  const paginatedData = data?.data;
  const notifications = paginatedData?.results || [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time status updates on your applications, interviews, and candidates.
          </p>
        </div>

        {notifications.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllReadMutation.mutate()}
            className="gap-1.5 self-start sm:self-auto text-xs"
          >
            <Check className="w-3.5 h-3.5" /> Mark All as Read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-6 h-6 text-slate-400" />}
          title="No notifications yet"
          description="When you apply for a job or receive candidate updates, alerts will show up here in real time."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <Card
              key={item.id}
              onClick={() => !item.is_read && markReadMutation.mutate(item.id)}
              className={`p-4 transition-all cursor-pointer flex items-start gap-4 ${
                !item.is_read ? 'border-primary/40 bg-blue-50/20' : 'bg-white'
              }`}
            >
              <div
                className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 ${
                  !item.is_read ? 'bg-primary' : 'bg-slate-200'
                }`}
              />

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(item.created_at)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
              </div>
            </Card>
          ))}

          {paginatedData && (
            <Pagination
              currentPage={paginatedData.current_page}
              totalPages={paginatedData.total_pages}
              hasNext={paginatedData.has_next}
              hasPrevious={paginatedData.has_previous}
              onPageChange={(p) => setPage(p)}
            />
          )}
        </div>
      )}
    </div>
  );
};

