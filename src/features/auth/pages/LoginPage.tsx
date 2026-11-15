import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginSchema, LoginFormData } from '../schemas/authSchemas';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/common/Card';
import { showToast } from '@/components/common/Toast';
import { Briefcase, Lock, Mail, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);

  const from = location.state?.from?.pathname || null;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError(null);
      const user = await login(data);
      showToast('Welcome back!', 'success');

      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'RECRUITER') {
        navigate('/recruiter/dashboard', { replace: true });
      } else if (user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/jobs', { replace: true });
      }
    } catch (err: any) {
      const msg = err.response?.data?.errors?.server?.[0] || err.response?.data?.message || err.response?.data?.detail || 'Invalid email or password';
      setServerError(msg);
    }
  };

  const fillDemoAccount = (role: 'JOB_SEEKER' | 'RECRUITER' | 'ADMIN') => {
    if (role === 'JOB_SEEKER') {
      setValue('email', 'john.doe@example.com');
      setValue('password', 'Seeker@123456');
    } else if (role === 'RECRUITER') {
      setValue('email', 'recruiter@techcorp.com');
      setValue('password', 'Recruiter@123');
    } else if (role === 'ADMIN') {
      setValue('email', 'admin@recruitment.com');
      setValue('password', 'Admin@123456');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-md">
            <Briefcase className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sign in to HirePulse</h1>
          <p className="text-sm text-slate-500">Access your applications, job postings and candidate pipeline</p>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-900">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Quick Demo Logins (Click to autofill)</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('JOB_SEEKER')}
              className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Job Seeker
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('RECRUITER')}
              className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Recruiter
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('ADMIN')}
              className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Admin
            </button>
          </div>
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
                label="Email address"
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <div className="space-y-1">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  leftIcon={<Lock className="h-4 w-4" />}
                  error={errors.password?.message}
                  {...register('password')}
                />
                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:text-primary-hover font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Sign In
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-slate-100 py-4 text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="ml-1 font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

