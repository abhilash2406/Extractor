import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { useRegister } from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const schema = yup.object({
  name: yup.string().required('Full Name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords do not match').required('Confirm Password is required'),
});

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({ 
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  });

  const { mutate: doRegister, isPending } = useRegister();
  const passwordValue = watch('password', '');

  const onSubmit = ({ name, email, password }) => doRegister({ name, email, password });

  return (
    <AuthLayout 
      title="Create account" 
      subtitle="Join Extractor to streamline your resume extractions & talent pipeline."
      badgeText="Get Started in 30 Seconds"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors" />
            <Input 
              placeholder="Alex Johnson" 
              className={`pl-10 h-11 bg-background/50 border-border/80 focus-visible:ring-primary ${errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              {...register('name')} 
            />
          </div>
          {errors.name && (
            <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1 animate-in fade-in-0 duration-200">
              <AlertCircle className="h-3.5 w-3.5" /> {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors" />
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
        
        {/* Password */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors" />
            <Input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Min. 6 characters" 
              className={`pl-10 pr-10 h-11 bg-background/50 border-border/80 focus-visible:ring-primary ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              {...register('password')} 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1 animate-in fade-in-0 duration-200">
              <AlertCircle className="h-3.5 w-3.5" /> {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors" />
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

        {/* Password Hint */}
        {passwordValue && passwordValue.length >= 6 && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> Password meets minimum length requirements
          </div>
        )}
        
        {/* Submit Button */}
        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full h-12 rounded-xl text-sm font-bold tracking-wide bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 active:scale-[0.99] gap-2 mt-4"
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
      
      {/* Footer Switch */}
      <div className="mt-5 pt-4 border-t border-border/60 text-center text-xs text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-primary hover:underline">
          Sign In
        </Link>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
