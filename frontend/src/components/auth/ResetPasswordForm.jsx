import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Lock, AlertCircle, ArrowRight, Eye, EyeOff, KeyRound, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthModalStore } from '@/store/authModalStore';
import * as authApi from '@/api/auth.api';
import toast from 'react-hot-toast';

const resetSchema = yup.object({
  otp: yup
    .string()
    .length(6, 'Verification code must be 6 digits')
    .required('Verification code is required'),
  newPassword: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function ResetPasswordForm() {
  const { email, setMode } = useAuthModalStore();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(resetSchema),
    defaultValues: { otp: '', newPassword: '', confirmPassword: '' },
  });

  const onResetSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await authApi.resetPassword({
        otp: data.otp.trim(),
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      const res = response?.data;
      if (res && res.success === false) {
        throw new Error(res.message || 'Password reset failed');
      }

      toast.success('Password updated successfully! Please sign in with your new password.');
      reset();
      setMode('login');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Invalid or expired OTP code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onResendCode = async () => {
    if (!email) {
      return setMode('forgot-password');
    }
    setIsResending(true);
    try {
      await authApi.forgotPassword({ email });
      toast.success('New 6-digit reset code sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onResetSubmit)} className="space-y-3.5">
      {/* Visual icon */}
      <div className="text-center pb-1">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 mb-2">
          <KeyRound className="h-6 w-6" />
        </div>
        <p className="text-xs text-muted-foreground">
          Enter the 6-digit code sent to{' '}
          <span className="font-bold text-foreground">{email || 'your email'}</span> and your new password.
        </p>
      </div>

      {/* 6-Digit OTP Code */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          6-Digit Verification Code
        </label>
        <div className="relative">
          <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            maxLength={6}
            placeholder="123456"
            autoComplete="one-time-code"
            inputMode="numeric"
            className={`pl-10 h-11 text-center text-lg tracking-widest font-mono font-bold bg-background/60 border-border/80 rounded-xl focus-visible:ring-primary ${
              errors.otp ? 'border-destructive focus-visible:ring-destructive' : ''
            }`}
            autoFocus
            {...register('otp')}
          />
        </div>
        {errors.otp && (
          <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
            <AlertCircle className="h-3.5 w-3.5" /> {errors.otp.message}
          </p>
        )}
      </div>

      {/* New Password */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type={showNewPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            className={`pl-10 pr-10 h-11 bg-background/60 border-border/80 rounded-xl focus-visible:ring-primary ${
              errors.newPassword ? 'border-destructive focus-visible:ring-destructive' : ''
            }`}
            {...register('newPassword')}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors cursor-pointer"
          >
            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
            <AlertCircle className="h-3.5 w-3.5" /> {errors.newPassword.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Confirm New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            className={`pl-10 pr-10 h-11 bg-background/60 border-border/80 rounded-xl focus-visible:ring-primary ${
              errors.confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''
            }`}
            {...register('confirmPassword')}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
            <AlertCircle className="h-3.5 w-3.5" /> {errors.confirmPassword.message}
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
            <span>Updating Password...</span>
          </>
        ) : (
          <>
            <span>Update Password & Sign In</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>

      {/* Actions footer */}
      <div className="pt-2 text-center text-xs text-muted-foreground flex items-center justify-between">
        <button
          type="button"
          disabled={isResending}
          onClick={onResendCode}
          className="text-muted-foreground hover:text-foreground font-medium cursor-pointer"
        >
          {isResending ? 'Resending...' : 'Resend Code'}
        </button>
        <button
          type="button"
          onClick={() => setMode('login')}
          className="font-bold text-primary hover:underline cursor-pointer"
        >
          Back to Sign In
        </button>
      </div>
    </form>
  );
}
