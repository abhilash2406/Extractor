import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  Lock, 
  KeyRound, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Sparkles,
  LogIn
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { useAuthModalStore } from '@/store/authModalStore';
import * as authApi from '@/api/auth.api';
import toast from 'react-hot-toast';

const passwordSchema = yup.object({
  oldPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .min(8, 'New password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^~_\-+=\(\)\[\]\{\}\<\>\.\,\:\;\'\"\\\/`|])/,
      'Must contain uppercase, lowercase, number, and special character'
    )
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords do not match')
    .required('Please confirm your new password'),
});

export default function ChangePasswordPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { openAuthModal } = useAuthModalStore();
  
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
  });

  const newPasswordValue = watch('newPassword', '');

  // Password Strength Checker
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[@$!%*?&#^~_\-+=\(\)\[\]\{\}\<\>\.\,\:\;\'\"\\\/`|]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(newPasswordValue);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await authApi.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      const res = response?.data;
      if (res && res.success === false) {
        throw new Error(res.message || 'Failed to update password');
      }

      toast.success('Password updated successfully! A security confirmation email was sent.');
      setIsSuccess(true);
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-2xl p-6 text-center space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Lock className="h-8 w-8" />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">Sign In Required</h2>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              You must be logged into your account to update your security credentials.
            </p>
          </div>
          <Button 
            onClick={() => openAuthModal('login')} 
            className="w-full h-11 rounded-xl text-xs font-bold gap-2"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In to Continue</span>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[500px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-lg rounded-3xl border border-border/80 bg-card/95 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 relative z-10">
        
        {/* Card Header */}
        <div className="text-center space-y-2 pb-6 border-b border-border/60">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[11px] font-bold">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Account Security</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Change Password
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
            Update your password to keep your account and resume assets secure.
          </p>
        </div>

        {isSuccess && (
          <div className="my-5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold">Password Updated Successfully!</p>
              <p className="text-muted-foreground mt-0.5">
                A security alert has been dispatched to <strong className="text-foreground">{user?.email}</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-6">
          
          {/* Current Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Current Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type={showOldPassword ? 'text' : 'password'}
                placeholder="Enter current password"
                autoComplete="current-password"
                className={`pl-10 pr-10 h-11 bg-background/60 border-border/80 rounded-xl focus-visible:ring-primary ${
                  errors.oldPassword ? 'border-destructive focus-visible:ring-destructive' : ''
                }`}
                {...register('oldPassword')}
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors cursor-pointer"
              >
                {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.oldPassword && (
              <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.oldPassword.message}
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
                placeholder="Minimum 8 characters"
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

            {/* Password Strength Meter */}
            {newPasswordValue.length > 0 && (
              <div className="space-y-1 pt-1">
                <div className="flex gap-1 h-1.5">
                  <div className={`flex-1 rounded-full transition-colors ${strength >= 1 ? 'bg-red-500' : 'bg-muted'}`} />
                  <div className={`flex-1 rounded-full transition-colors ${strength >= 3 ? 'bg-amber-500' : 'bg-muted'}`} />
                  <div className={`flex-1 rounded-full transition-colors ${strength >= 4 ? 'bg-blue-500' : 'bg-muted'}`} />
                  <div className={`flex-1 rounded-full transition-colors ${strength >= 5 ? 'bg-emerald-500' : 'bg-muted'}`} />
                </div>
                <p className="text-[10px] text-muted-foreground flex justify-between">
                  <span>Strength: {strength >= 5 ? 'Strong' : strength >= 3 ? 'Medium' : 'Weak'}</span>
                  <span>(A-Z, a-z, 0-9, special char)</span>
                </p>
              </div>
            )}

            {errors.newPassword && (
              <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter new password"
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
            className="w-full h-12 rounded-xl text-xs font-bold tracking-wide bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 active:scale-[0.99] gap-2 mt-4"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <span>Save New Password</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

        </form>
      </Card>
    </div>
  );
}
