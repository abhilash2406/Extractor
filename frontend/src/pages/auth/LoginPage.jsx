import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { useLogin } from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
});

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const { mutate: login, isPending } = useLogin();

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Please enter your details to sign in to your account."
    >
      <form onSubmit={handleSubmit((data) => login(data))} className="space-y-4">
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
        
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</label>
            <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input 
              type="password" 
              placeholder="••••••••" 
              className={`pl-10 ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              {...register('password')} 
            />
          </div>
          {errors.password && (
            <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="h-3.5 w-3.5" /> {errors.password.message}
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
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign in to account</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>
      
      <p className="text-center text-xs text-muted-foreground pt-2">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-primary hover:underline">
          Register here
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
