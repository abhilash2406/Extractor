import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { useForgotPassword } from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

const schema = yup.object({ 
  email: yup.string().email('Invalid email').required('Email is required') 
});

const ForgotPasswordPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const { mutate: forgot, isPending, isSuccess } = useForgotPassword();

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your email and we'll send you instructions to reset your password."
    >
      {isSuccess ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 p-4 text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>Check your inbox! We've sent a password reset link to your email address.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit((d) => forgot(d))} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
              <Input 
                type="email" 
                placeholder="name@company.com" 
                className={`pl-10 ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                {...register('email')} 
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.email.message}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={isPending}
            className="w-full h-11 rounded-xl text-sm font-semibold gap-2 mt-2"
          >
            {isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Sending link...</span>
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>
      )}

      <div className="pt-2 text-center">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
