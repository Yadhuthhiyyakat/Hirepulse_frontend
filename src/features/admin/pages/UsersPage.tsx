import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { User, PaginatedResponse, ApiResponse } from '@/types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { Pagination } from '@/components/common/Pagination';
import { showToast } from '@/components/common/Toast';
import { formatDate } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';
import { Search, Shield, UserCheck, UserX, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UsersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 350);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', debouncedSearch, roleFilter, page],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<PaginatedResponse<User>>>('/admin/users/', {
        params: { search: debouncedSearch || undefined, role: roleFilter || undefined, page },
      });
      return res.data;
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return apiClient.patch(`/admin/users/${id}/`, { is_active: !isActive });
    },
    onSuccess: () => {
      showToast('User status updated.', 'success');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const paginatedData = data?.data;
  const users = paginatedData?.results || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/admin/dashboard" className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Management</h1>
          <p className="text-xs text-slate-500">Inspect registered users, manage roles, and enforce security policies</p>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            placeholder="Search by name, email or phone..."
            leftIcon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Account Roles</option>
            <option value="JOB_SEEKER">Job Seeker</option>
            <option value="RECRUITER">Recruiter</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </Card>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-4">User</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Joined Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">Loading users...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">No users found.</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div>{u.full_name}</div>
                    <div className="text-slate-400 font-normal">{u.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={u.role === 'ADMIN' ? 'danger' : u.role === 'RECRUITER' ? 'default' : 'secondary'}>
                      {u.role.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 font-semibold ${u.is_active ? 'text-emerald-600' : 'text-red-500'}`}>
                      {u.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {formatDate(u.created_at)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      size="sm"
                      variant={u.is_active ? 'outline' : 'secondary'}
                      onClick={() => toggleStatusMutation.mutate({ id: u.id, isActive: !!u.is_active })}
                      className="text-xs"
                    >
                      {u.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
  );
};

