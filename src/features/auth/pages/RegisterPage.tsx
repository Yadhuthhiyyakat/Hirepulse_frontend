import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema, RegisterFormData } from '../schemas/authSchemas';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/common/Card';
import { showToast } from '@/components/common/Toast';
import { Briefcase, Lock, Mail, User, Phone, CheckCircle2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
      role: 'JOB_SEEKER',
      phone: '',
      password: '',
      password_confirm: '',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setServerError(null);
      const user = await registerUser(data);
      showToast('Account created successfully! Welcome to HirePulse.', 'success');

      if (user.role === 'RECRUITER') {
        navigate('/recruiter/company', { replace: true });
      } else {
        navigate('/jobs', { replace: true });
      }
    } catch (err: any) {
      const errData = err.response?.data;
      if (errData?.errors?.server?.[0]) {
        setServerError(errData.errors.server[0]);
      } else if (errData?.errors?.email) {
        setServerError(errData.errors.email[0]);
      } else if (errData?.message) {
        setServerError(errData.message);
      } else {
        setServerError('Registration failed. Please check your inputs.');
      }
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-md">
            <Briefcase className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create an Account</h1>
          <p className="text-sm text-slate-500">Join thousands of companies and professionals today</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {serverError && (
                <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200">
                  {serverError}
                </div>
              )}

              {/* Role Selection Tabs */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">I want to:</label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setValue('role', 'JOB_SEEKER')}
                    className={`cursor-pointer rounded-xl border p-3 text-center transition-all ${
                      selectedRole === 'JOB_SEEKER'
                        ? 'border-primary bg-primary-50/50 text-primary shadow-sm font-medium'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-sm font-semibold">Find a Job</div>
                    <div className="text-xs text-slate-500 mt-0.5">I am a job seeker</div>
                  </div>

                  <div
                    onClick={() => setValue('role', 'RECRUITER')}
                    className={`cursor-pointer rounded-xl border p-3 text-center transition-all ${
                      selectedRole === 'RECRUITER'
                        ? 'border-primary bg-primary-50/50 text-primary shadow-sm font-medium'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-sm font-semibold">Hire Talent</div>
                    <div className="text-xs text-slate-500 mt-0.5">I am an employer/recruiter</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  placeholder="John"
                  leftIcon={<User className="h-4 w-4" />}
                  error={errors.first_name?.message}
                  {...register('first_name')}
                />
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  leftIcon={<User className="h-4 w-4" />}
                  error={errors.last_name?.message}
                  {...register('last_name')}
                />
              </div>

              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Phone number"
                type="tel"
                placeholder="+1 (555) 000-0000"
                leftIcon={<Phone className="h-4 w-4" />}
                error={errors.phone?.message}
                {...register('phone')}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Password"
                  type="password"
                  placeholder="At least 8 chars"
                  leftIcon={<Lock className="h-4 w-4" />}
                  error={errors.password?.message}
                  {...register('password')}
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Repeat password"
                  leftIcon={<Lock className="h-4 w-4" />}
                  error={errors.password_confirm?.message}
                  {...register('password_confirm')}
                />
              </div>

              <Button type="submit" className="w-full mt-2" isLoading={isSubmitting}>
                Create {selectedRole === 'RECRUITER' ? 'Recruiter' : 'Candidate'} Account
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-slate-100 py-4 text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="ml-1 font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

