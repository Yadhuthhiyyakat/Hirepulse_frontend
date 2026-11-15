import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../schemas/authSchemas';
import { authApi } from '../api/authApi';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card, CardContent, CardFooter } from '@/components/common/Card';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resetLink, setResetLink] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const res = await authApi.forgotPassword(data.email);
      setIsSubmitted(true);
      if (res.data?.reset_link) {
        setResetLink(res.data.reset_link);
      }
    } catch {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reset your password</h1>
          <p className="text-sm text-slate-500">
            Enter your email and we'll send you instructions to reset your password.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            {isSubmitted ? (
              <div className="space-y-4 text-center py-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Check your email</h3>
                <p className="text-xs text-slate-500">
                  If an account exists with that email, we've sent password reset instructions.
                </p>
                {resetLink && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg text-xs text-blue-900 text-left border border-blue-200">
                    <p className="font-semibold">Development Demo Direct Link:</p>
                    <Link to={resetLink} className="text-primary underline break-all mt-1 block">
                      Click here to reset your password
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  leftIcon={<Mail className="h-4 w-4" />}
                  error={errors.email?.message}
                  {...register('email')}
                />

                <Button type="submit" className="w-full" isLoading={isSubmitting}>
                  Send Reset Link
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t border-slate-100 py-4 text-xs">
            <Link to="/login" className="flex items-center gap-1.5 font-medium text-slate-600 hover:text-slate-900">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

