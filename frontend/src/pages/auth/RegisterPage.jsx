import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { useRegister } from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm Password is required'),
});

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const { mutate: doRegister, isPending } = useRegister();

  const onSubmit = ({ name, email, password }) => doRegister({ name, email, password });

  return (
    <AuthLayout 
      title="Create account" 
      subtitle="Join Extractor to streamline your hiring process."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input 
              placeholder="John Doe" 
              className={`pl-10 ${errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              {...register('name')} 
            />
          </div>
          {errors.name && (
            <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="h-3.5 w-3.5" /> {errors.name.message}
            </p>
          )}
        </div>

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
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</label>
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

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input 
              type="password" 
              placeholder="••••••••" 
              className={`pl-10 ${errors.confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              {...register('confirmPassword')} 
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="h-3.5 w-3.5" /> {errors.confirmPassword.message}
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
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Create account</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>
      
      <p className="text-center text-xs text-muted-foreground pt-2">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
