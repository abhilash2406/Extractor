import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSearchParams, Link } from 'react-router-dom';
import { useResetPassword } from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, AlertCircle, ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';

const schema = yup.object({
  newPassword: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword')], 'Passwords must match').required('Confirm Password is required'),
});

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [params] = useSearchParams();
  const token = params.get('token');
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const { mutate: reset, isPending } = useResetPassword();

  const onSubmit = ({ newPassword, confirmPassword }) => reset({ token, newPassword, confirmPassword });

  return (
    <AuthLayout 
      title="Choose a new password" 
      subtitle="Please enter and confirm your new password below."
      badgeText="Password Security"
    >
      {!token && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-destructive text-xs font-semibold flex items-center gap-2 mb-4">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Invalid or missing reset token link. Please request a new one.</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Min. 6 characters" 
              className={`pl-10 pr-10 h-11 bg-background/50 border-border/80 focus-visible:ring-primary ${errors.newPassword ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              {...register('newPassword')} 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1 animate-in fade-in-0 duration-200">
              <AlertCircle className="h-3.5 w-3.5" /> {errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Confirm New Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type={showConfirmPassword ? 'text' : 'password'} 
              placeholder="Re-enter password" 
              className={`pl-10 pr-10 h-11 bg-background/50 border-border/80 focus-visible:ring-primary ${errors.confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              {...register('confirmPassword')} 
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1 animate-in fade-in-0 duration-200">
              <AlertCircle className="h-3.5 w-3.5" /> {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button 
          type="submit" 
          disabled={isPending || !token}
          className="w-full h-12 rounded-xl text-sm font-bold tracking-wide bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 active:scale-[0.99] gap-2 mt-2"
        >
          {isPending ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Resetting Password...</span>
            </>
          ) : (
            <>
              <span>Save New Password</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-5 pt-4 border-t border-border/60 text-center">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
