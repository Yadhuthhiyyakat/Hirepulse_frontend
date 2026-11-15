import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPasswordSchema, ResetPasswordFormData } from '../schemas/authSchemas';
import { authApi } from '../api/authApi';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card, CardContent } from '@/components/common/Card';
import { showToast } from '@/components/common/Toast';
import { Lock, CheckCircle2 } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const uid = searchParams.get('uid') || '';
  const token = searchParams.get('token') || '';
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setServerError(null);
      await authApi.resetPassword({
        uid,
        token,
        new_password: data.new_password,
      });
      showToast('Password reset successfully! Please sign in with your new password.', 'success');
      navigate('/login');
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Invalid or expired token.');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Set new password</h1>
          <p className="text-sm text-slate-500">Your new password must be at least 8 characters</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {serverError && (
                <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200">
                  {serverError}
                </div>
              )}

              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock className="h-4 w-4" />}
                error={errors.new_password?.message}
                {...register('new_password')}
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock className="h-4 w-4" />}
                error={errors.confirm_password?.message}
                {...register('confirm_password')}
              />

              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Reset Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

