import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { useForgotPassword } from '@/hooks/api/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

const schema = yup.object({ 
  email: yup.string().email('Invalid email address').required('Email is required') 
});

const ForgotPasswordPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const { mutate: forgot, isPending, isSuccess } = useForgotPassword();

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your email address and we'll send you instructions to reset your password."
      badgeText="Account Recovery"
    >
      {isSuccess ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-foreground block">Check your inbox!</span>
              <span>We've dispatched a password reset link to your email address. Please follow the instructions to continue.</span>
            </div>
          </div>
          <Link to="/login" className="block">
            <Button variant="outline" className="w-full h-11 rounded-xl text-xs font-semibold">
              Return to Sign In
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit((d) => forgot(d))} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="email" 
                placeholder="name@company.com" 
                className={`pl-10 h-11 bg-background/50 border-border/80 focus-visible:ring-primary ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                {...register('email')} 
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1 animate-in fade-in-0 duration-200">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.email.message}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={isPending}
            className="w-full h-12 rounded-xl text-sm font-bold tracking-wide bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 active:scale-[0.99] gap-2 mt-2"
          >
            {isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Sending link...</span>
              </>
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      )}

      <div className="mt-5 pt-4 border-t border-border/60 text-center">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
