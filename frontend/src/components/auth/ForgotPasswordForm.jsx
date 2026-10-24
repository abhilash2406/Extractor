import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, AlertCircle, ArrowRight, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthModalStore } from '@/store/authModalStore';
import * as authApi from '@/api/auth.api';
import toast from 'react-hot-toast';

const forgotSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
});

export default function ForgotPasswordForm() {
  const { setMode, setEmail, email: storedEmail } = useAuthModalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotSchema),
    defaultValues: { email: storedEmail || '' },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await authApi.forgotPassword({ email: data.email.trim() });
      const res = response?.data;
      if (res && res.success === false) {
        throw new Error(res.message || 'Failed to send reset code');
      }

      setEmail(data.email.trim());
      setMode('reset-password');
      toast.success('6-digit reset code sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to send reset code');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Visual icon */}
      <div className="text-center pb-1">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 mb-2.5">
          <KeyRound className="h-6 w-6" />
        </div>
        <p className="text-xs text-muted-foreground">
          Enter your registered email address to receive a 6-digit password reset code.
        </p>
      </div>

      {/* Email Address */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder="you@example.com"
            className={`pl-10 h-11 bg-background/60 border-border/80 rounded-xl focus-visible:ring-primary ${
              errors.email ? 'border-destructive focus-visible:ring-destructive' : ''
            }`}
            autoFocus
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
            <AlertCircle className="h-3.5 w-3.5" /> {errors.email.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 rounded-xl text-xs font-bold tracking-wide bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 active:scale-[0.99] gap-2 mt-2"
      >
        {isSubmitting ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Sending Code...</span>
          </>
        ) : (
          <>
            <span>Send Reset Code</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>

      {/* Footer Switch */}
      <div className="pt-2 text-center text-xs text-muted-foreground">
        Remember your password?{' '}
        <button
          type="button"
          onClick={() => setMode('login')}
          className="font-bold text-primary hover:underline cursor-pointer"
        >
          Sign in here
        </button>
      </div>
    </form>
  );
}
